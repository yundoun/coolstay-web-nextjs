"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Container } from "@/components/layout"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useBookingForm } from "../hooks/useBookingForm"
import { RoomSummaryCard } from "./RoomSummaryCard"
import { TimeSlotSelector } from "./TimeSlotSelector"
import { BookerInfoForm } from "./BookerInfoForm"
import { VehicleSelector } from "./VehicleSelector"
import { CouponSelector } from "./CouponSelector"
import { MileageInput } from "./MileageInput"
import { PaymentMethodSelector } from "./PaymentMethodSelector"
import { AgreementCheckboxes } from "./AgreementCheckboxes"
import { PaymentSummaryCard } from "./PaymentSummaryCard"
import type { BookingContext, BookingResult } from "../types"

interface BookingPageLayoutProps {
  context: BookingContext
}

export function BookingPageLayout({ context }: BookingPageLayoutProps) {
  const router = useRouter()
  const form = useBookingForm(context)
  const [selectedTime, setSelectedTime] = useState("12:00")
  const isRental = context.bookingType === "rental"

  const handleSubmit = () => {
    if (!form.isValid) return

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

    const result: BookingResult = {
      bookingId: `CS${Date.now()}`,
      accommodationName: context.accommodation.name,
      roomName: context.room.name,
      bookingType: context.bookingType,
      checkIn: fmt(today),
      checkOut: context.bookingType === "stay" ? fmt(tomorrow) : fmt(today),
      usageTime: context.usageTime,
      bookerName: form.bookerInfo.name,
      bookerPhone: form.bookerInfo.phone,
      paymentMethod: form.paymentMethod,
      totalAmount: form.paymentSummary.totalAmount,
      earnedMileage: Math.floor(
        form.paymentSummary.totalAmount * (context.benefitPointRate / 100)
      ),
    }

    sessionStorage.setItem("bookingResult", JSON.stringify(result))
    router.push(`/booking/${context.accommodation.id}/complete`)
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
              isValid={form.isValid}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </Container>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 lg:hidden z-40">
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
            disabled={!form.isValid}
            onClick={handleSubmit}
          >
            결제하기
          </Button>
        </div>
      </div>
    </div>
  )
}
