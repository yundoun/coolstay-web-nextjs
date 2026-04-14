import { create } from "zustand"

interface HeaderStore {
  /** 동적 페이지 타이틀 (back variant 헤더에 표시) */
  dynamicTitle: string | null
  setDynamicTitle: (title: string | null) => void
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  dynamicTitle: null,
  setDynamicTitle: (title) => set({ dynamicTitle: title }),
}))
