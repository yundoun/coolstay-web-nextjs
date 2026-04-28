"use client"

import { useState, useEffect, useMemo } from "react"
import {
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Train,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRegions } from "../../hooks/useContentsData"
import { cityRegions } from "../../data/regions"

type RegionTab = "region" | "subway"

const VALID_REGION_CATEGORIES = new Set(["ALL", "MOTEL", "HOTEL", "CAMPING", "PENSION", "GUESTHOUSE"])

function getRegionCategoryCode(businessType: string): string {
  const types = businessType.split(",")
  const valid = types.find((t) => VALID_REGION_CATEGORIES.has(t))
  return valid || "ALL"
}

export function RegionDropdown({
  businessType,
  onSelect,
  onClose,
}: {
  businessType?: string
  onSelect: (keyword: string, code: string) => void
  onClose: () => void
}) {
  const regionCategoryCode = businessType
    ? `${getRegionCategoryCode(businessType)},SUBWAY`
    : undefined
  const { data: apiRegions, isLoading } = useRegions(regionCategoryCode)
  const [tab, setTab] = useState<RegionTab>("region")

  // 지역 목록
  const regionList = useMemo(() => {
    if (!apiRegions?.regions?.length) {
      return cityRegions.map((c) => ({
        name: c.city,
        code: "",
        subRegions: c.areas.map((a) => ({ name: a.name, code: "" })),
      }))
    }
    return apiRegions.regions
      .filter((r) => r.open_yn !== "N" || r.sub_regions?.some((s) => s.open_yn === "Y"))
      .map((r) => ({
        name: r.name,
        code: r.code,
        subRegions: (r.sub_regions || [])
          .filter((s) => s.open_yn === "Y")
          .map((s) => ({ name: s.name, code: s.code })),
      }))
  }, [apiRegions])

  // 지하철 목록 (3단계: 그룹 → 호선 → 역)
  const subwayGroups = useMemo(() => {
    if (!apiRegions?.subways?.length) return []
    return apiRegions.subways
      .filter((g) => g.open_yn !== "N")
      .map((group) => ({
        name: group.name,
        code: group.code,
        lines: (group.sub_regions || [])
          .filter((l) => l.open_yn !== "N")
          .map((line) => ({
            name: line.name,
            code: line.code,
            stations: (line.sub_regions || [])
              .filter((s) => s.open_yn !== "N")
              .map((s) => ({ name: s.name, code: s.code })),
          })),
      }))
  }, [apiRegions])

  const [activeCity, setActiveCity] = useState(regionList[0]?.name || "")
  const [activeSubwayGroup, setActiveSubwayGroup] = useState(subwayGroups[0]?.name || "")
  const [selectedLine, setSelectedLine] = useState<string | null>(null)
  const activeCityData = regionList.find((c) => c.name === activeCity)
  const activeGroupData = subwayGroups.find((g) => g.name === activeSubwayGroup)
  const activeLineData = selectedLine
    ? activeGroupData?.lines.find((l) => l.name === selectedLine)
    : null

  // 지하철 탭 전환 시 첫 번째 그룹 선택
  useEffect(() => {
    if (tab === "subway" && subwayGroups.length && !activeSubwayGroup) {
      setActiveSubwayGroup(subwayGroups[0].name)
    }
  }, [tab, subwayGroups, activeSubwayGroup])

  const handleSelect = (name: string, code: string) => {
    onSelect(name, code)
  }

  const handleMyArea = () => {
    onSelect("", "")
  }

  const hasSubways = subwayGroups.length > 0

  return (
    <div className="absolute left-0 top-full mt-2 z-50 bg-background rounded-xl shadow-xl border w-[580px] max-h-[min(520px,70vh)] flex flex-col overflow-hidden animate-fade-in-down">
      <div className="flex items-center justify-between px-5 py-3.5 border-b shrink-0">
        <h3 className="text-sm font-bold">지역 선택</h3>
        <button onClick={onClose} className="p-0.5 rounded-full hover:bg-muted">
          <X className="size-4 text-muted-foreground" />
        </button>
      </div>

      {/* 내 주변 + 탭 전환 */}
      <div className="flex items-center gap-2 px-5 py-2.5 border-b border-border/50 shrink-0">
        <button
          onClick={handleMyArea}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-primary font-medium hover:bg-primary/5 rounded-full border border-primary/30"
        >
          <Navigation className="size-3" />
          내 주변
        </button>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setTab("region")}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 text-xs rounded-full transition-colors",
              tab === "region"
                ? "bg-primary text-white font-semibold"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <MapPin className="size-3" />
            지역
          </button>
          {hasSubways && (
            <button
              onClick={() => setTab("subway")}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 text-xs rounded-full transition-colors",
                tab === "subway"
                  ? "bg-primary text-white font-semibold"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Train className="size-3" />
              지하철
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : tab === "region" ? (
        <div className="flex flex-1 min-h-0">
          {/* Cities */}
          <div className="w-[120px] border-r bg-muted/50 py-1 overflow-y-auto">
            {regionList.map((region) => (
              <button
                key={region.name}
                onClick={() => {
                  if (!region.subRegions.length) {
                    handleSelect(region.name, region.code)
                  } else {
                    setActiveCity(region.name)
                  }
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm relative",
                  activeCity === region.name
                    ? "text-primary font-semibold bg-background"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {activeCity === region.name && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary rounded-r-full" />
                )}
                {region.name}
              </button>
            ))}
          </div>
          {/* Areas — 하위 지역만 표시 (상위 코드 ALL_XX는 API 미지원) */}
          <div className="flex-1 py-1 overflow-y-auto">
            {activeCityData?.subRegions.map((area) => (
              <button
                key={area.code || area.name}
                onClick={() => handleSelect(area.name, area.code)}
                className="w-full flex items-center gap-2.5 px-5 py-2.5 text-sm text-foreground hover:bg-muted/50"
              >
                <MapPin className="size-3.5 text-muted-foreground" />
                <span>{area.name}</span>
                <ChevronRight className="size-3.5 text-muted-foreground/40 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 min-h-0">
          {/* Subway Groups */}
          <div className="w-[120px] border-r bg-muted/50 py-1 overflow-y-auto">
            {subwayGroups.map((group) => (
              <button
                key={group.name}
                onClick={() => {
                  setActiveSubwayGroup(group.name)
                  setSelectedLine(null)
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm relative",
                  activeSubwayGroup === group.name
                    ? "text-primary font-semibold bg-background"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {activeSubwayGroup === group.name && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary rounded-r-full" />
                )}
                {group.name}
              </button>
            ))}
          </div>
          {/* Lines → Stations drill-down */}
          <div className="flex-1 overflow-y-auto">
            {selectedLine && activeLineData ? (
              <>
                <button
                  onClick={() => setSelectedLine(null)}
                  className="sticky top-0 z-10 w-full flex items-center gap-1.5 px-5 py-2.5 text-sm text-primary font-medium hover:bg-muted/50 border-b border-border/50 bg-background"
                >
                  <ChevronLeft className="size-3.5" />
                  <span>{selectedLine}</span>
                </button>
                {activeLineData.stations.map((station) => (
                  <button
                    key={station.code || station.name}
                    onClick={() => handleSelect(station.name, station.code)}
                    className="w-full flex items-center gap-2.5 px-5 py-2.5 text-sm text-foreground hover:bg-muted/50"
                  >
                    <Train className="size-3.5 text-muted-foreground" />
                    <span>{station.name}</span>
                    <ChevronRight className="size-3.5 text-muted-foreground/40 ml-auto" />
                  </button>
                ))}
                {!activeLineData.stations.length && (
                  <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                    역 정보가 없습니다
                  </div>
                )}
              </>
            ) : (
              <>
                {activeGroupData?.lines.map((line) => (
                  <button
                    key={line.code || line.name}
                    onClick={() => setSelectedLine(line.name)}
                    className="w-full flex items-center gap-2.5 px-5 py-2.5 text-sm text-foreground hover:bg-muted/50"
                  >
                    <Train className="size-3.5 text-muted-foreground" />
                    <span>{line.name}</span>
                    <ChevronRight className="size-3.5 text-muted-foreground/40 ml-auto" />
                  </button>
                ))}
                {!activeGroupData?.lines.length && (
                  <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                    노선 정보가 없습니다
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
