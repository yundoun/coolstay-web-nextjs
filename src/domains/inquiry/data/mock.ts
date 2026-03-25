import type { InquiryItem } from "../types"

export const inquiriesMock: InquiryItem[] = [
  {
    id: "inq1",
    category: "예약",
    content:
      "3월 28일 체크인 예약 건인데, 체크인 시간을 오후 2시에서 오후 4시로 변경할 수 있을까요? 예약번호는 CS20260320-001입니다.",
    createdAt: "2026-03-20",
    status: "answered",
    reply:
      "안녕하세요, 꿀스테이입니다.\n\n문의하신 예약 건(CS20260320-001)의 체크인 시간을 오후 4시로 변경 완료하였습니다. 숙소 측에도 전달하였으니 안심하고 방문해주세요.\n\n추가 문의사항이 있으시면 언제든 문의해주세요.\n감사합니다.",
    repliedAt: "2026-03-21",
  },
  {
    id: "inq2",
    category: "결제",
    content:
      "지난주 예약 취소를 했는데 아직 환불이 안 되었습니다. 취소한 지 5일이 넘었는데 언제 환불되나요? 결제는 신한카드로 했습니다.",
    createdAt: "2026-03-23",
    status: "pending",
  },
  {
    id: "inq3",
    category: "기타",
    content:
      "앱에서 제주도 숙소 검색 시 필터가 제대로 작동하지 않습니다. '풀빌라' 카테고리를 선택해도 펜션이 함께 노출됩니다. 확인 부탁드립니다.",
    createdAt: "2026-03-24",
    status: "pending",
  },
]
