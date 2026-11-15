#!/usr/bin/env bash
# Stop 훅: 작업 턴이 끝날 때 server/·web/ 소스가 바뀌었으면
#   1) docker compose up --build -d 로 다시 띄우고
#   2) 브라우저 검증을 아직 안 했으면 종료를 막고 Claude에게 jw:agent-browser 검증을 시킨다.
#   3) 검증 중 코드를 고치면 해시가 바뀌므로 다음 종료 때 다시 빌드하고 다시 검증한다.
# 검증이 끝나면 Claude가 아래 verified 스탬프에 현재 해시를 적는다. 변경이 없으면 아무것도 안 한다.
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 0
built=.claude/.docker-up.stamp
verified=.claude/.browser-verified.stamp
tries=.claude/.browser-verify.tries
docs_ok=.claude/.docs-checked.stamp
input=$(cat)

hash() { { git rev-parse HEAD; git diff HEAD -- server web ':!web/dist' ':!**/node_modules'; git ls-files -o --exclude-standard -- server web | xargs -r sha1sum; } 2>/dev/null | sha1sum | cut -d' ' -f1; }
cur=$(hash)

# 0) 문서 먼저: server/·web/ 코드가 커밋 전 상태로 바뀌었는데 docs/는 그대로면 한 번 막는다.
#    문서가 필요 없는 사소한 변경이면 Claude가 docs_ok 스탬프에 현재 해시를 적어 넘어간다.
if [ -n "$(git status --porcelain -- server web ':!web/dist' 2>/dev/null)" ] \
   && [ -z "$(git status --porcelain -- docs 2>/dev/null)" ] \
   && [ "$cur" != "$(cat "$docs_ok" 2>/dev/null)" ]; then
  reason="코드(server/·web/)는 바뀌었는데 docs/는 그대로입니다. .claude/rules/docs-first.md에 따라 Skill jw:spec-docs로 docs/specs/<capability>/spec.md 요구사항과 docs/tasks.md 항목을 먼저 정리하세요. 요구사항이 바뀌지 않는 사소한 변경이면 다음 명령으로 기록하고 이유를 사용자에게 알리세요: echo $cur > $docs_ok"
  jq -n --arg r "$reason" '{decision:"block", reason:$r}'
  exit 0
fi

# 1) 빌드: 마지막 빌드 이후 바뀌었을 때만
if [ "$cur" != "$(cat "$built" 2>/dev/null)" ]; then
  if docker compose up --build -d >/tmp/folio-docker-up.log 2>&1; then
    echo "$cur" > "$built"
  else
    echo '{"systemMessage":"docker compose up 실패 — /tmp/folio-docker-up.log 확인"}'
    exit 0
  fi
fi

# 2) 검증: 이 해시로 아직 검증 안 했으면 종료를 막는다 (무한 반복 방지: 같은 해시로 최대 3번)
[ "$cur" = "$(cat "$verified" 2>/dev/null)" ] && { rm -f "$tries"; exit 0; }
read -r t h 2>/dev/null < "$tries"; [ "$h" = "$cur" ] || t=0
if [ "${t:-0}" -ge 3 ]; then
  echo '{"systemMessage":"브라우저 검증이 3번 끝나지 않아 훅이 더 막지 않습니다. 직접 확인해 주세요."}'
  exit 0
fi
echo "$((t+1)) $cur" > "$tries"
reason="코드 변경을 docker로 다시 띄웠습니다(http://localhost:3002). 끝내기 전에 Skill jw:agent-browser로 이번 변경이 실제 화면에서 동작하는지 검증하세요. 문제가 있으면 고치세요(고치면 종료 시 자동으로 다시 빌드·검증합니다). 검증을 통과하면 마지막으로 다음 명령을 실행하세요: echo $cur > $verified  — 그리고 검증 결과를 사용자에게 보고하세요."
jq -n --arg r "$reason" '{decision:"block", reason:$r}'
