const tabsEl = document.getElementById('tabs');
const subtabsEl = document.getElementById('subtabs');
const questionsEl = document.getElementById('questions');
const answerEl = document.getElementById('answer');
const questionsTitleEl = document.getElementById('questions-title');
const browseViewEl = document.getElementById('browse-view');
const searchViewEl = document.getElementById('search-view');
const searchInputEl = document.getElementById('search-input');
const searchResultsEl = document.getElementById('search-results');
const searchStatusEl = document.getElementById('search-status');

const FAV_KEY = 'learn:favorites';
const LANG_KEY = 'app:lang';

const state = {
    tabs: [],
    activeTab: null,
    activeSection: null,
    activeQuestion: null,
    favorites: loadFavorites(),
    lang: localStorage.getItem(LANG_KEY) || 'en',
    searchQuery: '',
    searchIndex: null,
    indexLang: null,
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

function getFavoritesForTab(tabId) {
    return state.favorites[tabId] || [];
}

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

// --- fetch helpers ---

async function fetchJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
}

async function fetchText(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.text();
}

function esify(file) {
    return file.replace(/\.md$/, '.es.md');
}

async function fetchQuestionMd(tabId, file) {
    if (state.lang === 'es') {
        const esRes = await fetch(`questions/${tabId}/${esify(file)}`);
        if (esRes.ok) return { text: await esRes.text(), fellBack: false };
    }
    const path = `questions/${tabId}/${file}`;
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return { text: await res.text(), fellBack: state.lang === 'es' };
}

async function fetchQuestionMdForIndex(tabId, file) {
    try {
        if (state.lang === 'es') {
            const esRes = await fetch(`questions/${tabId}/${esify(file)}`);
            if (esRes.ok) return await esRes.text();
        }
        const res = await fetch(`questions/${tabId}/${file}`);
        if (res.ok) return await res.text();
    } catch {}
    return '';
}

// --- rendering ---

function renderTabs() {
    tabsEl.innerHTML = '';
    state.tabs.forEach((tab) => {
        const btn = document.createElement('button');
        btn.className = 'tab' + (tab.id === state.activeTab?.id ? ' active' : '');
        btn.textContent = tab.label;
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
        btn.textContent = section.label;
        btn.onclick = () => selectSection(section);
        subtabsEl.appendChild(btn);
    });
}

function renderQuestions() {
    const section = state.activeSection;
    questionsTitleEl.textContent = section ? `${section.label} questions` : 'Questions';
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
                if (firstReal) {
                    selectSection(firstReal);
                    return;
                }
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

async function selectTab(tab) {
    state.activeTab = tab;
    state.activeSection = null;
    state.activeQuestion = null;
    renderTabs();
    answerEl.innerHTML = '<p class="hint">Pick a section and question on the left.</p>';

    if (!tab.sections) {
        try {
            const data = await fetchJSON(`tabs/${tab.id}.json`);
            tab.sections = data.sections || [];
        } catch (err) {
            subtabsEl.innerHTML = `<span class="error">${err.message}</span>`;
            return;
        }
    }

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

async function selectQuestion(q) {
    state.activeQuestion = q;
    renderQuestions();
    answerEl.innerHTML = '<p class="hint">Loading…</p>';
    try {
        const { text, fellBack } = await fetchQuestionMd(state.activeTab.id, q.file);
        let html = window.marked ? marked.parse(text) : `<pre>${text}</pre>`;
        if (fellBack) {
            html = '<div class="lang-fallback-banner">🇪🇸 Traducción al español pendiente — mostrando la versión en inglés.</div>' + html;
        }
        answerEl.innerHTML = html;
        updateHash();
        answerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    if (state.searchIndex && state.indexLang === state.lang) return;
    if (buildPromise) { await buildPromise; if (state.searchIndex && state.indexLang === state.lang) return; }

    const targetLang = state.lang;

    buildPromise = (async () => {
        const entries = [];

        for (const tab of state.tabs) {
            if (!tab.sections) {
                try {
                    const data = await fetchJSON(`tabs/${tab.id}.json`);
                    tab.sections = data.sections || [];
                } catch { tab.sections = []; }
            }
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
            e.body = await fetchQuestionMdForIndex(e.tabId, e.file);
        }));

        if (state.lang === targetLang) {
            state.searchIndex = entries;
            state.indexLang = targetLang;
        }
    })();

    try { await buildPromise; }
    finally { buildPromise = null; }
}

function searchEntries(query) {
    const q = query.toLowerCase().trim();
    if (q.length < 2 || !state.searchIndex) return [];
    return state.searchIndex
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
}

function showSearchView() {
    browseViewEl.hidden = true;
    searchViewEl.hidden = false;
}

async function goToResult(r) {
    searchInputEl.value = '';
    state.searchQuery = '';
    showBrowseView();

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
            state.searchIndex = null;
            state.indexLang = null;
            if (state.activeQuestion) selectQuestion(state.activeQuestion);
        });
    });
}

// --- search wiring ---

function wireSearch() {
    searchInputEl.addEventListener('input', (e) => {
        const q = e.target.value;
        state.searchQuery = q;
        if (searchTimer) clearTimeout(searchTimer);

        if (!q.trim()) {
            showBrowseView();
            return;
        }

        showSearchView();
        searchStatusEl.textContent = state.searchIndex && state.indexLang === state.lang ? 'Searching…' : 'Indexing…';
        searchResultsEl.innerHTML = '';

        searchTimer = setTimeout(async () => {
            await buildSearchIndex();
            if (state.searchQuery !== q) return; // user kept typing
            const results = searchEntries(q);
            renderSearchResults(results, q.trim());
        }, 200);
    });

    searchInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInputEl.value = '';
            state.searchQuery = '';
            showBrowseView();
        }
    });
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
