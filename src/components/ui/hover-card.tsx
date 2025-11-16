import * as React from "react"
import { cn } from "@/lib/utils"

const HoverCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative", className)} {...props} />
  )
)
HoverCard.displayName = "HoverCard"

const HoverCardTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn("cursor-pointer", className)} {...props} />
  )
)
HoverCardTrigger.displayName = "HoverCardTrigger"

const HoverCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("absolute z-50 bg-white rounded shadow-lg p-4 min-w-[180px] border border-gray-200 text-gray-900 text-sm", className)} {...props} />
  )
)
HoverCardContent.displayName = "HoverCardContent"

export { HoverCard, HoverCardTrigger, HoverCardContent }
