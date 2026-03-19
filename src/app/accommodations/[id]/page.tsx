import { AccommodationDetailLayout } from "@/domains/accommodation/components"
import { getAccommodationDetail } from "@/domains/accommodation/data/mock"

interface AccommodationPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: AccommodationPageProps) {
  const { id } = await params
  const accommodation = getAccommodationDetail(id)

  return {
    title: accommodation
      ? `${accommodation.name} | 꿀스테이`
      : "숙소 상세 | 꿀스테이",
    description: accommodation?.description,
  }
}

export default async function AccommodationDetailPage({
  params,
}: AccommodationPageProps) {
  const { id } = await params
  const accommodation = getAccommodationDetail(id)

  if (!accommodation) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">숙소를 찾을 수 없습니다</h1>
          <p className="text-muted-foreground">요청하신 숙소 정보가 존재하지 않습니다.</p>
        </div>
      </div>
    )
  }

  return <AccommodationDetailLayout accommodation={accommodation} />
}
