import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthUser, AuthToken } from "@/domains/auth/types"
import { setClientToken, clearClientToken } from "@/lib/api/client"

interface AuthStore {
  // 상태
  user: AuthUser | null
  token: AuthToken | null
  isLoggedIn: boolean

  // 액션
  setSession: (token: AuthToken, user: AuthUser) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      setSession: (token, user) => {
        setClientToken({ accessToken: token.access_token, secret: token.secret })
        set({ token, user, isLoggedIn: true })
      },
      clearSession: () => {
        clearClientToken()
        set({ token: null, user: null, isLoggedIn: false })
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        // hydration 완료 후 로그인 상태면 client 토큰 복원
        if (state?.token && state.isLoggedIn) {
          setClientToken({
            accessToken: state.token.access_token,
            secret: state.token.secret,
          })
        }
      },
    }
  )
)
