import { WithdrawPage } from "@/domains/mypage/components"

export function generateMetadata() {
  return {
    title: "회원 탈퇴 | 꿀스테이",
  }
}

export default function WithdrawRoute() {
  return <WithdrawPage />
}
