# Figma Tokens 사용 가이드

Coolstay 웹 디자인 시스템을 Figma로 가져오는 방법입니다.

## 1. Tokens Studio for Figma 플러그인 설치

1. Figma를 열고 **Plugins > Browse plugins in Community** 클릭
2. "Tokens Studio for Figma" 검색 (구 Figma Tokens)
3. **Install** 클릭

## 2. 토큰 파일 가져오기

### 방법 A: 파일 직접 Import

1. Figma에서 **Plugins > Tokens Studio for Figma** 실행
2. 좌측 하단 **Settings (톱니바퀴)** 클릭
3. **Import** > **Import from file** 선택
4. `docs/web-design-system/figma-tokens.json` 파일 선택
5. **Import** 클릭

### 방법 B: JSON 복사/붙여넣기

1. Tokens Studio 플러그인 실행
2. Settings > **Import** > **Import from JSON**
3. `figma-tokens.json` 파일 내용 전체 복사 후 붙여넣기

## 3. 토큰 세트 활성화

Import 후 다음 3개의 토큰 세트가 표시됩니다:

| 세트 | 설명 |
|------|------|
| `global` | 모든 기본 토큰 (색상 팔레트, 타이포그래피, 스페이싱) |
| `light` | 라이트 모드 시맨틱 색상 |
| `dark` | 다크 모드 시맨틱 색상 |

**사용법:**
- 라이트 모드: `global` + `light` 활성화
- 다크 모드: `global` + `dark` 활성화

## 4. Figma에서 토큰 적용하기

### 색상 적용
1. 오브젝트 선택
2. Tokens Studio 패널에서 원하는 색상 토큰 클릭
3. **Fill** 또는 **Stroke**로 적용

### 타이포그래피 적용
1. 텍스트 레이어 선택
2. Typography 섹션에서 토큰 클릭
3. 폰트 크기, 행간 등 자동 적용

### 스페이싱 적용
1. 오브젝트 선택
2. Spacing 섹션에서 토큰 클릭
3. Gap, Padding 등으로 적용

## 5. 토큰 구조

```
global/
├── colors/
│   ├── brand/primary/300~700   # 브랜드 컬러 (Honey Yellow)
│   ├── neutral/50~900          # 뉴트럴 팔레트
│   ├── semantic/               # 에러, 성공, 경고, 정보
│   └── social/                 # 카카오, 네이버
├── typography/
│   ├── fontFamily/             # Pretendard, Mono
│   ├── fontWeight/             # 400~700
│   ├── fontSize/               # display, heading, body, label
│   └── lineHeight/             # tight, snug, normal, relaxed
├── spacing/                    # 0~24 (8px 기반)
├── borderRadius/               # none~full
├── sizing/                     # 버튼, 인풋, 컨테이너 사이즈
└── boxShadow/                  # sm~xl, card, cardHover

light/
└── colors/                     # 라이트 모드 시맨틱 색상

dark/
└── colors/                     # 다크 모드 시맨틱 색상
```

## 6. 스타일 & 컴포넌트 생성

### Local Styles 생성

Tokens Studio에서 토큰을 Figma Local Styles로 변환할 수 있습니다:

1. Settings > **Sync styles with Figma**
2. 원하는 토큰 유형 선택 (Colors, Typography, Effects)
3. **Create styles** 클릭

### Variables 생성 (Figma Variables)

Figma Variables로 변환하려면:

1. Settings > **Export** > **Figma Variables**
2. 변환할 토큰 세트 선택
3. **Export** 클릭

## 7. 컴포넌트 권장 구조

디자인 시스템 페이지(`/design-system`)의 컴포넌트를 참고하여 Figma에서 다음 구조로 컴포넌트를 만드세요:

### 버튼 컴포넌트
```
Button
├── Variants: primary, secondary, outline, ghost, destructive, link
├── Sizes: sm, default, lg, icon
└── States: default, hover, active, disabled
```

### 입력 컴포넌트
```
Input
├── Sizes: sm, md, lg
└── States: default, focus, error, disabled
```

### 카드 컴포넌트
```
Card
├── Accommodation Card (숙소 카드)
├── Room Card (객실 카드)
└── Review Card (리뷰 카드)
```

## 8. 디자인-개발 동기화 유지

### GitHub 연동 (선택사항)

Tokens Studio Pro를 사용하면 GitHub과 연동하여 토큰을 자동 동기화할 수 있습니다:

1. Settings > **Sync providers** > **GitHub**
2. Repository: `coolstay-web-nextjs`
3. File path: `docs/web-design-system/figma-tokens.json`
4. Branch: `main`

이렇게 하면 개발팀과 디자인팀이 동일한 토큰을 사용할 수 있습니다.

## 9. 참고 자료

- **개발 디자인 시스템 페이지**: `http://localhost:3000/design-system` (개발 모드에서만 접근 가능)
- **토큰 원본 파일**: `docs/web-design-system/web-design-tokens.json`
- **CSS 변수**: `src/styles/globals.css`
- **Tokens Studio 문서**: https://docs.tokens.studio/

## 10. 자주 묻는 질문

### Q: 토큰 업데이트 시 어떻게 동기화하나요?
A: 개발팀에서 `figma-tokens.json`을 업데이트하면, Figma에서 다시 Import하거나 GitHub 동기화를 사용하세요.

### Q: 다크 모드 미리보기는 어떻게 하나요?
A: `light` 세트를 비활성화하고 `dark` 세트를 활성화하면 다크 모드 색상이 적용됩니다.

### Q: 컴포넌트 라이브러리도 제공되나요?
A: 현재는 토큰만 제공됩니다. 컴포넌트는 토큰을 기반으로 Figma에서 직접 만들어야 합니다.
