# 매거진 모바일 앱 동일 구현 (v2)

> **진행률**: 14 / 14 (100%)

## 원칙

- **레퍼런스 이미지(캡쳐본) 기준**으로 영역을 정의한다
- API 구조가 아닌, 눈에 보이는 섹션 순서와 구성을 따른다
- 디자인 자체는 웹에 맞게 자연스럽게 대체한다

---

## 캡쳐본 영역 → 데이터 매핑

| # | 캡쳐본 영역 | 데이터 소스 |
|---|-----------|-----------|
| 1 | 배너 캐러셀 + dot | `magazine_banner` ← `/aiMagazine/home` |
| 2 | 지역 필터 "지금은 전국 ▼" | `/aiMagazine/regions` |
| 3 | AI 추천 관광정보 (4탭 + 카드) | 한국관광공사 공공API (`areaBasedList2`) |
| 4 | {인플루언서}와 함께 여행 + CTA | `magazine_video` ← `/aiMagazine/home` |
| 5 | 추천 숙소 모아보기 | `/aiMagazine/store/list` |
| 6 | 이런 글은 어떠신지 | `magazine_board` ← `/aiMagazine/home` |

**캡쳐본에 없는 것**: `magazine_package` 섹션 (이 페이지에 노출 안 함)

---

## Phase 1 — 홈 화면 매거진 섹션

- [x] `MZ-1` 홈 MagazineSection 배너 카드 나열로 변경
  - 현재: video+board 합쳐서 수평 스크롤
  - 변경: `magazine_banner` 데이터로 수평 스크롤 카드 나열
  - 카드: 220px 너비, 3:4 비율 (AOS dp_220)
  - link 기반 네비게이션 (APP_LINK → 웹 경로 매핑)

---

## Phase 2 — 매거진 전용 페이지 기본 구조

- [x] `MZ-2` 페이지 헤더 + 배너 캐러셀 리디자인
  - 헤더: "꿀스테이 여행 매거진"
  - 배너: aspect-video(16:9), dot 인디케이터, 3초 자동 슬라이드
  - 좌우 화살표 제거

- [x] `MZ-3` 지역 필터 배너 아래 재배치
  - 현재: 헤더 옆
  - 변경: 배너 아래 별도 행, "지금은 {지역} ▼" 형식

---

## Phase 3 — AI 추천 관광정보 (신규)

- [x] `MZ-4` 한국관광공사 공공API 연동
  - 엔드포인트: `apis.data.go.kr/B551011/KorService2/areaBasedList2`
  - 파라미터: MobileOS=ETC, MobileApp=coolstay, serviceKey, contentTypeId, areaCode, sigunguCode
  - 응답: XML → JSON 변환 (또는 _type=json 파라미터 사용)
  - TourItem 타입 정의 (title, firstImage, addr1, contentId 등)
  - Next.js API Route 프록시 (CORS 우회)

- [x] `MZ-5` TourSection 컴포넌트 구현
  - 탭: 관광지(12), 문화시설(14), 축제(15), 음식점(39)
  - 탭 아래 카드 수평 스크롤 (이미지 + 장소명)
  - 지역 필터 연동 (areaCode, sigunguCode)
  - 섹션 제목: "AI 추천 관광정보" + "전체보기 >"

---

## Phase 4 — 인플루언서 섹션 재구성

- [x] `MZ-6` 인플루언서 섹션 구조 변경
  - 현재: "영상" 제목 + 작은 썸네일 그리드
  - 변경: "{인플루언서명}와 함께 여행" 제목 + 수평 스크롤 카드 (322px, 16:9)
  - 하단 CTA 버튼: "AI 인플루언서 영상 전체보기" → `/magazine/board?type=VIDEO`
  - 데이터: `magazine_video` 그대로 사용

---

## Phase 5 — 추천 숙소 섹션 (신규)

- [x] `MZ-7` StoreList API 연동
  - `/aiMagazine/store/list` (위치 기반 10km, 최대 10개)
  - 타입 + API 함수 + 훅 작성
  - 위치 권한 요청 → 기본값 fallback

- [x] `MZ-8` RecommendStoreSection 컴포넌트
  - 숙소 카드 수평 스크롤 (이미지 + 쿠폰 태그 + 이름 + 가격)
  - 섹션 제목: "추천 숙소 모아보기" + "전체보기 >"

---

## Phase 6 — 게시글 섹션 개선 + 불필요 섹션 제거

- [x] `MZ-9` BoardCardGrid → "이런 글은 어떠신지" 스타일 변경
  - 현재: 그리드 레이아웃 + "게시글" 제목
  - 변경: 수평 스크롤 카드 + "이런 글은 어떠신지" 제목
  - 카드에 하단 그라데이션 + 타입 태그

- [x] `MZ-10` MagazineHomePage에서 패키지 섹션 제거
  - 캡쳐본에 없으므로 이 페이지에서 제거
  - 패키지 관련 컴포넌트/라우트는 유지 (별도 접근용)

---

## Phase 7 — 섹션 순서 통합 + 마무리

- [x] `MZ-11` MagazineHomePage 섹션 순서 재배치
  - 캡쳐본 순서:
    1. 배너 캐러셀
    2. 지역 필터
    3. AI 추천 관광정보
    4. 인플루언서 영상
    5. 추천 숙소 모아보기
    6. 이런 글은 어떠신지
  - 각 섹션 "전체보기" 링크 통일

- [x] `MZ-12` 스켈레톤 + 에러 상태 갱신
  - 변경된 레이아웃에 맞는 스켈레톤
  - 외부 API(관광공사) 에러 시 섹션 숨김 처리

- [x] `MZ-13` 빌드 + 테스트 확인

- [x] `MZ-14` Playwright E2E 검증
  - 모바일 뷰포트에서 각 섹션 렌더링 확인
  - 캡쳐본과 영역 구성 대조

---

## 참고

### API 엔드포인트
| 엔드포인트 | 용도 | 상태 |
|-----------|------|------|
| `GET /aiMagazine/home` | 배너, 영상, 게시글 | 연동 완료 |
| `GET /aiMagazine/regions` | 지역 필터 | 연동 완료 |
| `GET /aiMagazine/store/list` | 추천 숙소 (위치 기반) | **미연동** |
| `GET /aiMagazine/board/list` | 게시글 목록 | 연동 완료 |
| 한국관광공사 `areaBasedList2` | AI 추천 관광정보 | **미연동 (외부 API)** |

### 한국관광공사 API 정보
- Base: `http://apis.data.go.kr/B551011/KorService2/areaBasedList2`
- serviceKey: `5MgP1ceVGD0WTZ7AwA3LHM1yByrsTVfCX3VFbU4L3GYo1JSCRKLJqd8APK8n5HVgsr1X5TX8ugAmsqdYgYK5sA==`
- contentTypeId: 12(관광지), 14(문화시설), 15(축제), 39(음식점)
- 응답: XML (JSON 변환 필요)
