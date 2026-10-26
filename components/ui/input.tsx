import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

// Campo de la administración: 48 px de alto (cómodo con el dedo) y letra de 16 px,
// para que el celular no agrande la página al tocarlo.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-foreground/30 bg-background px-4 text-base text-foreground caret-highlight transition-colors outline-none placeholder:text-muted-foreground hover:border-foreground/45 focus-visible:border-highlight focus-visible:ring-3 focus-visible:ring-highlight/25 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-highlight",
        className
      )}
      {...props}
    />
  )
}

export { Input }
