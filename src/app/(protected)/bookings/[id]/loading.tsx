import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/layout"

export default function BookingDetailLoading() {
  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <Skeleton className="h-5 w-16 rounded-full mb-4" />
      <div className="rounded-xl border p-4 space-y-3 mb-4">
        <div className="flex gap-3">
          <Skeleton className="size-16 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between py-3 border-b">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </Container>
  )
}
