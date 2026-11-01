# Folio 에이전트 지침

Zotero 라이브러리에 저장한 논문을 웹에서 읽고 메모를 남기는 개인용 도구다.

프로젝트 규칙은 `.claude/rules/`에 주제별로 나뉘어 있다. Claude Code는 이 디렉터리를 자동으로 읽는다. 다른 에이전트는 작업 전에 필요한 파일을 직접 읽는다.

| 파일 | 내용 |
| --- | --- |
| `identity.md` | 프로젝트 정체성과 폐기한 방향 |
| `constraints.md` | 하지 말아야 할 것 |
| `architecture.md` | 구조와 데이터 흐름 |
| `dev-workflow.md` | 작업 디렉터리, 빌드, 코딩 컨벤션 |
| `docs.md` | 문서 배치 |
| `harness.md` | 기능 개발 워크플로(builder → verifier) |
| `commit-automation.md` | 커밋 자동화 |
