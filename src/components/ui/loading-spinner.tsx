import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const SIZE_MAP = {
  sm: "size-5",
  md: "size-8",
  lg: "size-12",
} as const

interface LoadingSpinnerProps {
  size?: keyof typeof SIZE_MAP
  message?: string
  fullPage?: boolean
  className?: string
}

export function LoadingSpinner({
  size = "md",
  message = "로딩 중",
  fullPage = false,
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center py-20",
        fullPage && "min-h-[50vh]",
        className
      )}
    >
      <Loader2 className={cn(SIZE_MAP[size], "animate-spin text-muted-foreground")} />
      <span className="sr-only">{message}</span>
    </div>
  )
}
