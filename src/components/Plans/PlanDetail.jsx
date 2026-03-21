import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { getPlan, deletePlan } from "../../services/planService";
import { UserContext } from "../../contexts/UserContext.jsx";
import { generateWorkoutsFromPlan } from "../../services/planService.js";

const PlanDetail = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const { user } = useContext(UserContext);
  let { planId } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      setError("");

      try {
        const planData = await getPlan(planId);
        setPlan(planData);
      } catch (err) {
        setError("Could not load this plan.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  const handleGenerateWorkouts = async () => {
    setGenerating(true);
    setError("");
    try {
      await generateWorkoutsFromPlan(planId);
    } catch (err) {
      setError("Could not generate workouts. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this plan? This cannot be undone.",
    );
    if (!confirmed) return;

    setDeleting(true);
    setError("");
    try {
      await deletePlan(planId);
      navigate("/plans");
    } catch (err) {
      setError("Could not delete this plan. Please try again.");
      setDeleting(false);
    }
  };

  if (loading) return <h3>Loading plan...</h3>;
  if (error && !plan) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!plan) return <p>Plan not found.</p>;

  const startDate = plan.start_dt
    ? new Date(plan.start_dt).toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "N/A";

  const templateLinks = Array.isArray(plan.template_links)
    ? [...plan.template_links].sort((a, b) => a.order - b.order)
    : [];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem" }}>
      <h2>{plan.title}</h2>
      <p>{plan.is_public ? "Public plan" : "Private plan"}</p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <p>
          <strong>Start:</strong> {startDate}
        </p>
        <p>
          <strong>Interval:</strong> Every {plan.interval} day
          {plan.interval === 1 ? "" : "s"}
        </p>
        <p>
          <strong>Templates attached:</strong> {templateLinks.length}
        </p>
      </div>

      <h3>Template Rotation</h3>
      {templateLinks.length === 0 ? (
        <p>No templates attached to this plan yet.</p>
      ) : (
        <ol>
          {templateLinks.map((link) => (
            <li
              key={link.id}
              style={{
                border: "1px solid #eee",
                borderRadius: "8px",
                padding: "0.75rem",
                marginBottom: "0.5rem",
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>
                  {link.template_detail?.title || "Untitled template"}
                </strong>
              </p>
              <p style={{ margin: "0.25rem 0 0 0" }}>
                Order: {link.order} | Time: {link.time || "N/A"}
              </p>
            </li>
          ))}
        </ol>
      )}

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
        <button onClick={handleGenerateWorkouts} disabled={generating}>
          {generating ? "Generating..." : "Generate Workouts"}
        </button>
        {user?.id === plan.user ? (
          <>
          <Link to={`/plans/${plan.id}/edit`}>
            <button>Edit Plan</button>
          </Link>
          <button onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete Plan"}
          </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PlanDetail;
