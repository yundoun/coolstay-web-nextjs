import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/layout"

export default function TermsLoading() {
  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <Skeleton className="h-8 w-24 mb-6" />
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 flex-1 rounded-md" />
        ))}
      </div>
      <Skeleton className="h-[60vh] rounded-xl" />
    </Container>
  )
}
