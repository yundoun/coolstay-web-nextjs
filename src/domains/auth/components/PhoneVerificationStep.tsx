"use client"

import { useState, useEffect, useCallback } from "react"
import { Phone, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface PhoneVerificationStepProps {
  onVerified: () => void
  onBack: () => void
}

export function PhoneVerificationStep({
  onVerified,
  onBack,
}: PhoneVerificationStepProps) {
  const [phone, setPhone] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [code, setCode] = useState("")
  const [timeLeft, setTimeLeft] = useState(0)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState("")
  const [sendCount, setSendCount] = useState(0)
  const [cooldown, setCooldown] = useState(false)

  // Format phone number as 010-XXXX-XXXX
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11)
    if (digits.length <= 3) return digits
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value))
  }

  const isPhoneValid = phone.replace(/\D/g, "").length === 11

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, "0")}`
  }, [])

  const handleSendCode = () => {
    if (!isPhoneValid || cooldown) return
    setCodeSent(true)
    setCode("")
    setError("")
    setTimeLeft(180) // 3 minutes
    setSendCount((prev) => prev + 1)

    // Cooldown for resend (simulated)
    if (sendCount > 0) {
      setCooldown(true)
      setTimeout(() => setCooldown(false), 10000) // 10s cooldown for demo
    }
  }

  const handleVerify = () => {
    if (code.length !== 6) {
      setError("인증번호 6자리를 입력해 주세요.")
      return
    }
    if (timeLeft <= 0) {
      setError("인증 시간이 만료되었습니다. 재발송해 주세요.")
      return
    }
    // Mock: any 6-digit code succeeds
    setVerified(true)
    setError("")
  }

  return (
    <div className="space-y-6">
      {/* Phone Number Input */}
      <div className="space-y-2">
        <Label htmlFor="phone-input">휴대폰 번호</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="phone-input"
              type="tel"
              placeholder="010-0000-0000"
              value={phone}
              onChange={handlePhoneChange}
              className="pl-10"
              disabled={verified}
            />
          </div>
          <Button
            type="button"
            variant={codeSent ? "outline" : "default"}
            disabled={!isPhoneValid || verified || cooldown}
            onClick={handleSendCode}
            className="shrink-0"
          >
            {codeSent ? "재발송" : "인증번호 발송"}
          </Button>
        </div>
        {cooldown && (
          <p className="text-xs text-muted-foreground">
            잠시 후 다시 시도해 주세요.
          </p>
        )}
      </div>

      {/* Verification Code Input */}
      {codeSent && !verified && (
        <div className="space-y-2">
          <Label htmlFor="code-input">인증번호</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="code-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="인증번호 6자리"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  setError("")
                }}
                className="pl-10"
              />
              {timeLeft > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-destructive">
                  {formatTime(timeLeft)}
                </span>
              )}
            </div>
            <Button
              type="button"
              disabled={code.length !== 6 || timeLeft <= 0}
              onClick={handleVerify}
              className="shrink-0"
            >
              확인
            </Button>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          {timeLeft <= 0 && codeSent && (
            <p className="text-xs text-red-500">
              인증 시간이 만료되었습니다.{" "}
              <button
                type="button"
                className="text-primary underline"
                onClick={handleSendCode}
              >
                재발송
              </button>
            </p>
          )}
        </div>
      )}

      {/* Verified State */}
      {verified && (
        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300 font-medium flex items-center gap-2">
            <Shield className="size-4" />
            휴대폰 인증이 완료되었습니다.
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-6">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onBack}
        >
          이전
        </Button>
        <Button
          type="button"
          size="lg"
          className="flex-[2]"
          disabled={!verified}
          onClick={onVerified}
        >
          다음
        </Button>
      </div>
    </div>
  )
}
