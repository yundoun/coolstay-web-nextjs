#!/bin/bash
#
# ╔══════════════════════════════════════════════════════════╗
# ║  CoolStay 작업 하네스 설치 스크립트                        ║
# ║                                                          ║
# ║  새 기기에서 레포를 클론한 후 한 번만 실행하면 됩니다.        ║
# ║  실행: ./scripts/setup-harness.sh                        ║
# ╚══════════════════════════════════════════════════════════╝
#
# ── 하네스란? ──────────────────────────────────────────────
#
#   작업 추적 자동화 시스템입니다.
#   커밋할 때마다 아래 동작이 자동으로 실행됩니다:
#
#   [pre-commit]
#     1. 오늘 날짜의 작업 히스토리 엔트리(.work-history/entries/)가
#        있는지 확인 → 없으면 커밋 차단
#     2. CHANGELOG.md에 엔트리 자동 추가 + 스테이징
#
#   [post-commit]
#     1. CHANGELOG.md에 커밋 해시 반영
#     2. TASKS.md 진행률 자동 업데이트 (main 제외 모든 브랜치)
#
# ── 구성 파일 ─────────────────────────────────────────────
#
#   레포에 포함 (git pull로 받아짐):
#     TASKS.md                      — 태스크 체크리스트 + 진행률
#     .work-history/CHANGELOG.md    — 전체 변경 이력 (최신순)
#     .work-history/entries/        — 작업별 히스토리 엔트리
#     scripts/task-status.sh        — 프로그레스 바 표시
#     scripts/complete-task.sh      — 태스크 완료 처리
#     scripts/check-work-history.sh — 히스토리 엔트리 확인
#     scripts/append-changelog.sh   — CHANGELOG 자동 추가
#     scripts/update-changelog-hash.sh — 커밋 해시 반영
#     scripts/update-task-progress.sh  — 진행률 업데이트
#
#   이 스크립트가 설치하는 것 (로컬 전용, git에 안 올라감):
#     .git/hooks/pre-commit         — 히스토리 체크 + CHANGELOG
#     .git/hooks/post-commit        — 해시 반영 + 진행률 업데이트
#
# ── 사용법 ────────────────────────────────────────────────
#
#   # 1. 설치
#   ./scripts/setup-harness.sh
#
#   # 2. 작업 시작 전 현황 확인
#   ./scripts/task-status.sh
#
#   # 3. 작업 후 커밋 (히스토리 엔트리 필요)
#   #    엔트리 파일: .work-history/entries/YYYY-MM-DD_HH-MM_제목.md
#   git add . && git commit -m "feat: 작업 내용"
#
#   # 4. 히스토리 없이 급하게 커밋하고 싶을 때 (비권장)
#   git commit --no-verify -m "hotfix: 긴급 수정"
#
# ── 제거 ──────────────────────────────────────────────────
#
#   ./scripts/setup-harness.sh --uninstall
#
#   # 확인 없이 강제 설치 (CI 또는 Claude Code용)
#   ./scripts/setup-harness.sh --force
#
# ──────────────────────────────────────────────────────────

set -e

FORCE=0
for arg in "$@"; do
  case "$arg" in
    --force|-f) FORCE=1 ;;
  esac
done

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOOKS_DIR="$ROOT/.git/hooks"

# 색상
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# ── 제거 모드 ──

if [ "$1" = "--uninstall" ]; then
  echo ""
  echo -e "${YELLOW}▸ 하네스 git hooks 제거 중...${NC}"

  for hook in pre-commit post-commit; do
    if [ -f "$HOOKS_DIR/$hook" ]; then
      # 하네스가 설치한 hook인지 확인
      if grep -q "작업 히스토리" "$HOOKS_DIR/$hook" 2>/dev/null || \
         grep -q "CHANGELOG" "$HOOKS_DIR/$hook" 2>/dev/null; then
        rm "$HOOKS_DIR/$hook"
        echo -e "  ${GREEN}✓${NC} $hook 제거됨"
      else
        echo -e "  ${YELLOW}⚠${NC} $hook — 하네스가 설치한 hook이 아닙니다 (건드리지 않음)"
      fi
    else
      echo -e "  ${CYAN}─${NC} $hook — 이미 없음"
    fi
  done

  echo ""
  echo -e "${GREEN}✓ 하네스 hooks 제거 완료${NC}"
  echo "  레포 내 파일(TASKS.md, .work-history/, scripts/)은 유지됩니다."
  echo ""
  exit 0
fi

# ── 설치 모드 ──

echo ""
echo -e "${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${BOLD}║  CoolStay 작업 하네스 설치            ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""

# .git 존재 확인
if [ ! -d "$ROOT/.git" ]; then
  echo -e "${RED}✗ .git 디렉토리가 없습니다. git 레포 루트에서 실행해주세요.${NC}"
  exit 1
fi

# hooks 디렉토리 확인
mkdir -p "$HOOKS_DIR"

# ── pre-commit hook 설치 ──

PRE_COMMIT="$HOOKS_DIR/pre-commit"

if [ -f "$PRE_COMMIT" ] && [ "$FORCE" -eq 0 ]; then
  echo -e "${YELLOW}▸ pre-commit hook이 이미 존재합니다.${NC}"
  echo -n "  덮어쓸까요? (y/N) "
  read -r answer
  if [ "$answer" != "y" ] && [ "$answer" != "Y" ]; then
    echo "  건너뜀"
    SKIP_PRE=1
  fi
fi

if [ -z "$SKIP_PRE" ]; then
  cat > "$PRE_COMMIT" << 'HOOK'
#!/bin/bash
# Pre-commit hook: 작업 히스토리 체크 → CHANGELOG 자동 추가

ROOT=$(git rev-parse --show-toplevel)

# 1. 히스토리 엔트리 존재 확인
"$ROOT/scripts/check-work-history.sh"
if [ $? -ne 0 ]; then
  exit 1
fi

# 2. CHANGELOG.md에 엔트리 추가 + 스테이징
"$ROOT/scripts/append-changelog.sh"

exit 0
HOOK
  chmod +x "$PRE_COMMIT"
  echo -e "  ${GREEN}✓${NC} pre-commit hook 설치됨"
fi

# ── post-commit hook 설치 ──

POST_COMMIT="$HOOKS_DIR/post-commit"

if [ -f "$POST_COMMIT" ] && [ "$FORCE" -eq 0 ]; then
  echo -e "${YELLOW}▸ post-commit hook이 이미 존재합니다.${NC}"
  echo -n "  덮어쓸까요? (y/N) "
  read -r answer
  if [ "$answer" != "y" ] && [ "$answer" != "Y" ]; then
    echo "  건너뜀"
    SKIP_POST=1
  fi
fi

if [ -z "$SKIP_POST" ]; then
  cat > "$POST_COMMIT" << 'HOOK'
#!/bin/bash
# Post-commit hook: CHANGELOG에 커밋 해시 반영 + 태스크 진행률 업데이트

ROOT="$(git rev-parse --show-toplevel)"

# 1. CHANGELOG 커밋 해시 반영
"$ROOT/scripts/update-changelog-hash.sh"

# 2. 태스크 진행률 업데이트 (main 제외 모든 브랜치)
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ] && [ -f "$ROOT/TASKS.md" ]; then
  "$ROOT/scripts/update-task-progress.sh"

  # TASKS.md가 변경되었으면 amend에 포함
  if ! git diff --quiet "$ROOT/TASKS.md" 2>/dev/null; then
    git add "$ROOT/TASKS.md"
    git commit --amend --no-edit --no-verify >/dev/null 2>&1
  fi
fi
HOOK
  chmod +x "$POST_COMMIT"
  echo -e "  ${GREEN}✓${NC} post-commit hook 설치됨"
fi

# ── scripts 실행 권한 확인 ──

echo ""
echo -e "${CYAN}▸ scripts 실행 권한 확인...${NC}"
for script in "$ROOT"/scripts/*.sh; do
  if [ ! -x "$script" ]; then
    chmod +x "$script"
    echo -e "  ${GREEN}✓${NC} chmod +x $(basename "$script")"
  fi
done
echo -e "  ${GREEN}✓${NC} 모든 스크립트 실행 가능"

# ── .work-history 디렉토리 확인 ──

mkdir -p "$ROOT/.work-history/entries"

# ── 완료 ──

echo ""
echo -e "${GREEN}${BOLD}✓ 하네스 설치 완료!${NC}"
echo ""
echo -e "  ${BOLD}사용법:${NC}"
echo -e "  ${CYAN}./scripts/task-status.sh${NC}         현재 태스크 현황 확인"
echo -e "  ${CYAN}./scripts/complete-task.sh ID${NC}    태스크 완료 처리"
echo ""
echo -e "  ${BOLD}커밋 시 자동 동작:${NC}"
echo -e "  • 히스토리 엔트리 없으면 커밋 차단 (--no-verify로 우회 가능)"
echo -e "  • CHANGELOG.md 자동 업데이트"
echo -e "  • TASKS.md 진행률 자동 업데이트 (피처 브랜치)"
echo ""
echo -e "  ${BOLD}제거:${NC}"
echo -e "  ${CYAN}./scripts/setup-harness.sh --uninstall${NC}"
echo ""
