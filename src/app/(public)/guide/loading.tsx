import { ListItemSkeleton } from "@/components/skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/layout"

export default function GuideLoading() {
  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <Skeleton className="h-8 w-28 mb-6" />
      <div className="space-y-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <ListItemSkeleton key={i} hasImage lines={3} />
        ))}
      </div>
    </Container>
  )
}
