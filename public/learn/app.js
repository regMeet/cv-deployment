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
const filterBarEl = document.getElementById('filter-bar');
const filterTopicEl = document.getElementById('filter-topic');
const filterOriginEl = document.getElementById('filter-origin');
const filterResetEl = document.getElementById('filter-reset');
const filterRandomEl = document.getElementById('filter-random');
const filterCountEl = document.getElementById('filter-count');
const qnavEl = document.getElementById('qnav');
const qnavPrevEl = document.getElementById('qnav-prev');
const qnavNextEl = document.getElementById('qnav-next');
const qnavPrevTitleEl = document.getElementById('qnav-prev-title');
const qnavNextTitleEl = document.getElementById('qnav-next-title');
const qnavPositionEl = document.getElementById('qnav-position');
const drawerToggleEl = document.getElementById('drawer-toggle');
const drawerBackdropEl = document.getElementById('drawer-backdrop');

const FAV_KEY = 'learn:favorites';
const PROGRESS_KEY = 'learn:progress';
const LANG_KEY = 'app:lang';
const STATUS_CYCLE = ['pending', 'progress', 'solved'];
const STATUS_GLYPH = { pending: '○', progress: '◐', solved: '●' };
const TAB_ICONS = { java: '☕', react: '⚛️', javascript: '🟨', typescript: '🔷', sql: '🗄️', manager: '👔' };

const I18N = {
    en: {
        questionsHeader: 'Questions',
        favorites: '★ Favorites',
        addFav: 'Add to favorites',
        removeFav: 'Remove from favorites',
        noQuestions: 'No questions yet.',
        noSections: 'No sections yet.',
        noCategories: 'No categories yet.',
        pickSectionAndQuestion: 'Pick a section and question on the left.',
        pickQuestion: 'Pick a question on the left.',
        pickCategoryAndQuestion: 'Pick a category and a question on the left.',
        loading: 'Loading…',
        searchPlaceholder: 'Search…',
        searching: 'Searching…',
        indexing: 'Indexing…',
        searchResults: 'Search results',
        noResults: (q) => `No results for "${q}"`,
        results: (n, q) => `${n} result${n === 1 ? '' : 's'} for "${q}"`,
        filterTopic: 'Topic',
        filterOrigin: 'Origin',
        filterReset: 'Reset',
        filterRandom: '🎲',
        filterAll: 'All',
        filterCount: (shown, total) => `${shown} / ${total}`,
        noFilterMatch: 'No questions match the selected filters.',
        navPrev: 'Previous',
        navNext: 'Next',
        navPosition: (i, n) => `${i} / ${n}`,
        copy: 'Copy',
        copied: 'Copied',
        statusPending: 'Mark as in progress',
        statusInProgress: 'Mark as solved',
        statusSolved: 'Reset to pending',
        sectionProgress: (s, t) => `${s}/${t} solved`,
    },
    es: {
        questionsHeader: 'Preguntas',
        favorites: '★ Favoritos',
        addFav: 'Agregar a favoritos',
        removeFav: 'Quitar de favoritos',
        noQuestions: 'Aún no hay preguntas.',
        noSections: 'Aún no hay secciones.',
        noCategories: 'Aún no hay categorías.',
        pickSectionAndQuestion: 'Elegí una sección y una pregunta a la izquierda.',
        pickQuestion: 'Elegí una pregunta a la izquierda.',
        pickCategoryAndQuestion: 'Elegí una categoría y una pregunta a la izquierda.',
        loading: 'Cargando…',
        searchPlaceholder: 'Buscar…',
        searching: 'Buscando…',
        indexing: 'Indexando…',
        searchResults: 'Resultados de búsqueda',
        noResults: (q) => `Sin resultados para "${q}"`,
        results: (n, q) => `${n} resultado${n === 1 ? '' : 's'} para "${q}"`,
        filterTopic: 'Tema',
        filterOrigin: 'Origen',
        filterReset: 'Limpiar',
        filterRandom: '🎲',
        filterAll: 'Todos',
        filterCount: (shown, total) => `${shown} / ${total}`,
        noFilterMatch: 'Ninguna pregunta coincide con los filtros.',
        navPrev: 'Anterior',
        navNext: 'Siguiente',
        navPosition: (i, n) => `${i} / ${n}`,
        copy: 'Copiar',
        copied: 'Copiado',
        statusPending: 'Marcar como en progreso',
        statusInProgress: 'Marcar como resuelta',
        statusSolved: 'Volver a pendiente',
        sectionProgress: (s, t) => `${s}/${t} resueltas`,
    },
};

function t(key) {
    const v = I18N[state.lang]?.[key];
    return v !== undefined ? v : I18N.en[key];
}

function pickLabel(item) {
    if (!item) return '';
    if (state.lang === 'es' && item.label_es) return item.label_es;
    return item.label || '';
}

function pickTitle(item) {
    if (!item) return '';
    if (state.lang === 'es' && item.title_es) return item.title_es;
    return item.title || '';
}

const mdCache = new Map();              // path → text (raw)
const searchIndices = { en: null, es: null };

const state = {
    tabs: [],
    activeTab: null,
    activeSection: null,
    activeQuestion: null,
    favorites: loadFavorites(),
    progress: loadProgress(),
    lang: localStorage.getItem(LANG_KEY) || 'en',
    searchQuery: '',
    filterTopic: '',
    filterOrigin: '',
};

function sectionSupportsFilters(section) {
    if (!section) return false;
    return (section.questions || []).some((q) => (q.topics && q.topics.length) || q.origin);
}

function getFilteredQuestions(section) {
    if (!section) return [];
    const all = section.questions || [];
    if (!sectionSupportsFilters(section)) return all;
    if (!state.filterTopic && !state.filterOrigin) return all;
    return all.filter((q) => {
        if (state.filterTopic) {
            const topics = q.topics || [];
            if (!topics.includes(state.filterTopic)) return false;
        }
        if (state.filterOrigin) {
            if (q.origin !== state.filterOrigin) return false;
        }
        return true;
    });
}

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

// --- progress tracking ---

function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
    catch { return {}; }
}

function saveProgress() {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress));
}

function getStatus(tabId, sectionId, questionId) {
    return state.progress?.[tabId]?.[sectionId]?.[questionId] || 'pending';
}

function setStatus(tabId, sectionId, questionId, status) {
    state.progress[tabId] = state.progress[tabId] || {};
    state.progress[tabId][sectionId] = state.progress[tabId][sectionId] || {};
    if (status === 'pending') {
        delete state.progress[tabId][sectionId][questionId];
        if (!Object.keys(state.progress[tabId][sectionId]).length) {
            delete state.progress[tabId][sectionId];
        }
        if (!Object.keys(state.progress[tabId] || {}).length) {
            delete state.progress[tabId];
        }
    } else {
        state.progress[tabId][sectionId][questionId] = status;
    }
    saveProgress();
}

function cycleStatus(tabId, sectionId, questionId) {
    const cur = getStatus(tabId, sectionId, questionId);
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(cur) + 1) % STATUS_CYCLE.length];
    setStatus(tabId, sectionId, questionId, next);
    return next;
}

function countSolved(tabId, sectionId, questions) {
    const map = state.progress?.[tabId]?.[sectionId] || {};
    let solved = 0;
    for (const q of questions) {
        if (map[q.id] === 'solved') solved++;
    }
    return solved;
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
                title_es: realQ.title_es,
                file: realQ.file,
                originSectionId: f.sectionId,
                originSectionLabel: realSection.label,
                originSectionLabel_es: realSection.label_es,
                originQuestionId: f.questionId,
            };
        })
        .filter(Boolean);
    if (!questions.length) return null;
    return {
        id: 'favorites',
        label: '★ Favorites',
        label_es: '★ Favoritos',
        questions,
        isFavoritesSection: true,
    };
}

// --- fetch + cache ---

async function fetchJSON(path) {
    const res = await fetch(path, { cache: 'no-cache' });
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
        const res = await fetch(path, { cache: 'no-cache' });
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
        btn.innerHTML = `<span class="tab-icon">${icon}</span><span class="tab-label">${escapeHtml(pickLabel(tab))}</span>`;
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
        btn.textContent = pickLabel(section);
        btn.onclick = () => selectSection(section);
        subtabsEl.appendChild(btn);
    });
}

function uniqueSorted(values) {
    return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function computeFacetCounts(section) {
    const all = section?.questions || [];
    const topicCounts = {};
    const originCounts = {};
    let allTopicsTotal = 0;
    let allOriginsTotal = 0;
    for (const q of all) {
        const topics = q.topics || [];
        const origin = q.origin;
        const topicMatch = !state.filterTopic || topics.includes(state.filterTopic);
        const originMatch = !state.filterOrigin || origin === state.filterOrigin;
        // Topic options reflect the current Origin filter
        if (originMatch) {
            for (const tp of topics) {
                topicCounts[tp] = (topicCounts[tp] || 0) + 1;
            }
            allTopicsTotal++;
        }
        // Origin options reflect the current Topic filter
        if (topicMatch) {
            if (origin) originCounts[origin] = (originCounts[origin] || 0) + 1;
            allOriginsTotal++;
        }
    }
    return { topicCounts, originCounts, allTopicsTotal, allOriginsTotal };
}

function populateFilterDropdowns(section) {
    if (!filterTopicEl || !filterOriginEl) return;
    const all = section?.questions || [];
    const topics = uniqueSorted(all.flatMap((q) => q.topics || []));
    const origins = uniqueSorted(all.map((q) => q.origin));
    const { topicCounts, originCounts, allTopicsTotal, allOriginsTotal } = computeFacetCounts(section);

    const fillSelect = (el, values, current, counts, allTotal) => {
        const allLabel = t('filterAll');
        el.innerHTML = '';
        const optAll = document.createElement('option');
        optAll.value = '';
        optAll.textContent = `${allLabel} (${allTotal})`;
        el.appendChild(optAll);
        values.forEach((v) => {
            const opt = document.createElement('option');
            opt.value = v;
            const n = counts[v] || 0;
            opt.textContent = `${v} (${n})`;
            if (n === 0 && v !== current) opt.disabled = true;
            el.appendChild(opt);
        });
        el.value = values.includes(current) ? current : '';
    };

    fillSelect(filterTopicEl, topics, state.filterTopic, topicCounts, allTopicsTotal);
    fillSelect(filterOriginEl, origins, state.filterOrigin, originCounts, allOriginsTotal);
    if (filterTopicEl.value === '') state.filterTopic = '';
    if (filterOriginEl.value === '') state.filterOrigin = '';
}

function applyStaticI18nFilters() {
    if (!filterBarEl) return;
    filterBarEl.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n;
        if (key) el.textContent = t(key);
    });
}

function updateFilterBar(section, shown, total) {
    if (!filterBarEl) return;
    const enabled = sectionSupportsFilters(section);
    filterBarEl.hidden = !enabled;
    if (!enabled) return;
    populateFilterDropdowns(section);
    applyStaticI18nFilters();
    const hasFilter = !!(state.filterTopic || state.filterOrigin);
    if (filterResetEl) filterResetEl.disabled = !hasFilter;
    if (filterCountEl) filterCountEl.textContent = t('filterCount')(shown, total);
}

function renderQuestions() {
    const section = state.activeSection;
    const total = section?.questions?.length ?? 0;
    const questions = getFilteredQuestions(section);
    const count = questions.length;
    let titleHtml = section
        ? `${escapeHtml(pickLabel(section))} <span class="count">${count}</span>`
        : t('questionsHeader');
    if (section && !section.isFavoritesSection && total > 0) {
        const solved = countSolved(state.activeTab.id, section.id, section.questions || []);
        if (solved > 0) {
            titleHtml += ` <span class="count count-solved">${escapeHtml(t('sectionProgress')(solved, total))}</span>`;
        }
    }
    questionsTitleEl.innerHTML = titleHtml;
    updateFilterBar(section, count, total);
    questionsEl.innerHTML = '';
    if (!questions.length) {
        const li = document.createElement('li');
        const msg = total > 0 ? t('noFilterMatch') : t('noQuestions');
        li.innerHTML = `<span class="hint" style="padding:8px 10px;display:block;">${escapeHtml(msg)}</span>`;
        questionsEl.appendChild(li);
        return;
    }
    questions.forEach((q) => {
        const li = document.createElement('li');
        li.className = 'question-item';

        const sectionIdForRef = section.isFavoritesSection ? q.originSectionId : section.id;
        const questionIdForRef = section.isFavoritesSection ? q.originQuestionId : q.id;

        const status = getStatus(state.activeTab.id, sectionIdForRef, questionIdForRef);

        // Status button (cycles pending → progress → solved)
        const statusBtn = document.createElement('button');
        statusBtn.className = `status-btn status-${status}`;
        statusBtn.type = 'button';
        statusBtn.textContent = STATUS_GLYPH[status];
        statusBtn.title =
            status === 'pending'    ? t('statusPending')    :
            status === 'progress'   ? t('statusInProgress') :
                                      t('statusSolved');
        statusBtn.onclick = (e) => {
            e.stopPropagation();
            cycleStatus(state.activeTab.id, sectionIdForRef, questionIdForRef);
            renderQuestions();
        };

        const titleBtn = document.createElement('button');
        titleBtn.className = 'question-title' + (q.id === state.activeQuestion?.id ? ' active' : '');
        titleBtn.type = 'button';
        titleBtn.onclick = () => selectQuestion(q);

        if (section.isFavoritesSection) {
            const badge = document.createElement('span');
            badge.className = 'origin-badge';
            badge.textContent = pickLabel({ label: q.originSectionLabel, label_es: q.originSectionLabel_es });
            const text = document.createElement('span');
            text.textContent = pickTitle(q);
            titleBtn.appendChild(badge);
            titleBtn.appendChild(text);
        } else if (q.origin) {
            const badge = document.createElement('span');
            badge.className = 'origin-badge';
            badge.textContent = q.origin;
            const text = document.createElement('span');
            text.textContent = pickTitle(q);
            titleBtn.appendChild(badge);
            titleBtn.appendChild(text);
        } else {
            titleBtn.textContent = pickTitle(q);
        }

        const fav = isFavorite(state.activeTab.id, sectionIdForRef, questionIdForRef);

        const starBtn = document.createElement('button');
        starBtn.className = 'star-btn' + (fav ? ' active' : '');
        starBtn.type = 'button';
        starBtn.textContent = fav ? '★' : '☆';
        starBtn.title = fav ? t('removeFav') : t('addFav');
        starBtn.onclick = (e) => {
            e.stopPropagation();
            toggleFavorite(state.activeTab.id, sectionIdForRef, questionIdForRef);

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

        li.appendChild(statusBtn);
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
    answerEl.innerHTML = `<p class="hint">${escapeHtml(t('pickSectionAndQuestion'))}</p>`;
    updateQnav();

    await ensureTabSections(tab);
    renderSubtabs();

    const sections = getSectionsForActiveTab();
    if (sections.length) {
        selectSection(sections[0]);
    } else {
        questionsTitleEl.textContent = t('questionsHeader');
        questionsEl.innerHTML = `<li><span class="hint" style="padding:8px 10px;display:block;">${escapeHtml(t('noSections'))}</span></li>`;
        updateHash();
    }
}

function selectSection(section) {
    if (state.activeSection?.id !== section?.id) {
        state.filterTopic = '';
        state.filterOrigin = '';
    }
    state.activeSection = section;
    state.activeQuestion = null;
    renderSubtabs();
    renderQuestions();
    answerEl.innerHTML = `<p class="hint">${escapeHtml(t('pickQuestion'))}</p>`;
    updateQnav();
    updateHash();
}

async function selectQuestion(q, opts = {}) {
    state.activeQuestion = q;
    renderQuestions();

    const cached = mdCache.has(pathFor(state.activeTab.id, q.file, state.lang)) ||
                   mdCache.has(pathFor(state.activeTab.id, q.file, 'en'));
    if (!cached) answerEl.innerHTML = `<p class="hint">${escapeHtml(t('loading'))}</p>`;

    try {
        const { text, fellBack } = await getQuestionContent(state.activeTab.id, q.file);
        let html = window.marked ? marked.parse(text) : `<pre>${text}</pre>`;
        if (fellBack) {
            html = '<div class="lang-fallback-banner">🇪🇸 Traducción al español pendiente — mostrando la versión en inglés.</div>' + html;
        }
        answerEl.innerHTML = html;
        enhanceCodeBlocks(answerEl);
        updateQnav();
        updateHash();
        maybeCloseDrawer();
        if (opts.scroll !== false) {
            answerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        prefetchOtherLang(state.activeTab.id, q.file);
    } catch (err) {
        answerEl.innerHTML = `<p class="error">${err.message}</p>`;
        updateQnav();
    }
}

// --- Prism + copy buttons ---

function enhanceCodeBlocks(root) {
    const pres = root.querySelectorAll('pre');
    pres.forEach((pre) => {
        if (pre.parentElement?.classList.contains('code-block')) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.textContent = t('copy');
        btn.addEventListener('click', () => copyCode(pre, btn));
        wrapper.appendChild(btn);
    });
    if (window.Prism) {
        try { window.Prism.highlightAllUnder(root); } catch {}
    }
}

function copyCode(pre, btn) {
    const code = pre.querySelector('code')?.textContent ?? pre.textContent ?? '';
    const done = () => {
        btn.classList.add('copied');
        btn.textContent = t('copied');
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.textContent = t('copy');
        }, 1500);
    };
    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(code).then(done, () => fallbackCopy(code, done));
    } else {
        fallbackCopy(code, done);
    }
}

function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch {}
    document.body.removeChild(ta);
}

// --- Question navigation (prev/next + keyboard) ---

function updateQnav() {
    if (!qnavEl) return;
    const section = state.activeSection;
    const q = state.activeQuestion;
    if (!section || !q) {
        qnavEl.hidden = true;
        return;
    }
    const list = getFilteredQuestions(section);
    const idx = list.findIndex((x) => x.id === q.id);
    if (idx === -1 || list.length <= 1) {
        qnavEl.hidden = true;
        return;
    }
    qnavEl.hidden = false;
    const prev = idx > 0 ? list[idx - 1] : null;
    const next = idx < list.length - 1 ? list[idx + 1] : null;

    qnavPrevEl.disabled = !prev;
    qnavNextEl.disabled = !next;
    qnavPrevTitleEl.textContent = prev ? pickTitle(prev) : '';
    qnavNextTitleEl.textContent = next ? pickTitle(next) : '';
    qnavPositionEl.textContent = t('navPosition')(idx + 1, list.length);

    qnavPrevEl.onclick = () => prev && selectQuestion(prev);
    qnavNextEl.onclick = () => next && selectQuestion(next);
}

function navAdjacent(delta) {
    const section = state.activeSection;
    if (!section) return;
    const list = getFilteredQuestions(section);
    if (!list.length) return;
    const cur = state.activeQuestion;
    const curIdx = cur ? list.findIndex((x) => x.id === cur.id) : -1;
    const nextIdx = curIdx === -1
        ? (delta > 0 ? 0 : list.length - 1)
        : curIdx + delta;
    if (nextIdx < 0 || nextIdx >= list.length) return;
    selectQuestion(list[nextIdx]);
}

function pickRandom() {
    const list = getFilteredQuestions(state.activeSection);
    if (!list.length) return;
    let pick = list[Math.floor(Math.random() * list.length)];
    if (list.length > 1 && pick.id === state.activeQuestion?.id) {
        const others = list.filter((x) => x.id !== pick.id);
        pick = others[Math.floor(Math.random() * others.length)];
    }
    selectQuestion(pick);
}

function isTextInput(el) {
    if (!el) return false;
    const tag = el.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (el.isContentEditable) return true;
    return false;
}

function wireKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) {
            closeDrawer();
            return;
        }
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (isTextInput(document.activeElement)) return;
        if (e.key === 'j' || e.key === 'ArrowDown') {
            e.preventDefault();
            navAdjacent(1);
        } else if (e.key === 'k' || e.key === 'ArrowUp') {
            e.preventDefault();
            navAdjacent(-1);
        } else if (e.key === 'r' && state.activeSection) {
            e.preventDefault();
            pickRandom();
        }
    });
}

// --- Mobile drawer ---

function isMobile() {
    return window.matchMedia('(max-width: 900px)').matches;
}

function openDrawer() {
    document.body.classList.add('drawer-open');
    drawerToggleEl?.setAttribute('aria-expanded', 'true');
}

function closeDrawer() {
    document.body.classList.remove('drawer-open');
    drawerToggleEl?.setAttribute('aria-expanded', 'false');
}

function maybeCloseDrawer() {
    if (isMobile()) closeDrawer();
}

function wireDrawer() {
    if (drawerToggleEl) {
        drawerToggleEl.addEventListener('click', () => {
            if (document.body.classList.contains('drawer-open')) closeDrawer();
            else openDrawer();
        });
    }
    if (drawerBackdropEl) {
        drawerBackdropEl.addEventListener('click', closeDrawer);
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
                        tabLabel_es: tab.label_es,
                        sectionId: section.id,
                        sectionLabel: section.label,
                        sectionLabel_es: section.label_es,
                        questionId: q.id,
                        title: q.title,
                        title_es: q.title_es,
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
            const title = pickTitle(e);
            const sectionLabel = pickLabel({ label: e.sectionLabel, label_es: e.sectionLabel_es });
            const tabLabel = pickLabel({ label: e.tabLabel, label_es: e.tabLabel_es });
            const titleHit = title.toLowerCase().includes(q);
            const bodyHit = e.body.toLowerCase().includes(q);
            const sectionHit = sectionLabel.toLowerCase().includes(q);
            const tabHit = tabLabel.toLowerCase().includes(q);
            if (!titleHit && !bodyHit && !sectionHit && !tabHit) return null;
            return {
                ...e,
                displayTitle: title,
                displaySectionLabel: sectionLabel,
                displayTabLabel: tabLabel,
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
        searchStatusEl.textContent = t('noResults')(query);
        return;
    }
    searchStatusEl.textContent = t('results')(results.length, query);
    results.forEach((r) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.className = 'search-result';
        btn.type = 'button';
        const title = highlightMatch(escapeHtml(r.displayTitle || r.title), query);
        const snippet = r.snippet ? highlightMatch(escapeHtml(r.snippet), query) : '';
        const tabLabel = r.displayTabLabel || r.tabLabel;
        const sectionLabel = r.displaySectionLabel || r.sectionLabel;
        btn.innerHTML =
            `<div class="search-result-breadcrumb">${escapeHtml(tabLabel)} › ${escapeHtml(sectionLabel)}</div>` +
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

function applyStaticI18n() {
    if (searchInputEl) {
        searchInputEl.placeholder = t('searchPlaceholder');
        searchInputEl.setAttribute('aria-label', t('searchPlaceholder'));
    }
    if (searchStatusEl && searchViewEl?.hidden !== false) {
        searchStatusEl.textContent = t('searchResults');
    }
}

function wireLangToggle() {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const newLang = btn.dataset.lang;
            if (newLang === state.lang) return;
            state.lang = newLang;
            localStorage.setItem(LANG_KEY, newLang);
            updateLangButtons();
            applyStaticI18n();
            renderTabs();
            renderSubtabs();
            renderQuestions();
            if (state.activeQuestion) selectQuestion(state.activeQuestion, { scroll: false });
            if (state.searchQuery && state.searchQuery.trim()) {
                buildSearchIndex().then(() => {
                    const results = searchEntries(state.searchQuery);
                    renderSearchResults(results, state.searchQuery.trim());
                });
            }
        });
    });
}

// --- filter wiring ---

function wireFilters() {
    if (!filterTopicEl || !filterOriginEl) return;
    const onFilterChange = () => {
        state.activeQuestion = null;
        renderQuestions();
        answerEl.innerHTML = `<p class="hint">${escapeHtml(t('pickQuestion'))}</p>`;
        updateQnav();
    };
    filterTopicEl.addEventListener('change', () => {
        state.filterTopic = filterTopicEl.value;
        onFilterChange();
    });
    filterOriginEl.addEventListener('change', () => {
        state.filterOrigin = filterOriginEl.value;
        onFilterChange();
    });
    if (filterResetEl) {
        filterResetEl.addEventListener('click', () => {
            state.filterTopic = '';
            state.filterOrigin = '';
            onFilterChange();
        });
    }
    if (filterRandomEl) {
        filterRandomEl.addEventListener('click', pickRandom);
    }
}

// --- search wiring ---

function wireSearch() {
    searchInputEl.addEventListener('input', (e) => {
        const q = e.target.value;
        state.searchQuery = q;
        if (searchTimer) clearTimeout(searchTimer);

        if (!q.trim()) { showBrowseView(); return; }

        showSearchView();
        searchStatusEl.textContent = searchIndices[state.lang] ? t('searching') : t('indexing');
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
    applyStaticI18n();
    wireLangToggle();
    wireSearch();
    wireFilters();
    wireKeyboardNav();
    wireDrawer();

    answerEl.innerHTML = `<p class="hint">${escapeHtml(t('pickCategoryAndQuestion'))}</p>`;
    questionsTitleEl.textContent = t('questionsHeader');

    try {
        const data = await fetchJSON('tabs/tabs.json');
        state.tabs = data.tabs || [];
    } catch (err) {
        tabsEl.innerHTML = `<span class="error">${err.message}</span>`;
        return;
    }
    if (!state.tabs.length) {
        tabsEl.innerHTML = `<span class="hint">${escapeHtml(t('noCategories'))}</span>`;
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
