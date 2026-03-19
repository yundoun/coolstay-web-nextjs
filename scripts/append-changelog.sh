#!/bin/bash
# append-changelog.sh
# Git post-commit hook: 새 히스토리 엔트리를 CHANGELOG.md에 자동 추가

HISTORY_DIR=".work-history/entries"
CHANGELOG=".work-history/CHANGELOG.md"

# 이 커밋에서 추가된 히스토리 엔트리 찾기
NEW_ENTRIES=$(git diff HEAD~1 --name-only --diff-filter=A 2>/dev/null | grep "^${HISTORY_DIR}/.*\.md$")

if [ -z "$NEW_ENTRIES" ]; then
  exit 0
fi

for entry in $NEW_ENTRIES; do
  if [ -f "$entry" ]; then
    TITLE=$(head -1 "$entry" | sed 's/^# //')
    DATE=$(echo "$entry" | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}')
    COMMIT_HASH=$(git rev-parse --short HEAD)

    # CHANGELOG.md 끝에 엔트리 추가 (--- 마커 뒤에)
    ENTRY_LINE="- **${DATE}** | ${TITLE} | [\`${COMMIT_HASH}\`](${entry})"

    # "---" 줄 바로 뒤에 삽입
    if grep -q "^---$" "$CHANGELOG"; then
      # macOS sed compatibility
      sed -i '' "/^---$/a\\
${ENTRY_LINE}
" "$CHANGELOG"
    fi

    echo "[work-history] 히스토리 기록 완료: ${TITLE}"
  fi
done
