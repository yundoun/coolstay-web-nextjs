"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { Container } from "@/components/layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { loginWithEmail } from "../api/authApi"
import { useAuthStore } from "@/lib/stores/auth"
import { encryptPassword } from "@/lib/api/client"

export function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setSession = useAuthStore((s) => s.setSession)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const isValid = email.trim() !== "" && password.trim() !== ""

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || loading) return

    setError("")
    setLoading(true)
    try {
      const encPw = await encryptPassword(password)
      const result = await loginWithEmail({
        user_id: email,
        enc_password: encPw,
      })
      setSession(result.token, result.user)
      const redirect = searchParams.get("redirect")
      const destination = redirect && redirect.startsWith("/") ? redirect : "/"
      router.push(destination)
    } catch (err) {
      const message = err instanceof Error ? err.message : "로그인에 실패했습니다"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    // TODO: 카카오/네이버 SDK 연동
    router.push("/")
  }

  return (
    <Container size="tight" padding="responsive" className="py-12">
      <div className="mx-auto max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">로그인</h1>
          <p className="text-sm text-muted-foreground mt-2">
            꿀스테이에 오신 것을 환영합니다
          </p>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={!isValid || loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : "로그인"}
          </Button>
        </form>

        {/* Links */}
        <div className="flex items-center justify-center gap-4 mt-4 text-sm">
          <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground">
            비밀번호 찾기
          </Link>
          <span className="text-border">|</span>
          <Link href="/register" className="text-primary font-medium hover:underline">
            회원가입
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">간편 로그인</span>
          <Separator className="flex-1" />
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <button
            onClick={() => handleSocialLogin("kakao")}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-colors bg-[#FEE500] text-[#191919] hover:bg-[#FDD835]"
          >
            <KakaoIcon />
            카카오로 시작하기
          </button>

          <button
            onClick={() => handleSocialLogin("naver")}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-colors bg-[#03C75A] text-white hover:bg-[#02b351]"
          >
            <NaverIcon />
            네이버로 시작하기
          </button>
        </div>
      </div>
    </Container>
  )
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 1.5C4.86 1.5 1.5 4.14 1.5 7.38C1.5 9.42 2.88 11.22 4.92 12.24L4.2 15.06C4.14 15.3 4.38 15.48 4.62 15.36L7.86 13.2C8.22 13.26 8.58 13.26 9 13.26C13.14 13.26 16.5 10.62 16.5 7.38C16.5 4.14 13.14 1.5 9 1.5Z"
        fill="#191919"
      />
    </svg>
  )
}

function NaverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M12.06 9.42L5.76 1.5H1.5V16.5H5.94V8.58L12.24 16.5H16.5V1.5H12.06V9.42Z"
        fill="white"
      />
    </svg>
  )
}
