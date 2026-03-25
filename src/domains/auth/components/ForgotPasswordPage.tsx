"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Smartphone, CheckCircle, ArrowLeft } from "lucide-react"
import { Container } from "@/components/layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Step = "email" | "method" | "complete"

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

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [selectedMethod, setSelectedMethod] = useState<"email" | "sms" | null>(null)

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // Mock masked values based on email
  const maskedEmail = email
    ? `${email.slice(0, 3)}***@${email.split("@")[1] || "***"}`
    : ""
  const maskedPhone = "010-****-5678"

  return (
    <Container size="tight" padding="responsive" className="py-12">
      <div className="mx-auto max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">비밀번호 찾기</h1>
          <p className="text-sm text-muted-foreground mt-2">
            가입 시 등록한 이메일로 임시 비밀번호를 발송합니다
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          <StepIndicator
            number={1}
            label="이메일 입력"
            active={step === "email"}
            completed={step === "method" || step === "complete"}
          />
          <div className="flex-1 h-px bg-border" />
          <StepIndicator
            number={2}
            label="인증 수단"
            active={step === "method"}
            completed={step === "complete"}
          />
          <div className="flex-1 h-px bg-border" />
          <StepIndicator
            number={3}
            label="완료"
            active={step === "complete"}
            completed={false}
          />
        </div>

        {/* Step 1: Email Input */}
        {step === "email" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fp-email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="fp-email"
                  type="email"
                  placeholder="가입 시 사용한 이메일 입력"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              {email.length > 0 && !isEmailValid && (
                <p className="text-xs text-red-500">올바른 이메일 형식을 입력해주세요.</p>
              )}
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={!isEmailValid}
              onClick={() => setStep("method")}
            >
              다음
            </Button>
          </div>
        )}

        {/* Step 2: Verification Method */}
        {step === "method" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              임시 비밀번호를 받을 인증 수단을 선택해주세요
            </p>

            <button
              onClick={() => setSelectedMethod("email")}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-colors",
                selectedMethod === "email"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className={cn(
                "size-10 rounded-full flex items-center justify-center",
                selectedMethod === "email" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                <Mail className="size-5" />
              </div>
              <div>
                <p className="font-medium text-sm">이메일로 받기</p>
                <p className="text-xs text-muted-foreground mt-0.5">{maskedEmail}</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedMethod("sms")}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-colors",
                selectedMethod === "sms"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className={cn(
                "size-10 rounded-full flex items-center justify-center",
                selectedMethod === "sms" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                <Smartphone className="size-5" />
              </div>
              <div>
                <p className="font-medium text-sm">SMS로 받기</p>
                <p className="text-xs text-muted-foreground mt-0.5">{maskedPhone}</p>
              </div>
            </button>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setStep("email")}
              >
                이전
              </Button>
              <Button
                size="lg"
                className="flex-[2]"
                disabled={!selectedMethod}
                onClick={() => setStep("complete")}
              >
                인증 요청
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === "complete" && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="size-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="size-8 text-green-600" />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">임시 비밀번호가 발송되었습니다</p>
              <p className="text-sm text-muted-foreground mt-2">
                {selectedMethod === "email"
                  ? `${maskedEmail}로 임시 비밀번호를 발송했습니다.`
                  : `${maskedPhone}으로 임시 비밀번호를 발송했습니다.`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                로그인 후 반드시 비밀번호를 변경해주세요.
              </p>
            </div>
            <Button className="w-full" size="lg" asChild>
              <Link href="/login">로그인으로</Link>
            </Button>
          </div>
        )}

        {/* Back to login link */}
        {step !== "complete" && (
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <Link href="/login" className="text-primary font-medium hover:underline flex items-center justify-center gap-1">
              <ArrowLeft className="size-3" />
              로그인으로 돌아가기
            </Link>
          </div>
        )}
      </div>
    </Container>
  )
}
