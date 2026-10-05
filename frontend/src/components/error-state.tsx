"use client"

import * as React from "react"
import { AlertCircle, RefreshCcw } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading this content.",
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 p-8 text-center",
        className
      )}
      {...props}
    >
      <AlertCircle className="mb-4 h-10 w-10 text-red-500" />
      <h3 className="mb-2 text-lg font-semibold text-zinc-100">{title}</h3>
      <p className="mb-6 text-sm text-zinc-400 max-w-md">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="bg-transparent">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}
