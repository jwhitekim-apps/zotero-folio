# Design

capability를 가로지르는 기술 결정만 기록. capability 하나에만
해당하는 세부 구현은 각 `specs/<capability>/spec.md`나
`docs/notes/`에서 관리.

## 아키텍처 개요

```
[Zotero Web API]
      │ (읽기: 변경된 아이템/컬렉션 조회, PDF 다운로드, note 조회)
      │ (쓰기: 메모 note 생성/수정만 — 원본 서지정보는 절대 안 건드림)
      ▼
[server/] — Node.js + Express + Supabase(Postgres) + express-session
      ▲
      │ fetch('/api/...')
[web/] — Svelte + Vite
```

파일별 역할(zotero.js/supabase.js/context.js/db.js/server.js) 세부는
[.claude/rules/architecture.md](../.claude/rules/architecture.md)에서 관리 — 여기서
중복 기술 안 함.

## capability 간 공유 결정

- **메모 원문 미캐시**: memo capability뿐 아니라 papers 캐시(`folio_papers`)와
  구분되는 원칙 — 메모는 항상 Zotero에서 라이브 조회. source of truth는
  항상 Zotero.
- **증분 동기화**: papers capability의 목록 갱신은 `library version`
  기반 `?since=` 조회만 사용. 전체 재조회 금지.
- **메모 note 식별 태그**: memo capability(논문별/독립 메모) 공통으로
  `zotero-insight:memo`/`zotero-insight:standalone-memo` 태그 사용 —
  프로젝트 초기 이름(Zotero Insight)의 흔적이지만, 이미 사용자
  라이브러리에 이 태그로 저장된 메모 존재. 표시 이름이 Folio로
  바뀌어도 태그 문자열은 유지.
- **원문 뷰어 패턴**: PdfViewer.svelte/HtmlViewer.svelte 기준 — 뷰어
  하나당 컴포넌트 하나, 확대(`zoom`) 상태는 부모(PdfPane.svelte)가
  단일 소스로 보유. papers/webpage-add 양쪽 원문 표시에 공통 적용.
- **뷰포트/터치 제스처**: `touch-action: none` + 커스텀 포인터 이벤트로
  팬/핀치 직접 구현(`docs/notes/touch/pdf-touch-pinch-zoom.md`) — 원인과
  대안 검토 과정은 `docs/notes/touch/`에 기록.

## 검토했으나 채택하지 않은 방향

- AI 생성 요약/태그 — `contract.md`에서 폐기 확정.
- 커스텀 필기(펜/형광펜) 고도화 — GoodNotes로 대체 결정, 코드는 유지한
  채 UI에서만 숨김(`PdfPane.svelte`의 `SHOW_DRAWING_TOOLS`). GoodNotes로
  필기한 PDF를 되돌려 올리는 작업은 이제 Folio 웹에서 직접 첨부파일을
  교체할 수 있다(아래) — Zotero 데스크톱 앱의 수동 교체가 필요 없다.

## 첨부파일 교체 (읽기 전용 원칙의 명시적 예외)

`zotero.js`는 원칙적으로 서지정보·첨부파일 아이템을 건드리지 않지만, 기존
첨부파일(PDF/HTML 스냅샷)의 "파일 바이너리"만 새 파일로 교체하는 것은 예외로
허용한다(`replaceAttachmentFile`, `POST /api/papers/:key/attachment`). Zotero
Web API의 3단계 업로드(인증→S3 업로드→등록)를 따르고, 기존 파일 md5로 If-Match를
걸어 그새 다른 곳에서 바뀐 경우(412)엔 덮어쓰지 않는다. HTML은 스냅샷 zip 포맷과
호환되도록 서버가 plain html을 zip으로 감싼다. 되돌릴 수 없는 작업이라 웹 UI는
업로드 전 확인 다이얼로그를 반드시 거친다.
- `visualViewport` 기반 전면 네이티브 핀치 — 분할뷰(원문+메모 패널)
  레이아웃이 함께 확대되며 깨지는 문제, `docs/notes/touch/mobile-scroll-zoom-reference.md`
  참고.

## 화면 디자인 언어 (잡지형)

모든 화면은 홈 첫 화면에서 정한 **잡지·신문 표지 스타일**을 같은 규칙으로 따른다.
움직임을 늘리지 않고 글자 크기 대비와 선으로 인상을 만든다(참고: recent.design의 타이포그래피 위계).
근거 요구사항: Distinctive Home Hero, Consistent Editorial Page Style, Consistent Hover Feedback,
Staggered Entrance Motion (`docs/specs/entry/spec.md`).

### 공통 규칙

| 요소 | 규칙 |
| --- | --- |
| 화면 머리 | 맨 위에 `3px` 본문색(`--text`) 굵은 줄. 그 아래 영문 대문자 작은 제목(eyebrow) |
| 큰 제목 | 명조(`--font-serif`), 굵기 500, 자간 좁게. 끝에 강조색(`--accent`) 마침표 |
| 소개 문구 | 본문보다 옅은 색. 홈처럼 강조할 때만 왼쪽 `2px` 강조색 세로줄 |
| 구분 | 둥근 상자·그림자 대신 가는 가로줄(`--border`, `--border-strong`). 모서리 둥글기 0 |
| 목록 | 01, 02… 두 자리 번호(명조, 고정폭 숫자) + 항목마다 아래 가는 줄 |
| 숫자 정보 | 명조 큰 숫자 + 작은 대문자 설명. 상자 없이 세로줄로 칸을 나눔 |
| 버튼 | 주요 버튼은 짙은 강조색 면, 보조 버튼은 테두리만. 둘 다 같은 높이·둥글기 |
| 호버 | 버튼은 1px 떠오름, 목록은 바탕을 강조색 4%로 옅게 물들이고 제목만 강조색 |
| 등장 | 위에서부터 0.055초 간격으로 10px 떠오름, 8번째부터는 함께 |
| 접근성 | 움직임 줄이기 설정이면 호버 이동·등장 효과를 모두 끔 |

### 화면별 적용

| 화면 | 적용 내용 | 상태 |
| --- | --- | --- |
| 로그인 | 표지형 2단(제목 한 줄 + 사진 / 로그인 칸), 굵은 윗줄, 제목·로그인 칸 제목 끝 강조색 마침표 | 적용됨 |
| 홈 첫 화면 | 머리글(FOLIO·날짜·자료 수), 큰 제목 + 마침표, 세로줄 소개 문구, 책 표지 장식 | 적용됨 |
| 홈 통계 | 상자 3개 → 세로줄로 나눈 숫자 3칸, 장식 원 제거 | 적용됨 |
| 홈 섹션(최근 들어온 책·컬렉션) | 섹션 제목 위 가는 줄, 컬렉션 카드는 번호 목록형 | 적용됨 |
| 라이브러리 | 머리 굵은 줄 + 제목 마침표, 번호 목록형 | 적용됨 |
| 컬렉션·컬렉션 상세 | 라이브러리와 같음 | 적용됨 |
| 검색 | 머리 규칙 동일, 검색칸은 상자 대신 아래 굵은 줄 하나, 빈 상태 장식 원 제거 | 적용됨 |
| 사용 가이드 | 이미 로그인 화면과 같은 표지형. 제목 마침표와 굵은 윗줄만 맞춤 | 적용됨 |
| 안내 카드(빈 목록·오류·비로그인) | 점선 상자 → 위아래 가는 줄 사이 가운데 정렬 | 적용됨 |
| 문서 읽기·메모 | **적용하지 않음** — 글쓰기에 방해되지 않게 기존 배치 유지 | 제외 |
| 격자 보기(책 표지 카드) | 표지 그림 자체가 장식이라 유지 | 제외 |
