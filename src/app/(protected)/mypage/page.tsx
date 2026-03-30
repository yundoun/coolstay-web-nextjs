import { MyPage } from "@/domains/mypage/components"

export function generateMetadata() {
  return {
    title: "마이페이지 | 꿀스테이",
  }
}

export default function MyPageRoute() {
  return <MyPage />
}
