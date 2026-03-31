"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock } from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { encryptPassword } from "@/lib/api/client"
import { updateUser } from "../api/mypageApi"
import { useAuthStore } from "@/lib/stores/auth"

export function PasswordChangePage() {
  const router = useRouter()
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const isNewPwValid = newPw.length >= 8
  const isConfirmMatch = newPw === confirmPw && confirmPw.length > 0
  const isFormValid = currentPw.length > 0 && isNewPwValid && isConfirmMatch

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const setSession = useAuthStore((s) => s.setSession)

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return
    setIsSubmitting(true)
    setSubmitError("")
    try {
      const encOld = await encryptPassword(currentPw)
      const encNew = await encryptPassword(newPw)
      const result = await updateUser({
        enc_old_password: encOld,
        enc_new_password: encNew,
      })
      setSession(result.token, result.user)
      alert("비밀번호가 변경되었습니다.")
      router.push("/mypage/profile")
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "비밀번호 변경에 실패했습니다")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">비밀번호 변경</h1>

      <div className="rounded-xl border bg-card p-5 space-y-5">
        <div className="flex justify-center mb-2">
          <div className="flex items-center justify-center size-14 rounded-full bg-primary/10">
            <Lock className="size-7 text-primary" />
          </div>
        </div>

        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="currentPw">현재 비밀번호</Label>
          <div className="relative">
            <Input
              id="currentPw"
              type={showCurrent ? "text" : "password"}
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="현재 비밀번호를 입력하세요"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showCurrent ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPw">새 비밀번호</Label>
          <div className="relative">
            <Input
              id="newPw"
              type={showNew ? "text" : "password"}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="새 비밀번호를 입력하세요 (8자 이상)"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showNew ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {newPw.length > 0 && !isNewPwValid && (
            <p className="text-xs text-destructive">
              비밀번호는 8자 이상이어야 합니다
            </p>
          )}
          {isNewPwValid && (
            <p className="text-xs text-green-600">사용 가능한 비밀번호입니다</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPw">새 비밀번호 확인</Label>
          <div className="relative">
            <Input
              id="confirmPw"
              type={showConfirm ? "text" : "password"}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="새 비밀번호를 다시 입력하세요"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showConfirm ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {confirmPw.length > 0 && !isConfirmMatch && (
            <p className="text-xs text-destructive">
              비밀번호가 일치하지 않습니다
            </p>
          )}
          {isConfirmMatch && (
            <p className="text-xs text-green-600">비밀번호가 일치합니다</p>
          )}
        </div>

        {/* Error */}
        {submitError && (
          <p className="text-sm text-destructive">{submitError}</p>
        )}

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? "변경 중..." : "변경하기"}
        </Button>
      </div>
    </Container>
  )
}
