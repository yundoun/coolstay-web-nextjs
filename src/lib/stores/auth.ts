import { create } from "zustand"
import type { AuthUser, AuthToken } from "@/domains/auth/types"

interface AuthStore {
  // 상태
  user: AuthUser | null
  token: AuthToken | null
  isLoggedIn: boolean

  // 액션
  setSession: (token: AuthToken, user: AuthUser) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  setSession: (token, user) => set({ token, user, isLoggedIn: true }),
  clearSession: () => set({ token: null, user: null, isLoggedIn: false }),
}))
