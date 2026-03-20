import { create } from "zustand"

export type SearchStep = "region" | "date" | "guest" | null

interface SearchModalStore {
  isOpen: boolean
  step: SearchStep
  // 검색 조건 상태
  selectedCity: string | null
  selectedArea: string | null
  checkIn: Date | null
  checkOut: Date | null
  adults: number
  kids: number
  // 액션
  open: (step?: SearchStep) => void
  close: () => void
  setStep: (step: SearchStep) => void
  setCity: (city: string | null) => void
  setArea: (area: string | null) => void
  setCheckIn: (date: Date | null) => void
  setCheckOut: (date: Date | null) => void
  setAdults: (n: number) => void
  setKids: (n: number) => void
  reset: () => void
}

export const useSearchModal = create<SearchModalStore>((set) => ({
  isOpen: false,
  step: null,
  selectedCity: null,
  selectedArea: null,
  checkIn: null,
  checkOut: null,
  adults: 2,
  kids: 0,
  open: (step = "region") => set({ isOpen: true, step }),
  close: () => set({ isOpen: false, step: null }),
  setStep: (step) => set({ step }),
  setCity: (city) => set({ selectedCity: city, selectedArea: null }),
  setArea: (area) => set({ selectedArea: area }),
  setCheckIn: (date) => set({ checkIn: date }),
  setCheckOut: (date) => set({ checkOut: date }),
  setAdults: (n) => set({ adults: n }),
  setKids: (n) => set({ kids: n }),
  reset: () =>
    set({
      selectedCity: null,
      selectedArea: null,
      checkIn: null,
      checkOut: null,
      adults: 2,
      kids: 0,
    }),
}))
