# P4: 주요 도메인 전환 (home, search, accommodation)

## 변경 사항

### 포트
- `src/domains/home/ports/HomeRepository.ts` — getMain, getRegionStores
- `src/domains/search/ports/SearchRepository.ts` — 9개 메서드 (contents + keyword 통합)
- `src/domains/accommodation/ports/AccommodationRepository.ts` — getDetail, getImages, getDailyBookStatus, getRefundPolicy

### 어댑터
- `src/domains/home/adapters/ApiHomeRepository.ts`
- `src/domains/search/adapters/ApiSearchRepository.ts`
- `src/domains/accommodation/adapters/ApiAccommodationRepository.ts`

### Container 등록
- `di/types.ts` + `container.ts`에 homeRepository, searchRepository, accommodationRepository 추가

## 테스트
- 3개 테스트 파일, 13 cases 전체 통과
