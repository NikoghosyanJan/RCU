import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const FILING_STEPS = ["Company", "Operation", "Review", "Confirm", "Payment"];

export function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 text-xs sm:text-sm">
      {FILING_STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary text-primary",
                !done && !active && "text-muted-foreground",
              )}
            >
              {done ? <Check className="size-4" /> : i + 1}
            </span>
            <span className={cn("hidden sm:inline", active ? "font-medium" : "text-muted-foreground")}>{label}</span>
            {i < FILING_STEPS.length - 1 && <span className="h-px flex-1 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}
