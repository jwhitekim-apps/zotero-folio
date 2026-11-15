# 하네스: 기능 개발 워크플로

**목표:** 여러 파일에 걸치거나 실제 동작 확인이 필요한 기능 추가/버그 수정을,
구현(folio-builder)과 실행 기반 독립 검증(folio-verifier)을 분리해서 처리한다.

**트리거:** 기능 추가·버그 수정 요청(및 그 재수정/재검증 요청) 시 `folio-feature-team`
스킬을 사용하라. 오탈자 수정처럼 결과를 눈으로 바로 판단 가능한 사소한 변경은
직접 처리한다.

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-08-28 | 초기 구성 (folio-builder, folio-verifier, folio-run-verify, folio-feature-team) | 전체 | 사용자 요청 — 기능 개발 워크플로 자동화 |
| 2026-09-02 | folio-verifier 제거 | agents | 토큰 사용량이 커서 오케스트레이터가 간단히 직접 검증 |
| 2026-11-01 | folio-verifier 복원, builder의 `plan` 스킬 의존 제거 | agents, skills | 스킬이 verifier를 계속 호출하는데 파일이 없어 워크플로가 끊김. `plan`은 9월에 삭제됨 |
| 2026-11-01 | 폐기된 유저 단위 스킬(todo-guard, watch-rules) 훅 제거, deploy-status 훅 재설치, 동작하지 않던 pytest Stop 훅 삭제 | hooks, settings | 레포 단위와 유저 단위 경계 정리 |
| 2026-11-03 | deploy-status 껍데기 훅 삭제, `.claude/deploy-status.enabled`로 전환 | hooks, settings | my-claude-skills가 jw 플러그인으로 바뀌어 껍데기 훅이 부르던 `~/.claude/skills/deploy-status` 경로가 사라짐 |
| 2026-11-15 | Stop 훅 `.claude/hooks/docker-up.sh` 추가 — server/·web/ 변경이 있으면 `docker compose up --build -d` | hooks, settings | 사용자 요청 — 작업 후 바로 브라우저로 직접 확인 |
| 2026-11-15 | docker-up 훅 확장 — 빌드 후 브라우저 검증 전까지 종료를 막고(jw:agent-browser), 수정 시 재빌드·재검증, 같은 변경에 최대 3번 | hooks | 사용자 요청 — 작업 끝마다 실제 화면 검증 강제 |
| 2026-11-15 | 문서 먼저 규칙(`rules/docs-first.md`)과 docker-up 훅의 docs 확인 단계 추가 — 코드만 바뀌고 docs/가 그대로면 종료를 막음 | rules, hooks | 사용자 요청 — 시키지 않아도 매번 문서부터 정리 |
