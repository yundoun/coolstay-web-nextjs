#!/bin/bash
# dev 서버 배포 스크립트
# 사용: pnpm deploy:dev

set -e

HOST="web@192.168.1.26"
REMOTE_DIR="www/coolstay"
PASS='web1234#$#$'

echo "🔨 빌드 중..."
# API route는 static export와 호환되지 않으므로 빌드 시 임시 제외
API_DIR="src/app/api"
API_BACKUP="/tmp/_coolstay_api_backup"
if [ -d "$API_DIR" ]; then
  rm -rf "$API_BACKUP"
  mv "$API_DIR" "$API_BACKUP"
fi

BUILD_MODE=export \
NEXT_PUBLIC_API_BASE_URL=/web/coolstay/api/v2/mobile \
NEXT_PUBLIC_BASE_PATH=/web/coolstay \
pnpm build
BUILD_EXIT=$?

# API route 복원
if [ -d "$API_BACKUP" ]; then
  mv "$API_BACKUP" "$API_DIR"
fi

if [ $BUILD_EXIT -ne 0 ]; then
  echo "❌ 빌드 실패"
  exit 1
fi

echo "📦 업로드 중..."
# serve.js가 서버에 없을 수 있으므로 (최초 배포, 디렉토리 재생성 등) 먼저 보장
sshpass -p "$PASS" ssh "$HOST" "mkdir -p ~/$REMOTE_DIR"
sshpass -p "$PASS" scp serve.js "$HOST:$REMOTE_DIR/serve.js"
sshpass -p "$PASS" rsync -avz --delete --filter='protect serve.js' --filter='protect /tmp/' out/ "$HOST:$REMOTE_DIR/"

echo "🔄 서버 재시작 중..."
sshpass -p "$PASS" ssh "$HOST" "kill \$(ps aux | grep 'node serve' | grep -v grep | awk '{print \$2}') 2>/dev/null; cd ~/$REMOTE_DIR && nohup node serve.js > /tmp/serve.log 2>&1 &"

echo "✅ 배포 완료: https://dev.pineone.com:20443/web/coolstay/"
