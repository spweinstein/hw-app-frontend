import { useState } from "react";
import { generateWorkoutsFromPlan } from "@/src/services/planService.js";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Zap } from "lucide-react";
import LoadingSpinner from "@/src/components/shared/LoadingSpinner/LoadingSpinner.jsx";

/**
 * Icon button + confirm: POST plan generate. Parent should refresh calendar on success.
 */
export default function WorkoutPlanGenerateDialog({
  plan,
  disabled,
  onPointerDown,
  onGenerated,
  onError,
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleConfirm = async () => {
    if (!plan?.id) return;
    setPending(true);
    try {
      const result = await generateWorkoutsFromPlan(plan.id);
      setOpen(false);
      onGenerated?.(result);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        "Could not generate workouts.";
      onError?.(typeof msg === "string" ? msg : "Could not generate workouts.");
      setOpen(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        aria-label="Generate workouts from plan"
        title="Materialize this plan onto your calendar"
        onPointerDown={onPointerDown}
        onClick={() => setOpen(true)}
      >
        <Zap className="size-4" />
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Generate workouts?</AlertDialogTitle>
            <AlertDialogDescription>
              This creates or refreshes calendar workouts from{" "}
              <span className="font-medium text-foreground">
                {plan?.title ?? "this plan"}
              </span>{" "}
              for the configured cycles. Existing generated slots may be
              replaced.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel size="sm" disabled={pending}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              size="sm"
              disabled={pending}
              onClick={() => void handleConfirm()}
            >
              {pending ? (
                <LoadingSpinner
                  variant="inline"
                  size="sm"
                  message="Generating…"
                  ariaLive="off"
                />
              ) : (
                "Generate"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
