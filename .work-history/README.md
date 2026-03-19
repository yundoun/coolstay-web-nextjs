# Work History

작업 히스토리를 기록하는 디렉토리입니다.

## 구조

```
.work-history/
├── README.md          # 이 파일
├── CHANGELOG.md       # 전체 변경 히스토리 (최신순)
└── entries/           # 개별 히스토리 엔트리
    └── YYYY-MM-DD_HH-MM_제목.md
```

## 히스토리 엔트리 형식

각 엔트리는 다음 구조를 따릅니다:

```markdown
# [제목]
- **날짜**: YYYY-MM-DD HH:MM
- **작업 유형**: feature | refactor | bugfix | setup | migration
- **영향 범위**: 변경된 주요 디렉토리/파일

## 변경 사항
- 무엇을 했는지

## 기술적 결정
- 왜 이렇게 했는지

## 다음 단계
- 이후 해야 할 작업
```

## Git Hook

`post-commit` 훅을 통해 커밋 시 히스토리 엔트리가 없으면 경고합니다.
`prepare-commit-msg` 훅을 통해 커밋 메시지에 히스토리 참조를 추가합니다.
