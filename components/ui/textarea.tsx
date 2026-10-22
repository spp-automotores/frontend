import * as React from "react"
import { cn } from "cn"

// Texto largo de la administración, con el mismo borde y la misma letra de 16 px que `Input`.
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-28 w-full min-w-0 rounded-xl border border-foreground/30 bg-background px-4 py-3 text-base leading-relaxed text-foreground caret-highlight transition-colors outline-none placeholder:text-muted-foreground hover:border-foreground/45 focus-visible:border-highlight focus-visible:ring-3 focus-visible:ring-highlight/25 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-highlight",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
