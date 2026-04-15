"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Container } from "@/components/layout"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useBookingForm } from "../hooks/useBookingForm"
import { useBookingSubmit } from "../hooks/useBookingSubmit"
import { InicisPaymentForm } from "./InicisPaymentForm"
import { RoomSummaryCard } from "./RoomSummaryCard"
import { TimeSlotSelector } from "./TimeSlotSelector"
import { BookerInfoForm } from "./BookerInfoForm"
import { VehicleSelector } from "./VehicleSelector"
import { CouponSelector } from "./CouponSelector"
import { MileageInput } from "./MileageInput"
import { PaymentMethodSelector } from "./PaymentMethodSelector"
import { AgreementCheckboxes } from "./AgreementCheckboxes"
import { PaymentSummaryCard } from "./PaymentSummaryCard"
import type { BookingContext } from "../types"

interface BookingPageLayoutProps {
  context: BookingContext
}

export function BookingPageLayout({ context }: BookingPageLayoutProps) {
  const form = useBookingForm(context)
  const { submit, isLoading, error, inicisParams } = useBookingSubmit()
  const router = useRouter()
  const [selectedTime, setSelectedTime] = useState("12:00")
  const isRental = context.bookingType === "rental"

  // 이니시스 팝업에서 결제 결과 수신 → 완료 페이지로 이동
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type !== "INICIS_PAYMENT_RESULT") return
      const { resultCode } = event.data.payload
      if (resultCode === "0000") {
        // bookingResult는 useBookingSubmit에서 이미 localStorage에 저장됨
        const bookingResult = localStorage.getItem("bookingResult")
        if (bookingResult) {
          sessionStorage.setItem("bookingResult", bookingResult)
          localStorage.removeItem("bookingResult")
        }
        localStorage.removeItem("pendingBookingAccommodationId")
        localStorage.removeItem("pendingBookingBookId")
        localStorage.removeItem("pendingPaymentInfo")
        router.replace(`/booking/${context.accommodation.id}/complete`)
      } else {
        alert("결제가 취소되었습니다.")
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [context.accommodation.id, router])

  const handleSubmit = () => {
    if (!form.isValid || isLoading) return
    submit({
      context,
      bookerInfo: form.bookerInfo,
      hasVehicle: form.hasVehicle,
      paymentMethod: form.paymentMethod,
      paymentSummary: form.paymentSummary,
      mileageUsed: form.mileageUsed,
      selectedCouponId: form.selectedCouponId,
      selectedTime,
    })
  }

  return (
    <div className="min-h-screen pb-28 lg:pb-16">
      <Container size="normal" padding="responsive" className="pt-6">
        <h1 className="text-2xl font-bold mb-6">예약하기</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            <RoomSummaryCard context={context} />

            {/* Time Slot Selector — only for rental (대실) */}
            {isRental && (
              <>
                <Separator />
                <section>
                  <TimeSlotSelector
                    selectedTime={selectedTime}
                    onSelectTime={setSelectedTime}
                  />
                </section>
              </>
            )}

            <Separator />

            <section>
              <h2 className="text-lg font-semibold mb-4">예약자 정보</h2>
              <BookerInfoForm
                value={form.bookerInfo}
                onChange={form.setBookerInfo}
              />
            </section>

            <Separator />

            <section>
              <h2 className="text-lg font-semibold mb-4">이동 수단</h2>
              <VehicleSelector
                hasVehicle={form.hasVehicle}
                onChange={form.setHasVehicle}
                parkingInfo={context.accommodation.parkingInfo}
              />
            </section>

            <Separator />

            <section>
              <h2 className="text-lg font-semibold mb-4">할인</h2>
              <div className="space-y-5">
                <CouponSelector
                  coupons={context.availableCoupons}
                  selectedId={form.selectedCouponId}
                  onSelect={form.setSelectedCouponId}
                  roomPrice={context.price}
                />
                <MileageInput
                  available={context.availableMileage}
                  used={form.mileageUsed}
                  onChange={form.setMileage}
                  onUseAll={form.useAllMileage}
                />
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-lg font-semibold mb-4">결제 수단</h2>
              <PaymentMethodSelector
                value={form.paymentMethod}
                onChange={form.setPaymentMethod}
              />
            </section>

            <Separator />

            <section>
              <h2 className="text-lg font-semibold mb-4">약관 동의</h2>
              <AgreementCheckboxes
                agreements={form.agreements}
                allAgreed={form.allAgreed}
                onToggle={form.toggleAgreement}
                onToggleAll={form.toggleAllAgreements}
              />
            </section>
          </div>

          {/* Right: Sticky Payment Summary */}
          <div className="hidden lg:block">
            <PaymentSummaryCard
              summary={form.paymentSummary}
              benefitPointRate={context.benefitPointRate}
              isValid={form.isValid && !isLoading}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </Container>

      {/* 이니시스 결제 폼 */}
      <InicisPaymentForm params={inicisParams} />

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg text-sm max-w-md text-center">
          {error}
        </div>
      )}

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 lg:hidden z-[var(--z-fixed)] safe-area-bottom">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">최종 결제금액</p>
            <p className="text-xl font-bold">
              {form.paymentSummary.totalAmount.toLocaleString()}원
            </p>
          </div>
          <Button
            size="lg"
            className="px-8"
            disabled={!form.isValid || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "처리중..." : "결제하기"}
          </Button>
        </div>
      </div>
    </div>
  )
}
