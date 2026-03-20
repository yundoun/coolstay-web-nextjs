#!/bin/bash
# append-changelog.sh
# Git pre-commit 단계에서 호출: 새 히스토리 엔트리를 CHANGELOG.md에 추가하고 함께 스테이징

HISTORY_DIR=".work-history/entries"
CHANGELOG=".work-history/CHANGELOG.md"

# 이 커밋에서 스테이징된 새 히스토리 엔트리 찾기
NEW_ENTRIES=$(git diff --cached --name-only --diff-filter=A 2>/dev/null | grep "^${HISTORY_DIR}/.*\.md$")

if [ -z "$NEW_ENTRIES" ]; then
  exit 0
fi

# 현재 시각 (HH:MM)
CURRENT_TIME=$(date +%H:%M)

for entry in $NEW_ENTRIES; do
  if [ -f "$entry" ]; then
    TITLE=$(head -1 "$entry" | sed 's/^# //')
    DATE=$(echo "$entry" | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}')
    # pre-commit 단계이므로 커밋 해시는 아직 없음 — 커밋 후 post-commit에서 업데이트
    ENTRY_LINE="- **${DATE} ${CURRENT_TIME}** | ${TITLE} | [엔트리](${entry})"

    # "---" 줄 바로 뒤에 삽입
    if grep -q "^---$" "$CHANGELOG"; then
      sed -i '' "/^---$/a\\
${ENTRY_LINE}
" "$CHANGELOG"
    fi
  fi
done

# CHANGELOG.md를 스테이징에 추가 → 같은 커밋에 포함됨
git add "$CHANGELOG"

exit 0
