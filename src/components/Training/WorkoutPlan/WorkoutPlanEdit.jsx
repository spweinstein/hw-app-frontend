import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { getPlan, updatePlan } from "@/src/services/planService.js";
import WorkoutPlanForm from "./WorkoutPlanForm.jsx";
import { Button } from "@/components/ui/button";

export default function WorkoutPlanEdit({
  planId,
  onClose,
  onSave,
  templateScope,
}) {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const data = await getPlan(planId);
        if (!cancelled) setPlan(data);
      } catch {
        if (!cancelled) setLoadError("Could not load plan.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [planId]);

  const defaultValues = useMemo(() => {
    if (!plan) return null;
    return {
      title: plan.title,
      start_dt: plan.start_dt,
      interval: plan.interval,
      cycles: plan.cycles,
      is_public: plan.is_public,
      template_links: plan.template_links,
    };
  }, [plan]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const saved = await updatePlan(planId, data);
      onSave?.(saved);
      onClose?.();
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        "Could not update plan. Try again.";
      setSubmitError(
        typeof msg === "string" ? msg : "Could not update plan.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <p className="text-muted-foreground mx-auto max-w-lg px-4 py-8 text-sm">
        Loading…
      </p>
    );
  }

  if (loadError || !plan) {
    return (
      <div className="mx-auto max-w-lg space-y-4 px-4 py-8">
        <p className="text-destructive text-sm" role="alert">
          {loadError || "Plan not found."}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/training")}
        >
          Back to training
        </Button>
      </div>
    );
  }

  return (
    <WorkoutPlanForm
      key={planId}
      defaultValues={defaultValues}
      heading="Edit workout plan"
      submitLabel="Save changes"
      templateScope={templateScope}
      onSubmit={handleSubmit}
      onCancel={onClose}
      error={submitError}
      isSubmitting={isSubmitting}
    />
  );
}
