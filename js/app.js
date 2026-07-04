/**
 * Yatra Saarthi — Main Application Logic
 * Modular frontend engine for interactive chat, query processing, and UI rendering.
 * Enforces language lock after initial selection from the splash screen.
 */

let currentLang = 'en';
let chatStarted = false;

const DOM = {};
function getDOM(id) {
    return DOM[id] || (DOM[id] = document.getElementById(id));
}

// ---- Initialization ----
document.addEventListener('DOMContentLoaded', () => {
    renderSplashScreen();
    setupInputListeners();
});

// ======================================================
//  SPLASH SCREEN — Language Selection First (Locked)
// ======================================================

function renderSplashScreen() {
    const grid = document.getElementById('lang-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    YS_LANG_CONFIG.forEach(lang => {
        const card = document.createElement('button');
        card.className = 'lang-card';
        card.setAttribute('id', `splash-lang-${lang.code}`);
        card.innerHTML = `
            <span class="card-script">${lang.script}</span>
            <span class="card-label">${lang.label}</span>
            <span class="card-sublabel">${lang.englishName}</span>
        `;
        card.addEventListener('click', () => selectLanguageAndStart(lang.code));
        grid.appendChild(card);
    });
}

function selectLanguageAndStart(langCode) {
    if (chatStarted) return; // Enforce language lock once selected
    
    currentLang = langCode;
    chatStarted = true;

    // Animate splash exit
    const splash = document.getElementById('lang-splash');
    if (splash) {
        splash.classList.add('exit');
        setTimeout(() => {
            splash.style.display = 'none';
            const container = document.getElementById('chat-container');
            if (container) container.classList.remove('splash-active');

            // Initialize the chat in the selected language
            applyLanguage(langCode);
            renderStaticLangIndicator(langCode);
            renderNudges();
            addWelcomeMessage();
        }, 450);
    }
}

// ======================================================
//  LANGUAGE MANAGEMENT (Locked Indicator)
// ======================================================

function applyLanguage(lang) {
    const t = YS_I18N[lang] || YS_I18N.en;
    const titleEl = document.getElementById('header-title');
    const subtitleEl = document.getElementById('header-subtitle');
    const inputEl = document.getElementById('user-input');
    const promptEl = document.getElementById('splash-prompt');
    
    if (titleEl) titleEl.textContent = t.title;
    if (subtitleEl) subtitleEl.textContent = t.subtitle;
    if (inputEl) inputEl.placeholder = t.placeholder;
    if (promptEl) promptEl.textContent = t.placeholder; // fallback if needed
}

/**
 * Renders a static language badge instead of interactive switching pills.
 * Enforces the requirement: "after selecting language at startup, let's not allow user to change the language"
 */
function renderStaticLangIndicator(langCode) {
    const container = document.getElementById('lang-selector');
    if (!container) return;
    
    const langObj = YS_LANG_CONFIG.find(l => l.code === langCode) || YS_LANG_CONFIG[0];
    container.innerHTML = `
        <div class="lang-badge-locked" title="Language locked for this session">
            <span class="lang-code">${langObj.script}</span>
            <strong>${langObj.label}</strong>
            <span class="lock-icon">🔒</span>
        </div>
    `;
}

// ======================================================
//  NUDGE CHIPS
// ======================================================

function renderNudges() {
    const t = YS_I18N[currentLang] || YS_I18N.en;
    const nudges = [
        { text: t.nudge_platform, query: t.nudge_query_platform },
        { text: t.nudge_cab,      query: t.nudge_query_cab },
        { text: t.nudge_delay,    query: t.nudge_query_delay },
        { text: t.nudge_food,     query: t.nudge_query_food }
    ];

    const container = getDOM('nudge-bar');
    if (!container) return;
    container.innerHTML = '';
    
    nudges.forEach(n => {
        const chip = document.createElement('button');
        chip.className = 'nudge-chip';
        chip.textContent = n.text;
        chip.addEventListener('click', () => {
            const input = getDOM('user-input');
            if (input) {
                input.value = n.query;
                handleSend();
            }
        });
        container.appendChild(chip);
    });
}

// ======================================================
//  WELCOME MESSAGE
// ======================================================

function addWelcomeMessage() {
    const t = YS_I18N[currentLang] || YS_I18N.en;
    addAIMessage(t.welcome);
}

// ======================================================
//  INPUT HANDLING
// ======================================================

function setupInputListeners() {
    const input = getDOM('user-input');
    if (!input) return;
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
}

function handleSend() {
    const input = getDOM('user-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    addUserMessage(text);
    input.value = '';

    // Show typing indicator
    const typingEl = showTypingIndicator();

    // Simulate AI response after realistic delay
    setTimeout(() => {
        removeTypingIndicator(typingEl);
        processQuery(text);
    }, 900 + Math.random() * 400);
}

// ======================================================
//  MESSAGE RENDERING
// ======================================================

function addUserMessage(text) {
    const chatArea = getDOM('chat-area');
    if (!chatArea) return;
    const row = document.createElement('div');
    row.className = 'msg-row user';
    row.innerHTML = `
        <div class="msg-bubble user">
            ${escapeHTML(text)}
            <span class="msg-time">${getCurrentTime()}</span>
        </div>
    `;
    chatArea.appendChild(row);
    scrollToBottom();
}

function addAIMessage(html) {
    const chatArea = getDOM('chat-area');
    if (!chatArea) return;
    const row = document.createElement('div');
    row.className = 'msg-row ai';
    row.innerHTML = `
        <div class="msg-bubble ai">
            ${html}
            <span class="msg-time">${getCurrentTime()}</span>
        </div>
    `;
    chatArea.appendChild(row);
    scrollToBottom();
}

// ======================================================
//  TRAIN STATUS CARD RENDERING
// ======================================================

function addTrainCard(train, trainNum) {
    const t = YS_I18N[currentLang] || YS_I18N.en;
    const chatArea = getDOM('chat-area');
    if (!chatArea) return;

    const statusClass = train.statusType || 'ontime';
    let badgeClass = 'ontime';
    if (statusClass === 'late') badgeClass = 'late';
    if (statusClass === 'critical') badgeClass = 'critical';

    const card = document.createElement('div');
    card.className = `train-card status-${statusClass}`;
    card.innerHTML = `
        <div class="train-card-header">
            <span class="train-icon">🚂</span>
            <div>
                <div class="train-name">${escapeHTML(train.name)}</div>
                <div class="train-number">#${escapeHTML(trainNum)}</div>
            </div>
        </div>
        <div class="train-card-body">
            <div class="train-card-row">
                <span class="row-icon">📍</span>
                <span class="row-label">${t.current}</span>
                <span class="row-value">${escapeHTML(train.current_station)}</span>
            </div>
            <div class="train-card-row">
                <span class="row-icon">⏱</span>
                <span class="row-label">${t.status_label}</span>
                <span class="status-badge ${badgeClass}">${escapeHTML(train.status)}</span>
            </div>
            <div class="train-card-row">
                <span class="row-icon">➡️</span>
                <span class="row-label">${t.next}</span>
                <span class="row-value">${escapeHTML(train.next_stop)}</span>
            </div>
            <div class="train-card-row">
                <span class="row-icon">🚏</span>
                <span class="row-label">${t.platform_label}</span>
                <span class="row-value">${train.platform}</span>
            </div>
            <div class="cancel-risk">
                <span class="row-icon">⚠️</span>
                ${t.cancel_risk}: <strong>${escapeHTML(train.probability_cancel)}</strong>
            </div>
        </div>
    `;
    chatArea.appendChild(card);
    scrollToBottom();
}

// ======================================================
//  QUERY PROCESSING — Smart Intent Detection
// ======================================================

function processQuery(text) {
    const t = YS_I18N[currentLang] || YS_I18N.en;
    const textLower = text.toLowerCase();

    // 1. Check for delay/alert keywords
    if (isIntent(textLower, 'delay')) {
        showDelayAlerts();
        return;
    }

    // 2. Check for food keywords + station
    if (isIntent(textLower, 'food')) {
        const station = detectStation(textLower);
        if (station) {
            showFoodOptions(station);
        } else {
            addAIMessage(t.food_title + '<br>' + t.unknown);
        }
        return;
    }

    // 3. Check for cab keywords + station
    if (isIntent(textLower, 'cab')) {
        const station = detectStation(textLower);
        if (station) {
            showCabOptions(station);
        } else {
            addAIMessage(t.cab_title + '<br>' + t.unknown);
        }
        return;
    }

    // 4. Check for platform query + train number
    if (isIntent(textLower, 'platform')) {
        const trainMatch = text.match(YS_TRAIN_REGEX);
        if (trainMatch) {
            const trainNum = trainMatch[1];
            const train = YS_TRAIN_DB[trainNum];
            if (train) {
                const msg = t.platform_response
                    .replace('{name}', escapeHTML(train.name))
                    .replace('{num}', escapeHTML(trainNum))
                    .replace('{platform}', train.platform)
                    .replace('{station}', escapeHTML(train.current_station));
                addAIMessage(msg);
                return;
            }
        }
    }

    // 5. Check for train status (train number present)
    const trainMatch = text.match(YS_TRAIN_REGEX);
    if (trainMatch) {
        const trainNum = trainMatch[1];
        const train = YS_TRAIN_DB[trainNum];
        if (train) {
            addTrainCard(train, trainNum);
            renderNudges();
            return;
        }
    }

    // 6. Check if there's any 5-digit number (possible train number not in DB)
    const anyTrain = text.match(/\b\d{5}\b/);
    if (anyTrain) {
        addAIMessage(t.not_found);
    } else {
        addAIMessage(t.unknown);
    }

    renderNudges();
}

// ---- Intent Detection Helpers ----

function isIntent(text, intentType) {
    const keywords = YS_INTENT_KEYWORDS[intentType] || [];
    return keywords.some(k => text.includes(k));
}

function detectStation(text) {
    for (const [code, keywords] of Object.entries(YS_STATION_KEYWORDS)) {
        if (keywords.some(k => text.includes(k))) {
            return code;
        }
    }
    return null;
}

// ---- Response Renderers ----

function showDelayAlerts() {
    const t = YS_I18N[currentLang] || YS_I18N.en;
    let html = `<strong>${t.delay_title}</strong><br><br>`;

    if (!YS_DELAY_ALERTS || YS_DELAY_ALERTS.length === 0) {
        html += t.no_delays;
    } else {
        YS_DELAY_ALERTS.forEach(alert => {
            const severityIcon = alert.severity === 'critical' ? '🔴' : alert.severity === 'warning' ? '🟡' : '🔵';
            html += `${severityIcon} <strong>${escapeHTML(alert.region)}</strong><br>`;
            html += `${escapeHTML(alert.message)}<br>`;
            html += `<span style="font-size:0.72rem;color:#888;">Affected: ${alert.trains.join(', ')}</span><br><br>`;
        });
    }

    addAIMessage(html);
    renderNudges();
}

function showFoodOptions(stationCode) {
    const t = YS_I18N[currentLang] || YS_I18N.en;
    const station = YS_STATION_DB[stationCode];
    if (!station) return addAIMessage(t.not_found);

    let html = t.food_response.replace('{station}', escapeHTML(station.name)) + '<br><br>';
    station.food.forEach(f => {
        html += `• ${escapeHTML(f)}<br>`;
    });
    html += `<br><span style="font-size:0.78rem;">📱 Order via IRCTC e-Catering or visit stalls at the station.</span>`;

    addAIMessage(html);
    renderNudges();
}

function showCabOptions(stationCode) {
    const t = YS_I18N[currentLang] || YS_I18N.en;
    const station = YS_STATION_DB[stationCode];
    if (!station) return addAIMessage(t.not_found);

    let html = t.cab_response.replace('{station}', escapeHTML(station.name)) + '<br><br>';
    station.cabs.forEach(c => {
        html += `• ${escapeHTML(c)}<br>`;
    });
    html += `<br>${t.booking_tip}`;

    addAIMessage(html);
    renderNudges();
}

// ======================================================
//  TYPING INDICATOR
// ======================================================

function showTypingIndicator() {
    const chatArea = getDOM('chat-area');
    if (!chatArea) return null;
    const row = document.createElement('div');
    row.className = 'msg-row ai';
    row.id = 'typing-row';
    row.innerHTML = `
        <div class="typing-indicator">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        </div>
    `;
    chatArea.appendChild(row);
    scrollToBottom();
    return row;
}

function removeTypingIndicator(el) {
    if (el && el.parentNode) {
        el.parentNode.removeChild(el);
    }
}

// ======================================================
//  TOAST & UTILITIES
// ======================================================

function showToast(message) {
    const toast = getDOM('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
}

function scrollToBottom() {
    const chatArea = getDOM('chat-area');
    if (!chatArea) return;
    requestAnimationFrame(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
    });
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
