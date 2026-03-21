import { useCallback, useEffect, useState } from "react";
import Calendar from "../Calendar/Calendar.jsx";
import WorkoutTemplatePicker from "./WorkoutTemplate/WorkoutTemplatePicker.jsx";
import { scheduleWorkoutFromTemplate } from "@/src/services/templateService.js";
import { getExercises } from "@/src/services/exerciseService.js";

export default function TrainingPage() {
  const [calendarRefreshNonce, setCalendarRefreshNonce] = useState(0);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getExercises();
        if (!cancelled) setExercises(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) throw new Error("Could not load exercises.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSchedule = useCallback(async (template, { startISO }) => {
    try {
      await scheduleWorkoutFromTemplate(template.id, { start_dt: startISO });
      setCalendarRefreshNonce((n) => n + 1);
    } catch (error) {
      console.error("Error scheduling workout:", error);
      return { success: false, error: error.message };
    }
  }, []);

  const handleWorkoutMutated = useCallback(() => {
    setCalendarRefreshNonce((n) => n + 1);
  }, []);

  return (
    <div className="flex flex-col gap-10 px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">Training</h1>

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
