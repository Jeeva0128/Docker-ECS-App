import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80",
        secondary:
          "border-transparent bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80",
        destructive:
          "border-transparent bg-red-900/50 text-red-200 hover:bg-red-900/70",
        outline: "text-zinc-50 border-zinc-800",
        // Status badges
        pending: "border-transparent bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
        inProgress: "border-transparent bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
        completed: "border-transparent bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
        // Priority badges
        low: "border-transparent bg-zinc-800 text-zinc-400 hover:bg-zinc-800/80",
        medium: "border-transparent bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
        high: "border-transparent bg-rose-500/10 text-rose-500 hover:bg-rose-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
