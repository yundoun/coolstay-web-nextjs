"use client"

import Image from "next/image"
import { Container } from "@/components/layout"
import { SearchBar } from "@/components/ui/search-bar"
import { heroBackgrounds } from "../data/mock"
import { cn } from "@/lib/utils"

export function HeroSection() {
  return (
    <section
      data-slot="hero-section"
      className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBackgrounds[0]}
          alt="Hero background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      </div>

      {/* Content */}
      <Container size="normal" className="relative z-10 py-12 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* Title */}
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg md:text-4xl lg:text-5xl">
            <span className="text-primary">꿀</span>같은 휴식을 선물하세요
          </h1>
          <p className="mt-3 text-base text-white/90 drop-shadow md:mt-4 md:text-lg">
            전국 5,000개 이상의 엄선된 숙소에서 특별한 순간을 만나보세요
          </p>

          {/* Glassmorphism Search Bar */}
          <div className="mt-8 md:mt-12">
            <SearchBar variant="hero" />
          </div>

          {/* Quick Tags */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {["오션뷰", "커플추천", "가족여행", "호캉스", "펜션"].map((tag) => (
              <button
                key={tag}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium",
                  "bg-white/20 text-white backdrop-blur-sm",
                  "transition-all hover:bg-white/30",
                  "border border-white/30"
                )}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
