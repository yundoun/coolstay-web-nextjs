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

TOTAL=$(count_grep '^\- \[[ x]\] `P')
DONE=$(count_grep '^\- \[x\] `P')

if [ "$TOTAL" -eq 0 ]; then
  exit 0
fi

PERCENT=$(( DONE * 100 / TOTAL ))

# 진행률 라인 업데이트
sed -i '' "s|> \*\*진행률\*\*: .*|> **진행률**: ${DONE} / ${TOTAL} (${PERCENT}%)|" "$TASKS_FILE"

# Phase별 완료 상태 출력
P1_TOTAL=$(count_grep '^\- \[[ x]\] `P1')
P1_DONE=$(count_grep '^\- \[x\] `P1')
P2_TOTAL=$(count_grep '^\- \[[ x]\] `P2')
P2_DONE=$(count_grep '^\- \[x\] `P2')
P3_TOTAL=$(count_grep '^\- \[[ x]\] `P3')
P3_DONE=$(count_grep '^\- \[x\] `P3')
P4_TOTAL=$(count_grep '^\- \[[ x]\] `P4')
P4_DONE=$(count_grep '^\- \[x\] `P4')

echo ""
echo "┌──────────────────────────────────────┐"
echo "│  📋 태스크 진행률: ${DONE}/${TOTAL} (${PERCENT}%)"
echo "│──────────────────────────────────────│"
echo "│  Phase 1 정리:    ${P1_DONE}/${P1_TOTAL}"
echo "│  Phase 2 핵심:    ${P2_DONE}/${P2_TOTAL}"
echo "│  Phase 3 보강:    ${P3_DONE}/${P3_TOTAL}"
echo "│  Phase 4 서브:    ${P4_DONE}/${P4_TOTAL}"
echo "└──────────────────────────────────────┘"
echo ""

# 변경사항이 있으면 스테이징 (amend에 포함)
if ! git diff --quiet "$TASKS_FILE" 2>/dev/null; then
  git add "$TASKS_FILE"
fi
