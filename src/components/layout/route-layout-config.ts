/**
 * 라우트별 레이아웃 설정
 *
 * headerVariant:
 *   - "default"  : 로고 + 검색바 + 네비게이션 (기본)
 *   - "back"     : ← 뒤로가기 + 타이틀 + 우측 액션
 *   - "minimal"  : 홈 버튼만 (플로우 완료)
 *
 * showBottomNav: 하단 네비게이션 표시 여부
 * title: back variant에서 표시할 타이틀
 * rightActions: back variant 우측 액션 ("home" | "share" | "favorite")
 */

export type HeaderVariant = "default" | "back" | "minimal"

export interface RouteLayoutConfig {
  headerVariant: HeaderVariant
  showBottomNav: boolean
  title?: string
  rightActions?: ("home" | "share" | "favorite")[]
}

const DEFAULT_CONFIG: RouteLayoutConfig = {
  headerVariant: "default",
  showBottomNav: true,
}

/**
 * 정확 매치 라우트 설정
 */
const EXACT_ROUTES: Record<string, RouteLayoutConfig> = {
  "/": { headerVariant: "default", showBottomNav: true },
  "/search": { headerVariant: "default", showBottomNav: true },
  "/favorites": { headerVariant: "default", showBottomNav: true },
  "/coupons": { headerVariant: "default", showBottomNav: true },
  "/mypage": { headerVariant: "default", showBottomNav: true },
  "/events": { headerVariant: "default", showBottomNav: true },
  "/exhibitions": { headerVariant: "default", showBottomNav: true },
  "/magazine": { headerVariant: "default", showBottomNav: true },
  "/magazine/board": { headerVariant: "default", showBottomNav: true },
  "/magazine/package": { headerVariant: "default", showBottomNav: true },

  // 지원 페이지
  "/faq": { headerVariant: "back", showBottomNav: true, title: "FAQ" },
  "/guide": { headerVariant: "back", showBottomNav: true, title: "이용안내" },
  "/notices": { headerVariant: "back", showBottomNav: true, title: "공지사항" },
  "/terms": { headerVariant: "back", showBottomNav: true, title: "이용약관" },

  // 인증 플로우
  "/login": { headerVariant: "back", showBottomNav: false, title: "로그인" },
  "/register": { headerVariant: "back", showBottomNav: false, title: "회원가입" },
  "/forgot-password": { headerVariant: "back", showBottomNav: false, title: "비밀번호 찾기" },

  // 마이페이지 서브
  "/mypage/profile": { headerVariant: "back", showBottomNav: false, title: "프로필 수정" },
  "/mypage/password": { headerVariant: "back", showBottomNav: false, title: "비밀번호 변경" },
  "/mypage/withdraw": { headerVariant: "back", showBottomNav: false, title: "회원탈퇴" },

  // 마이페이지 하위 기능
  "/bookings": { headerVariant: "back", showBottomNav: true, title: "예약내역" },
  "/notifications": { headerVariant: "back", showBottomNav: false, title: "알림" },
  "/reviews": { headerVariant: "back", showBottomNav: false, title: "리뷰" },
  "/inquiries": { headerVariant: "back", showBottomNav: false, title: "문의" },
  "/mileage": { headerVariant: "back", showBottomNav: false, title: "마일리지" },
  "/settings": { headerVariant: "back", showBottomNav: false, title: "설정" },
}

/**
 * 패턴 매치 라우트 설정 (동적 라우트용)
 * 순서 중요: 더 구체적인 패턴이 먼저 와야 함
 */
const PATTERN_ROUTES: { pattern: RegExp; config: RouteLayoutConfig }[] = [
  // 예약 완료
  {
    pattern: /^\/booking\/[^/]+\/complete$/,
    config: { headerVariant: "minimal", showBottomNav: false },
  },
  // 결제 완료
  {
    pattern: /^\/payment\/complete$/,
    config: { headerVariant: "minimal", showBottomNav: false },
  },
  // 예약하기
  {
    pattern: /^\/booking\/[^/]+$/,
    config: { headerVariant: "back", showBottomNav: false, title: "예약하기" },
  },
  // 예약 상세
  {
    pattern: /^\/bookings\/[^/]+$/,
    config: { headerVariant: "back", showBottomNav: false, title: "예약 상세" },
  },
  // 숙소 리뷰 전체보기
  {
    pattern: /^\/accommodations\/[^/]+\/reviews$/,
    config: {
      headerVariant: "back",
      showBottomNav: false,
      title: "리뷰",
    },
  },
  // 숙소 상세
  {
    pattern: /^\/accommodations\/[^/]+$/,
    config: {
      headerVariant: "back",
      showBottomNav: false,
      rightActions: ["home", "share", "favorite"],
    },
  },
  // 이벤트 상세
  {
    pattern: /^\/events\/[^/]+$/,
    config: {
      headerVariant: "back",
      showBottomNav: false,
      rightActions: ["home"],
    },
  },
  // 기획전 상세
  {
    pattern: /^\/exhibitions\/[^/]+$/,
    config: {
      headerVariant: "back",
      showBottomNav: false,
      rightActions: ["home"],
    },
  },
  // 매거진 게시글 상세
  {
    pattern: /^\/magazine\/board\/[^/]+$/,
    config: {
      headerVariant: "back",
      showBottomNav: false,
      rightActions: ["home", "share"],
    },
  },
  // 매거진 패키지 상세
  {
    pattern: /^\/magazine\/package\/[^/]+$/,
    config: {
      headerVariant: "back",
      showBottomNav: false,
      rightActions: ["home"],
    },
  },
]

/**
 * 현재 경로에 해당하는 레이아웃 설정을 반환
 */
export function getRouteLayoutConfig(pathname: string): RouteLayoutConfig {
  // 1. 정확 매치
  if (EXACT_ROUTES[pathname]) {
    return EXACT_ROUTES[pathname]
  }

  // 2. 패턴 매치
  for (const { pattern, config } of PATTERN_ROUTES) {
    if (pattern.test(pathname)) {
      return config
    }
  }

  // 3. 기본값
  return DEFAULT_CONFIG
}
