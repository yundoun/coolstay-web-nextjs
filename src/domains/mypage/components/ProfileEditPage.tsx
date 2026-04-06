"use client"

import { useState } from "react"
import Link from "next/link"
import { User } from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/lib/stores/auth"
import { updateUser } from "../api/mypageApi"
import { sendAuthCode, checkAuthCode } from "@/domains/auth/api/authApi"

const LOGIN_TYPE_LABELS: Record<string, string> = {
  U: "이메일",
  SK: "카카오",
  SN: "네이버",
}

export function ProfileEditPage() {
  const authUser = useAuthStore((s) => s.user)
  const setSession = useAuthStore((s) => s.setSession)

  const [nickname, setNickname] = useState(authUser?.nickname ?? "")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState(authUser?.phone_number ?? "")
  const [showPhoneVerify, setShowPhoneVerify] = useState(false)
  const [verifyCode, setVerifyCode] = useState("")
  const [smsAuthKey, setSmsAuthKey] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true)
    setError("")
    try {
      const body: Record<string, string> = {}
      if (nickname !== authUser?.nickname) body.nickname = nickname
      if (name) body.name = name
      if (Object.keys(body).length === 0) {
        alert("변경된 내용이 없습니다.")
        setIsSaving(false)
        return
      }
      const result = await updateUser(body)
      setSession(result.token, result.user)
      alert("회원정보가 저장되었습니다.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePhoneChange = async () => {
    const rawPhone = phone.replace(/-/g, "")
    try {
      const res = await sendAuthCode({ phone_number: rawPhone })
      setSmsAuthKey(res.sms_auth_key)
      setShowPhoneVerify(true)
    } catch {
      alert("인증번호 발송에 실패했습니다")
    }
  }

  const handleVerifyCode = async () => {
    const rawPhone = phone.replace(/-/g, "")
    try {
      const res = await checkAuthCode({
        sms_auth_key: smsAuthKey,
        sms_auth_code: verifyCode,
        auth_method: rawPhone,
      })
      if (!res.is_verified) {
        alert("인증번호가 일치하지 않습니다")
        return
      }
      const result = await updateUser({
        phone_number: rawPhone,
        sms_auth_key: smsAuthKey,
        sms_auth_code: verifyCode,
      })
      setSession(result.token, result.user)
      alert("전화번호가 변경되었습니다.")
      setShowPhoneVerify(false)
      setVerifyCode("")
    } catch {
      alert("전화번호 변경에 실패했습니다")
    }
  }

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">회원정보 수정</h1>

      <div className="rounded-xl border bg-card p-5 space-y-5">
        {/* Profile Avatar */}
        <div className="flex justify-center">
          <div className="flex items-center justify-center size-20 rounded-full bg-primary/10">
            <User className="size-9 text-primary" />
          </div>
        </div>

        {/* Login Type */}
        <div className="space-y-2">
          <Label>로그인 유형</Label>
          <div>
            <Badge variant="outline">
              {LOGIN_TYPE_LABELS[authUser?.type ?? "U"] ?? "이메일"}
            </Badge>
          </div>
        </div>

        {/* Email (readonly) */}
        <div className="space-y-2">
          <Label>이메일</Label>
          <Input value={authUser?.email ?? ""} disabled className="bg-muted" />
        </div>

        <Separator />

        {/* Nickname (editable) */}
        <div className="space-y-2">
          <Label htmlFor="nickname">닉네임</Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
          />
        </div>

        {/* Name (editable) */}
        <div className="space-y-2">
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </div>

        {/* Phone (editable with verification) */}
        <div className="space-y-2">
          <Label>전화번호</Label>
          <div className="flex gap-2">
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="flex-1"
            />
            <Button variant="outline" size="sm" onClick={handlePhoneChange}>
              변경
            </Button>
          </div>
          {showPhoneVerify && (
            <div className="flex gap-2 mt-2">
              <Input
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="인증번호 6자리"
                maxLength={6}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={handleVerifyCode}
                disabled={verifyCode.length < 6}
              >
                확인
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Password */}
        <div className="space-y-2">
          <Label>비밀번호</Label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">••••••••</span>
            <Button variant="link" size="sm" className="text-primary p-0 h-auto" asChild>
              <Link href="/mypage/password">변경</Link>
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {/* Save Button */}
        <Button onClick={handleSave} disabled={isSaving} className="w-full" size="lg">
          {isSaving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </Container>
  )
}
