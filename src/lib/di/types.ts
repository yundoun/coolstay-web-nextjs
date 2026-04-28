import type { HttpClient } from "@/lib/ports/HttpClient"
import type { TokenManager } from "@/lib/ports/TokenManager"
import type { StoragePort } from "@/lib/ports/Storage"
import type { BookingRepository } from "@/domains/booking/ports/BookingRepository"
import type { HomeRepository } from "@/domains/home/ports/HomeRepository"
import type { SearchRepository } from "@/domains/search/ports/SearchRepository"
import type { AccommodationRepository } from "@/domains/accommodation/ports/AccommodationRepository"
import type { AuthRepository } from "@/domains/auth/ports/AuthRepository"
import type { MypageRepository } from "@/domains/mypage/ports/MypageRepository"
import type { SettingsRepository } from "@/domains/settings/ports/SettingsRepository"
import type { EventRepository } from "@/domains/event/ports/EventRepository"
import type { ExhibitionRepository } from "@/domains/exhibition/ports/ExhibitionRepository"
import type { MagazineRepository } from "@/domains/magazine/ports/MagazineRepository"
import type { TermsRepository } from "@/domains/terms/ports/TermsRepository"
import type { CouponRepository } from "@/domains/coupon/ports/CouponRepository"
import type { MileageRepository } from "@/domains/mileage/ports/MileageRepository"
import type { ReviewRepository } from "@/domains/review/ports/ReviewRepository"
import type { AlarmRepository } from "@/domains/alarm/ports/AlarmRepository"
import type { CsRepository } from "@/domains/cs/ports/CsRepository"
import type { FriendRepository } from "@/domains/friend/ports/FriendRepository"

/**
 * DI 컨테이너 인터페이스
 *
 * 인프라 포트 + 모든 도메인 Repository를 보유한다.
 */
export interface Container {
  // 인프라
  httpClient: HttpClient
  tokenManager: TokenManager
  storage: StoragePort
  // 도메인 Repository
  bookingRepository: BookingRepository
  homeRepository: HomeRepository
  searchRepository: SearchRepository
  accommodationRepository: AccommodationRepository
  authRepository: AuthRepository
  mypageRepository: MypageRepository
  settingsRepository: SettingsRepository
  eventRepository: EventRepository
  exhibitionRepository: ExhibitionRepository
  magazineRepository: MagazineRepository
  termsRepository: TermsRepository
  couponRepository: CouponRepository
  mileageRepository: MileageRepository
  reviewRepository: ReviewRepository
  alarmRepository: AlarmRepository
  csRepository: CsRepository
  friendRepository: FriendRepository
}
