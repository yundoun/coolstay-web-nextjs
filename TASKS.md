# Hexagonal Architecture 전환

> **진행률**: 7 / 28 (25%)

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

- [ ] `P2-1` **Container 타입 정의** — `src/lib/di/types.ts`
  - `Container` 인터페이스: `httpClient`, `tokenManager`, `storage` 필드
  - 각 도메인 Repository 타입은 Phase 3에서 추가

- [ ] `P2-2` **기본 Container 생성** — `src/lib/di/container.ts`
  - `createDefaultContainer()`: FetchHttpClient + ApiTokenManager + LocalStorageAdapter 조합
  - 싱글톤 `defaultContainer` export

- [ ] `P2-3` **DIProvider 컴포넌트** — `src/lib/di/DIProvider.tsx`
  - `DIContext` + `DIProvider` + `useDI()` 훅
  - `app/providers.tsx`에 통합
  - 테스트: useDI()가 기본 컨테이너 반환 확인

- [ ] `P2-4` **기존 `api` 객체 호환 레이어**
  - 기존 `import { api } from "@/lib/api/client"` 경로 유지
  - 내부적으로 `defaultContainer.httpClient` 위임
  - 18개 도메인 API 파일 변경 없이 동작 보장
  - 테스트: 기존 전체 테스트 스위트 통과

---

### Phase 3 — 파일럿 도메인 전환 (booking)

> 가장 복잡한 도메인에 Repository + Service 패턴 적용.
> 성공 시 나머지 도메인 전환의 템플릿이 됨.

- [ ] `P3-1` **booking 도메인 모델 타입 정의** — `src/domains/booking/types/domain.ts`
  - `BookingRequest`, `PaymentSummary`, `BookingResult` 등 도메인 모델
  - API 응답 타입(`api.ts`)과 분리 — camelCase 사용
  - 매퍼 함수 시그니처 정의

- [ ] `P3-2` **BookingRepository 포트 정의** — `src/domains/booking/ports/BookingRepository.ts`
  - `getPaymentInfo(userId): Promise<PaymentInfo>`
  - `prepare(request): Promise<PrepareResult>`
  - `confirm(request): Promise<BookingResult>`
  - `getList(params): Promise<BookingListResult>`
  - `cancel(bookId): Promise<void>`
  - 현재 `reservationApi.ts`의 9개 함수를 도메인 메서드로 재구성

- [ ] `P3-3` **ApiBookingRepository 어댑터** — `src/domains/booking/adapters/ApiBookingRepository.ts`
  - `HttpClient` 주입받아 `BookingRepository` 구현
  - API 응답 → 도메인 모델 매핑 로직 포함
  - 테스트: HttpClient 모킹으로 매핑 로직 단위 테스트

- [ ] `P3-4` **BookingService 비즈니스 로직 추출** — `src/domains/booking/services/BookingService.ts`
  - `calculatePayment(basePrice, coupon, mileage): PaymentSummary` — useBookingForm의 useMemo 로직
  - `validateBookerInfo(info): ValidationResult`
  - `buildBookingRequest(form, context): BookingRequest`
  - 순수 함수, React 의존 없음
  - 테스트: 쿠폰 할인 계산, CC009 제약, 마일리지 차감 경계값

- [ ] `P3-5` **PaymentGateway 포트 정의** — `src/domains/booking/ports/PaymentGateway.ts`
  - `requestPayment(params): Promise<PaymentResult>`
  - 현재 `inicis.ts`의 INIStdPay 호출을 추상화
  - InicisPaymentGateway 어댑터 구현

- [ ] `P3-6` **booking hooks 리팩토링**
  - `useBookingForm`: BookingService + useDI() 사용으로 전환
  - `useBookingSubmit`: BookingRepository + PaymentGateway 포트 사용
  - localStorage 직접 호출 → StoragePort 교체 (6개 키)
  - 테스트: 기존 동작 회귀 테스트

- [ ] `P3-7` **Container에 BookingRepository 등록**
  - `di/types.ts`에 `bookingRepository` 필드 추가
  - `container.ts`에서 `ApiBookingRepository` 인스턴스 생성
  - booking hooks에서 `useDI().bookingRepository` 사용

---

### Phase 4 — 주요 도메인 전환 (home, search, accommodation)

> 파일럿 템플릿 기반으로 사용 빈도 높은 3개 도메인 전환.

- [ ] `P4-1` **home 도메인 Repository + Adapter**
  - `HomeRepository` 포트: `getMain`, `getRegionStores`, `getRecentStores`
  - `ApiHomeRepository` 어댑터
  - `homeApi.ts`의 localStorage 직접 호출 → StoragePort 교체
  - hooks 전환: `useHomeMain`, `useRegionStores`
  - 테스트: 매퍼 + 훅 회귀

- [ ] `P4-2` **search 도메인 Repository + Adapter**
  - `SearchRepository` 포트: contents + keyword + filter 통합
  - `ApiSearchRepository` 어댑터 (contentsApi + keywordApi 통합)
  - `mapStoreToAccommodation` 매퍼를 어댑터 내부로 이동
  - hooks 전환: `useContentsList`, `useFilterSearch`, `useKeywordSearch` 등
  - CompactSearchBar의 localStorage 직접 호출 → StoragePort 교체
  - 테스트: 매퍼 + 훅 회귀

- [ ] `P4-3` **accommodation 도메인 Repository + Adapter**
  - `AccommodationRepository` 포트: detail, images, bookStatus, refundPolicy
  - `ApiAccommodationRepository` 어댑터
  - `mapMotelToDetail` 매퍼를 어댑터 내부로 이동
  - hooks 전환: `useStoreDetail`, `useStoreImages` 등
  - 테스트: 매퍼 + 훅 회귀

- [ ] `P4-4` **Container에 3개 도메인 Repository 등록**
  - `di/types.ts` 업데이트
  - `container.ts`에 팩토리 추가
  - 테스트: 전체 테스트 스위트 통과

---

### Phase 5 — 나머지 도메인 일괄 전환

> 단순한 CRUD 도메인들을 템플릿 기반으로 빠르게 전환.

- [ ] `P5-1` **인증/사용자 도메인 전환** — auth, mypage, settings
  - `AuthRepository`, `UserRepository`, `SettingsRepository` 포트 + 어댑터
  - hooks 전환 + Container 등록

- [ ] `P5-2` **콘텐츠 도메인 전환** — event, exhibition, magazine, notice, faq, guide, terms
  - 7개 도메인 공통 패턴: `getList` + `getDetail`
  - 각 도메인별 개별 포트 작성

- [ ] `P5-3` **부가 기능 도메인 전환** — coupon, mileage, review, favorites, alarm, cs, friend, inquiry, notification
  - 각 도메인별 Repository 포트 + 어댑터
  - favorites의 localStorage 의존 → StoragePort 교체
  - Container 등록

---

### Phase 6 — 정리 및 검증

- [ ] `P6-1` **레거시 직접 import 제거**
  - `import { api } from "@/lib/api/client"` → 모든 도메인에서 제거 확인
  - `localStorage`/`sessionStorage` 직접 호출 → 전부 StoragePort 경유 확인
  - 사용하지 않는 파일/export 정리

- [ ] `P6-2` **전체 테스트 + E2E 검증**
  - `pnpm test:run` 전체 통과
  - dev 서버 기동 → 주요 플로우 수동 검증 (홈, 검색, 상세, 예약)
  - 성능 회귀 없음 확인
