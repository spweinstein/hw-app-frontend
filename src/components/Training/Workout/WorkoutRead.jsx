import { useEffect, useState } from "react";
import { getWorkout } from "@/src/services/workoutService.js";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function createExerciseBlurb(item) {
  let ret = "";
  if (item.sets && item.sets > 0) {
    ret += item.sets;
    if (item.reps && item.reps > 0) ret += " x " + item.reps;
    if (item.weight && item.weight_unit)
      ret += " @ " + item.weight + " " + item.weight_unit;
  }
  if (item.distance)
    ret += (ret ? " • " : "") + item.distance + (item.distance_unit || "");
  if (item.duration) ret += (ret ? " • " : "") + item.duration + "s";
  return ret || "No prescription specified";
}

function formatRange(startISO, endISO) {
  if (!startISO) return "";
  const s = new Date(startISO);
  const e = endISO ? new Date(endISO) : null;
  const opts = {
    dateStyle: "medium",
    timeStyle: "short",
  };
  if (e && !Number.isNaN(e.getTime())) {
    return `${s.toLocaleString(undefined, opts)} – ${e.toLocaleString(undefined, opts)}`;
  }
  return s.toLocaleString(undefined, opts);
}

const STATUS_LABEL = {
  planned: "Planned",
  completed: "Completed",
  skipped: "Skipped",
  canceled: "Canceled",
};

export default function WorkoutRead({ workoutId }) {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (workoutId == null) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getWorkout(workoutId);
        if (!cancelled) setWorkout(data);
      } catch {
        if (!cancelled) setError("Could not load workout.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [workoutId]);

  if (loading)
    return <p className="text-muted-foreground py-2 text-sm">Loading…</p>;
  if (error)
    return (
      <p className="text-destructive py-2 text-sm" role="alert">
        {error}
      </p>
    );
  if (!workout)
    return (
      <p className="text-muted-foreground py-2 text-sm">Workout not found.</p>
    );

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">{workout.title}</h1>
        <p className="text-sm text-muted-foreground">
          {formatRange(workout.start_dt, workout.end_dt)}
        </p>
        <p className="text-sm text-muted-foreground">
          Status: {STATUS_LABEL[workout.status] ?? workout.status ?? "—"}
        </p>
        {workout.notes ? (
          <p className="text-sm text-muted-foreground">{workout.notes}</p>
        ) : null}
        <p className="text-sm text-muted-foreground">
          {workout.items?.length || 0} exercise
          {workout.items?.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="-mr-1 max-h-[min(50vh,20rem)] overflow-y-auto pr-1">
        {(!workout.items || workout.items.length === 0) && (
          <p className="text-muted-foreground text-sm">
            No exercises logged for this workout yet.
          </p>
        )}
        <ol className="m-0 list-none space-y-2 p-0">
          {workout.items?.map((item, index) => (
            <li
              key={item.id ?? index}
              className="rounded-lg border border-border/80 bg-muted/20 px-3 py-2"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-muted-foreground text-xs font-medium tabular-nums">
                  #{index + 1}
                </span>
                <span className="font-medium">
                  {item.exercise_detail?.name || "Exercise"}
                </span>
              </div>
              <p className="mt-1 text-sm text-foreground/90">
                {createExerciseBlurb(item)}
              </p>
              {item.notes ? (
                <p className="mt-1 border-t border-border/60 pt-1 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">Notes:</span>{" "}
                  {item.notes}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <DialogFooter className="gap-2 sm:gap-2" />
    </>
  );
}
