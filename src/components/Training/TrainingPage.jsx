import { useCallback, useEffect, useState } from "react";
import Calendar from "../Calendar/Calendar.jsx";
import WorkoutTemplatePicker from "./WorkoutTemplate/WorkoutTemplatePicker.jsx";
import { scheduleWorkoutFromTemplate } from "@/src/services/templateService.js";
import { getExercises } from "@/src/services/exerciseService.js";

export default function TrainingPage() {
  const [calendarRefreshNonce, setCalendarRefreshNonce] = useState(0);
  const [exercises, setExercises] = useState([]);
  const [exercisesError, setExercisesError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setExercisesError("");
    (async () => {
      try {
        const data = await getExercises();
        if (!cancelled) {
          setExercises(Array.isArray(data) ? data : []);
          setExercisesError("");
        }
      } catch {
        if (!cancelled) {
          setExercises([]);
          setExercisesError("Could not load exercises.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSchedule = useCallback(async (template, { startISO }) => {
    await scheduleWorkoutFromTemplate(template.id, { start_dt: startISO });
    setCalendarRefreshNonce((n) => n + 1);
  }, []);

  const handleWorkoutMutated = useCallback(() => {
    setCalendarRefreshNonce((n) => n + 1);
  }, []);

  return (
    <div className="flex flex-col gap-10 px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">Training</h1>

      {exercisesError ? (
        <p className="text-destructive text-sm" role="alert">
          {exercisesError}
        </p>
      ) : null}

      <WorkoutTemplatePicker
        scope="user"
        onSchedule={handleSchedule}
        exercises={exercises}
      />
      <div className="calendar-wrapper">
        <Calendar
          refreshNonce={calendarRefreshNonce}
          exercises={exercises}
          onWorkoutMutated={handleWorkoutMutated}
        />
      </div>
    </div>
  );
}
