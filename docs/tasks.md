# Tasks

capability별 구현 체크리스트이자 유일한 할 일 목록. 새 작업은
근거 Requirement(`docs/specs/<capability>/spec.md`)와 함께 여기에 추가한다.
수정 이력은 커밋 기록에 남긴다.

## papers — 논문 목록/제목 검색

- [x] Zotero 라이브러리 증분 동기화(`?since=` 기반)
- [x] 논문 목록 조회/제목 검색
- [x] 정렬(최근순/년도순/이름순), 목록/표지 보기 전환
- [ ] 검색 결과에서 메모 검색까지 확장할지 — `docs/notes/overview/scope-discipline-notes.md`에서 제기된 open question

## memo — 논문별/독립 메모

- [x] 논문별 메모(child note) 읽고 쓰기, 태그 식별(`zotero-insight:memo`)
- [x] 독립 메모(standalone note) 읽고 쓰기, 태그 식별(`zotero-insight:standalone-memo`)
- [x] 마크다운 편집, 자동저장(레이스 컨디션 수정 완료)
- [x] 저장 시 기존 note 존재 여부 확인 후 PATCH/POST 분기(중복 생성 방지)

## collections — 컬렉션 기준 탐색

- [x] Zotero 컬렉션 구조 조회
- [x] 컬렉션별 논문 필터링
- [x] 컬렉션 전환 레이스 컨디션 수정 완료(RepoProof RP-WEB-002)

## webpage-add — 웹페이지를 새 논문 아이템으로 추가

- [x] URL 입력 → Zotero `webpage` 아이템 생성
- [x] 페이지 `<title>` 자동 추출
- [x] SSRF 방지(내부망/사설 IP 차단, RepoProof RP-NODE-002)

## capability 공통

- [x] Zotero OAuth 로그인, 멀티유저(Supabase) 전환
- [x] PDF/HTML 원문 뷰어(확대/축소, 터치 제스처)
- [x] 필기 도구 구현 후 UI 숨김 처리(GoodNotes 대체 결정)
- [ ] 의미 기반 검색 — 보류(`contract.md`)

## entry — 로그인 화면과 홈

- [x] Zotero 로그인을 Folio 도메인 안에서 처리하는 방법 검토 — 지금은 Zotero 페이지로 이동. 팝업 방식 등 가능 여부부터 조사 (근거: Login Without Leaving Folio Domain)
- [x] 로그인 화면 문구 "논문 원문과 나만의 노트를 한 흐름으로 연결하는 개인 연구 공간." 수정 — 연구보다 PDF 문서 중심으로 (근거: Document-Centered Copy)
- [x] 홈 안내 문구 "읽어야 할 자료와 기록한 생각이 한곳에 머무는 조용한 연구 공간입니다." 에서 '연구' 표현 수정 (근거: Document-Centered Copy)
- [x] 홈 인사 "OOO님의 서재"에서 아이디 글씨 강조 줄이기 (근거: Understated Home Greeting)
- [x] 두 번째 탭 이름 "논문" → "라이브러리" (근거: Consistent Library Naming)
- [x] 첫 방문 사용자가 사용 가이드를 쉽게 찾도록 진입점 배치 — 로그인 버튼 아래 안내 상자 + 비로그인 홈 버튼 (근거: Discoverable Usage Guide)
