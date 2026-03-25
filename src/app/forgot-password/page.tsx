import { ForgotPasswordPage } from "@/domains/auth/components"

export function generateMetadata() {
  return {
    title: "비밀번호 찾기 | 꿀스테이",
  }
}

export default function ForgotPasswordRoute() {
  return <ForgotPasswordPage />
}
