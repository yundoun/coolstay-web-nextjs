"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Image from "next/image"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageLightboxProps {
  images: string[]
  initialIndex?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  alt?: string
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
  alt = "이미지",
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  // Touch state
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const pinchStartDistRef = useRef<number | null>(null)
  const pinchStartScaleRef = useRef(1)
  const isDraggingRef = useRef(false)
  const lastTranslateRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Sync initialIndex when lightbox opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex)
      setScale(1)
      setTranslate({ x: 0, y: 0 })
      setDirection(null)
    }
  }, [open, initialIndex])

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [open])

  const resetZoom = useCallback(() => {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
    lastTranslateRef.current = { x: 0, y: 0 }
  }, [])

  const goTo = useCallback(
    (index: number, dir: "left" | "right") => {
      if (isAnimating || index < 0 || index >= images.length) return
      resetZoom()
      setDirection(dir)
      setIsAnimating(true)
      // Let enter animation start, then swap index
      requestAnimationFrame(() => {
        setCurrentIndex(index)
        setTimeout(() => {
          setDirection(null)
          setIsAnimating(false)
        }, 280)
      })
    },
    [isAnimating, images.length, resetZoom]
  )

  const goNext = useCallback(() => {
    if (currentIndex < images.length - 1) goTo(currentIndex + 1, "left")
  }, [currentIndex, images.length, goTo])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) goTo(currentIndex - 1, "right")
  }, [currentIndex, goTo])

  const close = useCallback(() => {
    onOpenChange(false)
    resetZoom()
  }, [onOpenChange, resetZoom])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          goPrev()
          break
        case "ArrowRight":
          goNext()
          break
        case "Escape":
          close()
          break
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, goNext, goPrev, close])

  // Double-tap to zoom
  const lastTapRef = useRef(0)
  const handleDoubleTap = useCallback(() => {
    if (scale > 1) {
      resetZoom()
    } else {
      setScale(2)
    }
  }, [scale, resetZoom])

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch start
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        pinchStartDistRef.current = dist
        pinchStartScaleRef.current = scale
        return
      }

      const touch = e.touches[0]
      touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() }
      lastTranslateRef.current = { ...translate }
      isDraggingRef.current = false

      // Double-tap detection
      const now = Date.now()
      if (now - lastTapRef.current < 300) {
        handleDoubleTap()
        lastTapRef.current = 0
        return
      }
      lastTapRef.current = now
    },
    [scale, translate, handleDoubleTap]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
        // Pinch zoom
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        const newScale = Math.min(
          4,
          Math.max(1, pinchStartScaleRef.current * (dist / pinchStartDistRef.current))
        )
        setScale(newScale)
        if (newScale <= 1) {
          setTranslate({ x: 0, y: 0 })
          lastTranslateRef.current = { x: 0, y: 0 }
        }
        return
      }

      if (!touchStartRef.current) return
      const touch = e.touches[0]
      const dx = touch.clientX - touchStartRef.current.x
      const dy = touch.clientY - touchStartRef.current.y
      isDraggingRef.current = true

      if (scale > 1) {
        // Pan when zoomed
        setTranslate({
          x: lastTranslateRef.current.x + dx,
          y: lastTranslateRef.current.y + dy,
        })
      }
    },
    [scale]
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (pinchStartDistRef.current !== null) {
        pinchStartDistRef.current = null
        if (scale <= 1) resetZoom()
        return
      }

      if (!touchStartRef.current || !isDraggingRef.current) {
        touchStartRef.current = null
        return
      }

      const touch = e.changedTouches[0]
      const dx = touch.clientX - touchStartRef.current.x
      const elapsed = Date.now() - touchStartRef.current.time
      touchStartRef.current = null

      // Swipe detection (only when not zoomed)
      if (scale <= 1) {
        const velocity = Math.abs(dx) / elapsed
        if (Math.abs(dx) > 50 || velocity > 0.5) {
          if (dx > 0) goPrev()
          else goNext()
        }
      }
    },
    [scale, goNext, goPrev, resetZoom]
  )

  if (!open || !mounted) return null

  const slideClass = cn(
    "transition-transform duration-280 ease-out",
    direction === "left" && "animate-slide-in-from-right",
    direction === "right" && "animate-slide-in-from-left"
  )

  return createPortal(
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center select-none"
      role="dialog"
      aria-modal="true"
      aria-label="이미지 상세 보기"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black animate-fade-in"
        onClick={close}
      />

      {/* Close button */}
      <button
        onClick={close}
        className="absolute top-4 right-4 z-10 size-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
        aria-label="닫기"
      >
        <X className="size-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-white/70 text-sm font-medium tabular-nums">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Navigation - Desktop */}
      {images.length > 1 && (
        <>
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex size-12 rounded-full bg-white/10 backdrop-blur-sm items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors disabled:opacity-0 disabled:pointer-events-none"
            aria-label="이전 이미지"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex === images.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex size-12 rounded-full bg-white/10 backdrop-blur-sm items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors disabled:opacity-0 disabled:pointer-events-none"
            aria-label="다음 이미지"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      {/* Image Area */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={cn("relative w-full max-w-5xl mx-auto aspect-[3/2] md:aspect-[3/2] max-md:h-[60vh] max-md:max-w-full", slideClass)}
          style={{
            transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
            transition: scale === 1 && !isDraggingRef.current ? "transform 0.3s ease-out" : undefined,
          }}
        >
          <Image
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            fill
            className="object-contain pointer-events-none"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-[90vw] overflow-x-auto px-2 py-1.5 rounded-xl bg-black/40 backdrop-blur-sm">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                const dir = index > currentIndex ? "left" : "right"
                goTo(index, dir)
              }}
              className={cn(
                "relative size-12 shrink-0 rounded-lg overflow-hidden transition-all duration-200",
                index === currentIndex
                  ? "ring-2 ring-white opacity-100"
                  : "opacity-50 hover:opacity-80"
              )}
            >
              <Image
                src={image}
                alt={`썸네일 ${index + 1}`}
                fill
                className="object-cover"
                sizes="48px"
              />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}
