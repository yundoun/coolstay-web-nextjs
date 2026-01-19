"use client"

import Image from "next/image"
import { MapPin } from "lucide-react"
import { Container } from "@/components/layout"
import { SearchBar } from "@/components/ui/search-bar"
import { getRegionImage } from "../data/regionImages"

interface SearchHeroSectionProps {
  region?: string
  checkIn?: string
  checkOut?: string
  guests?: number
}

export function SearchHeroSection({
  region,
  checkIn,
  checkOut,
  guests = 2,
}: SearchHeroSectionProps) {
  const regionData = getRegionImage(region)

  return (
    <section
      data-slot="search-hero-section"
      className="relative min-h-[40vh] md:min-h-[45vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src={regionData.heroImage}
          alt={`${regionData.label} 배경`}
          fill
          priority
          className="object-cover scale-105 animate-slow-zoom"
          sizes="100vw"
        />
        {/* Gradient Overlay - More cinematic */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        {/* Noise texture for depth */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]" />
      </div>

      {/* Content */}
      <Container size="normal" className="relative z-10 py-8 md:py-12">
        <div className="mx-auto max-w-3xl text-center">
          {/* Region Label */}
          {region && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              <MapPin className="size-4 text-white" />
              <span className="text-sm font-medium text-white">
                {regionData.label}
              </span>
            </div>
          )}

          {/* Title with Animation */}
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg md:text-3xl lg:text-4xl animate-fade-in">
            {regionData.description}
          </h1>

          {/* Glassmorphism Search Bar */}
          <div className="mt-6 md:mt-8">
            <SearchBar
              variant="hero"
              location={region ? regionData.label : undefined}
              locationLabel="여행지"
              locationPlaceholder="여행지 선택"
              date={checkIn && checkOut ? `${checkIn} - ${checkOut}` : undefined}
              guests={`성인 ${guests}명`}
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
