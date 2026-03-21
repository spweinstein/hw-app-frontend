import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarClock } from "lucide-react";

function toDateInputValue(d) {
  const z = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

function combineLocalDateTimeToISO(dateStr, timeStr) {
  if (!dateStr?.trim()) return null;
  const t = timeStr?.trim() || "09:00";
  const d = new Date(`${dateStr}T${t}:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export default function WorkoutTemplateSchedulerPopover({
  template,
  disabled,
  onSchedule,
}) {
  const id = useId();
  const dateId = `${id}-date`;
  const timeId = `${id}-time`;
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(() => toDateInputValue(new Date()));
  const [time, setTime] = useState("09:00");
  const [error, setError] = useState("");

  const handleOpenChange = (next) => {
    setOpen(next);
    if (next) {
      setDate(toDateInputValue(new Date()));
      setTime("09:00");
      setError("");
    }
  };

  function scheduleErrorMessage(error) {
    const d = error?.response?.data;
    if (typeof d?.detail === "string" && d.detail) return d.detail;
    if (Array.isArray(d?.errors) && d.errors.length) return d.errors.join(" ");
    if (d && typeof d === "object") {
      const first = Object.values(d).flat()[0];
      if (typeof first === "string") return first;
      if (Array.isArray(first) && first[0]) return String(first[0]);
    }
    return error?.message || "Could not schedule workout.";
  }

  const confirm = async () => {
    try {
      if (!template) return;
      const startISO = combineLocalDateTimeToISO(date, time);
      if (!startISO) {
        throw new Error("Invalid date or time");
      }
      await onSchedule(template, { startISO });
      setOpen(false);
      setDate(toDateInputValue(new Date()));
      setTime("09:00");
    } catch (error) {
      setError(scheduleErrorMessage(error));
      // throw error;
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={disabled}
          aria-label="Schedule template"
          onPointerDown={(e) => e.preventDefault()}
        >
          <CalendarClock className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 gap-3">
        <PopoverHeader className="gap-0.5">
          <PopoverTitle>Schedule workout</PopoverTitle>
          {template ? (
            <PopoverDescription className="line-clamp-2">
              {template.title || "Untitled"}
            </PopoverDescription>
          ) : null}
        </PopoverHeader>
        <div className="grid gap-2">
          <div className="space-y-1">
            <Label htmlFor={dateId}>Date</Label>
            <Input
              id={dateId}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={timeId}>Time</Label>
            <Input
              id={timeId}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
        {error && (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={confirm}>
            Schedule
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
