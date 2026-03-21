import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { createPlan, getPlan, updatePlan } from "../../services/planService.js";
import { getTemplates } from "../../services/templateService.js";
import { UserContext } from "../../contexts/UserContext.jsx";

const toDateTimeLocal = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const toIsoStringOrNull = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const defaultLinkTime = (startDtInput) => {
  if (!startDtInput || !startDtInput.includes("T")) return "18:00:00";
  const [, timePart] = startDtInput.split("T");
  if (!timePart) return "18:00:00";
  const [hours = "18", minutes = "00"] = timePart.split(":");
  return `${hours}:${minutes}:00`;
};

const PlanBuilder = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const isEditMode = Boolean(planId);

  const [templates, setTemplates] = useState([]);
  const [title, setTitle] = useState("");
  const [startDt, setStartDt] = useState("");
  const [interval, setInterval] = useState(1);
  const [isPublic, setIsPublic] = useState(false);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);
  const [linkTimes, setLinkTimes] = useState({});
  const [cycles, setCycles] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const templateData = await getTemplates();
        setTemplates(Array.isArray(templateData) ? templateData : []);

        if (isEditMode) {
          const planData = await getPlan(planId);
          setTitle(planData?.title || "");
          setStartDt(toDateTimeLocal(planData?.start_dt));
          setInterval(planData?.interval || 1);
          setIsPublic(Boolean(planData?.is_public));
          setCycles(planData?.cycles || 1);

          const links = Array.isArray(planData?.template_links)
            ? planData.template_links
            : [];

          const ids = links
            .map((link) => link?.template)
            .filter((templateId) => Number.isInteger(templateId));
          setSelectedTemplateIds(ids);

          const initialTimes = {};
          links.forEach((link) => {
            if (Number.isInteger(link?.template)) {
              initialTimes[link.template] = link.time || "18:00:00";
            }
          });
          setLinkTimes(initialTimes);
        } else {
          const now = new Date();
          now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
          setStartDt(now.toISOString().slice(0, 16));
        }
      } catch (err) {
        setError("Could not load plan builder data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isEditMode, planId]);

  const sortedSelectedTemplateIds = useMemo(
    () =>
      selectedTemplateIds
        .filter((id) => Number.isInteger(id))
        .sort((a, b) => a - b),
    [selectedTemplateIds],
  );

  const handleTemplateToggle = (templateId) => {
    setSelectedTemplateIds((prevIds) => {
      const exists = prevIds.includes(templateId);
      if (exists) {
        return prevIds.filter((id) => id !== templateId);
      }
      return [...prevIds, templateId];
    });

    setLinkTimes((prevTimes) => {
      if (prevTimes[templateId]) return prevTimes;
      return { ...prevTimes, [templateId]: defaultLinkTime(startDt) };
    });
  };

  const handleLinkTimeChange = (templateId, value) => {
    setLinkTimes((prevTimes) => ({
      ...prevTimes,
      [templateId]: value.length === 5 ? `${value}:00` : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!title.trim()) {
        throw new Error("Plan title is required.");
      }

      const startDtIso = toIsoStringOrNull(startDt);
      if (!startDtIso) {
        throw new Error("Start date and time are required.");
      }

      const parsedInterval = Number(interval);
      if (!Number.isInteger(parsedInterval) || parsedInterval < 1) {
        throw new Error("Interval must be a positive whole number.");
      }
      if (!user?.id) {
        throw new Error("You must be signed in to create a plan.");
      }

      const template_links = sortedSelectedTemplateIds.map(
        (templateId, idx) => ({
          template: templateId,
          order: idx + 1,
          time: linkTimes[templateId] || defaultLinkTime(startDt),
        }),
      );

      const payload = {
        user: user?.id,
        title: title.trim(),
        start_dt: startDtIso,
        interval: parsedInterval,
        is_public: isPublic,
        cycles: cycles,
        template_links,
      };

      const savedPlan = isEditMode
        ? await updatePlan(planId, payload)
        : await createPlan(payload);

      navigate(`/plans/${savedPlan.id}`);
    } catch (err) {
      const apiError =
        err?.response?.data?.detail ||
        JSON.stringify(err?.response?.data || "") ||
        "";
      setError(err.message || apiError || "Could not save plan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <h3>Loading plan builder...</h3>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem" }}>
      <h2>{isEditMode ? "Edit Plan" : "Create Plan"}</h2>

      <form onSubmit={handleSubmit}>
        <div
          style={{ display: "grid", gap: "0.75rem", marginBottom: "1.5rem" }}
        >
          <label>
            Plan Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Beginner 2-Day Split"
              required
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
            />
          </label>

          <label>
            Start Date and Time
            <input
              type="datetime-local"
              value={startDt}
              onChange={(e) => setStartDt(e.target.value)}
              required
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
            />
          </label>

          <label>
            Interval (days between workouts)
            <input
              type="number"
              min="1"
              step="1"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              required
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
            />
          </label>

          <label>
            Cycles (number of times to repeat the plan)
            <input
              type="number"
              min="1"
              step="1"
              value={cycles}
              onChange={(e) => setCycles(e.target.value)}
              required
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
            />
          </label>

          <label
            style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Make plan public
          </label>
        </div>

        <h3>Attach Templates</h3>
        <p>Select templates to include in this plan.</p>

        {templates.length === 0 ? (
          <p>No templates available yet. Create a template first.</p>
        ) : (
          <div
            style={{ display: "grid", gap: "0.75rem", marginBottom: "1.5rem" }}
          >
            {templates.map((template) => {
              const selected = selectedTemplateIds.includes(template.id);
              const timeValue = (linkTimes[template.id] || "").slice(0, 5);

              return (
                <div
                  key={template.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "0.75rem",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <strong>{template.title}</strong>
                      {template.description ? ` - ${template.description}` : ""}
                    </span>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => handleTemplateToggle(template.id)}
                    />
                  </label>

                  {selected && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <label>
                        Time
                        <input
                          type="time"
                          value={timeValue}
                          onChange={(e) =>
                            handleLinkTimeChange(template.id, e.target.value)
                          }
                          style={{ marginLeft: "0.5rem" }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {error ? (
          <p style={{ color: "crimson", marginBottom: "1rem" }}>{error}</p>
        ) : null}

        <button type="submit" disabled={saving}>
          {saving
            ? isEditMode
              ? "Saving..."
              : "Creating..."
            : isEditMode
              ? "Save Plan"
              : "Create Plan"}
        </button>
      </form>
    </div>
  );
};

export default PlanBuilder;
