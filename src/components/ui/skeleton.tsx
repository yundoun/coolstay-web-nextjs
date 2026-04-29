import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {
  variant?: "pulse" | "shimmer"
}

function Skeleton({ className, variant = "pulse", ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-md",
        variant === "shimmer"
          ? "bg-gradient-to-r from-accent via-accent/50 to-accent bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"
          : "bg-accent animate-pulse",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
export type { SkeletonProps }
