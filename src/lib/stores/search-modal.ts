import { create } from "zustand"

export type SearchStep = "region" | "date" | "guest" | null

interface SearchModalStore {
  isOpen: boolean
  step: SearchStep
  // 검색 조건 상태
  selectedCity: string | null
  selectedArea: string | null
  regionCode: string | null  // API 지역 코드 (ex: MOTEL_1, MOTEL_9300001)
  checkIn: Date | null
  checkOut: Date | null
  adults: number
  // 업태 클릭 → 지역 선택 플로우용
  businessType: string | null              // 선택된 업태 (MOTEL, HOTEL 등)
  mappingBusinessTypes: string[] | null     // 업태 매핑 배열
  // 적용 콜백 (숙소 상세 등에서 등록)
  onApply: (() => void) | null
  // 액션
  open: (step?: SearchStep) => void
  close: () => void
  setStep: (step: SearchStep) => void
  setCity: (city: string | null) => void
  setArea: (area: string | null) => void
  setRegionCode: (code: string | null) => void
  setCheckIn: (date: Date | null) => void
  setCheckOut: (date: Date | null) => void
  setAdults: (n: number) => void
  openWithBusinessType: (businessType: string, mappingTypes?: string[]) => void
  setOnApply: (cb: (() => void) | null) => void
  reset: () => void
}

export const useSearchModal = create<SearchModalStore>((set, get) => ({
  isOpen: false,
  step: null,
  selectedCity: null,
  selectedArea: null,
  regionCode: null,
  checkIn: null,
  checkOut: null,
  adults: 2,
  businessType: null,
  mappingBusinessTypes: null,
  onApply: null,
  open: (step = "region") => set({ isOpen: true, step }),
  close: () => {
    const { onApply } = get()
    set({ isOpen: false, step: null, businessType: null, mappingBusinessTypes: null })
    onApply?.()
  },
  setStep: (step) => set({ step }),
  setCity: (city) => set({ selectedCity: city, selectedArea: null, regionCode: null }),
  setArea: (area) => set({ selectedArea: area }),
  setRegionCode: (code) => set({ regionCode: code }),
  setCheckIn: (date) => set({ checkIn: date }),
  setCheckOut: (date) => set({ checkOut: date }),
  setAdults: (n) => set({ adults: n }),
  openWithBusinessType: (businessType, mappingTypes) =>
    set({ isOpen: true, step: "region", businessType, mappingBusinessTypes: mappingTypes || null }),
  setOnApply: (cb) => set({ onApply: cb }),
  reset: () =>
    set({
      selectedCity: null,
      selectedArea: null,
      regionCode: null,
      checkIn: null,
      checkOut: null,
      adults: 2,
      businessType: null,
      mappingBusinessTypes: null,
    }),
}))
