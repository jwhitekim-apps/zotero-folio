<script>
  import { api } from '../services/api.js';
  import Icon from '../components/Icon.svelte';
  import PaperCard from '../components/PaperCard.svelte';

  let { onOpenPaper } = $props();

  let collections = $state([]);
  let loading = $state(true);
  let error = $state('');

  let selected = $state(null); // { key, name }
  let papers = $state([]);
  let papersLoading = $state(false);
  let papersError = $state('');
  let requestId = 0;

  async function load() {
    loading = true;
    error = '';
    try {
      collections = await api.listCollections();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  // 컬렉션을 고를 때마다 이전 목록은 비우고 새로 읽는다. 결과/오류/로딩 표시는
  // 모두 "가장 최근 요청"일 때만 반영한다 — 빠르게 A→B를 누르면 늦게 온 A 응답이
  // B 화면을 덮어쓰거나, A의 실패 메시지가 B 화면에 뜨는 걸 막는다.
  async function selectCollection(c) {
    const currentRequest = ++requestId;
    selected = c;
    papers = [];
    papersError = '';
    papersLoading = true;
    try {
      const result = await api.listCollectionPapers(c.key);
      if (currentRequest === requestId) papers = result;
    } catch (err) {
      if (currentRequest === requestId) papersError = err.message;
    } finally {
      if (currentRequest === requestId) papersLoading = false;
    }
  }

  function backToCollections() {
    // 진행 중인 요청이 뒤늦게 돌아와도 화면을 건드리지 못하도록 세대를 올린다.
    requestId++;
    selected = null;
    papersLoading = false;
    papersError = '';
  }

  async function deletePaper(itemKey) {
    await api.deletePaper(itemKey);
    papers = papers.filter((p) => p.itemKey !== itemKey);
  }

  load();
</script>

{#if selected}
  <button class="back-btn" onclick={backToCollections}><Icon name="arrow-left" size={18} /> 컬렉션 목록</button>
  <header class="detail-heading collection-heading collection-detail-hero">
    <span class="collection-hero-icon"><Icon name="folder" size={28} /></span>
    <div><p class="eyebrow">COLLECTION</p><h1>{selected.name}</h1></div>
  </header>
  {#if papersLoading}
    <div class="skeleton-list"><div class="skeleton-card"><i></i><span></span><span></span></div></div>
  {:else if papersError}
    <div class="state-card error-state"><Icon name="alert" size={25} /><strong>논문 목록을 불러오지 못했어요</strong><p>{papersError}</p><button class="back-btn" onclick={() => selectCollection(selected)}>다시 시도</button></div>
  {:else if papers.length === 0}
    <div class="state-card"><span class="state-icon"><Icon name="library" size={27} /></span><strong>빈 컬렉션이에요</strong><p>이 컬렉션에는 아직 논문이 없습니다.</p></div>
  {:else}
    <div class="content-heading"><h2>논문</h2><span>{papers.length}편</span></div>
    <div class="paper-list">
      {#each papers as p (p.itemKey)}
        <PaperCard paper={p} onOpen={onOpenPaper} onDelete={deletePaper} />
      {/each}
    </div>
  {/if}
{:else}
  <header class="page-header compact">
    <div><p class="eyebrow">YOUR SHELVES</p><h1>컬렉션</h1><p class="page-description">주제와 프로젝트별로 정리된 나만의 선반입니다.</p></div>
  </header>
  {#if loading}
    <div class="skeleton-list"><div class="skeleton-card"><i></i><span></span></div><div class="skeleton-card"><i></i><span></span></div></div>
  {:else if error}
    <div class="state-card error-state"><Icon name="alert" size={25} /><strong>컬렉션을 불러오지 못했어요</strong><p>{error}</p></div>
  {:else if collections.length === 0}
    <div class="state-card"><span class="state-icon"><Icon name="folder" size={27} /></span><strong>컬렉션이 없어요</strong><p>Zotero에서 컬렉션을 만들면 이곳에 표시됩니다.</p></div>
  {:else}
    <div class="content-heading"><h2>모든 선반</h2><span>{collections.length}개</span></div>
    <div class="collection-grid">
      {#each collections as c, index (c.key)}
        <button class="collection-card" onclick={() => selectCollection(c)}>
          <span class="collection-number">{String(index + 1).padStart(2, '0')}</span>
          <span class="folder-icon"><Icon name="folder" size={23} /></span>
          <span class="collection-copy"><span class="title">{c.name}</span><small>Zotero collection</small></span>
          <span class="chevron"><Icon name="chevron" size={18} /></span>
        </button>
      {/each}
    </div>
  {/if}
{/if}
