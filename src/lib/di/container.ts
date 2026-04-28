import type { Container } from "./types"
import { ApiTokenManager } from "@/lib/adapters/ApiTokenManager"
import { FetchHttpClient } from "@/lib/adapters/FetchHttpClient"
import { LocalStorageAdapter } from "@/lib/adapters/LocalStorageAdapter"
import { ApiBookingRepository } from "@/domains/booking/adapters/ApiBookingRepository"
import { ApiHomeRepository } from "@/domains/home/adapters/ApiHomeRepository"
import { ApiSearchRepository } from "@/domains/search/adapters/ApiSearchRepository"
import { ApiAccommodationRepository } from "@/domains/accommodation/adapters/ApiAccommodationRepository"
import { ApiAuthRepository } from "@/domains/auth/adapters/ApiAuthRepository"
import { ApiMypageRepository } from "@/domains/mypage/adapters/ApiMypageRepository"
import { ApiSettingsRepository } from "@/domains/settings/adapters/ApiSettingsRepository"
import { ApiEventRepository } from "@/domains/event/adapters/ApiEventRepository"
import { ApiExhibitionRepository } from "@/domains/exhibition/adapters/ApiExhibitionRepository"
import { ApiMagazineRepository } from "@/domains/magazine/adapters/ApiMagazineRepository"
import { ApiTermsRepository } from "@/domains/terms/adapters/ApiTermsRepository"
import { ApiCouponRepository } from "@/domains/coupon/adapters/ApiCouponRepository"
import { ApiMileageRepository } from "@/domains/mileage/adapters/ApiMileageRepository"
import { ApiReviewRepository } from "@/domains/review/adapters/ApiReviewRepository"
import { ApiAlarmRepository } from "@/domains/alarm/adapters/ApiAlarmRepository"
import { ApiCsRepository } from "@/domains/cs/adapters/ApiCsRepository"
import { ApiFriendRepository } from "@/domains/friend/adapters/ApiFriendRepository"

/** 기본 Container 생성 — 실제 API + localStorage 사용 */
export function createDefaultContainer(): Container {
  const tokenManager = new ApiTokenManager()
  const httpClient = new FetchHttpClient(tokenManager)
  const storage = new LocalStorageAdapter()

  return {
    httpClient,
    tokenManager,
    storage,
    bookingRepository: new ApiBookingRepository(httpClient),
    homeRepository: new ApiHomeRepository(httpClient),
    searchRepository: new ApiSearchRepository(httpClient),
    accommodationRepository: new ApiAccommodationRepository(httpClient),
    authRepository: new ApiAuthRepository(httpClient),
    mypageRepository: new ApiMypageRepository(httpClient),
    settingsRepository: new ApiSettingsRepository(httpClient),
    eventRepository: new ApiEventRepository(httpClient),
    exhibitionRepository: new ApiExhibitionRepository(httpClient),
    magazineRepository: new ApiMagazineRepository(httpClient),
    termsRepository: new ApiTermsRepository(httpClient),
    couponRepository: new ApiCouponRepository(httpClient),
    mileageRepository: new ApiMileageRepository(httpClient),
    reviewRepository: new ApiReviewRepository(httpClient),
    alarmRepository: new ApiAlarmRepository(httpClient),
    csRepository: new ApiCsRepository(httpClient),
    friendRepository: new ApiFriendRepository(httpClient),
  }
}

/** 싱글톤 기본 컨테이너 */
export const defaultContainer = createDefaultContainer()
