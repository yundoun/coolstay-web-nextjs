# fix: 설정 페이지 로그아웃 import 오류 수정

useAuth → useAuthStore로 import 경로 수정. 존재하지 않는 export를 참조하여 클라이언트 에러 발생하던 문제 해결.
