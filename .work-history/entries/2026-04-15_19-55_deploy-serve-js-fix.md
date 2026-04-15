# deploy 스크립트 serve.js 누락 수정

## 변경 사항
- rsync 실행 전 `mkdir -p`로 원격 디렉토리 보장
- `scp`로 serve.js를 사전 업로드하여 최초 배포 시에도 누락되지 않도록 수정

## 수정 파일
- `scripts/deploy-dev.sh`
