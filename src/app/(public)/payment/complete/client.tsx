"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"

export function PaymentCompleteClient() {
  const [status, setStatus] = useState<"loading" | "success" | "fail">("loading")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const raw = localStorage.getItem("inicisPaymentResult")
    const bookingResult = localStorage.getItem("bookingResult")
    const accommodationId = localStorage.getItem("pendingBookingAccommodationId")

    // localStorage 정리
    if (raw) localStorage.removeItem("inicisPaymentResult")
    if (accommodationId) localStorage.removeItem("pendingBookingAccommodationId")
    localStorage.removeItem("pendingBookingBookId")
    localStorage.removeItem("pendingPaymentInfo")

    const result = raw ? JSON.parse(raw) : null
    const isSuccess = result?.resultCode === "0000"

    if (isSuccess && bookingResult && accommodationId) {
      // PG 결제 성공 → 예약 완료 페이지로 이동
      sessionStorage.setItem("bookingResult", bookingResult)
      localStorage.removeItem("bookingResult")
      setStatus("success")

      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
      setTimeout(() => {
        window.location.href = `${basePath}/booking/${accommodationId}/complete/`
      }, 1000)
    } else {
      setStatus("fail")
      setErrorMsg(result?.resultMsg || "결제 결과를 확인할 수 없습니다.")
    }
  }, [])

  if (status === "loading") {
    return (
      <Container size="normal" padding="responsive" className="py-20">
        <div className="text-center">
          <Loader2 className="size-16 text-primary mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold mb-2">결제 결과 확인 중...</h1>
        </div>
      </Container>
    )
  }

  if (status === "success") {
    return (
      <Container size="normal" padding="responsive" className="py-20">
        <div className="text-center">
          <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">결제가 완료되었습니다</h1>
          <p className="text-muted-foreground">예약 완료 페이지로 이동 중...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container size="normal" padding="responsive" className="py-20">
      <div className="text-center">
        <XCircle className="size-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">결제 처리 실패</h1>
        <p className="text-muted-foreground mb-6">{errorMsg}</p>
        <Button onClick={() => { window.location.href = (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/" }}>
          홈으로 돌아가기
        </Button>
      </div>
    </Container>
  )
}
