import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Section, Grid } from "@/components/layout"
import { AccommodationCard } from "@/components/accommodation"
import { featuredAccommodations } from "../data/mock"

export function FeaturedSection() {
  return (
    <Section
      title="MD 추천 숙소"
      description="에디터가 직접 선정한 이번 주 인기 숙소"
      headerAction={
        <Button variant="ghost" asChild>
          <Link href="/accommodations">전체보기</Link>
        </Button>
      }
    >
      <Grid cols={4} gap="lg" responsive className="lg:grid-cols-4">
        {featuredAccommodations.map((accommodation) => (
          <AccommodationCard key={accommodation.id} accommodation={accommodation} />
        ))}
      </Grid>
    </Section>
  )
}
