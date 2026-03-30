import { AccommodationDetailPage } from "@/domains/accommodation/components/AccommodationDetailPage"

interface AccommodationPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: AccommodationPageProps) {
  const { id } = await params
  return {
    title: `숙소 상세 | 꿀스테이`,
    description: `숙소 ${id} 상세 정보`,
  }
}

export default async function Page({ params }: AccommodationPageProps) {
  const { id } = await params
  return <AccommodationDetailPage storeKey={id} />
}
