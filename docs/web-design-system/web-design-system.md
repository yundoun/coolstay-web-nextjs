# Coolstay Web Design System v1.0

> **목적**: 데스크탑 기반 반응형 웹 예약 플랫폼을 위한 디자인 시스템
> **작성일**: 2026-01-16
> **기반**: 모바일 디자인 토큰 + 2025 숙박 플랫폼 UI/UX 트렌드
> **프레임워크**: Tailwind CSS v4

---

## 1. 디자인 철학

### 1.1 핵심 원칙

| 원칙 | 설명 |
|------|------|
| **Quiet Luxury** | 과하지 않은 우아함. 브랜드 옐로우를 악센트로만 사용하고, 차분한 톤으로 신뢰감 전달 |
| **Frictionless** | 마찰 없는 예약 여정. 최소 클릭으로 목적 달성 |
| **Content-First** | 숙소 이미지와 정보가 주인공. UI는 콘텐츠를 돋보이게 하는 프레임 |
| **Progressive Disclosure** | 필요한 정보를 적시에 노출. 인지 과부하 방지 |

### 1.2 적용 트렌드

```
┌─────────────────────────────────────────────────────────────────┐
│  2025 트렌드 적용                                                │
├─────────────────────────────────────────────────────────────────┤
│  ✅ 벤토 그리드 (Bento Grid)     → 숙소 상세 페이지 레이아웃      │
│  ✅ 키네틱 타이포그래피           → 히어로 섹션, 스크롤 인터랙션   │
│  ✅ 소셜 프루프 내재화            → 숙소 카드에 리뷰 스니펫 통합   │
│  ✅ 다크 모드                    → 시스템/수동 전환 지원          │
│  ✅ Quiet Luxury 톤              → 부드러운 뉴트럴 팔레트         │
│  ✅ 마이크로 인터랙션             → 호버, 전환 애니메이션          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 컬러 시스템

### 2.1 브랜드 컬러

모바일의 강렬한 옐로우를 유지하되, 웹에서는 **악센트 컬러**로 절제해서 사용합니다.

```
Brand Primary (Honey Yellow)
├── primary-500: #FFC600  ← 메인 브랜드 컬러
├── primary-400: #FFD033  ← 호버 상태
├── primary-300: #FFDB66  ← 비활성/라이트
├── primary-600: #E6B200  ← 액티브/프레스
└── primary-700: #A37F00  ← 다크 모드 텍스트
```

**사용 가이드라인**:
- CTA 버튼, 선택된 상태, 가격 강조에만 사용
- 배경색으로 과다 사용 금지 (눈의 피로)
- 다크 모드에서는 채도를 약간 낮춰 사용

### 2.2 뉴트럴 팔레트 (Quiet Luxury)

차분하고 세련된 느낌을 위한 웜 그레이 계열입니다.

```
Light Mode (Warm Neutral)
├── neutral-50:  #FAFAF9   ← 페이지 배경
├── neutral-100: #F5F5F4   ← 카드 배경, 섹션 구분
├── neutral-200: #E7E5E4   ← 보더, 디바이더
├── neutral-300: #D6D3D1   ← 비활성 보더
├── neutral-400: #A8A29E   ← 플레이스홀더
├── neutral-500: #78716C   ← 보조 텍스트
├── neutral-600: #57534E   ← 본문 텍스트
├── neutral-700: #44403C   ← 강조 텍스트
├── neutral-800: #292524   ← 제목
└── neutral-900: #1C1917   ← 최강조
```

```
Dark Mode (Cool Neutral)
├── dark-50:  #18181B   ← 페이지 배경
├── dark-100: #27272A   ← 카드 배경
├── dark-200: #3F3F46   ← 보더
├── dark-300: #52525B   ← 비활성 보더
├── dark-400: #71717A   ← 플레이스홀더
├── dark-500: #A1A1AA   ← 보조 텍스트
├── dark-600: #D4D4D8   ← 본문 텍스트
├── dark-700: #E4E4E7   ← 강조 텍스트
├── dark-800: #F4F4F5   ← 제목
└── dark-900: #FAFAFA   ← 최강조
```

### 2.3 시맨틱 컬러

```
├── error:   #EF4444 (Red-500)    → 에러, 취소, 일요일
├── success: #22C55E (Green-500)  → 성공, 예약 가능, 할인
├── warning: #F59E0B (Amber-500)  → 경고, 마감 임박
├── info:    #3B82F6 (Blue-500)   → 정보, 토요일, 링크
```

### 2.4 특수 컬러

```
Social Login
├── kakao-bg:    #FEE500
├── kakao-text:  #000000
├── naver-bg:    #03C75A
└── naver-text:  #FFFFFF

Overlay
├── overlay-light: rgba(0, 0, 0, 0.5)   → 라이트 모드 모달
├── overlay-dark:  rgba(0, 0, 0, 0.7)   → 다크 모드 모달
└── scrim:         rgba(0, 0, 0, 0.3)   → 이미지 위 텍스트 가독성
```

### 2.5 다크 모드 전략

```typescript
// 시스템 설정 자동 감지 + 수동 전환
type ThemeMode = 'light' | 'dark' | 'system';

// CSS 변수 기반 테마 전환
:root {
  --color-bg-primary: theme('colors.neutral.50');
  --color-text-primary: theme('colors.neutral.800');
}

:root.dark {
  --color-bg-primary: theme('colors.dark.50');
  --color-text-primary: theme('colors.dark.800');
}
```

---

## 3. 타이포그래피

### 3.1 폰트 패밀리

```css
/* Primary: 본문 및 UI 전체 */
--font-sans: 'Pretendard Variable', 'Pretendard', -apple-system,
             BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Display: 히어로 타이틀, 키네틱 타이포그래피 */
--font-display: 'Pretendard Variable', var(--font-sans);

/* Mono: 가격, 예약번호 등 숫자 */
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;
```

**Pretendard 선택 이유**:
- 한글 최적화 + 가변 폰트 지원
- 숫자 가독성 우수 (가격 표시에 중요)
- 무료 라이선스

### 3.2 타입 스케일 (Desktop First)

모바일 대비 더 큰 스케일을 사용하여 데스크탑 가독성 확보

```
Display (히어로, 랜딩)
├── display-2xl: 4.5rem (72px)  / line-height: 1.1 / letter-spacing: -0.02em
├── display-xl:  3.75rem (60px) / line-height: 1.1 / letter-spacing: -0.02em
├── display-lg:  3rem (48px)    / line-height: 1.15 / letter-spacing: -0.02em
└── display-md:  2.25rem (36px) / line-height: 1.2 / letter-spacing: -0.01em

Heading (섹션 제목)
├── heading-xl: 1.875rem (30px) / line-height: 1.3 / font-weight: 700
├── heading-lg: 1.5rem (24px)   / line-height: 1.35 / font-weight: 700
├── heading-md: 1.25rem (20px)  / line-height: 1.4 / font-weight: 600
└── heading-sm: 1.125rem (18px) / line-height: 1.4 / font-weight: 600

Body (본문)
├── body-lg: 1.125rem (18px) / line-height: 1.6 / font-weight: 400
├── body-md: 1rem (16px)     / line-height: 1.6 / font-weight: 400  ← 기본
├── body-sm: 0.875rem (14px) / line-height: 1.5 / font-weight: 400
└── body-xs: 0.75rem (12px)  / line-height: 1.5 / font-weight: 400

Label (버튼, 레이블)
├── label-lg: 1rem (16px)     / line-height: 1.4 / font-weight: 600
├── label-md: 0.875rem (14px) / line-height: 1.4 / font-weight: 500
└── label-sm: 0.75rem (12px)  / line-height: 1.4 / font-weight: 500
```

### 3.3 반응형 타이포그래피

```css
/* Fluid Typography - clamp() 사용 */
.display-2xl {
  font-size: clamp(2.5rem, 5vw + 1rem, 4.5rem);
}

.heading-xl {
  font-size: clamp(1.5rem, 2vw + 1rem, 1.875rem);
}
```

### 3.4 키네틱 타이포그래피 가이드

스크롤 기반 텍스트 애니메이션 (히어로 섹션 등)

```
사용 케이스:
├── 히어로 메인 카피: 페이드인 + 슬라이드업
├── 섹션 타이틀: 스크롤 시 순차 등장
├── 강조 숫자: 카운트업 애니메이션 (예: "3,000+ 숙소")
└── 브랜드 메시지: 단어별 순차 등장

주의사항:
├── prefers-reduced-motion 존중
├── 핵심 콘텐츠에는 과도한 애니메이션 자제
└── 첫 로드 시에만 실행, 재방문 시 스킵 옵션
```

---

## 4. 레이아웃 시스템

### 4.1 그리드 시스템

12컬럼 그리드 기반, 벤토 그리드 레이아웃 지원

```
Desktop (1280px+)
├── Columns: 12
├── Gutter: 24px
├── Margin: 80px (양쪽)
└── Max-width: 1440px

Tablet (768px - 1279px)
├── Columns: 8
├── Gutter: 20px
└── Margin: 40px

Mobile (< 768px)
├── Columns: 4
├── Gutter: 16px
└── Margin: 16px
```

### 4.2 벤토 그리드 (Bento Grid)

숙소 상세 페이지의 정보 블록 레이아웃

```
┌─────────────────────────────────────────────────────────────┐
│                    숙소 상세 페이지 예시                       │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────┬─────────────┬─────────────┐      │
│  │                       │   체크인    │  체크아웃   │      │
│  │    메인 이미지        │   14:00     │   11:00     │      │
│  │    (2x2)             ├─────────────┴─────────────┤      │
│  │                       │      ⭐ 4.8 (리뷰 326)    │      │
│  ├───────────────────────┼───────────────────────────┤      │
│  │  📍 위치              │  🏷️ 가격                  │      │
│  │  강남역 도보 5분      │  ₩89,000 ~               │      │
│  ├───────────────────────┼─────────────┬─────────────┤      │
│  │  🛎️ 편의시설          │   주차      │   조식      │      │
│  │  와이파이, 에어컨...  │   무료      │   포함      │      │
│  └───────────────────────┴─────────────┴─────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

```css
/* Bento Grid 구현 */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(120px, auto);
  gap: 16px;
}

.bento-item-2x2 { grid-column: span 2; grid-row: span 2; }
.bento-item-2x1 { grid-column: span 2; }
.bento-item-1x2 { grid-row: span 2; }
```

### 4.3 컨테이너

```css
.container-full   { max-width: 100%; }
.container-wide   { max-width: 1440px; } /* 메인 콘텐츠 */
.container-normal { max-width: 1200px; } /* 일반 페이지 */
.container-narrow { max-width: 800px; }  /* 폼, 결제 */
.container-tight  { max-width: 480px; }  /* 로그인, 모달 */
```

### 4.4 페이지 레이아웃 패턴

```
┌─────────────────────────────────────────────────────────────┐
│  Header (Fixed, 64px)                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────────────────────────────┐  │
│  │             │  │                                     │  │
│  │  Sidebar    │  │           Main Content              │  │
│  │  (Optional) │  │                                     │  │
│  │  280px      │  │           flex-1                    │  │
│  │             │  │                                     │  │
│  └─────────────┘  └─────────────────────────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Footer                                                     │
└─────────────────────────────────────────────────────────────┘

검색 결과 페이지:
├── Sidebar: 필터 영역 (데스크탑)
├── Main: 숙소 리스트
└── Mobile: 필터는 바텀시트로

숙소 상세 페이지:
├── Full-width 이미지 갤러리
├── 2-Column: 정보 + 예약 위젯 (Sticky)
└── Mobile: 예약 버튼 Fixed Bottom
```

---

## 5. 스페이싱 시스템

### 5.1 기본 단위

8px 베이스 유지, 웹에서 더 여유로운 스페이싱 적용

```
space-0:   0
space-0.5: 2px   (0.125rem)
space-1:   4px   (0.25rem)
space-1.5: 6px   (0.375rem)
space-2:   8px   (0.5rem)   ← 기본 단위
space-3:   12px  (0.75rem)
space-4:   16px  (1rem)     ← 컴포넌트 내부 패딩
space-5:   20px  (1.25rem)
space-6:   24px  (1.5rem)   ← 컴포넌트 간 간격
space-8:   32px  (2rem)     ← 섹션 내 간격
space-10:  40px  (2.5rem)
space-12:  48px  (3rem)     ← 섹션 간 간격
space-16:  64px  (4rem)
space-20:  80px  (5rem)     ← 대형 섹션 간격
space-24:  96px  (6rem)
```

### 5.2 컴포넌트 스페이싱 가이드

```
Button
├── padding-x: space-6 (24px)
├── padding-y: space-3 (12px)
└── gap (아이콘): space-2 (8px)

Card
├── padding: space-6 (24px)
├── gap (내부 요소): space-4 (16px)
└── border-radius: radius-lg (12px)

Input
├── padding-x: space-4 (16px)
├── padding-y: space-3 (12px)
└── height: 48px

Section
├── padding-y: space-16 ~ space-24
└── gap (카드 간): space-6 (24px)
```

---

## 6. 컴포넌트 시스템

### 6.1 버튼

```
크기 (Size)
├── xs: height 32px, text-xs, px-3
├── sm: height 40px, text-sm, px-4
├── md: height 48px, text-base, px-6  ← 기본
├── lg: height 56px, text-lg, px-8
└── xl: height 64px, text-xl, px-10   ← 히어로 CTA

변형 (Variant)
├── primary:  bg-primary-500 text-neutral-900 (CTA)
├── secondary: bg-neutral-800 text-white (보조 액션)
├── outline:  border-neutral-300 text-neutral-700
├── ghost:    text-neutral-600 hover:bg-neutral-100
└── link:     text-info underline

상태 (State)
├── default → hover → active → disabled
├── hover: opacity 증가 또는 배경색 변화
├── active: scale(0.98) + 더 진한 색상
└── disabled: opacity-50 cursor-not-allowed
```

### 6.2 입력 필드

```
Text Input
├── height: 48px
├── border: 1px solid neutral-300
├── border-radius: radius-md (8px)
├── focus: ring-2 ring-primary-500/30 border-primary-500
└── error: border-error ring-error/30

Search Input (히어로)
├── height: 56px ~ 64px
├── border-radius: radius-full
├── 아이콘: 좌측 검색, 우측 클리어
└── 그림자: shadow-lg

Select / Dropdown
├── 기본 스타일은 Input과 동일
├── 드롭다운: shadow-lg, max-height 320px
└── 옵션 hover: bg-neutral-100
```

### 6.3 카드

```
숙소 카드 (Accommodation Card)
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │         이미지              │ ♡ │
│  │         (16:10)             │   │
│  └─────────────────────────────┘   │
│  숙소명                    ⭐ 4.8  │
│  강남구 · 도보 5분                 │
│  ─────────────────────────────────  │
│  "깨끗하고 좋았어요" - 리뷰 스니펫  │  ← 소셜 프루프
│  ─────────────────────────────────  │
│  ₩89,000 ~              예약하기   │
└─────────────────────────────────────┘

속성:
├── border-radius: radius-lg (12px)
├── shadow: shadow-sm → hover:shadow-lg
├── transition: transform, shadow (200ms)
├── hover: translateY(-4px)
└── 이미지: lazy loading + blur placeholder
```

### 6.4 네비게이션

```
Header (Desktop)
┌─────────────────────────────────────────────────────────────┐
│  🍯 Coolstay    [검색바------------]    쿠폰 | 로그인/프로필 │
└─────────────────────────────────────────────────────────────┘
├── height: 64px
├── position: sticky top-0
├── background: blur(12px) + bg-white/80
└── z-index: 1030

Header (Mobile)
┌─────────────────────────────────────────────────────────────┐
│  🍯 Coolstay                              🔍  👤            │
└─────────────────────────────────────────────────────────────┘
├── height: 56px
└── 검색은 별도 페이지/모달로

GNB (Mobile Only)
├── Bottom fixed, height: 64px + safe-area
├── 5 tabs: 홈, 검색, 예약내역, 쿠폰, 더보기
└── 활성 탭: primary-500 컬러
```

### 6.5 모달 & 오버레이

```
Dialog Modal
├── max-width: 480px (sm), 640px (md), 800px (lg)
├── border-radius: radius-xl (16px)
├── padding: space-6
├── backdrop: overlay-light/dark
└── 애니메이션: fade + scale (200ms)

Bottom Sheet (Mobile/Tablet)
├── border-radius: radius-xl radius-xl 0 0
├── max-height: 90vh
├── drag indicator: 40px × 4px bar
└── 애니메이션: slide-up (300ms)

Toast / Snackbar
├── position: bottom-center (mobile), bottom-right (desktop)
├── max-width: 400px
├── border-radius: radius-lg
├── auto-dismiss: 3-5초
└── 애니메이션: slide-up + fade
```

### 6.6 숙소 상세 컴포넌트

```
Image Gallery
├── 메인: aspect-ratio 16/10
├── 썸네일 그리드: 4~5개 미리보기
├── Lightbox: 풀스크린 슬라이더
└── 터치: 스와이프, 핀치 줌

Room Card (객실 선택)
┌─────────────────────────────────────────────────────────────┐
│  [이미지]  스탠다드 더블                           잔여 3개 │
│            ├── 대실 3시간 / ₩30,000                        │
│            └── 숙박 15:00~ / ₩89,000   [예약하기]          │
└─────────────────────────────────────────────────────────────┘

Review Card (소셜 프루프)
├── 작성자 아바타 + 닉네임 + 날짜
├── 별점 (filled stars)
├── 리뷰 텍스트 (2줄 clamp)
├── 첨부 이미지 (있는 경우)
└── 사장님 답변 (있는 경우, 접힘)

Booking Widget (Sticky Sidebar)
├── 데스크탑: 우측 sticky, width 380px
├── 모바일: bottom fixed bar
├── 내용: 날짜, 인원, 가격, CTA
└── 그림자: shadow-xl
```

---

## 7. 인터랙션 & 애니메이션

### 7.1 트랜지션 토큰

```css
/* Duration */
--duration-instant: 0ms;
--duration-fast:    150ms;  /* 호버, 토글 */
--duration-normal:  200ms;  /* 기본 전환 */
--duration-slow:    300ms;  /* 모달, 드로어 */
--duration-slower:  500ms;  /* 페이지 전환 */

/* Easing */
--ease-default:     cubic-bezier(0.4, 0, 0.2, 1);  /* 자연스러운 감속 */
--ease-in:          cubic-bezier(0.4, 0, 1, 1);
--ease-out:         cubic-bezier(0, 0, 0.2, 1);
--ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1);  /* 바운스 효과 */
```

### 7.2 마이크로 인터랙션

```
Button
├── hover: scale(1.02), 배경색 변화
├── active: scale(0.98)
└── ripple 효과 (optional)

Card
├── hover: translateY(-4px), shadow 증가
└── 이미지: scale(1.05) 확대

Favorite (하트)
├── 클릭: scale 팝 + 컬러 전환
└── 파티클 효과 (optional)

Tab / Toggle
├── indicator 슬라이드
└── 300ms ease-out

Loading
├── Skeleton: shimmer 애니메이션
├── Spinner: rotate infinite
└── Progress: 부드러운 width 전환
```

### 7.3 스크롤 기반 애니메이션

```javascript
// Intersection Observer 기반
const scrollAnimations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  staggerChildren: {
    // 자식 요소 순차 등장
    staggerDelay: 0.1
  },
  parallax: {
    // 배경 이미지 패럴랙스
    speed: 0.5
  }
};

// 접근성: 모션 감소 설정 존중
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 7.4 페이지 전환

```
Route 전환
├── 부드러운 fade (200ms)
└── 스크롤 위치 복원

Skeleton Loading
├── 콘텐츠 영역 shimmer
├── 실제 콘텐츠와 동일한 레이아웃
└── 이미지: blur-up 기법
```

---

## 8. 반응형 브레이크포인트

### 8.1 브레이크포인트 정의

```css
/* Mobile First 접근 */
--breakpoint-sm:  640px;   /* 큰 모바일 */
--breakpoint-md:  768px;   /* 태블릿 세로 */
--breakpoint-lg:  1024px;  /* 태블릿 가로 / 작은 데스크탑 */
--breakpoint-xl:  1280px;  /* 데스크탑 */
--breakpoint-2xl: 1536px;  /* 대형 모니터 */
```

### 8.2 반응형 패턴

```
숙소 리스트 그리드
├── mobile (< 640px):   1 column
├── sm (640px+):        2 columns
├── lg (1024px+):       3 columns
└── xl (1280px+):       4 columns

검색 필터
├── mobile: 바텀시트 (버튼으로 열기)
├── tablet: 상단 가로 필터 바
└── desktop: 좌측 사이드바 (280px)

예약 위젯
├── mobile: bottom fixed bar (가격 + CTA)
├── tablet: 하단 플로팅 카드
└── desktop: 우측 sticky sidebar

헤더 검색바
├── mobile: 아이콘만, 탭하면 전체화면 검색
├── tablet: 축소된 검색바
└── desktop: 풀 검색바 (위치, 날짜, 인원)
```

### 8.3 터치 vs 마우스

```
Touch (Mobile/Tablet)
├── 터치 타겟: 최소 44px × 44px
├── 호버 상태 없음 (탭 = 액티브)
├── 스와이프 제스처 지원
└── bottom sheet, 풀스크린 모달 선호

Mouse (Desktop)
├── 호버 상태 활용
├── 툴팁 표시
├── 드래그 앤 드롭 (날짜 범위 등)
└── 키보드 네비게이션 지원
```

---

## 9. 접근성 (A11y)

### 9.1 기본 원칙

```
WCAG 2.1 AA 준수 목표

색상 대비
├── 일반 텍스트: 최소 4.5:1
├── 큰 텍스트 (18px+): 최소 3:1
└── UI 컴포넌트: 최소 3:1

키보드 접근성
├── 모든 인터랙티브 요소 Tab 접근 가능
├── focus-visible 스타일 명확히
├── Skip to content 링크
└── 모달 열릴 때 포커스 트랩

스크린 리더
├── 시맨틱 HTML 사용
├── ARIA 레이블 적절히
├── 이미지 alt 텍스트
└── 동적 콘텐츠 aria-live
```

### 9.2 포커스 스타일

```css
/* 키보드 포커스만 표시 */
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* 마우스 클릭 시 outline 숨김 */
:focus:not(:focus-visible) {
  outline: none;
}
```

---

## 10. 성능 최적화 가이드

### 10.1 이미지 최적화

```
포맷
├── WebP 기본, AVIF 지원 시 사용
├── fallback: JPEG (품질 80%)
└── 아이콘: SVG (인라인 또는 스프라이트)

반응형 이미지
├── srcset으로 해상도별 제공
├── sizes 속성으로 뷰포트별 크기 힌트
└── 레티나 대응: 2x 이미지

로딩 전략
├── Above the fold: eager loading
├── Below the fold: lazy loading
├── 썸네일: blur-up placeholder (LQIP)
└── 갤러리: 가시 영역 + 1개만 로드
```

### 10.2 Core Web Vitals 목표

```
LCP (Largest Contentful Paint)
├── 목표: < 2.5초
├── 히어로 이미지 preload
└── 폰트 preload, font-display: swap

FID (First Input Delay) / INP
├── 목표: < 100ms
├── 메인 스레드 블로킹 최소화
└── 이벤트 핸들러 최적화

CLS (Cumulative Layout Shift)
├── 목표: < 0.1
├── 이미지/비디오 aspect-ratio 지정
├── 폰트 로딩 시 레이아웃 시프트 방지
└── 동적 콘텐츠 영역 예약
```

### 10.3 CSS 최적화

```
Tailwind CSS v4
├── JIT 모드로 사용하는 클래스만 빌드
├── CSS 변수 기반 테마 (런타임 전환)
└── @layer로 specificity 관리

Critical CSS
├── Above the fold 스타일 인라인
└── 나머지는 비동기 로드
```

---

## 11. 디자인 토큰 (Tailwind Config)

### 11.1 tailwind.config.ts 확장

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          300: '#FFDB66',
          400: '#FFD033',
          500: '#FFC600',
          600: '#E6B200',
          700: '#A37F00',
        },
        neutral: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        // ... 기타 컬러
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        // ... 기타 타입 스케일
      },
      spacing: {
        'header': '64px',
        'sidebar': '280px',
        'booking-widget': '380px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 40px rgba(0,0,0,0.12)',
        'modal': '0 25px 50px -12px rgba(0,0,0,0.25)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'toast': '1080',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

---

## 12. 컴포넌트 명명 규칙

### 12.1 파일 구조

```
src/
├── components/
│   ├── ui/              # 기본 UI 컴포넌트
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Card/
│   │   └── Modal/
│   │
│   ├── layout/          # 레이아웃 컴포넌트
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Sidebar/
│   │   └── Container/
│   │
│   └── domain/          # 도메인 특화 컴포넌트
│       ├── accommodation/
│       │   ├── AccommodationCard/
│       │   ├── AccommodationGallery/
│       │   └── RoomSelector/
│       ├── booking/
│       │   ├── BookingWidget/
│       │   ├── DatePicker/
│       │   └── GuestCounter/
│       └── review/
│           └── ReviewCard/
```

### 12.2 명명 규칙

```
컴포넌트: PascalCase
├── Button.tsx
├── AccommodationCard.tsx
└── BookingWidget.tsx

Props 인터페이스: 컴포넌트명 + Props
├── ButtonProps
├── AccommodationCardProps
└── BookingWidgetProps

CSS 클래스 (Tailwind 커스텀): kebab-case
├── btn-primary
├── card-accommodation
└── input-search
```

---

## 부록: 빠른 참조

### 컬러 치트시트

| 용도 | Light Mode | Dark Mode |
|------|------------|-----------|
| 배경 | neutral-50 | dark-50 |
| 카드 배경 | white | dark-100 |
| 본문 텍스트 | neutral-600 | dark-600 |
| 제목 | neutral-800 | dark-800 |
| 보더 | neutral-200 | dark-200 |
| CTA 버튼 | primary-500 | primary-500 |
| 링크 | info | info |

### 스페이싱 치트시트

| 토큰 | 값 | 사용처 |
|------|-----|-------|
| space-2 | 8px | 아이콘-텍스트 간격 |
| space-4 | 16px | 컴포넌트 내부 패딩 |
| space-6 | 24px | 카드 패딩, 컴포넌트 간격 |
| space-8 | 32px | 섹션 내 요소 간격 |
| space-16 | 64px | 섹션 간 간격 |

### 브레이크포인트 치트시트

| 이름 | 값 | 대상 기기 |
|------|-----|----------|
| sm | 640px | 큰 모바일 |
| md | 768px | 태블릿 세로 |
| lg | 1024px | 태블릿 가로 |
| xl | 1280px | 데스크탑 |
| 2xl | 1536px | 대형 모니터 |
