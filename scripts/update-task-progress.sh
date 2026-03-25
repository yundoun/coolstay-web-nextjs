#!/bin/bash
# update-task-progress.sh
# 커밋 후 TASKS.md 진행률을 자동 업데이트
# post-commit hook에서 호출

TASKS_FILE="$(git rev-parse --show-toplevel)/TASKS.md"

if [ ! -f "$TASKS_FILE" ]; then
  exit 0
fi

# grep -c 래퍼: 매치 0일 때도 안전하게 숫자만 반환
count_grep() {
  local result
  result=$(grep -c "$1" "$TASKS_FILE" 2>/dev/null)
  if [ $? -ne 0 ] || [ -z "$result" ]; then
    echo 0
  else
    echo "$result"
  fi
}

TOTAL=$(count_grep '^\- \[[ x]\] `')
DONE=$(count_grep '^\- \[x\] `')

if [ "$TOTAL" -eq 0 ]; then
  exit 0
fi

PERCENT=$(( DONE * 100 / TOTAL ))

# 진행률 라인 업데이트
sed -i '' "s|> \*\*진행률\*\*: .*|> **진행률**: ${DONE} / ${TOTAL} (${PERCENT}%)|" "$TASKS_FILE"

# 섹션별 완료 상태 출력
echo ""
echo "┌──────────────────────────────────────┐"
echo "│  📋 태스크 진행률: ${DONE}/${TOTAL} (${PERCENT}%)"

# 섹션 헤더가 있으면 섹션별 통계 표시
SECTIONS=$(grep '^### ' "$TASKS_FILE" | sed 's/^### //')
if [ -n "$SECTIONS" ]; then
  echo "│──────────────────────────────────────│"
  while IFS= read -r section; do
    start_line=$(grep -n "^### ${section}$" "$TASKS_FILE" | head -1 | cut -d: -f1)
    end_line=$(awk "NR > $start_line && /^### /{print NR; exit}" "$TASKS_FILE")
    if [ -z "$end_line" ]; then
      end_line=$(wc -l < "$TASKS_FILE")
    fi
    content=$(sed -n "${start_line},${end_line}p" "$TASKS_FILE")
    s_total=$(echo "$content" | grep -c '^\- \[[ x]\] `' 2>/dev/null || echo 0)
    s_done=$(echo "$content" | grep -c '^\- \[x\] `' 2>/dev/null || echo 0)
    printf "│  %-20s %d/%d\n" "${section}:" "$s_done" "$s_total"
  done <<< "$SECTIONS"
fi

echo "└──────────────────────────────────────┘"
echo ""

# 변경사항이 있으면 스테이징
if ! git diff --quiet "$TASKS_FILE" 2>/dev/null; then
  git add "$TASKS_FILE"
fi
