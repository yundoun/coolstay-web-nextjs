import { getAccommodationDetail } from "@/domains/accommodation/data/mock"
import type { BookingContext, BookingType, Coupon } from "../types"

const mockCoupons: Coupon[] = [
  {
    id: "c1",
    name: "신규회원 5,000원 할인",
    discountType: "fixed",
    discountValue: 5000,
    minOrderAmount: 50000,
  },
  {
    id: "c2",
    name: "숙박 10% 할인",
    discountType: "percent",
    discountValue: 10,
    minOrderAmount: 100000,
  },
  {
    id: "c3",
    name: "주말 특가 3,000원 할인",
    discountType: "fixed",
    discountValue: 3000,
    minOrderAmount: 30000,
  },
]

export function getBookingContext(
  accommodationId: string,
  roomId: string,
  type: string
): BookingContext | null {
  const accommodation = getAccommodationDetail(accommodationId)
  if (!accommodation) return null

  const room = accommodation.rooms.find((r) => r.id === roomId)
  if (!room) return null

  const bookingType: BookingType = type === "rental" ? "rental" : "stay"
  const isRental = bookingType === "rental"

  const price = isRental ? (room.rentalPrice || room.stayPrice) : room.stayPrice
  const originalPrice = isRental ? room.rentalOriginalPrice : room.stayOriginalPrice

  return {
    accommodation: {
      id: accommodation.id,
      name: accommodation.name,
      address: accommodation.address,
      checkInTime: accommodation.checkInTime,
      checkOutTime: accommodation.checkOutTime,
      parkingInfo: accommodation.parkingInfo,
    },
    room: {
      id: room.id,
      name: room.name,
      imageUrl: room.imageUrl,
      maxGuests: room.maxGuests,
    },
    bookingType,
    price,
    originalPrice,
    usageTime: isRental ? room.rentalTime : undefined,
    availableCoupons: mockCoupons.filter((c) => c.minOrderAmount <= price),
    availableMileage: 12000,
    benefitPointRate: accommodation.benefitPointRate,
  }
}
