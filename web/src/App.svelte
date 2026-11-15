<script>
  import { onMount } from 'svelte';
  import TabBar from './components/TabBar.svelte';
  import HomeDashboard from './pages/HomeDashboard.svelte';
  import PapersList from './pages/PapersList.svelte';
  import SearchPapers from './pages/SearchPapers.svelte';
  import PaperDetailSplit from './pages/PaperDetailSplit.svelte';
  import Collections from './pages/Collections.svelte';
  import LoginPage from './pages/LoginPage.svelte';
  import GuidePage from './pages/GuidePage.svelte';
  import { api } from './services/api.js';

  let tab = $state('home'); // 'home' | 'papers' | 'collections' | 'search'
  let detailKey = $state(null); // 논문 상세로 들어가면 itemKey, 아니면 null
  let searchQuery = $state('');
  let searchResults = $state([]);
  let searchHasSearched = $state(false);

  // Zotero 계정 연결 여부 — 연결 전까지는 나머지 화면 대신 로그인 안내만 보여준다.
  let authChecked = $state(false);
  let authConnected = $state(false);
  let authUsername = $state('');
  let authError = $state('');
  let currentPath = $state(window.location.pathname);
  let showLoginRoute = $derived(currentPath === '/login');
  let showGuideRoute = $derived(currentPath === '/guide');
  // 비로그인 사용자가 `/`로 들어오면 로그인 화면 대신 홈을 "둘러보기"로 보여준다.
  let guestHome = $derived(authChecked && !authConnected && currentPath === '/');
  let showLibrary = $derived((authConnected || guestHome) && !showLoginRoute && !showGuideRoute);

  // Zotero 로그인 팝업 상태. 팝업이 열려 있는 동안만 닫힘을 감시한다.
  let loginPopup = null;
  let loginPopupTimer = null;

  // 로그인 버튼 클릭 시 팝업을 연다. 열었으면 true(호출부가 기본 이동을 막는다),
  // 차단되었거나 열 수 없으면 false — 그러면 링크의 기본 동작(전체 페이지 이동)이 그대로 진행된다.
  function startZoteroLogin() {
    let popup = null;
    try {
      // 사용자 클릭 핸들러 안에서 동기적으로 열어야 팝업 차단을 피할 수 있다.
      popup = window.open('about:blank', 'folio-zotero-login', 'width=520,height=720');
      if (!popup) return false;
      popup.location.href = '/oauth/login?popup=1';
    } catch {
      try { popup?.close(); } catch { /* 닫기 실패는 무시 */ }
      return false;
    }
    loginPopup = popup;
    clearInterval(loginPopupTimer);
    loginPopupTimer = setInterval(() => {
      if (loginPopup?.closed) finishZoteroLogin();
    }, 800);
    return true;
  }

  // 팝업이 끝났거나(메시지 수신) 닫혔을 때 — 새로고침 없이 로그인 상태를 다시 확인한다.
  async function finishZoteroLogin() {
    clearInterval(loginPopupTimer);
    loginPopupTimer = null;
    loginPopup = null;
    try {
      const status = await api.authStatus();
      authConnected = status.connected;
      authUsername = status.username || '';
      authError = '';
      if (status.connected) {
        // 로그인 화면에 머물지 않고 홈으로 옮긴다(히스토리는 교체해 뒤로가기 루프를 막는다).
        history.replaceState({}, '', '/');
        currentPath = '/';
        tab = 'home';
        detailKey = null;
      }
    } catch (err) {
      authError = err.message;
    }
  }

  async function checkAuth() {
    authChecked = false;
    authError = '';
    try {
      const status = await api.authStatus();
      authConnected = status.connected;
      authUsername = status.username || '';
      if (!status.connected && currentPath !== '/login' && currentPath !== '/guide' && currentPath !== '/') {
        history.replaceState({}, '', '/login');
        currentPath = '/login';
      }
    } catch (err) {
      authConnected = false;
      authError = err.message;
    } finally {
      authChecked = true;
    }
  }

  checkAuth();

  onMount(() => {
    const onPopState = () => (currentPath = window.location.pathname);
    // 팝업 콜백 페이지가 보내는 메시지. 같은 origin에서 온 것만 받는다.
    const onMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== 'folio:zotero-login') return;
      finishZoteroLogin();
    };
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (guestHome) goLogin();
        else if (authConnected && !detailKey && !showLoginRoute) openSearch();
      }
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('message', onMessage);
      clearInterval(loginPopupTimer);
    };
  });

  // 비로그인 둘러보기에서 로그인이 필요한 동작을 누르면 /login으로 보낸다.
  function goLogin() {
    history.pushState({}, '', '/login');
    currentPath = '/login';
  }

  function selectTab(t) {
    if (guestHome) {
      if (t !== 'home') goLogin();
      return;
    }
    tab = t;
    detailKey = null;
  }

  function openSearch() {
    if (guestHome) return goLogin();
    tab = 'search';
    detailKey = null;
  }

  function openPaper(key) {
    if (guestHome) return goLogin();
    detailKey = key;
  }

  function closeDetail() {
    detailKey = null;
  }
</script>

<div
  class="app-frame"
  class:library-frame={showLibrary && !detailKey}
  class:reader-frame={Boolean(detailKey) && !showLoginRoute && !showGuideRoute}
  class:login-frame={showGuideRoute || (!authConnected && !guestHome) || showLoginRoute}
>
  {#if showLibrary && !detailKey}
    <TabBar
      {tab}
      username={authUsername}
      guest={guestHome}
      onSelectTab={selectTab}
      onSearch={openSearch}
      onLogin={goLogin}
    />
  {/if}

  <main
    class:reading-mode={Boolean(detailKey) && !showLoginRoute && !showGuideRoute}
    class:login-mode={!showGuideRoute && ((!authConnected && !guestHome) || showLoginRoute)}
    class:guide-mode={showGuideRoute}
  >
    {#if showGuideRoute}
      <GuidePage />
    {:else if !authChecked}
      <div class="auth-loading" aria-label="로그인 상태 확인 중">
        <span class="folio-loading-mark">F</span>
        <strong>Folio</strong>
        <i></i>
      </div>
    {:else if guestHome}
      <HomeDashboard guest onLogin={goLogin} onOpenPaper={openPaper} onOpenLibrary={goLogin} onOpenCollections={goLogin} />
    {:else if showLoginRoute || !authConnected}
      <LoginPage error={authError} onRetry={checkAuth} connected={authConnected} username={authUsername} onStartLogin={startZoteroLogin} />
    {:else if detailKey}
      <PaperDetailSplit
        itemKey={detailKey}
        onBack={closeDetail}
        backLabel={tab === 'search' ? '검색 결과' : tab === 'collections' ? '컬렉션' : '라이브러리'}
      />
    {:else if tab === 'home'}
      <HomeDashboard
        onOpenPaper={openPaper}
        onOpenLibrary={() => selectTab('papers')}
        onOpenCollections={() => selectTab('collections')}
        username={authUsername}
      />
    {:else if tab === 'papers'}
      <PapersList onOpenPaper={openPaper} />
    {:else if tab === 'collections'}
      <Collections onOpenPaper={openPaper} />
    {:else if tab === 'search'}
      <SearchPapers
        onOpenPaper={openPaper}
        bind:query={searchQuery}
        bind:papers={searchResults}
        bind:hasSearched={searchHasSearched}
      />
    {/if}
  </main>
</div>
