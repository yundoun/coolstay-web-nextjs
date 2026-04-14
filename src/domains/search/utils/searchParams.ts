/**
 * 검색 URL params 상태 전환 로직
 *
 * 핵심 규칙:
 * - keyword와 regionCode는 배타적 (API 구조상 동시 검색 불가)
 * - keyword 검색 선택 시 → regionCode/regionName 제거
 * - region 검색 선택 시 → keyword 제거
 * - "내 주변" 선택 시 → keyword/regionCode/regionName 모두 제거
 */

/** 업태 코드 → 한글 라벨 */
export const BUSINESS_TYPES = [
  { code: "", label: "전체" },
  { code: "MOTEL", label: "모텔" },
  { code: "HOTEL", label: "호텔" },
  { code: "RESORT", label: "리조트" },
  { code: "PENSION", label: "펜션" },
  { code: "CAMPING", label: "캠핑" },
  { code: "GLAMPING", label: "글램핑" },
  { code: "GUESTHOUSE", label: "게스트하우스" },
  { code: "HANOK", label: "한옥" },
  { code: "POOLVILLA", label: "풀빌라" },
  { code: "RESIDENCE", label: "레지던스" },
  { code: "CARAVAN", label: "카라반" },
] as const

export interface SearchState {
  keyword: string
  regionCode: string
  regionName: string
  businessType: string
  checkIn: string
  checkOut: string
  adults: number
}

/** URL params에서 SearchState를 파싱 */
export function parseSearchParams(
  params: URLSearchParams,
  defaults: { checkIn: string; checkOut: string },
): SearchState {
  return {
    keyword: params.get("keyword") ?? "",
    regionCode: params.get("regionCode") ?? "",
    regionName: params.get("regionName") ?? "",
    businessType: params.get("type") ?? "",
    checkIn: params.get("checkIn") || defaults.checkIn,
    checkOut: params.get("checkOut") || defaults.checkOut,
    adults: Number(params.get("adults")) || 2,
  }
}

/** 지역 선택 시 다음 URL params 계산 */
export function buildRegionChangeParams(
  current: URLSearchParams,
  name: string,
  code: string,
): URLSearchParams {
  const next = new URLSearchParams(current.toString())

  if (code) {
    // 하위 지역 코드 → 지역 필터 검색 (keyword와 배타적)
    next.delete("keyword")
    next.set("regionCode", code)
    if (name) next.set("regionName", name)
    else next.delete("regionName")
  } else {
    // 내 주변 (모든 검색 필터 초기화)
    next.delete("keyword")
    next.delete("regionCode")
    next.delete("regionName")
  }

  return next
}

/** 해시태그 키워드 토글 시 다음 URL params 계산 */
export function buildHashtagToggleParams(
  current: URLSearchParams,
  toggleKeyword: string,
): URLSearchParams {
  const next = new URLSearchParams(current.toString())

  // 현재 활성 키워드 파싱
  const currentKw = next.get("keyword") ?? ""
  const active = new Set(
    currentKw.split(",").map((k) => k.trim()).filter(Boolean),
  )

  // 토글
  if (active.has(toggleKeyword)) {
    active.delete(toggleKeyword)
  } else {
    active.add(toggleKeyword)
  }

  // 키워드와 지역은 배타적
  next.delete("regionCode")
  next.delete("regionName")
  if (active.size > 0) {
    next.set("keyword", Array.from(active).join(","))
  } else {
    next.delete("keyword")
  }

  return next
}

/** 검색 상태에서 UI 표시 라벨 계산 */
export function getDisplayLabels(state: SearchState) {
  const hasKeyword = state.keyword.length > 0
  const hasRegion = state.regionCode.length > 0

  return {
    /** 조건바에 표시할 지역 라벨 (키워드와 무관하게 항상 지역만) */
    regionLabel: state.regionName || null,
    /** 조건바에 표시할 키워드 (있으면 표시) */
    keywordLabel: hasKeyword ? state.keyword : null,
    /** 정보바 검색 주체 텍스트 */
    infoBarSubject: hasKeyword
      ? `'${state.keyword}'`
      : state.regionName || "내 주변",
    /** 현재 검색 모드 */
    mode: hasKeyword ? "keyword" as const
      : hasRegion ? "region" as const
      : "myArea" as const,
  }
}
