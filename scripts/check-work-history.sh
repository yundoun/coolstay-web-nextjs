#!/bin/bash
# check-work-history.sh
# Git pre-commit hook: 작업 히스토리 엔트리 존재 여부 확인
# .work-history/entries/ 에 오늘 날짜의 엔트리가 있는지 체크

HISTORY_DIR=".work-history/entries"
TODAY=$(date +%Y-%m-%d)

# 스테이징된 파일 확인 (히스토리 파일 자체 변경은 제외)
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep -v "^\.work-history/")

# 히스토리 파일만 변경된 경우 통과
if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

# 오늘 날짜의 히스토리 엔트리가 스테이징되어 있는지 확인
STAGED_HISTORY=$(git diff --cached --name-only | grep "^\.work-history/entries/${TODAY}")

if [ -z "$STAGED_HISTORY" ]; then
  echo ""
  echo "============================================"
  echo "  ⚠  작업 히스토리가 없습니다!"
  echo "============================================"
  echo ""
  echo "  커밋 전에 작업 히스토리를 작성해주세요."
  echo ""
  echo "  위치: .work-history/entries/"
  echo "  형식: ${TODAY}_HH-MM_제목.md"
  echo ""
  echo "  --no-verify 로 우회할 수 있지만,"
  echo "  히스토리 기록을 강력히 권장합니다."
  echo ""
  echo "============================================"
  echo ""
  exit 1
fi

exit 0
