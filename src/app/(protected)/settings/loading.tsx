import { ListItemSkeleton } from "@/components/skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/layout"

export default function SettingsLoading() {
  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <Skeleton className="h-8 w-16 mb-6" />
      <div className="rounded-xl border bg-card overflow-hidden px-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    </Container>
  )
}
