"use client"

import { useState, useEffect } from "react"

interface UserLocation {
  latitude: string
  longitude: string
}

const DEFAULT_LOCATION: UserLocation = {
  latitude: "37.5665",
  longitude: "126.9780",
}

/**
 * 사용자 위치를 Geolocation API로 가져온다.
 * 권한 거부 또는 미지원 시 서울시청 좌표를 폴백으로 사용.
 */
export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation>(DEFAULT_LOCATION)
  const [isLocating, setIsLocating] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        })
        setIsLocating(false)
      },
      () => {
        // 권한 거부 — 기본값 유지
        setIsLocating(false)
      },
      { timeout: 5000, maximumAge: 300000 }
    )
  }, [])

  return { location, isLocating }
}
