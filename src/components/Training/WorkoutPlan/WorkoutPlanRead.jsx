import { useEffect, useState } from "react";
import { getPlan } from "@/src/services/planService.js";
import { Badge } from "@/components/ui/badge";
import { DialogFooter } from "@/components/ui/dialog";

function formatStart(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatTime(value) {
  if (value == null || value === "") return "—";
  const s = String(value);
  const parts = s.split(":");
  if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
  return s;
}

export default function WorkoutPlanRead({ planId }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (planId == null) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPlan(planId);
        if (!cancelled) setPlan(data);
      } catch {
        if (!cancelled) setError("Could not load plan.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [planId]);

  if (loading)
    return <p className="text-muted-foreground py-2 text-sm">Loading…</p>;
  if (error)
    return (
      <p className="text-destructive py-2 text-sm" role="alert">
        {error}
      </p>
    );
  if (!plan)
    return (
      <p className="text-muted-foreground py-2 text-sm">Plan not found.</p>
    );

  const links = [...(plan.template_links ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.id ?? 0) - (b.id ?? 0),
  );

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">{plan.title}</h1>
        <p className="text-sm text-muted-foreground">
          Starts {formatStart(plan.start_dt)}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            Every {plan.interval ?? 1} day
            {(plan.interval ?? 1) === 1 ? "" : "s"}
          </Badge>
          <Badge variant="secondary">
            {plan.cycles ?? 1} cycle{(plan.cycles ?? 1) === 1 ? "" : "s"}
          </Badge>
          {plan.is_public ? (
            <Badge variant="default">Public</Badge>
          ) : (
            <Badge variant="outline">Private</Badge>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {links.length} template link{links.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="-mr-1 max-h-[min(50vh,20rem)] overflow-y-auto pr-1">
        {links.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No templates linked yet.
          </p>
        ) : (
          <ol className="m-0 list-none space-y-2 p-0">
            {links.map((link, index) => (
              <li
                key={link.id ?? index}
                className="rounded-lg border border-border/80 bg-muted/20 px-3 py-2"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground text-xs font-medium tabular-nums">
                    #{index + 1}
                  </span>
                  <span className="font-medium">
                    {link.template_detail?.title ??
                      link.template_detail?.name ??
                      `Template ${link.template ?? "?"}`}
                  </span>
                  <Badge variant="outline" className="tabular-nums">
                    {formatTime(link.time)}
                  </Badge>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <DialogFooter className="gap-2 sm:gap-2" />
    </>
  );
}
