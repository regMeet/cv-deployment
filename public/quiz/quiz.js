// /quiz — multi-category MC quiz with daily mode (date-seeded), no-repeat tracking,
// history, per-cat stats, shuffled options, optional timer, review-wrong, and a
// keyboard shortcuts overlay.

const LANG_KEY = 'app:lang';
const ASKED_KEY = 'quiz:asked';        // { [catId]: string[] }
const HISTORY_KEY = 'quiz:history';    // [{ date, score, total, mode, picks: [{catId, qId, ok}] }]
const TIMED_KEY = 'quiz:timed';        // '1' | '0'

const TIMED_SECONDS = 30;

const I18N = {
    en: {
        title: 'Daily Quiz',
        back: 'Learn',
        loading: 'Loading…',
        introTitle: 'Stay sharp.',
        introBody: 'One random multiple-choice question per category. Track your streak, beat your average, never see the same question twice (until the pool resets).',
        next: 'Next',
        again: 'Another round',
        backHome: 'Back to Learn',
        historyTitle: 'History',
        resetHistory: 'Reset history & seen questions',
        statTotal: 'Quizzes',
        statStreak: 'Streak',
        statBest: 'Best',
        statAvg: 'Avg',
        progress: (i, n) => `${i} / ${n}`,
        correct: 'Correct',
        wrong: 'Wrong',
        timeUp: 'Time’s up',
        resultBadge: { perfect: 'Perfect run! 🎉', great: 'Great work.', good: 'Solid.', meh: 'Keep grinding.' },
        resultScore: (s, t) => `${s} / ${t}`,
        confirmReset: 'Reset all quiz history and seen questions?',
        noHistory: 'No quizzes taken yet.',
        loadError: 'Could not load the quiz bank.',
        poolResetHint: '🔁 You\'ve seen all the questions in this category — pool just reset.',
        correctAnswer: 'Correct answer',
        readMore: 'Read deep dive →',
        dailyTitle: 'Daily',
        dailyDoneSub: '✓ Done today — see results',
        dailyOpenSub: 'Today\'s set',
        freeplayTitle: 'Free play',
        freeplaySub: 'Random pick',
        timedMode: 'Timed mode (30s / question)',
        modeDaily: 'Daily',
        modeFree: 'Free',
        modeReview: 'Review',
        reviewWrong: (n) => `Review wrong (${n})`,
        reviewDone: 'Review complete — keep practicing.',
        kbdHelpTitle: 'Keyboard shortcuts',
        kbdPick: 'Pick an answer',
        kbdNext: 'Next · Start · Again',
        kbdLang: 'Toggle language',
        kbdHelp: 'Show this help',
        kbdClose: 'Close help',
        kbdCloseBtn: 'Close',
    },
    es: {
        title: 'Quiz diario',
        back: 'Learn',
        loading: 'Cargando…',
        introTitle: 'Mantenete afilado.',
        introBody: 'Una pregunta multiple-choice random por categoría. Trackeá tu racha, superá tu promedio, no veas la misma pregunta dos veces (hasta que el pool se resetee).',
        next: 'Siguiente',
        again: 'Otra ronda',
        backHome: 'Volver a Learn',
        historyTitle: 'Historial',
        resetHistory: 'Resetear historial y preguntas vistas',
        statTotal: 'Quizzes',
        statStreak: 'Racha',
        statBest: 'Mejor',
        statAvg: 'Prom',
        progress: (i, n) => `${i} / ${n}`,
        correct: 'Correcta',
        wrong: 'Incorrecta',
        timeUp: '¡Tiempo!',
        resultBadge: { perfect: '¡Perfecto! 🎉', great: 'Muy bien.', good: 'Sólido.', meh: 'A seguir entrenando.' },
        resultScore: (s, t) => `${s} / ${t}`,
        confirmReset: '¿Resetear todo el historial y las preguntas vistas?',
        noHistory: 'Todavía no hiciste ningún quiz.',
        loadError: 'No se pudo cargar el bank.',
        poolResetHint: '🔁 Ya viste todas las preguntas de esta categoría — el pool se reseteó.',
        correctAnswer: 'Respuesta correcta',
        readMore: 'Profundizar →',
        dailyTitle: 'Daily',
        dailyDoneSub: '✓ Hecho hoy — ver resultado',
        dailyOpenSub: 'El set de hoy',
        freeplayTitle: 'Free play',
        freeplaySub: 'Elección random',
        timedMode: 'Modo timed (30s / pregunta)',
        modeDaily: 'Daily',
        modeFree: 'Free',
        modeReview: 'Review',
        reviewWrong: (n) => `Revisar las que erraste (${n})`,
        reviewDone: 'Review terminado — a seguir practicando.',
        kbdHelpTitle: 'Atajos de teclado',
        kbdPick: 'Elegir respuesta',
        kbdNext: 'Siguiente · Empezar · Otra ronda',
        kbdLang: 'Cambiar idioma',
        kbdHelp: 'Mostrar esta ayuda',
        kbdClose: 'Cerrar ayuda',
        kbdCloseBtn: 'Cerrar',
    },
};

const state = {
    lang: localStorage.getItem(LANG_KEY) || 'en',
    bank: null,
    quiz: null,        // { picks: [{ category, q, displayOrder, resetHint }], current, answers, mode, timed }
    answeredCurrent: false,
    timer: null,       // { intervalId, secondsLeft }
    timed: localStorage.getItem(TIMED_KEY) === '1',
};

const $ = (sel) => document.querySelector(sel);
const screens = {
    loading: $('#screen-loading'),
    intro: $('#screen-intro'),
    question: $('#screen-question'),
    result: $('#screen-result'),
};

function t(key) {
    const v = I18N[state.lang]?.[key];
    return v !== undefined ? v : I18N.en[key];
}

function showScreen(name) {
    Object.entries(screens).forEach(([k, el]) => { el.hidden = (k !== name); });
}

// --- localStorage ---

function readJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
}
function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
const getAsked   = () => readJSON(ASKED_KEY, {});
const setAsked   = (v) => writeJSON(ASKED_KEY, v);
const getHistory = () => readJSON(HISTORY_KEY, []);
const setHistory = (v) => writeJSON(HISTORY_KEY, v);

// --- seeded RNG (mulberry32) ---

function makeRng(seed) {
    let s = seed >>> 0;
    return function () {
        s = (s + 0x6D2B79F5) | 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
function dateSeed(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}
function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function shuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function range(n) { return Array.from({ length: n }, (_, i) => i); }

// --- stats ---

function computeStats() {
    const hist = getHistory();
    if (!hist.length) return { total: 0, streak: 0, best: 0, avgPct: null };
    const total = hist.length;
    const best = hist.reduce((m, h) => Math.max(m, h.score), 0);
    const avg = hist.reduce((s, h) => s + (h.score / h.total), 0) / total;

    const dates = Array.from(new Set(hist.map((h) => h.date))).sort();
    let streak = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    for (let i = dates.length - 1; i >= 0; i--) {
        const d = new Date(dates[i]);
        d.setHours(0, 0, 0, 0);
        if (d.getTime() === cursor.getTime()) {
            streak++;
            cursor.setDate(cursor.getDate() - 1);
        } else if (d.getTime() < cursor.getTime()) break;
    }
    return { total, streak, best, avgPct: Math.round(avg * 100) };
}

function computeCategoryStats() {
    const hist = getHistory();
    const map = {};
    for (const h of hist) {
        for (const p of (h.picks || [])) {
            const m = (map[p.catId] ||= { ok: 0, total: 0 });
            m.total++;
            if (p.ok) m.ok++;
        }
    }
    return map;
}

function renderStats() {
    const s = computeStats();
    $('#stats-row').innerHTML = `
        <div class="qstat"><span class="qstat-value">${s.total}</span><span class="qstat-label">${escapeHtml(t('statTotal'))}</span></div>
        <div class="qstat"><span class="qstat-value">${s.streak}</span><span class="qstat-label">${escapeHtml(t('statStreak'))}</span></div>
        <div class="qstat"><span class="qstat-value">${s.best}</span><span class="qstat-label">${escapeHtml(t('statBest'))}</span></div>
        <div class="qstat"><span class="qstat-value">${s.avgPct == null ? '—' : s.avgPct + '%'}</span><span class="qstat-label">${escapeHtml(t('statAvg'))}</span></div>
    `;
}

function renderCategoryStats() {
    const el = $('#cat-stats-row');
    if (!el || !state.bank) return;
    const map = computeCategoryStats();
    el.innerHTML = '';
    for (const cat of state.bank.categories) {
        const m = map[cat.id];
        const pct = m && m.total ? Math.round((m.ok / m.total) * 100) : null;
        const label = state.lang === 'es' ? (cat.label_es || cat.label) : cat.label;
        const pctText = pct == null ? '—' : `${m.ok} / ${m.total} · ${pct}%`;
        const row = document.createElement('div');
        row.className = 'qcat-row';
        row.innerHTML = `
            <span class="qcat-row-icon">${cat.icon || ''}</span>
            <span class="qcat-row-label"></span>
            <span class="qcat-row-pct">${escapeHtml(pctText)}</span>
            <span class="qcat-row-bar ${pct == null ? 'qcat-row-bar-empty' : ''}"><span class="qcat-row-bar-fill" style="width:${pct == null ? 0 : pct}%"></span></span>
        `;
        row.querySelector('.qcat-row-label').textContent = label;
        el.appendChild(row);
    }
}

function renderHistory() {
    const el = $('#history-list');
    const hist = getHistory().slice().reverse().slice(0, 20);
    if (!hist.length) {
        el.innerHTML = `<li class="qhistory-empty">${escapeHtml(t('noHistory'))}</li>`;
        return;
    }
    el.innerHTML = hist.map((h) => {
        const badge = h.mode === 'daily' ? '★ ' : '';
        return `
            <li class="qhistory-item">
                <span class="qhistory-date">${escapeHtml(badge + h.date)}</span>
                <span>${'●'.repeat(h.score)}${'○'.repeat(h.total - h.score)}</span>
                <span class="qhistory-score">${h.score} / ${h.total}</span>
            </li>
        `;
    }).join('');
}

// --- pick + build quiz ---

function pickQuestionFor(category, rng) {
    const askedAll = getAsked();
    let asked = askedAll[category.id] || [];
    let pool = category.questions.filter((q) => !asked.includes(q.id));
    let resetHint = false;
    if (pool.length === 0) {
        asked = [];
        askedAll[category.id] = [];
        setAsked(askedAll);
        pool = category.questions.slice();
        resetHint = true;
    }
    const q = pool[Math.floor(rng() * pool.length)];
    return { q, resetHint };
}

function buildQuiz(mode) {
    // Daily: deterministic per date+category. Free: Math.random.
    const picks = state.bank.categories.map((c) => {
        const pickRng = mode === 'daily' ? makeRng(dateSeed(todayStr() + ':' + c.id + ':pick')) : Math.random;
        const { q, resetHint } = pickQuestionFor(c, pickRng);
        const optsLen = (q.options || []).length;
        const shufRng = mode === 'daily' ? makeRng(dateSeed(todayStr() + ':' + c.id + ':opts')) : Math.random;
        const displayOrder = shuffle(range(optsLen), shufRng);
        return { category: c, q, displayOrder, resetHint };
    });
    state.quiz = { picks, current: 0, answers: [], mode, timed: state.timed };
    state.answeredCurrent = false;
}

function buildReviewQuiz(wrongPicks) {
    const picks = wrongPicks.map((p) => {
        const optsLen = (p.q.options || []).length;
        return { category: p.category, q: p.q, displayOrder: shuffle(range(optsLen), Math.random), resetHint: false };
    });
    state.quiz = { picks, current: 0, answers: [], mode: 'review', timed: state.timed };
    state.answeredCurrent = false;
}

// --- daily completion ---

function dailyCompletedToday() {
    const today = todayStr();
    return getHistory().some((h) => h.mode === 'daily' && h.date === today);
}
function dailyResultToday() {
    const today = todayStr();
    const matches = getHistory().filter((h) => h.mode === 'daily' && h.date === today);
    return matches.length ? matches[matches.length - 1] : null;
}

// --- render question ---

function pickText(obj, fields) {
    return obj[fields[state.lang]] ?? obj[fields.en];
}

function renderQuestion() {
    const { picks, current, mode, timed } = state.quiz;
    const { category, q, displayOrder, resetHint } = picks[current];

    $('#q-cat-icon').textContent = category.icon || '';
    $('#q-cat-label').textContent = state.lang === 'es' ? (category.label_es || category.label) : category.label;
    $('#q-progress-text').textContent = t('progress')(current + 1, picks.length);

    const modeBadge = $('#q-mode-badge');
    if (mode === 'daily' || mode === 'review') {
        modeBadge.hidden = false;
        modeBadge.textContent = mode === 'daily' ? t('modeDaily') : t('modeReview');
    } else {
        modeBadge.hidden = true;
    }

    const hintEl = $('#q-reset-hint');
    if (resetHint) { hintEl.hidden = false; hintEl.textContent = t('poolResetHint'); }
    else { hintEl.hidden = true; }

    $('#q-text').textContent = pickText(q, { en: 'question', es: 'question_es' });

    const opts = pickText(q, { en: 'options', es: 'options_es' });
    const olEl = $('#q-options');
    olEl.innerHTML = '';
    displayOrder.forEach((origIdx, displayIdx) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'qoption';
        btn.dataset.origIdx = String(origIdx);
        btn.innerHTML = `<span class="qoption-letter">${String.fromCharCode(65 + displayIdx)}</span><span class="qoption-text"></span>`;
        btn.querySelector('.qoption-text').textContent = opts[origIdx];
        btn.addEventListener('click', () => onAnswer(origIdx, btn));
        li.appendChild(btn);
        olEl.appendChild(li);
    });

    $('#q-feedback').hidden = true;
    $('#q-feedback').innerHTML = '';
    $('#btn-next').hidden = true;
    state.answeredCurrent = false;

    showScreen('question');

    stopTimer();
    if (timed) startTimer();
}

// --- timer ---

function startTimer() {
    const el = $('#q-timer');
    el.hidden = false;
    el.classList.remove('warning');
    state.timer = { secondsLeft: TIMED_SECONDS };
    el.textContent = String(TIMED_SECONDS);
    state.timer.intervalId = setInterval(() => {
        state.timer.secondsLeft--;
        el.textContent = String(state.timer.secondsLeft);
        if (state.timer.secondsLeft <= 5) el.classList.add('warning');
        if (state.timer.secondsLeft <= 0) {
            stopTimer();
            onTimeout();
        }
    }, 1000);
}
function stopTimer() {
    if (state.timer?.intervalId) clearInterval(state.timer.intervalId);
    state.timer = null;
    const el = $('#q-timer');
    if (el) el.hidden = true;
}

function onTimeout() {
    if (state.answeredCurrent) return;
    state.answeredCurrent = true;
    const { picks, current } = state.quiz;
    const { q, category } = picks[current];

    const allBtns = $('#q-options').querySelectorAll('.qoption');
    allBtns.forEach((b) => {
        b.disabled = true;
        if (parseInt(b.dataset.origIdx, 10) === q.correct) b.classList.add('correct');
    });

    picks[current].chosen = -1;
    picks[current].ok = false;
    state.quiz.answers.push({ catId: category.id, qId: q.id, ok: false });
    persistAsked(category.id, q.id);

    showFeedback(false, q, true);
}

function onAnswer(origIdx, btn) {
    if (state.answeredCurrent) return;
    state.answeredCurrent = true;
    stopTimer();

    const { picks, current } = state.quiz;
    const { q, category } = picks[current];
    const ok = origIdx === q.correct;

    const allBtns = $('#q-options').querySelectorAll('.qoption');
    allBtns.forEach((b) => { b.disabled = true; });
    if (ok) {
        btn.classList.add('correct');
    } else {
        btn.classList.add('wrong');
        allBtns.forEach((b) => {
            if (parseInt(b.dataset.origIdx, 10) === q.correct) b.classList.add('correct');
        });
    }

    picks[current].chosen = origIdx;
    picks[current].ok = ok;
    state.quiz.answers.push({ catId: category.id, qId: q.id, ok });
    persistAsked(category.id, q.id);

    showFeedback(ok, q, false);
}

function persistAsked(catId, qId) {
    if (state.quiz.mode === 'review') return; // review doesn't pollute the asked-pool
    const askedAll = getAsked();
    const list = askedAll[catId] || [];
    if (!list.includes(qId)) list.push(qId);
    askedAll[catId] = list;
    setAsked(askedAll);
}

function showFeedback(ok, q, timeout) {
    const fb = $('#q-feedback');
    const headlineClass = ok ? 'correct' : 'wrong';
    const headlineText = timeout ? t('timeUp') : (ok ? t('correct') : t('wrong'));
    const opts = pickText(q, { en: 'options', es: 'options_es' });
    const explanation = pickText(q, { en: 'explanation', es: 'explanation_es' }) || '';
    const correctText = !ok ? `<div><strong>${escapeHtml(t('correctAnswer'))}:</strong> ${escapeHtml(opts[q.correct])}</div>` : '';
    const learnLink = q.learnRef
        ? `<a class="qfeedback-link" href="/learn/#${escapeHtml(q.learnRef)}" target="_blank" rel="noopener">${escapeHtml(t('readMore'))}</a>`
        : '';

    fb.className = `qfeedback ${headlineClass}`;
    fb.innerHTML = `
        <div class="qfeedback-headline ${headlineClass}">${escapeHtml(headlineText)}</div>
        ${correctText}
        ${explanation ? `<div style="margin-top:6px;">${escapeHtml(explanation)}</div>` : ''}
        ${learnLink}
    `;
    fb.hidden = false;

    $('#btn-next').hidden = false;
    $('#btn-next').focus();
}

function next() {
    state.quiz.current++;
    if (state.quiz.current >= state.quiz.picks.length) {
        finishQuiz();
    } else {
        renderQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function finishQuiz() {
    stopTimer();
    const { mode } = state.quiz;
    const score = state.quiz.answers.filter((a) => a.ok).length;
    const total = state.quiz.answers.length;
    if (mode !== 'review') {
        const entry = { date: todayStr(), score, total, mode, picks: state.quiz.answers };
        const hist = getHistory();
        hist.push(entry);
        setHistory(hist);
    }
    renderResult(score, total);
}

function renderResult(score, total) {
    let badge;
    if (state.quiz.mode === 'review' && score === total) badge = t('reviewDone');
    else if (score === total) badge = t('resultBadge').perfect;
    else if (score >= total - 1) badge = t('resultBadge').great;
    else if (score >= Math.ceil(total / 2)) badge = t('resultBadge').good;
    else badge = t('resultBadge').meh;

    $('#result-headline').textContent = badge;
    $('#result-score').textContent = t('resultScore')(score, total);

    const recap = $('#result-recap');
    recap.innerHTML = '';
    state.quiz.picks.forEach((p) => {
        const li = document.createElement('li');
        li.className = 'qrecap-item';
        const mark = p.ok ? `<span class="qrecap-mark ok">✓</span>` : `<span class="qrecap-mark bad">✕</span>`;
        const catLabel = state.lang === 'es' ? (p.category.label_es || p.category.label) : p.category.label;
        const qText = pickText(p.q, { en: 'question', es: 'question_es' });
        li.innerHTML = `${mark}<span class="qrecap-cat">${escapeHtml(catLabel)}</span><span class="qrecap-text"></span>`;
        li.querySelector('.qrecap-text').textContent = qText;
        recap.appendChild(li);
    });

    const wrong = state.quiz.picks.filter((p) => !p.ok);
    const reviewBtn = $('#btn-review');
    if (wrong.length && state.quiz.mode !== 'review') {
        reviewBtn.hidden = false;
        reviewBtn.textContent = t('reviewWrong')(wrong.length);
        reviewBtn.onclick = () => {
            buildReviewQuiz(wrong);
            renderQuestion();
        };
    } else {
        reviewBtn.hidden = true;
    }

    showScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- intro ---

function renderIntro() {
    renderStats();
    renderCategoryStats();
    renderHistory();
    renderDailyButton();
    showScreen('intro');
}

function renderDailyButton() {
    const sub = $('#daily-sub');
    if (dailyCompletedToday()) sub.textContent = t('dailyDoneSub');
    else sub.textContent = t('dailyOpenSub');
}

// --- i18n ---

function applyStaticI18n() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n;
        const v = t(key);
        if (typeof v === 'string') el.textContent = v;
    });
    document.documentElement.lang = state.lang;
    document.title = t('title');
}

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
            applyStaticI18n();
            if (!screens.intro.hidden) renderIntro();
            else if (!screens.question.hidden) renderQuestion();
            else if (!screens.result.hidden) {
                const score = state.quiz.answers.filter((a) => a.ok).length;
                renderResult(score, state.quiz.answers.length);
            }
        });
    });
}

function toggleLang() {
    const next = state.lang === 'en' ? 'es' : 'en';
    document.querySelector(`.lang-btn[data-lang="${next}"]`)?.click();
}

// --- utils ---

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function isTypingTarget(el) {
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
}

// --- init ---

async function init() {
    updateLangButtons();
    applyStaticI18n();
    wireLangToggle();

    const timedToggle = $('#toggle-timed');
    if (timedToggle) {
        timedToggle.checked = state.timed;
        timedToggle.addEventListener('change', () => {
            state.timed = timedToggle.checked;
            localStorage.setItem(TIMED_KEY, state.timed ? '1' : '0');
        });
    }

    try {
        const res = await fetch('bank.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error('http ' + res.status);
        state.bank = await res.json();
    } catch (err) {
        screens.loading.innerHTML = `<p class="qhint">${escapeHtml(t('loadError'))}: ${escapeHtml(err.message)}</p>`;
        return;
    }

    renderIntro();

    $('#btn-daily')?.addEventListener('click', () => {
        if (dailyCompletedToday()) {
            // Show today's recorded result
            const result = dailyResultToday();
            const picks = result.picks.map((a) => {
                const cat = state.bank.categories.find((c) => c.id === a.catId);
                const q = cat?.questions.find((qq) => qq.id === a.qId);
                return cat && q ? { category: cat, q, ok: a.ok } : null;
            }).filter(Boolean);
            state.quiz = { picks, current: picks.length, answers: result.picks, mode: 'daily', timed: false };
            renderResult(result.score, result.total);
            return;
        }
        buildQuiz('daily');
        renderQuestion();
    });

    $('#btn-freeplay')?.addEventListener('click', () => {
        buildQuiz('free');
        renderQuestion();
    });

    $('#btn-next')?.addEventListener('click', next);

    $('#btn-again')?.addEventListener('click', () => {
        // After result: if today's daily isn't done yet, go daily; else free play
        if (!dailyCompletedToday()) buildQuiz('daily');
        else buildQuiz('free');
        renderQuestion();
    });

    $('#btn-reset-history')?.addEventListener('click', () => {
        if (!confirm(t('confirmReset'))) return;
        localStorage.removeItem(ASKED_KEY);
        localStorage.removeItem(HISTORY_KEY);
        renderIntro();
    });

    // Keyboard shortcuts overlay
    const kbdHelp = $('#kbd-help');
    const openKbdHelp  = () => { if (kbdHelp) kbdHelp.hidden = false; };
    const closeKbdHelp = () => { if (kbdHelp) kbdHelp.hidden = true;  };
    $('#btn-kbd-help')?.addEventListener('click', openKbdHelp);
    $('#btn-kbd-close')?.addEventListener('click', closeKbdHelp);
    $('#kbd-help-backdrop')?.addEventListener('click', closeKbdHelp);

    document.addEventListener('keydown', (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;

        // help overlay takes priority
        if (kbdHelp && !kbdHelp.hidden) {
            if (e.key === 'Escape' || e.key === '?' || e.key.toLowerCase() === 'h') {
                e.preventDefault();
                closeKbdHelp();
            }
            return;
        }

        if (e.key === '?') { e.preventDefault(); openKbdHelp(); return; }
        if (e.key === 'Escape') { closeKbdHelp(); return; }

        if ((e.key === 'l' || e.key === 'L') && !isTypingTarget(e.target)) {
            e.preventDefault();
            toggleLang();
            return;
        }

        // Enter / N → primary action on the current screen
        if (e.key === 'Enter' || e.key === 'n' || e.key === 'N') {
            if (!screens.question.hidden) {
                if (state.answeredCurrent) { e.preventDefault(); $('#btn-next')?.click(); }
                return;
            }
            if (!screens.intro.hidden) {
                e.preventDefault();
                $('#btn-daily')?.click();
                return;
            }
            if (!screens.result.hidden) {
                e.preventDefault();
                $('#btn-again')?.click();
                return;
            }
            return;
        }

        // option pickers only on question screen
        if (screens.question.hidden) return;
        const k = e.key.toLowerCase();
        let displayIdx = -1;
        if (/^[1-9]$/.test(e.key)) displayIdx = parseInt(e.key, 10) - 1;
        else if (/^[a-d]$/.test(k)) displayIdx = k.charCodeAt(0) - 97;
        if (displayIdx < 0) return;
        const btn = $('#q-options').querySelectorAll('.qoption')[displayIdx];
        if (btn && !state.answeredCurrent) {
            e.preventDefault();
            btn.click();
        }
    });
}

window.addEventListener('DOMContentLoaded', init);
