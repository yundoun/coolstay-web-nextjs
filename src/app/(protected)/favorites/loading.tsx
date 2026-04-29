import { WishlistCardSkeleton } from "@/components/skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/layout"

export default function FavoritesLoading() {
  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <Skeleton className="h-8 w-24 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <WishlistCardSkeleton key={i} />
        ))}
      </div>
    </Container>
  )
}
