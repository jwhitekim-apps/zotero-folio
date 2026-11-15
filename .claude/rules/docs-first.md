# 문서 먼저

기능 추가·동작 변경 요청을 받으면 **코드를 고치기 전에** `jw:spec-docs`로 문서부터 정리한다.
사용자가 따로 시키지 않아도 한다.

1. `docs/specs/<capability>/spec.md`에 Requirement/Scenario를 추가하거나 고친다.
2. `docs/tasks.md`에 근거(Requirement 이름)를 단 작업 항목을 넣는다.
3. 구현과 검증이 끝나면 해당 항목을 `[x]`로 바꾼다.

오탈자, 색·여백 미세 조정처럼 요구사항이 바뀌지 않는 변경은 문서를 건너뛴다. 이때 Stop 훅
(`.claude/hooks/docker-up.sh`)이 막으면, 안내된 명령으로 "문서 변경 불필요"를 기록하고 이유를 보고한다.
