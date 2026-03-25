"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Ticket,
  Coins,
  Heart,
} from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const LOSS_ITEMS = [
  { icon: Ticket, label: "보유 쿠폰", value: "3개" },
  { icon: Coins, label: "마일리지", value: "12,000원" },
  { icon: Heart, label: "찜한 숙소", value: "5개" },
]

const REASONS = [
  "사용이 어려워요",
  "서비스가 불만족스러워요",
  "혜택이 부족해요",
  "중복 계정이 있어요",
  "이용 기록을 삭제하고 싶어요",
  "할인/이벤트가 부족해요",
  "기타 (직접 입력)",
]

export function WithdrawPage() {
  const [reason, setReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [agreed, setAgreed] = useState(false)

  const isReasonSelected = reason !== ""
  const isFormValid = isReasonSelected && agreed

  const handleWithdraw = () => {
    alert("회원 탈퇴가 완료되었습니다.")
  }

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">회원 탈퇴</h1>

      {/* Step 1: Loss Warning */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="size-5 text-destructive" />
          <h2 className="font-bold text-destructive">탈퇴 시 아래 정보가 모두 삭제됩니다</h2>
        </div>
        <div className="space-y-3">
          {LOSS_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-4 py-3 rounded-lg bg-background"
            >
              <div className="flex items-center gap-3">
                <item.icon className="size-5 text-muted-foreground" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-sm font-bold text-destructive">
                {item.value}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-destructive/80 mt-3">
          * 삭제된 데이터는 복구할 수 없습니다.
        </p>
      </div>

      {/* Step 2: Reason Selection */}
      <div className="rounded-xl border bg-card p-5 mb-6">
        <h2 className="font-bold mb-4">탈퇴 사유를 선택해주세요</h2>
        <RadioGroup value={reason} onValueChange={setReason}>
          <div className="space-y-3">
            {REASONS.map((r) => (
              <div key={r} className="flex items-center gap-3">
                <RadioGroupItem value={r} id={r} />
                <Label htmlFor={r} className="text-sm font-normal cursor-pointer">
                  {r}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        {reason === "기타 (직접 입력)" && (
          <Textarea
            placeholder="탈퇴 사유를 입력해주세요"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            className="mt-3"
            rows={3}
          />
        )}
      </div>

      {/* Step 3: Confirmation */}
      <div className="rounded-xl border bg-card p-5 mb-6">
        <div className="flex items-start gap-3">
          <Checkbox
            id="agree"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
          />
          <Label htmlFor="agree" className="text-sm font-normal leading-relaxed cursor-pointer">
            위 안내사항을 모두 확인하였으며, 모든 데이터가 삭제됨을 이해합니다.
          </Label>
        </div>
      </div>

      {/* Withdraw Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={!isFormValid}
            className="w-full"
            size="lg"
          >
            탈퇴하기
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 탈퇴하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              탈퇴 시 모든 데이터가 즉시 삭제되며, 복구할 수 없습니다.
              보유 쿠폰, 마일리지, 찜 목록이 모두 소멸됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWithdraw}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              탈퇴하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  )
}
