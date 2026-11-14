// 서버 API fetch 래퍼 모음.

// 멀티유저가 되면서 "누구인지"는 서버가 발급한 세션 쿠키(folio.sid)로만 판별한다.
// 같은 출처로 보내는 fetch라 쿠키는 기본으로 실려 가지만, 의도를 분명히 하려고
// credentials를 명시한다.
async function request(path, opts = {}) {
  const res = await fetch(path, { credentials: 'same-origin', ...opts });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // 세션이 만료됐거나(서버 재시작 등) 로그아웃된 상태 — 로그인 화면으로 돌린다.
    // 로그인 여부 자체를 묻는 /api/auth/status는 예외 (App.svelte가 직접 처리).
    if (res.status === 401 && !path.startsWith('/api/auth/')) {
      window.location.assign('/login');
    }
    // status/body를 함께 실어 호출부가 409(충돌) 같은 상태별 처리를 할 수 있게 한다.
    const err = new Error(body.error || `서버 오류 (${res.status})`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

function jsonBody(obj) {
  return { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) };
}

export const api = {
  authStatus: () => request('/api/auth/status'),
  logout: () => request('/api/auth/logout', { method: 'POST' }),

  sync: () => request('/api/sync', { method: 'POST' }),

  listPapers: (q) => request(`/api/papers${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  getPaper: (key) => request(`/api/papers/${key}`),
  deletePaper: (key) => request(`/api/papers/${key}`, { method: 'DELETE' }),
  addWebpage: (url) => request('/api/papers/webpage', { method: 'POST', ...jsonBody({ url }) }),
  // 기존 첨부파일(PDF/HTML 스냅샷)의 파일 내용을 새 파일로 교체한다.
  // multipart/form-data라 Content-Type은 브라우저가 boundary와 함께 자동 지정하게 둔다.
  replaceAttachment: (key, file) => {
    const form = new FormData();
    form.append('file', file);
    return request(`/api/papers/${key}/attachment`, { method: 'POST', body: form });
  },
  // base: 편집을 시작할 때 가진 메모 버전({noteKey, version}, 없었으면 null).
  // 서버는 이 버전과 Zotero의 현재 상태가 다르면 409로 충돌을 돌려준다.
  saveMemo: (key, markdown, base) =>
    request(`/api/papers/${key}/memo`, {
      method: 'PUT',
      ...jsonBody({
        markdown,
        baseNoteKey: base?.noteKey ?? null,
        baseVersion: base?.version ?? null,
      }),
    }),

  // 하이라이트(형광펜) — Zotero annotation 아이템에 직접 읽고 쓴다.
  listHighlights: (key) => request(`/api/papers/${key}/highlights`),
  createHighlight: (key, highlight) =>
    request(`/api/papers/${key}/highlights`, { method: 'POST', ...jsonBody(highlight) }),
  deleteHighlight: (key, annotationKey) =>
    request(`/api/papers/${key}/highlights/${annotationKey}`, { method: 'DELETE' }),

  // 필기(ink) — Zotero annotation 아이템(annotationType: ink)에 직접 읽고 쓴다.
  listInk: (key) => request(`/api/papers/${key}/ink`),
  createInk: (key, ink) => request(`/api/papers/${key}/ink`, { method: 'POST', ...jsonBody(ink) }),
  deleteInk: (key, annotationKey) =>
    request(`/api/papers/${key}/ink/${annotationKey}`, { method: 'DELETE' }),

  listCollections: () => request('/api/collections'),
  listCollectionPapers: (key) => request(`/api/collections/${key}/papers`),
};
