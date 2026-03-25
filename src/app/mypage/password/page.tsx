import { PasswordChangePage } from "@/domains/mypage/components"

export function generateMetadata() {
  return {
    title: "비밀번호 변경 | 꿀스테이",
  }
}

export default function PasswordRoute() {
  return <PasswordChangePage />
}
