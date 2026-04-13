"use client"

import { useState } from "react"
import { MapPin, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMagazineRegions } from "../hooks/useMagazine"
import type { Province, District } from "../types"

interface Props {
  onSelect: (provinceCode?: string, districtCode?: string, label?: string) => void
}

export function RegionFilter({ onSelect }: Props) {
  const { data } = useMagazineRegions()
  const [open, setOpen] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState("전국")
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)

  const provinces = data?.provinces ?? []

  function handleProvinceClick(province: Province) {
    if (province.code === 0 || province.code === null) {
      // 전국 선택
      setSelectedLabel("전국")
      setSelectedProvince(null)
      setOpen(false)
      onSelect(undefined, undefined, "전국")
      return
    }
    setSelectedProvince(province)
  }

  function handleDistrictClick(district: District) {
    const label = district.displayName
      ? `${selectedProvince?.name} ${district.displayName}`
      : `${selectedProvince?.name} ${district.name}`
    setSelectedLabel(label)
    setOpen(false)
    onSelect(String(district.provinceCode), String(district.code), label)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium",
          "transition-colors hover:bg-accent",
          open && "bg-accent"
        )}
      >
        <MapPin className="size-4 text-primary" />
        {selectedLabel}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSelectedProvince(null) }} />
          <div className="absolute left-0 top-full z-50 mt-2 w-[320px] sm:w-[400px] rounded-xl border bg-card shadow-xl">
            <div className="flex max-h-[360px]">
              {/* 시/도 목록 */}
              <div className="w-[120px] sm:w-[140px] border-r overflow-y-auto">
                {provinces.map((province) => (
                  <button
                    key={province.code ?? "all"}
                    onClick={() => handleProvinceClick(province)}
                    className={cn(
                      "w-full px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent",
                      selectedProvince?.code === province.code && "bg-accent font-medium text-primary"
                    )}
                  >
                    {province.name}
                  </button>
                ))}
              </div>

              {/* 시/군/구 목록 */}
              <div className="flex-1 overflow-y-auto p-2">
                {selectedProvince ? (
                  <div className="grid grid-cols-2 gap-1">
                    {selectedProvince.districts.map((district) => (
                      <button
                        key={`${district.provinceCode}-${district.code}`}
                        onClick={() => handleDistrictClick(district)}
                        className="rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                      >
                        {district.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    지역을 선택해주세요
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
