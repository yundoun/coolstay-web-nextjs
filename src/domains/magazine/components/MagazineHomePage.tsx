"use client"

import { useState } from "react"
import { Section } from "@/components/layout"
import { Skeleton } from "@/components/ui/skeleton"
import { useMagazineHome } from "../hooks/useMagazine"
import { MagazineBannerCarousel } from "./MagazineBannerCarousel"
import { VideoSection } from "./VideoSection"
import { BoardCardGrid } from "./BoardCardGrid"
import { PackageCardGrid } from "./PackageCardGrid"
import { RegionFilter } from "./RegionFilter"

export function MagazineHomePage() {
  const [regionFilter, setRegionFilter] = useState<{
    provinceCode?: string
    districtCode?: string
  }>({})

  const { data, isLoading } = useMagazineHome(
    regionFilter.provinceCode,
    regionFilter.districtCode
  )

  function handleRegionSelect(provinceCode?: string, districtCode?: string) {
    setRegionFilter({ provinceCode, districtCode })
  }

  if (isLoading) return <MagazineHomeSkeleton />

  return (
    <main>
      {/* 헤더 + 지역 필터 */}
      <Section spacing="md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">매거진</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              여행이 더 즐거워지는 이야기
            </p>
          </div>
          <RegionFilter onSelect={handleRegionSelect} />
        </div>
      </Section>

      {/* 배너 캐러셀 */}
      {data?.magazine_banner && data.magazine_banner.length > 0 && (
        <Section spacing="sm">
          <MagazineBannerCarousel banners={data.magazine_banner} />
        </Section>
      )}

      {/* 동영상 */}
      {data?.magazine_video && data.magazine_video.length > 0 && (
        <Section
          title="영상"
          description="인플루언서가 소개하는 숙소 이야기"
          spacing="md"
        >
          <VideoSection videos={data.magazine_video} />
        </Section>
      )}

      {/* 게시글 */}
      {data?.magazine_board && data.magazine_board.length > 0 && (
        <Section
          title="게시글"
          description="칼럼, 맛집 후기 등 다양한 콘텐츠"
          spacing="md"
        >
          <BoardCardGrid boards={data.magazine_board} />
        </Section>
      )}

      {/* 패키지 */}
      {data?.magazine_package && data.magazine_package.length > 0 && (
        <Section
          title="패키지"
          description="특별한 혜택이 담긴 숙소 패키지"
          spacing="md"
        >
          <PackageCardGrid packages={data.magazine_package} />
        </Section>
      )}
    </main>
  )
}

function MagazineHomeSkeleton() {
  return (
    <main>
      <Section spacing="md">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="mt-2 h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </Section>
      <Section spacing="sm">
        <Skeleton className="aspect-[2.5/1] w-full rounded-xl" />
      </Section>
      <Section spacing="md">
        <Skeleton className="h-6 w-16 mb-4" />
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[135px] w-[240px] flex-shrink-0 rounded-xl" />
          ))}
        </div>
      </Section>
      <Section spacing="md">
        <Skeleton className="h-6 w-16 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
          ))}
        </div>
      </Section>
    </main>
  )
}
