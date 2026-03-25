#!/bin/bash
# complete-task.sh
# 태스크 완료 처리: 체크박스 체크 + 히스토리 엔트리 자동 생성
#
# 사용법: ./scripts/complete-task.sh UI-1 "헤더 네비게이션 개선"

TASK_ID="$1"
TASK_TITLE="$2"

if [ -z "$TASK_ID" ] || [ -z "$TASK_TITLE" ]; then
  echo ""
  echo "사용법: ./scripts/complete-task.sh <태스크ID> <제목>"
  echo "예시:   ./scripts/complete-task.sh UI-1 \"헤더 네비게이션 개선\""
  echo ""
  exit 1
fi

ROOT=$(git rev-parse --show-toplevel)
TASKS_FILE="$ROOT/TASKS.md"
HISTORY_DIR="$ROOT/.work-history/entries"
TODAY=$(date +%Y-%m-%d)
TIME=$(date +%H-%M)
SAFE_TITLE=$(echo "$TASK_TITLE" | tr ' ' '-' | tr -cd '[:alnum:]-_')

# TASKS.md 존재 확인
if [ ! -f "$TASKS_FILE" ]; then
  echo "❌ TASKS.md 파일이 없습니다"
  exit 1
fi

# 히스토리 디렉토리 확인
mkdir -p "$HISTORY_DIR"

# 1. TASKS.md에서 해당 태스크 체크
if grep -q "\`${TASK_ID}\`" "$TASKS_FILE"; then
  sed -i '' "s/- \[ \] \`${TASK_ID}\`/- [x] \`${TASK_ID}\`/" "$TASKS_FILE"
  echo "✅ ${TASK_ID} 완료 체크"
else
  echo "❌ ${TASK_ID}를 TASKS.md에서 찾을 수 없습니다"
  exit 1
fi

# 2. 해당 태스크가 속한 섹션 찾기
SECTION=$(awk "/^### /{section=\$0} /\`${TASK_ID}\`/{print section; exit}" "$TASKS_FILE" | sed 's/^### //')
if [ -z "$SECTION" ]; then
  SECTION="(섹션 없음)"
fi

# 3. 히스토리 엔트리 생성
ENTRY_FILE="${HISTORY_DIR}/${TODAY}_${TIME}_${TASK_ID}_${SAFE_TITLE}.md"

cat > "$ENTRY_FILE" << EOF
# [${TASK_ID}] ${TASK_TITLE}

## 작업 내용
- (커밋 전에 작업 내용을 작성하세요)

## 변경 파일
- (변경된 파일 목록)

## 섹션
- ${SECTION}
EOF

echo "📝 히스토리 엔트리 생성: $(basename $ENTRY_FILE)"
echo ""
echo "다음 단계:"
echo "  1. 히스토리 엔트리 내용을 작성하세요: $ENTRY_FILE"
echo "  2. git add + git commit"
echo ""
