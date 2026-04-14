# deploy 스크립트 rsync --delete에서 serve.js 보호

## 문제
- rsync `--exclude='serve.js'`는 전송만 제외하고 `--delete` 시 서버의 serve.js 삭제를 막지 못함
- 수동 배포 시 serve.js가 삭제되어 503 발생

## 수정
- `--filter='protect serve.js'`로 변경 — 전송 제외 + 삭제 보호
- `/tmp/` 디렉토리도 보호 추가

## 변경 파일
- `scripts/deploy-dev.sh`
