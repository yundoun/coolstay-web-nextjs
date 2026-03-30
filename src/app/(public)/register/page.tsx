import { RegisterPage } from "@/domains/auth/components"

export function generateMetadata() {
  return {
    title: "회원가입 | 꿀스테이",
  }
}

export default function RegisterRoute() {
  return <RegisterPage />
}
