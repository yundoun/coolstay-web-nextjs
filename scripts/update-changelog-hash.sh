#!/bin/bash
# update-changelog-hash.sh
# Git post-commit hook: CHANGELOG.md의 "[엔트리]" 링크에 커밋 해시 추가
# pre-commit에서 해시 없이 기록된 엔트리를 실제 해시로 교체

CHANGELOG=".work-history/CHANGELOG.md"
COMMIT_HASH=$(git rev-parse --short HEAD)

if [ ! -f "$CHANGELOG" ]; then
  exit 0
fi

# "[엔트리]" 텍스트가 있으면 커밋 해시로 교체
if grep -q '\[엔트리\]' "$CHANGELOG"; then
  sed -i '' "s/\[엔트리\]/[\`${COMMIT_HASH}\`]/g" "$CHANGELOG"

  # 변경된 CHANGELOG를 amend (--no-verify로 무한루프 방지)
  git add "$CHANGELOG"
  git commit --amend --no-edit --no-verify >/dev/null 2>&1

  echo "[work-history] CHANGELOG 커밋 해시 업데이트: ${COMMIT_HASH}"
fi

exit 0
