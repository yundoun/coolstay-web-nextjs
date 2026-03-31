import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: { label: string; href: string }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 text-center", className)}>
      <div className="rounded-full bg-muted p-6 mb-4">
        <Icon className="size-10 text-muted-foreground" />
      </div>
      <p className="text-lg font-semibold">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button className="mt-4" asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  )
}
