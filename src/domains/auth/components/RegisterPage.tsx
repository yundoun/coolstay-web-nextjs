"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, User, CheckCircle } from "lucide-react"
import { Container } from "@/components/layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { PhoneVerificationStep } from "./PhoneVerificationStep"
import { cn } from "@/lib/utils"

interface Agreement {
  id: string
  label: string
  required: boolean
  checked: boolean
}

const INITIAL_AGREEMENTS: Agreement[] = [
  { id: "terms", label: "이용약관 동의", required: true, checked: false },
  { id: "privacy", label: "개인정보 수집 및 이용 동의", required: true, checked: false },
  { id: "age", label: "만 14세 이상 확인", required: true, checked: false },
  { id: "marketing", label: "마케팅 정보 수신 동의", required: false, checked: false },
]

export function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<"terms" | "phone" | "info">("terms")

  // 약관
  const [agreements, setAgreements] = useState(INITIAL_AGREEMENTS)
  const allAgreed = agreements.every((a) => a.checked)
  const requiredAgreed = agreements.filter((a) => a.required).every((a) => a.checked)

  // 회원 정보
  const [email, setEmail] = useState("")
  const [nickname, setNickname] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const passwordMatch = password === confirmPassword && password.length > 0
  const passwordValid = password.length >= 8
  const isFormValid =
    email.trim() !== "" &&
    nickname.trim() !== "" &&
    passwordValid &&
    passwordMatch

  const toggleAgreement = (id: string) => {
    setAgreements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, checked: !a.checked } : a))
    )
  }

  const toggleAll = () => {
    setAgreements((prev) =>
      prev.map((a) => ({ ...a, checked: !allAgreed }))
    )
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return
    router.push("/login")
  }

  return (
    <Container size="tight" padding="responsive" className="py-12">
      <div className="mx-auto max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">회원가입</h1>
          <p className="text-sm text-muted-foreground mt-2">
            꿀스테이 회원이 되어 다양한 혜택을 누리세요
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          <StepIndicator
            number={1}
            label="약관 동의"
            active={step === "terms"}
            completed={step === "phone" || step === "info"}
          />
          <div className="flex-1 h-px bg-border" />
          <StepIndicator
            number={2}
            label="본인 인증"
            active={step === "phone"}
            completed={step === "info"}
          />
          <div className="flex-1 h-px bg-border" />
          <StepIndicator
            number={3}
            label="정보 입력"
            active={step === "info"}
            completed={false}
          />
        </div>

        {/* Step 1: Terms */}
        {step === "terms" && (
          <div className="space-y-4">
            {/* All agree */}
            <label className="flex items-center gap-3 p-4 rounded-xl border bg-muted/30 cursor-pointer">
              <Checkbox checked={allAgreed} onCheckedChange={toggleAll} />
              <span className="text-sm font-semibold">전체 동의</span>
            </label>

            <Separator />

            <div className="space-y-2 pl-1">
              {agreements.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 py-2 cursor-pointer"
                >
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => toggleAgreement(item.id)}
                  />
                  <span className="text-sm flex-1">
                    {item.label}
                    <span
                      className={cn(
                        "ml-1",
                        item.required ? "text-red-500" : "text-muted-foreground"
                      )}
                    >
                      ({item.required ? "필수" : "선택"})
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <Button
              className="w-full mt-6"
              size="lg"
              disabled={!requiredAgreed}
              onClick={() => setStep("phone")}
            >
              다음
            </Button>
          </div>
        )}

        {/* Step 2: Phone Verification */}
        {step === "phone" && (
          <PhoneVerificationStep
            onVerified={() => setStep("info")}
            onBack={() => setStep("terms")}
          />
        )}

        {/* Step 3: Info */}
        {step === "info" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-nickname">닉네임</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="reg-nickname"
                  placeholder="닉네임을 입력하세요"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="8자 이상 입력"
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
              {password.length > 0 && !passwordValid && (
                <p className="text-xs text-red-500">비밀번호는 8자 이상이어야 합니다.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-confirm">비밀번호 확인</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="reg-confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="비밀번호 재입력"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && !passwordMatch && (
                <p className="text-xs text-red-500">비밀번호가 일치하지 않습니다.</p>
              )}
              {passwordMatch && (
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <CheckCircle className="size-3" />
                  비밀번호가 일치합니다.
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setStep("phone")}
              >
                이전
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-[2]"
                disabled={!isFormValid}
              >
                가입하기
              </Button>
            </div>
          </form>
        )}

        {/* Login Link */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </Container>
  )
}

function StepIndicator({
  number,
  label,
  active,
  completed,
}: {
  number: number
  label: string
  active: boolean
  completed: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "size-7 rounded-full flex items-center justify-center text-xs font-bold",
          completed
            ? "bg-primary text-primary-foreground"
            : active
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
        )}
      >
        {completed ? <CheckCircle className="size-4" /> : number}
      </div>
      <span
        className={cn(
          "text-sm font-medium",
          active || completed ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </div>
  )
}
