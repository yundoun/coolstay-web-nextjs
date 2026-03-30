import { LoginPage } from "@/domains/auth/components"

export function generateMetadata() {
  return {
    title: "로그인 | 꿀스테이",
  }
}

export default function LoginRoute() {
  return <LoginPage />
}
