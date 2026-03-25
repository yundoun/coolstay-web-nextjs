#!/bin/bash
# task-status.sh
# 현재 태스크 진행 상황 표시 (범용)
#
# 사용법: ./scripts/task-status.sh [섹션번호]
# 예시:   ./scripts/task-status.sh        (전체)
#         ./scripts/task-status.sh 1      (첫 번째 섹션만)

ROOT=$(git rev-parse --show-toplevel)
TASKS_FILE="$ROOT/TASKS.md"
SECTION_FILTER="$1"

if [ ! -f "$TASKS_FILE" ]; then
  echo ""
  echo "  TASKS.md 파일이 없습니다."
  echo "  브랜치 작업 시작 시 TASKS.md를 생성하세요."
  echo ""
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
echo "  CoolStay 웹 — 태스크 현황"
echo "  브랜치: $(git branch --show-current)"
echo "══════════════════════════════════════════"
echo ""

# TASKS.md에서 ### 섹션 헤더 추출
SECTIONS=()
while IFS= read -r line; do
  SECTIONS+=("$line")
done < <(grep '^### ' "$TASKS_FILE" | sed 's/^### //')

show_section() {
  local section_idx="$1"
  local section_name="$2"

  # 섹션 내 태스크 추출 (해당 섹션 ~ 다음 섹션 사이)
  local start_line end_line
  start_line=$(grep -n "^### ${section_name}$" "$TASKS_FILE" | head -1 | cut -d: -f1)
  if [ -z "$start_line" ]; then return; fi

  # 다음 섹션 시작 또는 파일 끝
  end_line=$(awk "NR > $start_line && /^### /{print NR; exit}" "$TASKS_FILE")
  if [ -z "$end_line" ]; then
    end_line=$(wc -l < "$TASKS_FILE")
  fi

  local section_content
  section_content=$(sed -n "${start_line},${end_line}p" "$TASKS_FILE")

  local total done_count remaining
  total=$(echo "$section_content" | grep -c '^\- \[[ x]\] `' 2>/dev/null)
  [ -z "$total" ] && total=0
  done_count=$(echo "$section_content" | grep -c '^\- \[x\] `' 2>/dev/null)
  [ -z "$done_count" ] && done_count=0
  remaining=$((total - done_count))

  # 프로그레스 바
  local bar=""
  if [ "$total" -gt 0 ]; then
    local filled=$((done_count * 20 / total))
    local empty=$((20 - filled))
    local i=0
    while [ $i -lt $filled ]; do bar="${bar}█"; i=$((i+1)); done
    i=0
    while [ $i -lt $empty ]; do bar="${bar}░"; i=$((i+1)); done
  else
    bar="░░░░░░░░░░░░░░░░░░░░"
  fi

  echo "  ${section_name}"
  echo "  ${bar} ${done_count}/${total}"
  echo ""

  # 미완료 태스크 목록
  if [ "$remaining" -gt 0 ]; then
    echo "$section_content" | grep '^\- \[ \] `' | while read -r line; do
      local id=$(echo "$line" | grep -oE '`[^`]+`' | head -1 | tr -d '`')
      local desc=$(echo "$line" | sed 's/.*` //')
      echo "    ⬚ ${id}: ${desc}"
    done
  fi

  # 완료 태스크 목록
  echo "$section_content" | grep '^\- \[x\] `' 2>/dev/null | while read -r line; do
    local id=$(echo "$line" | grep -oE '`[^`]+`' | head -1 | tr -d '`')
    local desc=$(echo "$line" | sed 's/.*` //')
    echo "    ✅ ${id}: ${desc}"
  done

  echo ""
}

# 전체 진행률
TOTAL=$(count_tasks '^\- \[[ x]\] `')
DONE=$(count_tasks '^\- \[x\] `')
if [ "$TOTAL" -gt 0 ]; then
  PERCENT=$(( DONE * 100 / TOTAL ))
else
  PERCENT=0
fi
echo "  전체 진행률: ${DONE}/${TOTAL} (${PERCENT}%)"
echo ""

if [ ${#SECTIONS[@]} -eq 0 ]; then
  # 섹션 없이 플랫 리스트인 경우
  grep '^\- \[ \] `' "$TASKS_FILE" | while read -r line; do
    local id=$(echo "$line" | grep -oE '`[^`]+`' | head -1 | tr -d '`')
    local desc=$(echo "$line" | sed 's/.*` //')
    echo "    ⬚ ${id}: ${desc}"
  done
  grep '^\- \[x\] `' "$TASKS_FILE" 2>/dev/null | while read -r line; do
    local id=$(echo "$line" | grep -oE '`[^`]+`' | head -1 | tr -d '`')
    local desc=$(echo "$line" | sed 's/.*` //')
    echo "    ✅ ${id}: ${desc}"
  done
else
  if [ -z "$SECTION_FILTER" ]; then
    for i in "${!SECTIONS[@]}"; do
      show_section "$i" "${SECTIONS[$i]}"
    done
  else
    local idx=$((SECTION_FILTER - 1))
    if [ "$idx" -ge 0 ] && [ "$idx" -lt ${#SECTIONS[@]} ]; then
      show_section "$idx" "${SECTIONS[$idx]}"
    else
      echo "  섹션 1~${#SECTIONS[@]} 중 선택하세요"
    fi
  fi
fi

echo "══════════════════════════════════════════"
echo ""
