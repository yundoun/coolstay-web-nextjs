# CHANGELOG 커밋 훅 수정

## 작업 내용
- CHANGELOG.md가 커밋에 누락되는 문제 수정
- pre-commit에서 CHANGELOG 업데이트 + 스테이징하여 같은 커밋에 포함
- post-commit에서 커밋 해시를 CHANGELOG에 반영 (amend)
- 날짜+시간(HH:MM) 형식 적용

## 변경 파일
- scripts/append-changelog.sh — pre-commit 단계에서 CHANGELOG 추가+스테이징
- scripts/update-changelog-hash.sh — post-commit에서 해시 반영 (신규)
