import { NoticeListPage } from "@/domains/notice/components"

export function generateMetadata() {
  return {
    title: "공지사항 | 꿀스테이",
  }
}

export default function NoticesRoute() {
  return <NoticeListPage />
}
