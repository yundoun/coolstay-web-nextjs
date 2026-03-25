#!/bin/bash
# task-status.sh
# 현재 태스크 진행 상황 표시
#
# 사용법: ./scripts/task-status.sh [phase]
# 예시:   ./scripts/task-status.sh        (전체)
#         ./scripts/task-status.sh 1      (Phase 1만)

ROOT=$(git rev-parse --show-toplevel)
TASKS_FILE="$ROOT/TASKS.md"
PHASE_FILTER="$1"

if [ ! -f "$TASKS_FILE" ]; then
  echo "TASKS.md 파일이 없습니다."
  exit 1
fi

# grep -c 래퍼: 매치 0일 때도 안전하게 숫자만 반환
count_tasks() {
  local pattern="$1"
  local result
  result=$(grep -c "$pattern" "$TASKS_FILE" 2>/dev/null)
  if [ $? -ne 0 ] || [ -z "$result" ]; then
    echo 0
  else
    echo "$result"
  fi
}

echo ""
echo "══════════════════════════════════════════"
echo "  CoolStay 웹 — Android 기능 정합 현황"
echo "  브랜치: $(git branch --show-current)"
echo "══════════════════════════════════════════"
echo ""

show_phase() {
  local phase_num="$1"
  local phase_name="$2"

  local total=$(count_tasks "^\- \[[ x]\] \`P${phase_num}")
  local done=$(count_tasks "^\- \[x\] \`P${phase_num}")
  local remaining=$((total - done))

  # 프로그레스 바
  local bar=""
  if [ "$total" -gt 0 ]; then
    local filled=$((done * 20 / total))
    local empty=$((20 - filled))
    local i=0
    while [ $i -lt $filled ]; do bar="${bar}█"; i=$((i+1)); done
    i=0
    while [ $i -lt $empty ]; do bar="${bar}░"; i=$((i+1)); done
  else
    bar="░░░░░░░░░░░░░░░░░░░░"
  fi

  echo "  ${phase_name}"
  echo "  ${bar} ${done}/${total}"
  echo ""

  # 미완료 태스크 목록
  if [ "$remaining" -gt 0 ]; then
    grep "^\- \[ \] \`P${phase_num}" "$TASKS_FILE" | while read -r line; do
      local id=$(echo "$line" | grep -oE 'P[0-9]-[0-9]+')
      local desc=$(echo "$line" | sed 's/.*`P[0-9]*-[0-9]*` //')
      echo "    ⬚ ${id}: ${desc}"
    done
  fi

  # 완료 태스크 목록
  grep "^\- \[x\] \`P${phase_num}" "$TASKS_FILE" 2>/dev/null | while read -r line; do
    local id=$(echo "$line" | grep -oE 'P[0-9]-[0-9]+')
    local desc=$(echo "$line" | sed "s/.*\`P[0-9]-[0-9]\+\` //")
    echo "    ✅ ${id}: ${desc}"
  done

  echo ""
}

if [ -z "$PHASE_FILTER" ]; then
  # 전체 진행률
  TOTAL=$(count_tasks '^\- \[[ x]\] `P')
  DONE=$(count_tasks '^\- \[x\] `P')
  if [ "$TOTAL" -gt 0 ]; then
    PERCENT=$(( DONE * 100 / TOTAL ))
  else
    PERCENT=0
  fi
  echo "  전체 진행률: ${DONE}/${TOTAL} (${PERCENT}%)"
  echo ""

  show_phase 1 "Phase 1: 정리 (제거 + 수정)"
  show_phase 2 "Phase 2: 핵심 플로우 완성 (🔴)"
  show_phase 3 "Phase 3: 기능 보강 (🟠)"
  show_phase 4 "Phase 4: 서브 페이지 확충 (🟡)"
else
  case "$PHASE_FILTER" in
    1) show_phase 1 "Phase 1: 정리 (제거 + 수정)" ;;
    2) show_phase 2 "Phase 2: 핵심 플로우 완성 (🔴)" ;;
    3) show_phase 3 "Phase 3: 기능 보강 (🟠)" ;;
    4) show_phase 4 "Phase 4: 서브 페이지 확충 (🟡)" ;;
    *) echo "  Phase 1~4 중 선택하세요" ;;
  esac
fi

echo "══════════════════════════════════════════"
echo ""
