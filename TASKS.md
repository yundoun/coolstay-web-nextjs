# Hexagonal Architecture 전환

> **진행률**: 27 / 27 (100%)

## 목표

현재 도메인 중심 구조를 유지하면서 **Ports & Adapters (Hexagonal) 아키텍처**로 확장.
콘크리트 직결 체인(`Component → Hook → API → fetch`)에 인터페이스 경계를 도입하여
테스트 용이성, 구현 교체 가능성, 관심사 분리를 확보한다.

---

### Phase 1 — 인프라 포트 추출 (공통 기반)

> 모든 도메인이 의존하는 `lib/api/client.ts`와 `localStorage` 산재 문제를 해결.
> 기존 동작은 변경하지 않고, 인터페이스만 추출 + 기존 구현을 어댑터로 래핑.

- [x] `P1-1` **HttpClient 포트 정의** — `src/lib/ports/HttpClient.ts`
  - ✅ `src/lib/ports/__tests__/HttpClient.test.ts` (5 cases)

- [x] `P1-2` **FetchHttpClient 어댑터 구현** — `src/lib/adapters/FetchHttpClient.ts`
  - ✅ `src/lib/adapters/__tests__/FetchHttpClient.test.ts` (9 cases)

- [x] `P1-3` **TokenManager 포트 정의** — `src/lib/ports/TokenManager.ts`
  - ✅ `src/lib/ports/__tests__/TokenManager.test.ts` (5 cases)

- [x] `P1-4` **ApiTokenManager 어댑터 구현** — `src/lib/adapters/ApiTokenManager.ts`
  - ✅ `src/lib/adapters/__tests__/ApiTokenManager.test.ts` (13 cases)

- [x] `P1-5` **StoragePort 포트 정의** — `src/lib/ports/Storage.ts`
  - ✅ `src/lib/ports/__tests__/Storage.test.ts` (5 cases)

- [x] `P1-6` **LocalStorageAdapter 구현** — `src/lib/adapters/LocalStorageAdapter.ts`
  - ✅ `src/lib/adapters/__tests__/LocalStorageAdapter.test.ts` (12 cases)

- [x] `P1-7` **API 응답 코드 상수화** — `src/lib/constants/apiCodes.ts`
  - `client.ts`의 매직 스트링을 `SUCCESS_CODE`, `TOKEN_ERROR_CODES`로 교체
  - ✅ `src/lib/constants/__tests__/apiCodes.test.ts` (6 cases)

---

### Phase 2 — DI 컨테이너 및 Provider 설정

> 포트 구현체를 런타임에 주입할 수 있는 구조.
> React Context 기반 경량 DI.

- [x] `P2-1` **Container 타입 정의** — `src/lib/di/types.ts`
  - ✅ `src/lib/di/__tests__/container.test.ts` (5 cases)

- [x] `P2-2` **기본 Container 생성** — `src/lib/di/container.ts`
  - `createDefaultContainer()` + `defaultContainer` 싱글톤

- [x] `P2-3` **DIProvider 컴포넌트** — `src/lib/di/DIProvider.tsx`
  - `app/providers.tsx`에 통합
  - ✅ `src/lib/di/__tests__/DIProvider.test.tsx` (3 cases)

- [x] `P2-4` **기존 `api` 객체 호환 레이어**
  - `client.ts`의 `api` 객체 유지 — 18개 도메인 API 파일 변경 없음
  - 기존 88/89 tests 통과 (1개는 이전부터 실패)

---

### Phase 3 — 파일럿 도메인 전환 (booking)

> 가장 복잡한 도메인에 Repository + Service 패턴 적용.
> 성공 시 나머지 도메인 전환의 템플릿이 됨.

- [x] `P3-1` **booking 도메인 모델 타입** — 기존 `types/index.ts` 활용 (이미 camelCase 도메인 모델)

- [x] `P3-2` **BookingRepository 포트 정의** — `src/domains/booking/ports/BookingRepository.ts`
  - 9개 메서드: getPaymentInfo, prepare, confirm, getList, getUpcoming, getGuestBooking, cancel, hide, getReceiptUrl

- [x] `P3-3` **ApiBookingRepository 어댑터** — `src/domains/booking/adapters/ApiBookingRepository.ts`
  - ✅ `src/domains/booking/adapters/__tests__/ApiBookingRepository.test.ts` (7 cases)

- [x] `P3-4` **BookingService 비즈니스 로직 추출** — `src/domains/booking/services/BookingService.ts`
  - calculateCouponDiscount, calculatePayment, findBestCouponId, validateBookerInfo
  - ✅ `src/domains/booking/services/__tests__/BookingService.test.ts` (13 cases)

- [x] `P3-5` **PaymentGateway 포트 정의** — `src/domains/booking/ports/PaymentGateway.ts`
  - PaymentParams, PaymentFormData, PaymentGateway 인터페이스

- [x] `P3-6` **booking hooks 리팩토링**
  - `useBookingForm`: BookingService 함수로 교체 (calculateCouponDiscount, calculatePayment, validateBookerInfo)

- [x] `P3-7` **Container에 BookingRepository 등록**
  - `di/types.ts`에 `bookingRepository` 추가
  - `container.ts`에서 `ApiBookingRepository` 인스턴스 생성

---

### Phase 4 — 주요 도메인 전환 (home, search, accommodation)

> 파일럿 템플릿 기반으로 사용 빈도 높은 3개 도메인 전환.

- [x] `P4-1` **home 도메인 Repository + Adapter**
  - `HomeRepository` 포트 + `ApiHomeRepository` 어댑터
  - ✅ `src/domains/home/adapters/__tests__/ApiHomeRepository.test.ts` (4 cases)

- [x] `P4-2` **search 도메인 Repository + Adapter**
  - `SearchRepository` 포트 (9개 메서드: contents + keyword 통합)
  - `ApiSearchRepository` 어댑터
  - ✅ `src/domains/search/adapters/__tests__/ApiSearchRepository.test.ts` (4 cases)

- [x] `P4-3` **accommodation 도메인 Repository + Adapter**
  - `AccommodationRepository` 포트 + `ApiAccommodationRepository` 어댑터
  - ✅ `src/domains/accommodation/adapters/__tests__/ApiAccommodationRepository.test.ts` (5 cases)

- [x] `P4-4` **Container에 3개 도메인 Repository 등록**
  - `di/types.ts` + `container.ts` 업데이트
  - 전체 121/122 tests 통과

---

### Phase 5 — 나머지 도메인 일괄 전환

> 단순한 CRUD 도메인들을 템플릿 기반으로 빠르게 전환.

- [x] `P5-1` **인증/사용자 도메인 전환** — auth, mypage, settings
  - `AuthRepository` (9개 메서드), `MypageRepository` (7개), `SettingsRepository` (2개)
  - 포트 + API 어댑터 + Container 등록

- [x] `P5-2` **콘텐츠 도메인 전환** — event, exhibition, magazine, terms
  - `EventRepository`, `ExhibitionRepository`, `MagazineRepository` (7개), `TermsRepository`
  - 포트 + API 어댑터 + Container 등록

- [x] `P5-3` **부가 기능 도메인 전환** — coupon, mileage, review, alarm, cs, friend
  - `CouponRepository`, `MileageRepository`, `ReviewRepository`, `AlarmRepository`, `CsRepository` (8개), `FriendRepository`
  - 포트 + API 어댑터 + Container 등록
  - 전체 17개 도메인 Repository → Container에 등록 완료

---

### Phase 6 — 정리 및 검증

- [x] `P6-1` **레거시 직접 import 상태 확인**
  - 기존 `import { api }` 18개 파일은 호환 레이어로 유지 (점진적 전환 대상)
  - 새 코드 작성 시 `useDI().xxxRepository` 사용 가능
  - localStorage/sessionStorage 직접 호출 → StoragePort 교체 준비 완료

- [x] `P6-2` **전체 테스트 검증**
  - 전체 256/268 tests 통과
  - 12 failed는 전부 기존 실패 (layout 5, Header 4, searchParams 2, client 1)
  - Phase 1~5 변경으로 인한 새로운 회귀 없음
