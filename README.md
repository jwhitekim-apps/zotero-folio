# Folio

Zotero에 저장한 논문을 웹에서 읽으며 메모를 남기는 개인용 도구입니다. 원문과 메모를 나란히 띄우고, 메모는 Zotero에 논문별 하위 메모(child note)로 저장됩니다.

[Folio 열기](https://folio.2joon.com) · [Zotero 연결 가이드](https://folio.2joon.com/guide)

![왼쪽에 웹페이지 원문, 오른쪽에 마크다운 메모 에디터를 배치한 Folio 읽기 화면](web/public/images/zotero-setup/8.png)

## 주요 기능

- **논문 탐색:** 제목 검색, 정렬, 그리드·목록 보기, 컬렉션별 탐색
- **원문 읽기:** 첨부 PDF와 HTML 스냅샷을 메모 옆에서 열기
- **메모:** 마크다운 작성과 자동 저장, `.md` 불러오기·내려받기
- **웹페이지 추가:** URL로 Zotero에 웹페이지 아이템 만들기

메모는 직접 씁니다. AI 요약은 없습니다.

## 시작하기

[folio.2joon.com](https://folio.2joon.com)에서 **Zotero로 계속하기**를 눌러 계정을 연결하고, 홈에서 **Zotero 동기화**를 누릅니다. 자세한 설정은 [연결 가이드](https://folio.2joon.com/guide)에 있습니다.

## 직접 실행하기

Docker Compose, [Zotero OAuth 앱](https://www.zotero.org/oauth/apps), Supabase 프로젝트가 필요합니다. 로컬 OAuth 콜백 주소는 `http://localhost:3002/oauth/callback`입니다.

1. `.env.example`을 `.env`로 복사하고 `ZOTERO_CLIENT_KEY`, `ZOTERO_CLIENT_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET`(긴 임의 문자열)을 채웁니다.
2. Supabase SQL Editor에서 [`server/supabase/schema.sql`](server/supabase/schema.sql)을 실행해 테이블을 만듭니다. 서버가 자동으로 만들지 않습니다.
3. 실행하고 `http://localhost:3002`로 접속합니다.

```bash
cp .env.example .env
docker compose up --build
```

외부 주소로 운영할 때는 `APP_BASE_URL`을 그 주소로 바꾸고, OAuth 콜백도 `<주소>/oauth/callback`으로 등록합니다.

## 관련 문서

- [설계와 데이터 흐름](docs/design.md)
- [문서 안내](docs/README.md), [조사·개발 기록](docs/notes/README.md)

## 라이선스

[MIT](LICENSE) © 2026 jwhitekim
