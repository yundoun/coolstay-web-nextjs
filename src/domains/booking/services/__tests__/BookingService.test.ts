import { describe, it, expect } from "vitest"
import {
  calculateCouponDiscount,
  calculatePayment,
  findBestCouponId,
  validateBookerInfo,
} from "../BookingService"
import type { Coupon, BookingContext } from "../../types"

describe("BookingService", () => {
  describe("calculateCouponDiscount", () => {
    it("정액(fixed) 쿠폰의 할인액을 반환한다", () => {
      const coupon: Coupon = {
        id: "1", name: "3000원 할인", discountType: "fixed",
        discountValue: 3000, minOrderAmount: 0,
      }
      expect(calculateCouponDiscount(coupon, 50000, [])).toBe(3000)
    })

    it("정률(percent) 쿠폰의 할인액을 계산한다", () => {
      const coupon: Coupon = {
        id: "1", name: "10% 할인", discountType: "percent",
        discountValue: 10, minOrderAmount: 0,
      }
      // 50000 * 10% = 5000
      expect(calculateCouponDiscount(coupon, 50000, [])).toBe(5000)
    })

    it("CC009 제약조건이 있으면 상한선을 적용한다", () => {
      const coupon: Coupon = {
        id: "1", name: "30% 할인", discountType: "percent",
        discountValue: 30, minOrderAmount: 0,
      }
      const rawCoupons = [{
        coupon_pk: 1,
        constraints: [{ code: "CC009", value: "5000" }],
      }]
      // 50000 * 30% = 15000, 상한 5000
      expect(calculateCouponDiscount(coupon, 50000, rawCoupons as never[])).toBe(5000)
    })

    it("CC009 상한선이 계산값보다 크면 계산값을 반환한다", () => {
      const coupon: Coupon = {
        id: "1", name: "5% 할인", discountType: "percent",
        discountValue: 5, minOrderAmount: 0,
      }
      const rawCoupons = [{
        coupon_pk: 1,
        constraints: [{ code: "CC009", value: "50000" }],
      }]
      // 50000 * 5% = 2500, 상한 50000
      expect(calculateCouponDiscount(coupon, 50000, rawCoupons as never[])).toBe(2500)
    })
  })

  describe("calculatePayment", () => {
    it("쿠폰과 마일리지를 적용한 결제 금액을 계산한다", () => {
      const result = calculatePayment(50000, 3000, 5000)
      expect(result).toEqual({
        roomPrice: 50000,
        couponDiscount: 3000,
        mileageDiscount: 5000,
        totalAmount: 42000,
      })
    })

    it("결제 금액이 0 미만이면 0을 반환한다", () => {
      const result = calculatePayment(10000, 8000, 5000)
      expect(result.totalAmount).toBe(0)
    })

    it("할인이 없으면 원가 그대로 반환한다", () => {
      const result = calculatePayment(50000, 0, 0)
      expect(result.totalAmount).toBe(50000)
    })
  })

  describe("findBestCouponId", () => {
    const baseContext: BookingContext = {
      accommodation: { id: "1", name: "테스트", address: "", checkInTime: "15:00", checkOutTime: "11:00" },
      room: { id: "r1", name: "방", imageUrl: "", maxGuests: 2 },
      bookingType: "stay",
      price: 50000,
      availableCoupons: [],
      rawCoupons: [],
      availableMileage: 0,
      benefitPointRate: 0,
    }

    it("쿠폰이 없으면 null을 반환한다", () => {
      expect(findBestCouponId(baseContext)).toBeNull()
    })

    it("할인이 가장 큰 쿠폰을 선택한다", () => {
      const context: BookingContext = {
        ...baseContext,
        availableCoupons: [
          { id: "a", name: "1000원", discountType: "fixed", discountValue: 1000, minOrderAmount: 0 },
          { id: "b", name: "5000원", discountType: "fixed", discountValue: 5000, minOrderAmount: 0 },
          { id: "c", name: "2000원", discountType: "fixed", discountValue: 2000, minOrderAmount: 0 },
        ],
      }
      expect(findBestCouponId(context)).toBe("b")
    })
  })

  describe("validateBookerInfo", () => {
    it("이름과 전화번호가 있으면 유효하다", () => {
      expect(validateBookerInfo({ name: "홍길동", phone: "010-1234-5678" })).toBe(true)
    })

    it("이름이 비어있으면 유효하지 않다", () => {
      expect(validateBookerInfo({ name: "", phone: "010-1234-5678" })).toBe(false)
    })

    it("전화번호가 비어있으면 유효하지 않다", () => {
      expect(validateBookerInfo({ name: "홍길동", phone: "" })).toBe(false)
    })

    it("공백만 있는 이름은 유효하지 않다", () => {
      expect(validateBookerInfo({ name: "   ", phone: "010-1234-5678" })).toBe(false)
    })
  })
})
