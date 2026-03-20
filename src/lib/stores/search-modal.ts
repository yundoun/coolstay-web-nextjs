import { create } from "zustand"

interface SearchModalStore {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useSearchModal = create<SearchModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
