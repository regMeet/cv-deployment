const tabsEl = document.getElementById('tabs');
const subtabsEl = document.getElementById('subtabs');
const questionsEl = document.getElementById('questions');
const answerEl = document.getElementById('answer');
const questionsTitleEl = document.getElementById('questions-title');
const browseViewEl = document.getElementById('browse-view');
const searchViewEl = document.getElementById('search-view');
const searchInputEl = document.getElementById('search-input');
const searchClearEl = document.getElementById('search-clear');
const searchResultsEl = document.getElementById('search-results');
const searchStatusEl = document.getElementById('search-status');

const FAV_KEY = 'learn:favorites';
const LANG_KEY = 'app:lang';
const TAB_ICONS = { java: '☕', react: '⚛️', sql: '🗄️', manager: '👔' };

const mdCache = new Map();              // path → text (raw)
const searchIndices = { en: null, es: null };

const state = {
    tabs: [],
    activeTab: null,
    activeSection: null,
    activeQuestion: null,
    favorites: loadFavorites(),
    lang: localStorage.getItem(LANG_KEY) || 'en',
    searchQuery: '',
};

let buildPromise = null;
let searchTimer = null;

// --- favorites ---

function loadFavorites() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || {}; }
    catch { return {}; }
}

function saveFavorites() {
    localStorage.setItem(FAV_KEY, JSON.stringify(state.favorites));
}

function getFavoritesForTab(tabId) { return state.favorites[tabId] || []; }

function isFavorite(tabId, sectionId, questionId) {
    return getFavoritesForTab(tabId).some(
        (f) => f.sectionId === sectionId && f.questionId === questionId,
    );
}

function toggleFavorite(tabId, sectionId, questionId) {
    const favs = getFavoritesForTab(tabId).slice();
    const idx = favs.findIndex(
        (f) => f.sectionId === sectionId && f.questionId === questionId,
    );
    if (idx >= 0) favs.splice(idx, 1);
    else favs.push({ sectionId, questionId });
    state.favorites[tabId] = favs;
    saveFavorites();
}

function buildFavoritesSection(tab) {
    if (!tab) return null;
    const favs = getFavoritesForTab(tab.id);
    if (!favs.length) return null;
    const questions = favs
        .map((f) => {
            const realSection = (tab.sections || []).find((s) => s.id === f.sectionId);
            if (!realSection) return null;
            const realQ = (realSection.questions || []).find((q) => q.id === f.questionId);
            if (!realQ) return null;
            return {
                id: `${f.sectionId}.${f.questionId}`,
                title: realQ.title,
                file: realQ.file,
                originSectionId: f.sectionId,
                originSectionLabel: realSection.label,
                originQuestionId: f.questionId,
            };
        })
        .filter(Boolean);
    if (!questions.length) return null;
    return { id: 'favorites', label: '★ Favorites', questions, isFavoritesSection: true };
}

// --- fetch + cache ---

async function fetchJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
}

function esify(file) { return file.replace(/\.md$/, '.es.md'); }

function pathFor(tabId, file, lang) {
    return lang === 'es'
        ? `questions/${tabId}/${esify(file)}`
        : `questions/${tabId}/${file}`;
}

async function fetchMd(tabId, file, lang) {
    const path = pathFor(tabId, file, lang);
    if (mdCache.has(path)) return mdCache.get(path);
    try {
        const res = await fetch(path);
        if (!res.ok) return null;
        const text = await res.text();
        mdCache.set(path, text);
        return text;
    } catch {
        return null;
    }
}

async function getQuestionContent(tabId, file) {
    if (state.lang === 'es') {
        const es = await fetchMd(tabId, file, 'es');
        if (es !== null) return { text: es, fellBack: false };
    }
    const en = await fetchMd(tabId, file, 'en');
    if (en !== null) return { text: en, fellBack: state.lang === 'es' };
    throw new Error(`Failed to load ${file}`);
}

function prefetchOtherLang(tabId, file) {
    const other = state.lang === 'es' ? 'en' : 'es';
    fetchMd(tabId, file, other).catch(() => {});
}

// --- rendering ---

function renderTabs() {
    tabsEl.innerHTML = '';
    state.tabs.forEach((tab) => {
        const btn = document.createElement('button');
        btn.className = 'tab' + (tab.id === state.activeTab?.id ? ' active' : '');
        btn.type = 'button';
        const icon = TAB_ICONS[tab.id] || '';
        btn.innerHTML = `<span class="tab-icon">${icon}</span><span class="tab-label">${escapeHtml(tab.label)}</span>`;
        btn.onclick = () => selectTab(tab);
        tabsEl.appendChild(btn);
    });
}

function getSectionsForActiveTab() {
    const real = state.activeTab?.sections || [];
    const favs = buildFavoritesSection(state.activeTab);
    return favs ? [favs, ...real] : real;
}

function renderSubtabs() {
    subtabsEl.innerHTML = '';
    const sections = getSectionsForActiveTab();
    if (!sections.length) return;
    sections.forEach((section) => {
        const btn = document.createElement('button');
        btn.className = 'subtab' + (section.id === state.activeSection?.id ? ' active' : '');
        btn.type = 'button';
        btn.textContent = section.label;
        btn.onclick = () => selectSection(section);
        subtabsEl.appendChild(btn);
    });
}

function renderQuestions() {
    const section = state.activeSection;
    const count = section?.questions?.length ?? 0;
    questionsTitleEl.innerHTML = section
        ? `${escapeHtml(section.label)} <span class="count">${count}</span>`
        : 'Questions';
    questionsEl.innerHTML = '';
    const questions = section?.questions || [];
    if (!questions.length) {
        const li = document.createElement('li');
        li.innerHTML = '<span class="hint" style="padding:8px 10px;display:block;">No questions yet.</span>';
        questionsEl.appendChild(li);
        return;
    }
    questions.forEach((q) => {
        const li = document.createElement('li');
        li.className = 'question-item';

        const titleBtn = document.createElement('button');
        titleBtn.className = 'question-title' + (q.id === state.activeQuestion?.id ? ' active' : '');
        titleBtn.type = 'button';
        titleBtn.onclick = () => selectQuestion(q);

        if (section.isFavoritesSection) {
            const badge = document.createElement('span');
            badge.className = 'origin-badge';
            badge.textContent = q.originSectionLabel;
            const text = document.createElement('span');
            text.textContent = q.title;
            titleBtn.appendChild(badge);
            titleBtn.appendChild(text);
        } else {
            titleBtn.textContent = q.title;
        }

        const sectionIdForFav = section.isFavoritesSection ? q.originSectionId : section.id;
        const questionIdForFav = section.isFavoritesSection ? q.originQuestionId : q.id;
        const fav = isFavorite(state.activeTab.id, sectionIdForFav, questionIdForFav);

        const starBtn = document.createElement('button');
        starBtn.className = 'star-btn' + (fav ? ' active' : '');
        starBtn.type = 'button';
        starBtn.textContent = fav ? '★' : '☆';
        starBtn.title = fav ? 'Remove from favorites' : 'Add to favorites';
        starBtn.onclick = (e) => {
            e.stopPropagation();
            toggleFavorite(state.activeTab.id, sectionIdForFav, questionIdForFav);

            if (
                section.isFavoritesSection &&
                !getFavoritesForTab(state.activeTab.id).length
            ) {
                const firstReal = (state.activeTab.sections || [])[0];
                if (firstReal) { selectSection(firstReal); return; }
            }
            renderSubtabs();
            renderQuestions();
        };

        li.appendChild(titleBtn);
        li.appendChild(starBtn);
        questionsEl.appendChild(li);
    });
}

function updateHash() {
    if (!state.activeTab) return;
    const parts = [state.activeTab.id];
    if (state.activeSection) parts.push(state.activeSection.id);
    if (state.activeQuestion) parts.push(state.activeQuestion.id);
    location.hash = `#${parts.join('/')}`;
}

// --- navigation ---

async function ensureTabSections(tab) {
    if (tab.sections) return;
    try {
        const data = await fetchJSON(`tabs/${tab.id}.json`);
        tab.sections = data.sections || [];
    } catch {
        tab.sections = [];
    }
}

async function selectTab(tab) {
    state.activeTab = tab;
    state.activeSection = null;
    state.activeQuestion = null;
    renderTabs();
    answerEl.innerHTML = '<p class="hint">Pick a section and question on the left.</p>';

    await ensureTabSections(tab);
    renderSubtabs();

    const sections = getSectionsForActiveTab();
    if (sections.length) {
        selectSection(sections[0]);
    } else {
        questionsTitleEl.textContent = 'Questions';
        questionsEl.innerHTML = '<li><span class="hint" style="padding:8px 10px;display:block;">No sections yet.</span></li>';
        updateHash();
    }
}

function selectSection(section) {
    state.activeSection = section;
    state.activeQuestion = null;
    renderSubtabs();
    renderQuestions();
    answerEl.innerHTML = '<p class="hint">Pick a question on the left.</p>';
    updateHash();
}

async function selectQuestion(q, opts = {}) {
    state.activeQuestion = q;
    renderQuestions();

    const cached = mdCache.has(pathFor(state.activeTab.id, q.file, state.lang)) ||
                   mdCache.has(pathFor(state.activeTab.id, q.file, 'en'));
    if (!cached) answerEl.innerHTML = '<p class="hint">Loading…</p>';

    try {
        const { text, fellBack } = await getQuestionContent(state.activeTab.id, q.file);
        let html = window.marked ? marked.parse(text) : `<pre>${text}</pre>`;
        if (fellBack) {
            html = '<div class="lang-fallback-banner">🇪🇸 Traducción al español pendiente — mostrando la versión en inglés.</div>' + html;
        }
        answerEl.innerHTML = html;
        updateHash();
        if (opts.scroll !== false) {
            answerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        prefetchOtherLang(state.activeTab.id, q.file);
    } catch (err) {
        answerEl.innerHTML = `<p class="error">${err.message}</p>`;
    }
}

function parseHash() {
    const raw = location.hash.replace(/^#/, '');
    if (!raw) return { tabId: null, sectionId: null, questionId: null };
    const [tabId, sectionId, questionId] = raw.split('/');
    return { tabId, sectionId, questionId };
}

// --- search ---

async function buildSearchIndex() {
    const targetLang = state.lang;
    if (searchIndices[targetLang]) return;
    if (buildPromise) {
        await buildPromise;
        if (searchIndices[targetLang]) return;
    }

    buildPromise = (async () => {
        const entries = [];

        for (const tab of state.tabs) {
            await ensureTabSections(tab);
            for (const section of tab.sections) {
                for (const q of (section.questions || [])) {
                    entries.push({
                        tabId: tab.id,
                        tabLabel: tab.label,
                        sectionId: section.id,
                        sectionLabel: section.label,
                        questionId: q.id,
                        title: q.title,
                        file: q.file,
                        body: '',
                    });
                }
            }
        }

        await Promise.all(entries.map(async (e) => {
            const primary = await fetchMd(e.tabId, e.file, targetLang);
            if (primary !== null) { e.body = primary; return; }
            if (targetLang === 'es') {
                const en = await fetchMd(e.tabId, e.file, 'en');
                if (en !== null) e.body = en;
            }
        }));

        searchIndices[targetLang] = entries;
    })();

    try { await buildPromise; }
    finally { buildPromise = null; }
}

function searchEntries(query) {
    const q = query.toLowerCase().trim();
    const idx = searchIndices[state.lang];
    if (q.length < 2 || !idx) return [];
    return idx
        .map((e) => {
            const titleHit = e.title.toLowerCase().includes(q);
            const bodyHit = e.body.toLowerCase().includes(q);
            const sectionHit = e.sectionLabel.toLowerCase().includes(q);
            const tabHit = e.tabLabel.toLowerCase().includes(q);
            if (!titleHit && !bodyHit && !sectionHit && !tabHit) return null;
            return {
                ...e,
                score: (titleHit ? 10 : 0) + (sectionHit ? 5 : 0) + (tabHit ? 3 : 0) + (bodyHit ? 1 : 0),
                snippet: bodyHit ? makeSnippet(e.body, q) : '',
            };
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .slice(0, 30);
}

function makeSnippet(body, query) {
    const idx = body.toLowerCase().indexOf(query);
    if (idx === -1) return '';
    const start = Math.max(0, idx - 60);
    const end = Math.min(body.length, idx + query.length + 60);
    let snip = body.slice(start, end).replace(/[#*`>]/g, '').replace(/\n+/g, ' ').trim();
    if (start > 0) snip = '…' + snip;
    if (end < body.length) snip = snip + '…';
    return snip;
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function highlightMatch(text, query) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(${escaped})`, 'gi');
    return text.replace(re, '<mark>$1</mark>');
}

function renderSearchResults(results, query) {
    searchResultsEl.innerHTML = '';
    if (!results.length) {
        searchStatusEl.textContent = `No results for "${query}"`;
        return;
    }
    searchStatusEl.textContent = `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`;
    results.forEach((r) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.className = 'search-result';
        btn.type = 'button';
        const title = highlightMatch(escapeHtml(r.title), query);
        const snippet = r.snippet ? highlightMatch(escapeHtml(r.snippet), query) : '';
        btn.innerHTML =
            `<div class="search-result-breadcrumb">${escapeHtml(r.tabLabel)} › ${escapeHtml(r.sectionLabel)}</div>` +
            `<div class="search-result-title">${title}</div>` +
            (snippet ? `<div class="search-result-snippet">${snippet}</div>` : '');
        btn.onclick = () => goToResult(r);
        li.appendChild(btn);
        searchResultsEl.appendChild(li);
    });
}

function showBrowseView() {
    browseViewEl.hidden = false;
    searchViewEl.hidden = true;
    if (searchClearEl) searchClearEl.hidden = true;
}

function showSearchView() {
    browseViewEl.hidden = true;
    searchViewEl.hidden = false;
    if (searchClearEl) searchClearEl.hidden = false;
}

function clearSearch() {
    searchInputEl.value = '';
    state.searchQuery = '';
    showBrowseView();
    searchInputEl.focus();
}

async function goToResult(r) {
    clearSearch();

    const tab = state.tabs.find((t) => t.id === r.tabId);
    if (!tab) return;
    if (state.activeTab !== tab) await selectTab(tab);
    const section = (tab.sections || []).find((s) => s.id === r.sectionId);
    if (section) selectSection(section);
    const q = (section?.questions || []).find((qq) => qq.id === r.questionId);
    if (q) await selectQuestion(q);
}

// --- lang toggle ---

function updateLangButtons() {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.lang === state.lang);
    });
}

function wireLangToggle() {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const newLang = btn.dataset.lang;
            if (newLang === state.lang) return;
            state.lang = newLang;
            localStorage.setItem(LANG_KEY, newLang);
            updateLangButtons();
            if (state.activeQuestion) selectQuestion(state.activeQuestion, { scroll: false });
        });
    });
}

// --- search wiring ---

function wireSearch() {
    searchInputEl.addEventListener('input', (e) => {
        const q = e.target.value;
        state.searchQuery = q;
        if (searchTimer) clearTimeout(searchTimer);

        if (!q.trim()) { showBrowseView(); return; }

        showSearchView();
        searchStatusEl.textContent = searchIndices[state.lang] ? 'Searching…' : 'Indexing…';
        searchResultsEl.innerHTML = '';

        searchTimer = setTimeout(async () => {
            await buildSearchIndex();
            if (state.searchQuery !== q) return;
            const results = searchEntries(q);
            renderSearchResults(results, q.trim());
        }, 150);
    });

    searchInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') clearSearch();
    });

    if (searchClearEl) searchClearEl.addEventListener('click', clearSearch);
}

// --- init ---

async function init() {
    updateLangButtons();
    wireLangToggle();
    wireSearch();

    try {
        const data = await fetchJSON('tabs/tabs.json');
        state.tabs = data.tabs || [];
    } catch (err) {
        tabsEl.innerHTML = `<span class="error">${err.message}</span>`;
        return;
    }
    if (!state.tabs.length) {
        tabsEl.innerHTML = '<span class="hint">No categories yet.</span>';
        return;
    }

    // Pre-load every tab manifest in parallel so tab switching is instant
    await Promise.all(state.tabs.map((t) => ensureTabSections(t)));

    const { tabId, sectionId, questionId } = parseHash();
    const initialTab = state.tabs.find((t) => t.id === tabId) || state.tabs[0];
    await selectTab(initialTab);

    if (sectionId) {
        const sections = getSectionsForActiveTab();
        const section = sections.find((s) => s.id === sectionId);
        if (section) selectSection(section);
    }

    if (questionId) {
        const q = (state.activeSection?.questions || []).find((x) => x.id === questionId);
        if (q) await selectQuestion(q);
    }
}

window.addEventListener('DOMContentLoaded', init);
