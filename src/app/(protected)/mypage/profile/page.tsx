import { ProfileEditPage } from "@/domains/mypage/components"

export function generateMetadata() {
  return {
    title: "회원정보 수정 | 꿀스테이",
  }
}

export default function ProfileRoute() {
  return <ProfileEditPage />
}
