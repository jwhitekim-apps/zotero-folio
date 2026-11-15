#!/usr/bin/env bash
# 작업 턴이 끝날 때 server/·web/ 소스가 바뀌었으면 docker compose로 다시 띄운다.
# 사용자가 바로 브라우저로 확인할 수 있게 하려는 용도. 변경이 없으면 아무것도 안 한다.
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 0
stamp=.claude/.docker-up.stamp
cur=$( { git rev-parse HEAD; git diff HEAD -- server web ':!web/dist' ':!**/node_modules'; git ls-files -o --exclude-standard -- server web | xargs -r sha1sum; } 2>/dev/null | sha1sum | cut -d' ' -f1)
[ "$cur" = "$(cat "$stamp" 2>/dev/null)" ] && exit 0
if docker compose up --build -d >/tmp/folio-docker-up.log 2>&1; then
  echo "$cur" > "$stamp"
  echo '{"systemMessage":"변경 사항으로 docker compose를 다시 띄웠어요 (로그: /tmp/folio-docker-up.log)"}'
else
  echo '{"systemMessage":"docker compose up 실패 — /tmp/folio-docker-up.log 확인"}'
fi
