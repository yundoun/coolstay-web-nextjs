import { DetailHeroSkeleton } from "@/components/skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/layout"

export default function EventDetailLoading() {
  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <DetailHeroSkeleton imageAspect="aspect-[2/1]" />
      <div className="space-y-3 mt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-60 w-full rounded-xl" />
      </div>
    </Container>
  )
}
