import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Small uppercase eyebrow label used above section headings. */
export function SectionLabel({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("text-xs uppercase tracking-widest text-primary font-semibold", className)}
      {...props}
    />
  );
}
