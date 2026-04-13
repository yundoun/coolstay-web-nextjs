#!/bin/bash
# dev 서버 배포 스크립트
# 사용: pnpm deploy:dev

set -e

HOST="web@192.168.1.26"
REMOTE_DIR="www/coolstay"
PASS='web1234#$#$'

echo "🔨 빌드 중..."
BUILD_MODE=export \
NEXT_PUBLIC_API_BASE_URL=/web/coolstay/api/v2/mobile \
NEXT_PUBLIC_BASE_PATH=/web/coolstay \
pnpm build

echo "📦 업로드 중..."
sshpass -p "$PASS" rsync -avz --delete --exclude='serve.js' out/ "$HOST:$REMOTE_DIR/"

echo "🔄 서버 재시작 중..."
sshpass -p "$PASS" ssh "$HOST" "kill \$(ps aux | grep 'node serve' | grep -v grep | awk '{print \$2}') 2>/dev/null; cd ~/$REMOTE_DIR && nohup node serve.js > /tmp/serve.log 2>&1 &"

echo "✅ 배포 완료: https://dev.pineone.com:20443/web/coolstay/"
