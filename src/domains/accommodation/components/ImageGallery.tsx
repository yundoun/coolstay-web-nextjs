"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Grid2x2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageLightbox } from "@/components/ui/image-lightbox"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  name: string
}

export function ImageGallery({ images, name }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const goTo = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, images.length - 1)))
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="relative">
        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-2 h-[480px] rounded-2xl overflow-hidden">
          {/* Main image */}
          <div
            className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden"
            onClick={() => openLightbox(0)}
          >
            <Image
              src={images[0]}
              alt={`${name} 메인 이미지`}
              fill
              priority
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              sizes="50vw"
            />
          </div>
          {/* Secondary images */}
          {images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden"
              onClick={() => openLightbox(index + 1)}
            >
              <Image
                src={image}
                alt={`${name} 이미지 ${index + 2}`}
                fill
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05]"
                sizes="25vw"
              />
              {/* Show count overlay on last image */}
              {index === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-colors group-hover:bg-black/40">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Grid2x2 className="size-5" />
                    <span>+{images.length - 5}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden relative aspect-[4/3] overflow-hidden">
          <Image
            src={images[currentIndex]}
            alt={`${name} 이미지 ${currentIndex + 1}`}
            fill
            priority
            className="object-cover cursor-pointer"
            sizes="100vw"
            onClick={() => openLightbox(currentIndex)}
          />

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white"
                onClick={() => goTo(currentIndex - 1)}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white"
                onClick={() => goTo(currentIndex + 1)}
                disabled={currentIndex === images.length - 1}
              >
                <ChevronRight className="size-5" />
              </Button>
            </>
          )}

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={cn(
                  "size-2 rounded-full transition-all",
                  index === currentIndex
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/70"
                )}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      <ImageLightbox
        images={images}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        alt={name}
      />
    </>
  )
}
