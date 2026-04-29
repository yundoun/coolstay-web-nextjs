import { Skeleton } from "@/components/ui/skeleton"
import { EventCardSkeleton } from "@/components/skeleton"
import { Container } from "@/components/layout"

export default function EventsLoading() {
  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-4 w-56 mb-6" />
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-16 rounded-full" />
        ))}
      </div>
      <EventCardSkeleton className="mb-4" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </Container>
  )
}
