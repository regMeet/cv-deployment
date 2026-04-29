// /quiz — daily multi-category MC quiz with localStorage tracking.

const LANG_KEY = 'app:lang';
const ASKED_KEY = 'quiz:asked';      // { [catId]: string[] }
const HISTORY_KEY = 'quiz:history';  // [{ date, score, total, picks: [{catId, qId, ok}] }]

const I18N = {
    en: {
        title: 'Daily Quiz',
        back: 'Learn',
        loading: 'Loading…',
        introTitle: 'Stay sharp.',
        introBody: 'One random multiple-choice question per category. Track your streak, beat your average, never see the same question twice (until the pool resets).',
        start: 'Start',
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
        resultBadge: { perfect: 'Perfect run! 🎉', great: 'Great work.', good: 'Solid.', meh: 'Keep grinding.' },
        resultScore: (s, t) => `${s} / ${t}`,
        recapCorrect: 'Got it',
        recapWrong: 'Missed',
        confirmReset: 'Reset all quiz history and seen questions?',
        noHistory: 'No quizzes taken yet.',
        loadError: 'Could not load the quiz bank.',
        poolResetHint: '(Pool reset — you\'ve seen them all once.)',
        correctAnswer: 'Correct answer',
    },
    es: {
        title: 'Quiz diario',
        back: 'Learn',
        loading: 'Cargando…',
        introTitle: 'Mantenete afilado.',
        introBody: 'Una pregunta multiple-choice random por categoría. Trackeá tu racha, superá tu promedio, no veas la misma pregunta dos veces (hasta que el pool se resetee).',
        start: 'Empezar',
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
        resultBadge: { perfect: '¡Perfecto! 🎉', great: 'Muy bien.', good: 'Sólido.', meh: 'A seguir entrenando.' },
        resultScore: (s, t) => `${s} / ${t}`,
        recapCorrect: 'Acertaste',
        recapWrong: 'Erraste',
        confirmReset: '¿Resetear todo el historial y las preguntas vistas?',
        noHistory: 'Todavía no hiciste ningún quiz.',
        loadError: 'No se pudo cargar el bank.',
        poolResetHint: '(Pool reseteado — ya las viste todas una vez.)',
        correctAnswer: 'Respuesta correcta',
    },
};

const state = {
    lang: localStorage.getItem(LANG_KEY) || 'en',
    bank: null,
    quiz: null,        // { picks: [{ category, q }], current: 0, answers: [] }
    answeredCurrent: false,
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

// --- localStorage helpers ---

function readJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
}

function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function getAsked()        { return readJSON(ASKED_KEY, {}); }
function setAsked(v)       { writeJSON(ASKED_KEY, v); }
function getHistory()      { return readJSON(HISTORY_KEY, []); }
function setHistory(v)     { writeJSON(HISTORY_KEY, v); }

// --- stats ---

function computeStats() {
    const hist = getHistory();
    if (!hist.length) {
        return { total: 0, streak: 0, best: 0, avgPct: null };
    }
    const total = hist.length;
    const best = hist.reduce((m, h) => Math.max(m, h.score), 0);
    const avg = hist.reduce((s, h) => s + (h.score / h.total), 0) / total;

    // streak: consecutive distinct days up to today
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
        } else if (d.getTime() < cursor.getTime()) {
            break;
        }
    }
    return {
        total,
        streak,
        best,
        avgPct: Math.round(avg * 100),
    };
}

function renderStats() {
    const stats = computeStats();
    const el = $('#stats-row');
    el.innerHTML = `
        <div class="qstat"><span class="qstat-value">${stats.total}</span><span class="qstat-label">${escapeHtml(t('statTotal'))}</span></div>
        <div class="qstat"><span class="qstat-value">${stats.streak}</span><span class="qstat-label">${escapeHtml(t('statStreak'))}</span></div>
        <div class="qstat"><span class="qstat-value">${stats.best}</span><span class="qstat-label">${escapeHtml(t('statBest'))}</span></div>
        <div class="qstat"><span class="qstat-value">${stats.avgPct == null ? '—' : stats.avgPct + '%'}</span><span class="qstat-label">${escapeHtml(t('statAvg'))}</span></div>
    `;
}

function renderHistory() {
    const el = $('#history-list');
    const hist = getHistory().slice().reverse().slice(0, 20);
    if (!hist.length) {
        el.innerHTML = `<li class="qhistory-empty">${escapeHtml(t('noHistory'))}</li>`;
        return;
    }
    el.innerHTML = hist.map((h) => `
        <li class="qhistory-item">
            <span class="qhistory-date">${escapeHtml(h.date)}</span>
            <span>${'●'.repeat(h.score)}${'○'.repeat(h.total - h.score)}</span>
            <span class="qhistory-score">${h.score} / ${h.total}</span>
        </li>
    `).join('');
}

// --- pick a fresh quiz ---

function pickQuestionFor(category) {
    const askedAll = getAsked();
    let asked = askedAll[category.id] || [];
    let pool = category.questions.filter((q) => !asked.includes(q.id));
    let resetHint = false;
    if (pool.length === 0) {
        // exhausted — reset and refresh pool
        asked = [];
        askedAll[category.id] = [];
        setAsked(askedAll);
        pool = category.questions.slice();
        resetHint = true;
    }
    const q = pool[Math.floor(Math.random() * pool.length)];
    return { q, resetHint };
}

function buildQuiz() {
    const picks = state.bank.categories.map((c) => {
        const { q, resetHint } = pickQuestionFor(c);
        return { category: c, q, resetHint };
    });
    state.quiz = { picks, current: 0, answers: [] };
    state.answeredCurrent = false;
}

// --- render question ---

function pickText(obj, fields) {
    const want = fields[state.lang];
    return obj[want] ?? obj[fields.en];
}

function renderQuestion() {
    const { picks, current } = state.quiz;
    const { category, q } = picks[current];

    $('#q-cat-icon').textContent = category.icon || '';
    $('#q-cat-label').textContent = state.lang === 'es' ? (category.label_es || category.label) : category.label;
    $('#q-progress-text').textContent = t('progress')(current + 1, picks.length);

    $('#q-text').textContent = pickText(q, { en: 'question', es: 'question_es' });

    const opts = pickText(q, { en: 'options', es: 'options_es' });
    const olEl = $('#q-options');
    olEl.innerHTML = '';
    opts.forEach((opt, i) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'qoption';
        btn.dataset.index = String(i);
        btn.innerHTML = `<span class="qoption-letter">${String.fromCharCode(65 + i)}</span><span class="qoption-text"></span>`;
        btn.querySelector('.qoption-text').textContent = opt;
        btn.addEventListener('click', () => onAnswer(i, btn));
        li.appendChild(btn);
        olEl.appendChild(li);
    });

    $('#q-feedback').hidden = true;
    $('#q-feedback').textContent = '';
    $('#btn-next').hidden = true;
    state.answeredCurrent = false;
    showScreen('question');
}

function onAnswer(chosenIdx, btn) {
    if (state.answeredCurrent) return;
    state.answeredCurrent = true;

    const { picks, current } = state.quiz;
    const { q } = picks[current];
    const correctIdx = q.correct;
    const ok = chosenIdx === correctIdx;

    // disable + mark
    const allBtns = $('#q-options').querySelectorAll('.qoption');
    allBtns.forEach((b) => { b.disabled = true; });
    if (ok) {
        btn.classList.add('correct');
    } else {
        btn.classList.add('wrong');
        const correctBtn = allBtns[correctIdx];
        if (correctBtn) correctBtn.classList.add('correct');
    }

    // record answer (also persist asked id)
    picks[current].chosen = chosenIdx;
    picks[current].ok = ok;
    state.quiz.answers.push({ catId: picks[current].category.id, qId: q.id, ok });

    const askedAll = getAsked();
    const list = askedAll[picks[current].category.id] || [];
    if (!list.includes(q.id)) list.push(q.id);
    askedAll[picks[current].category.id] = list;
    setAsked(askedAll);

    // feedback
    const fb = $('#q-feedback');
    const explanation = pickText(q, { en: 'explanation', es: 'explanation_es' }) || '';
    const headlineClass = ok ? 'correct' : 'wrong';
    const headlineText = ok ? t('correct') : t('wrong');
    const correctText = !ok && q.options
        ? `<div><strong>${escapeHtml(t('correctAnswer'))}:</strong> ${escapeHtml(pickText(q, { en: 'options', es: 'options_es' })[correctIdx])}</div>`
        : '';
    fb.className = `qfeedback ${headlineClass}`;
    fb.innerHTML = `
        <div class="qfeedback-headline ${headlineClass}">${escapeHtml(headlineText)}</div>
        ${correctText}
        ${explanation ? `<div style="margin-top:6px;">${escapeHtml(explanation)}</div>` : ''}
    `;
    fb.hidden = false;

    $('#btn-next').hidden = false;
    $('#btn-next').focus();
}

function next() {
    const { picks } = state.quiz;
    state.quiz.current++;
    if (state.quiz.current >= picks.length) {
        finishQuiz();
    } else {
        renderQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function finishQuiz() {
    const score = state.quiz.answers.filter((a) => a.ok).length;
    const total = state.quiz.answers.length;
    const today = new Date().toISOString().slice(0, 10);
    const entry = { date: today, score, total, picks: state.quiz.answers };
    const hist = getHistory();
    hist.push(entry);
    setHistory(hist);
    renderResult(score, total);
}

function renderResult(score, total) {
    let badge;
    if (score === total) badge = t('resultBadge').perfect;
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
    showScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- intro ---

function renderIntro() {
    renderStats();
    renderHistory();
    showScreen('intro');
}

// --- i18n / lang toggle ---

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
            // re-render whatever screen is visible
            if (!screens.intro.hidden) renderIntro();
            else if (!screens.question.hidden) renderQuestion();
            else if (!screens.result.hidden) {
                const score = state.quiz.answers.filter((a) => a.ok).length;
                renderResult(score, state.quiz.answers.length);
            }
        });
    });
}

// --- utils ---

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

// --- init ---

async function init() {
    updateLangButtons();
    applyStaticI18n();
    wireLangToggle();

    try {
        const res = await fetch('bank.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error('http ' + res.status);
        state.bank = await res.json();
    } catch (err) {
        screens.loading.innerHTML = `<p class="qhint">${escapeHtml(t('loadError'))}: ${escapeHtml(err.message)}</p>`;
        return;
    }

    renderIntro();

    $('#btn-start').addEventListener('click', () => {
        buildQuiz();
        renderQuestion();
    });

    $('#btn-next').addEventListener('click', next);

    $('#btn-again').addEventListener('click', () => {
        buildQuiz();
        renderQuestion();
    });

    $('#btn-reset-history').addEventListener('click', () => {
        if (!confirm(t('confirmReset'))) return;
        localStorage.removeItem(ASKED_KEY);
        localStorage.removeItem(HISTORY_KEY);
        renderIntro();
    });

    // keyboard: 1-4 to answer, Enter to advance, A-D too
    document.addEventListener('keydown', (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (screens.question.hidden) {
            if (e.key === 'Enter' && !screens.intro.hidden) { $('#btn-start').click(); }
            if (e.key === 'Enter' && !screens.result.hidden) { $('#btn-again').click(); }
            return;
        }
        if (state.answeredCurrent && e.key === 'Enter') {
            e.preventDefault();
            $('#btn-next').click();
            return;
        }
        const k = e.key.toLowerCase();
        let idx = -1;
        if (/^[1-9]$/.test(e.key)) idx = parseInt(e.key, 10) - 1;
        else if (/^[a-d]$/.test(k)) idx = k.charCodeAt(0) - 97;
        if (idx < 0) return;
        const btn = $('#q-options').querySelectorAll('.qoption')[idx];
        if (btn && !state.answeredCurrent) {
            e.preventDefault();
            btn.click();
        }
    });
}

window.addEventListener('DOMContentLoaded', init);
