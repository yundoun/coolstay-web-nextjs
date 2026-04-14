import {
  parseSearchParams,
  buildRegionChangeParams,
  buildHashtagToggleParams,
  getDisplayLabels,
} from "../utils/searchParams"

const DEFAULTS = { checkIn: "2026-04-07", checkOut: "2026-04-08" }

function makeParams(obj: Record<string, string> = {}) {
  return new URLSearchParams(obj)
}

// ─── parseSearchParams ──────────────────────────────────────

describe("parseSearchParams", () => {
  it("파라미터 없으면 기본값을 반환한다", () => {
    const state = parseSearchParams(makeParams(), DEFAULTS)
    expect(state).toEqual({
      keyword: "",
      regionCode: "",
      regionName: "",
      businessType: "",
      checkIn: "2026-04-07",
      checkOut: "2026-04-08",
      adults: 2,
    })
  })

  it("URL에서 모든 파라미터를 파싱한다", () => {
    const state = parseSearchParams(
      makeParams({
        keyword: "오션뷰",
        regionCode: "R01",
        regionName: "서울",
        type: "HOTEL",
        checkIn: "2026-05-01",
        checkOut: "2026-05-02",
        adults: "3",
      }),
      DEFAULTS,
    )
    expect(state.keyword).toBe("오션뷰")
    expect(state.regionCode).toBe("R01")
    expect(state.regionName).toBe("서울")
    expect(state.businessType).toBe("HOTEL")
    expect(state.adults).toBe(3)
  })

  it("type 파라미터로 businessType을 파싱한다", () => {
    const state = parseSearchParams(makeParams({ type: "MOTEL" }), DEFAULTS)
    expect(state.businessType).toBe("MOTEL")
  })
})

// ─── buildRegionChangeParams ────────────────────────────────

describe("buildRegionChangeParams", () => {
  describe("지역 코드가 있는 경우 (하위 지역 선택)", () => {
    it("keyword를 제거하고 regionCode/regionName을 설정한다", () => {
      const current = makeParams({ keyword: "오션뷰" })
      const next = buildRegionChangeParams(current, "강남", "R01_01")

      expect(next.get("keyword")).toBeNull()
      expect(next.get("regionCode")).toBe("R01_01")
      expect(next.get("regionName")).toBe("강남")
    })

    it("기존 regionCode를 새 값으로 교체한다", () => {
      const current = makeParams({ regionCode: "R01_01", regionName: "강남" })
      const next = buildRegionChangeParams(current, "홍대", "R01_02")

      expect(next.get("regionCode")).toBe("R01_02")
      expect(next.get("regionName")).toBe("홍대")
    })

    it("키워드+날짜가 있던 상태에서 지역 선택 시 keyword만 제거하고 날짜는 유지한다", () => {
      const current = makeParams({
        keyword: "스파",
        checkIn: "2026-05-01",
        checkOut: "2026-05-02",
        adults: "3",
      })
      const next = buildRegionChangeParams(current, "제주", "R08_01")

      expect(next.get("keyword")).toBeNull()
      expect(next.get("regionCode")).toBe("R08_01")
      expect(next.get("checkIn")).toBe("2026-05-01")
      expect(next.get("adults")).toBe("3")
    })
  })

  describe("이름만 있고 코드가 없는 경우 (도시 전체)", () => {
    it("키워드 검색으로 전환하고 regionCode/regionName을 제거한다", () => {
      const current = makeParams({ regionCode: "R01_01", regionName: "강남" })
      const next = buildRegionChangeParams(current, "서울", "")

      expect(next.get("keyword")).toBe("서울")
      expect(next.get("regionCode")).toBeNull()
      expect(next.get("regionName")).toBeNull()
    })
  })

  describe("이름도 코드도 없는 경우 (내 주변)", () => {
    it("keyword, regionCode, regionName 모두 제거한다", () => {
      const current = makeParams({
        keyword: "오션뷰",
        regionCode: "R01",
        regionName: "서울",
      })
      const next = buildRegionChangeParams(current, "", "")

      expect(next.get("keyword")).toBeNull()
      expect(next.get("regionCode")).toBeNull()
      expect(next.get("regionName")).toBeNull()
    })

    it("날짜와 인원 파라미터는 유지한다", () => {
      const current = makeParams({
        keyword: "오션뷰",
        checkIn: "2026-05-01",
        adults: "3",
      })
      const next = buildRegionChangeParams(current, "", "")

      expect(next.get("keyword")).toBeNull()
      expect(next.get("checkIn")).toBe("2026-05-01")
      expect(next.get("adults")).toBe("3")
    })
  })
})

// ─── buildHashtagToggleParams ───────────────────────────────

describe("buildHashtagToggleParams", () => {
  it("키워드가 없는 상태에서 해시태그 선택 시 keyword를 추가한다", () => {
    const next = buildHashtagToggleParams(makeParams(), "오션뷰")

    expect(next.get("keyword")).toBe("오션뷰")
  })

  it("해시태그 선택 시 regionCode/regionName을 제거한다", () => {
    const current = makeParams({ regionCode: "R01", regionName: "서울" })
    const next = buildHashtagToggleParams(current, "오션뷰")

    expect(next.get("keyword")).toBe("오션뷰")
    expect(next.get("regionCode")).toBeNull()
    expect(next.get("regionName")).toBeNull()
  })

  it("이미 활성인 키워드를 다시 클릭하면 제거한다", () => {
    const current = makeParams({ keyword: "오션뷰" })
    const next = buildHashtagToggleParams(current, "오션뷰")

    expect(next.get("keyword")).toBeNull()
  })

  it("복수 키워드를 쉼표로 연결한다", () => {
    const current = makeParams({ keyword: "오션뷰" })
    const next = buildHashtagToggleParams(current, "스파")

    const keywords = next.get("keyword")!.split(",")
    expect(keywords).toContain("오션뷰")
    expect(keywords).toContain("스파")
  })

  it("복수 키워드 중 하나를 제거한다", () => {
    const current = makeParams({ keyword: "오션뷰,스파" })
    const next = buildHashtagToggleParams(current, "오션뷰")

    expect(next.get("keyword")).toBe("스파")
  })

  it("마지막 키워드를 제거하면 keyword 파라미터 자체가 삭제된다", () => {
    const current = makeParams({ keyword: "오션뷰" })
    const next = buildHashtagToggleParams(current, "오션뷰")

    expect(next.has("keyword")).toBe(false)
  })

  it("날짜 등 기타 파라미터는 유지한다", () => {
    const current = makeParams({
      checkIn: "2026-05-01",
      regionCode: "R01",
      adults: "3",
    })
    const next = buildHashtagToggleParams(current, "조식")

    expect(next.get("keyword")).toBe("조식")
    expect(next.get("regionCode")).toBeNull()
    expect(next.get("checkIn")).toBe("2026-05-01")
    expect(next.get("adults")).toBe("3")
  })
})

// ─── getDisplayLabels ───────────────────────────────────────

describe("getDisplayLabels", () => {
  it("초기 상태 (내 주변): mode=myArea, 지역·키워드 라벨 null", () => {
    const labels = getDisplayLabels({
      keyword: "",
      regionCode: "",
      regionName: "",
      businessType: "",
      checkIn: "",
      checkOut: "",
      adults: 2,
    })

    expect(labels.mode).toBe("myArea")
    expect(labels.regionLabel).toBeNull()
    expect(labels.keywordLabel).toBeNull()
    expect(labels.infoBarSubject).toBe("내 주변")
  })

  it("키워드만 검색: mode=keyword, keywordLabel 표시, regionLabel null", () => {
    const labels = getDisplayLabels({
      keyword: "오션뷰",
      regionCode: "",
      regionName: "",
      businessType: "",
      checkIn: "",
      checkOut: "",
      adults: 2,
    })

    expect(labels.mode).toBe("keyword")
    expect(labels.keywordLabel).toBe("오션뷰")
    expect(labels.regionLabel).toBeNull()
    expect(labels.infoBarSubject).toBe("'오션뷰'")
  })

  it("지역만 검색: mode=region, regionLabel 표시, keywordLabel null", () => {
    const labels = getDisplayLabels({
      keyword: "",
      regionCode: "R01_01",
      regionName: "강남",
      businessType: "",
      checkIn: "",
      checkOut: "",
      adults: 2,
    })

    expect(labels.mode).toBe("region")
    expect(labels.regionLabel).toBe("강남")
    expect(labels.keywordLabel).toBeNull()
    expect(labels.infoBarSubject).toBe("강남")
  })

  it("keyword와 regionCode가 동시에 있으면 keyword 우선 (mode=keyword)", () => {
    // API 구조상 배타적이지만, URL 조작 등으로 동시에 있을 수 있음
    const labels = getDisplayLabels({
      keyword: "스파",
      regionCode: "R01",
      regionName: "서울",
      businessType: "",
      checkIn: "",
      checkOut: "",
      adults: 2,
    })

    expect(labels.mode).toBe("keyword")
    expect(labels.keywordLabel).toBe("스파")
    expect(labels.regionLabel).toBe("서울")
  })
})

// ─── 시나리오 기반 통합 테스트 ──────────────────────────────

describe("검색 상태 전환 시나리오", () => {
  it("시나리오 1: 키워드 검색 → 지역 선택 → keyword 제거됨", () => {
    // 1. 키워드 검색 중
    const step1 = makeParams({ keyword: "오션뷰" })
    const state1 = parseSearchParams(step1, DEFAULTS)
    expect(getDisplayLabels(state1).mode).toBe("keyword")
    expect(getDisplayLabels(state1).keywordLabel).toBe("오션뷰")

    // 2. 지역 선택
    const step2 = buildRegionChangeParams(step1, "강남", "R01_01")
    const state2 = parseSearchParams(step2, DEFAULTS)
    expect(getDisplayLabels(state2).mode).toBe("region")
    expect(getDisplayLabels(state2).keywordLabel).toBeNull()
    expect(getDisplayLabels(state2).regionLabel).toBe("강남")
  })

  it("시나리오 2: 지역 검색 → 해시태그 선택 → 지역 제거됨", () => {
    // 1. 지역 검색 중
    const step1 = makeParams({ regionCode: "R01_01", regionName: "강남" })

    // 2. 해시태그 선택
    const step2 = buildHashtagToggleParams(step1, "오션뷰")
    const state2 = parseSearchParams(step2, DEFAULTS)
    expect(state2.keyword).toBe("오션뷰")
    expect(state2.regionCode).toBe("")
    expect(state2.regionName).toBe("")
  })

  it("시나리오 3: 해시태그 2개 선택 → 지역 선택 → 해시태그 모두 제거", () => {
    // 1. 해시태그 2개
    let params = buildHashtagToggleParams(makeParams(), "오션뷰")
    params = buildHashtagToggleParams(params, "스파")
    expect(params.get("keyword")).toContain("오션뷰")
    expect(params.get("keyword")).toContain("스파")

    // 2. 지역 선택 → keyword 제거
    const step2 = buildRegionChangeParams(params, "제주", "R08_01")
    expect(step2.get("keyword")).toBeNull()
    expect(step2.get("regionCode")).toBe("R08_01")
  })

  it("시나리오 4: 지역 검색 → 내 주변 → 모든 필터 초기화", () => {
    const step1 = makeParams({ regionCode: "R01_01", regionName: "강남", checkIn: "2026-05-01" })
    const step2 = buildRegionChangeParams(step1, "", "")
    const state2 = parseSearchParams(step2, DEFAULTS)

    expect(state2.keyword).toBe("")
    expect(state2.regionCode).toBe("")
    expect(state2.regionName).toBe("")
    expect(state2.checkIn).toBe("2026-05-01") // 날짜는 유지
  })

  it("시나리오 5: 키워드 검색 → 내 주변 → keyword 제거", () => {
    const step1 = makeParams({ keyword: "스파" })
    const step2 = buildRegionChangeParams(step1, "", "")
    expect(step2.get("keyword")).toBeNull()
  })

  it("시나리오 6: 키워드 검색 → 도시 전체 (코드 없음) → 키워드가 도시명으로 교체", () => {
    const step1 = makeParams({ keyword: "오션뷰" })
    const step2 = buildRegionChangeParams(step1, "서울", "")
    expect(step2.get("keyword")).toBe("서울")
    expect(step2.get("regionCode")).toBeNull()
  })

  it("시나리오 7: 해시태그 선택 → 같은 해시태그 재클릭 → 초기 상태", () => {
    const step1 = buildHashtagToggleParams(makeParams(), "오션뷰")
    expect(step1.get("keyword")).toBe("오션뷰")

    const step2 = buildHashtagToggleParams(step1, "오션뷰")
    expect(step2.has("keyword")).toBe(false)
  })

  it("시나리오 8: 지역 A → 지역 B 변경 → regionCode/Name이 B로 교체", () => {
    const step1 = makeParams({ regionCode: "R01_01", regionName: "강남" })
    const step2 = buildRegionChangeParams(step1, "홍대", "R01_02")
    expect(step2.get("regionCode")).toBe("R01_02")
    expect(step2.get("regionName")).toBe("홍대")
  })

  it("시나리오 9: 비정상 URL (keyword+regionCode 동시) → 정상 전환에서 정리됨", () => {
    // 비정상 URL에서 지역 선택하면 keyword가 제거됨
    const abnormal = makeParams({ keyword: "스파", regionCode: "R01", regionName: "서울" })
    const step1 = buildRegionChangeParams(abnormal, "홍대", "R01_02")
    expect(step1.get("keyword")).toBeNull()
    expect(step1.get("regionCode")).toBe("R01_02")

    // 비정상 URL에서 해시태그 선택하면 regionCode가 제거됨
    const step2 = buildHashtagToggleParams(abnormal, "오션뷰")
    expect(step2.get("regionCode")).toBeNull()
    expect(step2.get("keyword")).toContain("오션뷰")

    // 비정상 URL에서 내 주변 선택하면 모두 제거됨
    const step3 = buildRegionChangeParams(abnormal, "", "")
    expect(step3.get("keyword")).toBeNull()
    expect(step3.get("regionCode")).toBeNull()
  })
})
