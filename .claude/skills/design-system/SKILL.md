---
name: design-system
description: UI/UX 컴포넌트 구현, 스타일 작성, 디자인 작업 시 Coolstay 디자인 시스템을 확인하고 준수합니다. 컴포넌트, 버튼, 카드, 색상, 타이포그래피, 스페이싱 등 UI 관련 작업에서 자동으로 활성화됩니다.
allowed-tools: Read, Grep, Glob, Edit, Write
---

# Coolstay 디자인 시스템 가이드

UI/UX 구현 시 디자인 시스템과의 일관성을 보장합니다.

## 핵심 파일 위치

### 1. 디자인 정의 (Design Tokens & Guidelines)
- 디자인 시스템 문서: `docs/web-design-system/web-design-system.md`
- 디자인 토큰 JSON: `docs/web-design-system/web-design-tokens.json`
- 전역 스타일: `src/styles/globals.css`

### 2. 구현된 컴포넌트 (UI Components)
- UI 컴포넌트: `src/components/ui/` (button, card, input, dialog 등)
- 도메인 컴포넌트: `src/components/domain/` (숙소 카드, 예약 위젯 등)
- 레이아웃 컴포넌트: `src/components/layout/` (Header, Footer 등)

## 작업 프로세스

### 1단계: 기존 컴포넌트 확인 (먼저!)

UI 작업 전 **반드시** 이미 구현된 컴포넌트가 있는지 확인합니다:

```
Glob src/components/ui/*.tsx
Glob src/components/domain/**/*.tsx
Glob src/components/layout/**/*.tsx
```

**이미 있는 컴포넌트는 재사용합니다. 새로 만들지 않습니다.**

### 2단계: 디자인 토큰 확인

새로운 스타일이 필요하면 디자인 토큰을 참조합니다:

```
Read docs/web-design-system/web-design-system.md
Read docs/web-design-system/web-design-tokens.json
```

### 3단계: 토큰 준수 확인

작업 시 다음 토큰들을 확인하고 준수합니다:

| 항목 | 확인 위치 |
|------|----------|
| 컬러 팔레트 | `colors.brand.primary`, `colors.neutral`, `colors.semantic` |
| 타이포그래피 | `typography.fontSize`, `typography.fontFamily` |
| 스페이싱 | `spacing` (8px 베이스 시스템) |
| 보더 라디우스 | `borderRadius` (sm: 4px, md: 8px, lg: 12px, xl: 16px) |
| 그림자 | `shadows` (card, cardHover, modal 등) |
| 브레이크포인트 | `breakpoints` (sm: 640px, md: 768px, lg: 1024px, xl: 1280px) |
| 트랜지션 | `transitions.duration`, `transitions.easing` |
| 컴포넌트 | `components` (button, input, card, modal 등) |

### 4단계: 구현 검증

#### 디자인 시스템에 있는 경우:

```
✅ [항목명] - 디자인 시스템에서 제공
- 위치: [토큰 경로 또는 컴포넌트 파일 경로]
- 사용법: [Tailwind 클래스 또는 코드 예시]
```

#### 디자인 시스템에 없는 경우:

```
⚠️ [항목명] - 디자인 시스템에 없음

제안:
1. 기존 토큰을 조합하여 구현하는 방법
2. 새 토큰/컴포넌트 추가가 필요한 경우 -> 사용자에게 추가 요청

질문: 이 [항목]을 디자인 시스템에 추가하시겠습니까?
- 추가한다면 어떤 값으로 정의할지 제안드립니다.
```

## 핵심 디자인 원칙

1. **Quiet Luxury** - 절제된 우아함, primary 컬러는 CTA에만
2. **Frictionless** - 최소 클릭으로 목적 달성
3. **Content-First** - 숙소 이미지와 정보가 주인공
4. **Progressive Disclosure** - 필요한 정보를 적시에 노출

## 자주 사용하는 토큰 빠른 참조

### 컬러
- Primary (CTA): `bg-primary-500` (#FFC600)
- 배경: `bg-neutral-50` (라이트), `bg-dark-50` (다크)
- 본문 텍스트: `text-neutral-600`
- 제목: `text-neutral-800`
- 보더: `border-neutral-200`

### 버튼 사이즈
- xs: h-8 px-3 text-xs
- sm: h-10 px-4 text-sm
- md: h-12 px-6 text-base (기본)
- lg: h-14 px-8 text-lg
- xl: h-16 px-10 text-xl

### 스페이싱
- 아이콘-텍스트: `gap-2` (8px)
- 컴포넌트 패딩: `p-4` (16px)
- 카드 패딩: `p-6` (24px)
- 섹션 간격: `py-16` (64px)

### 반응형
- Mobile: 기본
- sm (640px+): 2컬럼
- lg (1024px+): 3컬럼
- xl (1280px+): 4컬럼

## 새 컴포넌트/토큰 추가 요청 시

디자인 시스템에 없는 항목을 발견하면:

1. 먼저 기존 토큰으로 구현 가능한지 검토
2. 불가능하면 사용자에게 다음 형식으로 추가 제안:

```markdown
## 디자인 시스템 추가 제안

**항목**: [컴포넌트/토큰명]
**필요 이유**: [왜 필요한지]
**제안 값**:
- [속성1]: [값]
- [속성2]: [값]

**추가할 파일**:
- `docs/web-design-system/web-design-tokens.json` 의 [경로]
- `docs/web-design-system/web-design-system.md` 의 [섹션]

이 항목을 디자인 시스템에 추가하시겠습니까?
```
