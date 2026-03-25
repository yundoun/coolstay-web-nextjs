"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Eye, EyeOff } from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const mockProfile = {
  loginType: "이메일" as const,
  email: "hong@example.com",
  nickname: "홍길동",
  name: "홍길동",
  phone: "010-1234-5678",
}

export function ProfileEditPage() {
  const [nickname, setNickname] = useState(mockProfile.nickname)
  const [name, setName] = useState(mockProfile.name)
  const [phone, setPhone] = useState(mockProfile.phone)
  const [showPhoneVerify, setShowPhoneVerify] = useState(false)
  const [verifyCode, setVerifyCode] = useState("")

  const handleSave = () => {
    alert("회원정보가 저장되었습니다.")
  }

  const handlePhoneChange = () => {
    setShowPhoneVerify(true)
    alert("인증번호가 발송되었습니다.")
  }

  const handleVerifyCode = () => {
    alert("전화번호가 변경되었습니다.")
    setShowPhoneVerify(false)
    setVerifyCode("")
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
            <Badge variant="outline">{mockProfile.loginType}</Badge>
          </div>
        </div>

        {/* Email (readonly) */}
        <div className="space-y-2">
          <Label>이메일</Label>
          <Input value={mockProfile.email} disabled className="bg-muted" />
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
            <span className="text-sm text-muted-foreground">
              ••••••••
            </span>
            <Button variant="link" size="sm" className="text-primary p-0 h-auto" asChild>
              <Link href="/mypage/password">변경</Link>
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full" size="lg">
          저장
        </Button>
      </div>
    </Container>
  )
}
