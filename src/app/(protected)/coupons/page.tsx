import { CouponListPage } from "@/domains/coupon/components"

export function generateMetadata() {
  return {
    title: "쿠폰 | 꿀스테이",
  }
}

export default function CouponsRoute() {
  return <CouponListPage />
}
