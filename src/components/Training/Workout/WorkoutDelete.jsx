import { deleteWorkout } from "@/src/services/workoutService.js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function WorkoutDelete({ workout, onClose, onDeleted, onError }) {
  const open = workout != null;
  const label = formatTitle(workout);

  const handleConfirm = async () => {
    if (!workout) return;
    const id = workout.id;
    onClose();
    try {
      await deleteWorkout(id);
      onDeleted(id);
    } catch {
      onError?.("Delete failed. Try again.");
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this workout?</AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone.
            {label ? ` “${label}” will be removed.` : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            size="sm"
            onClick={() => void handleConfirm()}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function formatTitle(w) {
  if (w == null) return "";
  return String(w.title ?? "").trim();
}
