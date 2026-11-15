# Folio

Zotero에 저장한 논문을 웹에서 읽으며 메모를 남기는 개인용 도구입니다. 원문과 메모를 나란히 띄우고, 메모는 Zotero에 논문별 하위 메모(child note)로 저장됩니다.

![왼쪽에 웹페이지 원문, 오른쪽에 마크다운 메모 에디터를 배치한 Folio 읽기 화면](web/public/images/zotero-setup/8.png)

## 시작하기

Zotero 계정과 Zotero 웹 라이브러리에 동기화된 자료가 필요합니다. 원문을 읽으려면 해당 자료의 PDF 또는 HTML 스냅샷 첨부파일도 동기화되어 있어야 합니다.

1. [Folio 열기](https://folio.2joon.com)에서 **Zotero로 계속하기**를 눌러 계정을 연결합니다.
2. 홈에서 **Zotero 동기화**를 누릅니다.
3. **라이브러리 둘러보기**에서 논문을 열고 원문 옆에 메모를 작성합니다.

## 개발 방식

Folio는 Claude Code와 직접 만든 스킬 모음 [jwhitekim/my-claude-skills](https://github.com/jwhitekim/my-claude-skills)(`jw` 플러그인)로 개발했습니다. 기능마다 구현 → 실제 화면 검증 → 커밋 순서를 하네스로 강제합니다.

| 단계 | 사용한 도구 |
| --- | --- |
| 요구사항 정리 | `jw:spec-docs`로 [기능별 요구사항](docs/specs/)과 [작업 목록](docs/tasks.md) 작성 |
| 구현과 검증 분리 | 구현 에이전트 [folio-builder](.claude/agents/folio-builder.md)와 검증 에이전트 [folio-verifier](.claude/agents/folio-verifier.md)를 [folio-feature-team](.claude/skills/folio-feature-team/) 스킬이 조율 |
| 실제 화면 확인 | 작업이 끝나면 [Stop 훅](.claude/hooks/docker-up.sh)이 Docker로 다시 띄우고, `jw:agent-browser`로 브라우저 검증을 마칠 때까지 종료를 막음 |
| 교차 검토 | `jw:codex`로 Codex에게 코드·문서 검토 요청 |
| 커밋과 배포 | `jw:commit-and-push`로 커밋, `jw:deploy-status`로 GitHub Actions 배포 결과 확인 |

하네스 구성과 변경 이력은 [.claude/rules/harness.md](.claude/rules/harness.md)에 있습니다.

## 관련 문서

- [Zotero 연결 가이드](https://folio.2joon.com/guide)
- [설계와 데이터 흐름](docs/design.md)
- [문서 안내와 기능별 요구사항](docs/README.md)
- [조사·개발 기록](docs/notes/README.md)

## 라이선스

[MIT](LICENSE) © 2026 jwhitekim
