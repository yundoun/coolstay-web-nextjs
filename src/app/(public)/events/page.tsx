import { EventListPage } from "@/domains/event/components"

export function generateMetadata() {
  return {
    title: "이벤트 | 꿀스테이",
  }
}

export default function EventsRoute() {
  return <EventListPage />
}
