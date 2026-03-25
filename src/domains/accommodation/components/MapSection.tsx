"use client"

import { useState } from "react"
import { MapPin, Copy, Navigation, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MapSectionProps {
  address: string
  name: string
  latitude?: number
  longitude?: number
}

export function MapSection({ address, name, latitude, longitude }: MapSectionProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = address
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDirections = () => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://map.naver.com/v5/search/${encodedAddress}`, "_blank")
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">위치</h2>

      {/* Static Map Placeholder */}
      <div className="relative w-full h-48 rounded-xl bg-muted border overflow-hidden mb-4">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
          <MapPin className="size-8 mb-2" />
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs mt-1">지도를 보려면 길찾기를 눌러주세요</p>
        </div>
        {/* Grid pattern to simulate map */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 mb-4">
        <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-sm text-foreground">{address}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          onClick={handleCopyAddress}
        >
          {copied ? (
            <>
              <Check className="size-4 text-green-500" />
              복사 완료
            </>
          ) : (
            <>
              <Copy className="size-4" />
              주소 복사
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          onClick={handleDirections}
        >
          <Navigation className="size-4" />
          길찾기
        </Button>
      </div>
    </div>
  )
}
