/* ============================================================
   BURGER QUIZ - Game Engine v2
   5 épreuves : Nuggets, Sel ou Poivre, Menus, L'Addition, Burger de la Mort
   ============================================================ */

const TEAMS = ['ketchup', 'mayo', 'cheeseburger', 'frites'];
const TEAM_LABELS = { ketchup: '🍅 KETCHUP', mayo: '🥚 MAYO', cheeseburger: '🧀 CHEESEBURGER', frites: '🍟 FRITES' };
const TEAM_COLORS = { ketchup: '#e74c3c', mayo: '#f1c40f', cheeseburger: '#e67e22', frites: '#f39c12' };
const ROUNDS = ['nuggets', 'sel_ou_poivre', 'menus', 'addition', 'burger_de_la_mort'];
const ROUND_INFO = {
  nuggets:           { icon: '🟡', name: 'Nuggets',           desc: 'QCM à 4 choix, 4 niveaux de difficulté croissante.\nChaque équipe répond à 1 question par niveau.\nTirage au sort animé, puis suspense avant le résultat !' },
  sel_ou_poivre:     { icon: '🧂', name: 'Sel ou Poivre',    desc: 'Questions de rapidité lues par l\'animateur en salle !\nToutes les équipes jouent en même temps,\nla plus rapide répond !' },
  menus:             { icon: '📋', name: 'Les Menus',         desc: '5 menus de 5 questions ouvertes chacun.\nL\'équipe en tête choisit son menu en premier,\npuis la 2ème, etc. L\'animateur lit la question et juge la réponse.' },
  addition:          { icon: '🧾', name: 'L\'Addition',       desc: 'Questions de rapidité en salle !\nToutes les équipes jouent ensemble.\nBonne réponse = gros points, Mauvaise = gros malus !' },
  burger_de_la_mort: { icon: '💀', name: 'Burger de la Mort', desc: 'Épreuve finale réservée à l\'équipe en tête !\nL\'équipe doit choisir un membre pour relever le défi.\nDéfi chronométré en salle, géré par les animateurs.' }
};
const NUGGETS_LEVELS = ['niveau_1', 'niveau_2', 'niveau_3', 'niveau_4'];
const LEVEL_LABELS = { niveau_1: '⭐ Niveau 1 — Très Facile', niveau_2: '⭐⭐ Niveau 2', niveau_3: '⭐⭐⭐ Niveau 3', niveau_4: '💀 Niveau 4 — Expert' };

const LS_SETTINGS = 'burgerquiz_settings';
const LS_GAMESTATE = 'burgerquiz_gamestate';

let gs = {
  settings: {}, scores: {}, currentRound: 0, teamOrder: [],
  // Nuggets
  nuggetsLevel: 0, nuggetsTeamInLevel: 0, nuggetsQuestionCount: 0,
  questionsUsed: {}, currentQuestion: null,
  // Timer
  timerInterval: null, timerRemaining: 0, timerTotal: 0,
  // Menus
  menusAvailable: [], menusPicked: {}, menusCurrentTeamIdx: 0, menusCurrentQ: 0, menusCurrentMenu: null,
  // Round history
  roundHistory: {},
  // Game active flag
  gameActive: false,
  // Active screen
  activeScreen: 'screen-welcome'
};

// ======================== SETTINGS ========================
function getDefaultSettings() {
  return {
    nuggets: { pts: [1, 1, 1, 1], timer: 30 },
    sop: { points: 1 },
    menus: { points: 2, timer: 30 },
    addition: { points: 4 },
    death: { timer: 0 },
    general: { teamOrder: 'random', animateur1: 'Jean-Pierre', animateur2: 'Cyril' }
  };
}

function loadSettings() {
  return {
    nuggets: {
      pts: [
        parseInt(document.getElementById('set-nuggets-pts-1').value) || 1,
        parseInt(document.getElementById('set-nuggets-pts-2').value) || 2,
        parseInt(document.getElementById('set-nuggets-pts-3').value) || 3,
        parseInt(document.getElementById('set-nuggets-pts-4').value) || 5
      ],
      timer: parseInt(document.getElementById('set-nuggets-timer').value) || 0
    },
    sop: { points: parseInt(document.getElementById('set-sop-points').value) || 1 },
    menus: {
      points: parseInt(document.getElementById('set-menus-points').value) || 2,
      timer: parseInt(document.getElementById('set-menus-timer').value) || 0
    },
    addition: { points: parseInt(document.getElementById('set-addition-points').value) || 4 },
    death: { timer: parseInt(document.getElementById('set-death-timer').value) || 30 },
    general: {
      teamOrder: document.getElementById('set-team-order').value || 'random',
      animateur1: document.getElementById('set-animateur-1').value.trim(),
      animateur2: document.getElementById('set-animateur-2').value.trim()
    }
  };
}

function saveSettings() {
  gs.settings = loadSettings();
  localStorage.setItem(LS_SETTINGS, JSON.stringify(gs.settings));
  updateAnimateursDisplay();
  showToast('Paramètres sauvegardés !');
}

function updateAnimateursDisplay() {
  const a1 = gs.settings.general.animateur1;
  const a2 = gs.settings.general.animateur2;
  const el = document.getElementById('welcome-animateurs');
  if (a1 && a2) el.textContent = `Les Animateurs : ${a1} & ${a2}`;
  else if (a1 || a2) el.textContent = `Animateur : ${a1 || a2}`;
  else el.textContent = 'Les Animateurs';
}

// ======================== NAVIGATION ========================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ======================== START GAME ========================
function hasGameInProgress() {
  try { const raw = localStorage.getItem(LS_GAMESTATE); if (!raw) return false; const s = JSON.parse(raw); return s && s.gameActive === true; } catch(e) { return false; }
}

function updateContinueButton() {
  const btn = document.getElementById('btn-continue');
  if (btn) { btn.disabled = !hasGameInProgress(); }
}

function confirmStartGame() {
  if (hasGameInProgress()) {
    document.getElementById('modal-confirm').style.display = 'flex';
  } else {
    startGame();
  }
}

function closeConfirmModal() {
  document.getElementById('modal-confirm').style.display = 'none';
}

function continueGame() {
  if (!restoreGameState()) {
    showToast('⚠️ Sauvegarde invalide ou absente. Lancez une nouvelle partie !');
    updateContinueButton();
    return;
  }
  // Reload settings
  let saved; try { saved = JSON.parse(localStorage.getItem(LS_SETTINGS)); } catch(e) {}
  if (saved) { const d = getDefaultSettings(); gs.settings = { nuggets:{...d.nuggets,...saved.nuggets}, sop:{...d.sop,...saved.sop}, menus:{...d.menus,...saved.menus}, addition:{...d.addition,...saved.addition}, death:{...d.death,...saved.death}, general:{...d.general,...saved.general} }; }
  // If game was finished, show results
  if (gs.gameFinished) {
    showToast('🏆 Voici les résultats de la dernière partie !');
    showResults();
    return;
  }
  showToast('🔄 Partie en cours restaurée !');
  resumeCurrentRound();
}

function startGame() {
  gs.settings = loadSettings();
  localStorage.setItem(LS_SETTINGS, JSON.stringify(gs.settings));
  gs.scores = {}; TEAMS.forEach(t => gs.scores[t] = 0);
  gs.roundHistory = {};
  ROUNDS.forEach(r => { gs.roundHistory[r] = {}; TEAMS.forEach(t => gs.roundHistory[r][t] = 0); });
  gs.questionsUsed = {};
  NUGGETS_LEVELS.forEach(l => gs.questionsUsed['nuggets_' + l] = []);
  gs.currentRound = 0; gs.nuggetsLevel = 0; gs.nuggetsTeamInLevel = 0; gs.nuggetsQuestionCount = 0;
  gs.gameActive = true; gs.activeScreen = 'screen-game';
  gs.menusPicked = {}; gs.menusCurrentTeamIdx = 0; gs.menusCurrentQ = 0;
  gs.menusPlayIdx = 0; gs.menusPlayOrder = []; gs.menusPickOrder = [];
  gs.deathUsed = [];
  gs.gameFinished = false;
  updateScoreboard(); showScreen('screen-game');
  persistGameState();

  const order = gs.settings.general.teamOrder;
  if (order === 'random') {
    showTeamDrawModal();
  } else {
    const first = order.replace('-first', '');
    const idx = TEAMS.indexOf(first);
    gs.teamOrder = idx !== -1 ? [...TEAMS.slice(idx), ...TEAMS.slice(0, idx)] : [...TEAMS];
    updateScoreboard();
    showRoundIntro(ROUNDS[0]);
  }
}

// ======================== TEAM DRAW ========================
function showTeamDrawModal() {
  document.getElementById('modal-team-draw').style.display = 'flex';
  document.getElementById('btn-start-team-draw').style.display = 'inline-flex';
  document.getElementById('btn-team-draw-done').style.display = 'none';
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById('draw-val-' + i);
    el.textContent = '?'; el.className = 'draw-slot-value'; el.style.background = ''; el.style.color = '';
  }
}

function runTeamDrawAnimation() {
  document.getElementById('btn-start-team-draw').style.display = 'none';
  const shuffled = [...TEAMS];
  for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]]; }
  gs.teamOrder = shuffled;
  const allLabels = TEAMS.map(t => TEAM_LABELS[t]);
  let slot = 0;
  function revealNext() {
    if (slot >= 4) { setTimeout(() => document.getElementById('btn-team-draw-done').style.display = 'inline-flex', 400); return; }
    const el = document.getElementById('draw-val-' + (slot + 1));
    el.classList.add('spinning');
    let cycles = 0; const max = 15 + slot * 5;
    const iv = setInterval(() => {
      el.textContent = allLabels[Math.floor(Math.random() * allLabels.length)];
      if (++cycles >= max) {
        clearInterval(iv);
        const team = shuffled[slot];
        el.textContent = TEAM_LABELS[team]; el.classList.remove('spinning'); el.classList.add('revealed');
        el.style.background = TEAM_COLORS[team]; el.style.color = (team==='mayo'||team==='frites')?'#333':'#fff';
        playSound('correct'); slot++; setTimeout(revealNext, 500);
      }
    }, 80);
  }
  setTimeout(revealNext, 300);
}

function closeTeamDrawModal() {
  document.getElementById('modal-team-draw').style.display = 'none';
  updateScoreboard();
  persistGameState();
  showRoundIntro(ROUNDS[0]);
}

// ======================== ROUND INTRO ========================
function showRoundIntro(roundKey) {
  const info = ROUND_INFO[roundKey];
  document.getElementById('round-intro-icon').textContent = info.icon;
  document.getElementById('round-intro-title').textContent = info.name;
  document.getElementById('round-intro-desc').textContent = info.desc;
  document.getElementById('round-intro-scoring').textContent = getScoringLabel(roundKey);
  document.getElementById('modal-round').style.display = 'flex';
  document.querySelectorAll('.round-tab').forEach(tab => {
    tab.classList.remove('active');
    if (ROUNDS.indexOf(tab.dataset.round) < gs.currentRound) tab.classList.add('completed');
  });
  const tabEl = document.getElementById('tab-' + roundKey);
  if (tabEl) tabEl.classList.add('active');
}

function getScoringLabel(rk) {
  const s = gs.settings;
  switch (rk) {
    case 'nuggets': return `Niv.1: ${s.nuggets.pts[0]}pt · Niv.2: ${s.nuggets.pts[1]}pts · Niv.3: ${s.nuggets.pts[2]}pts · Niv.4: ${s.nuggets.pts[3]}pts`;
    case 'sel_ou_poivre': return `+${s.sop.points} / −${s.sop.points} par réponse`;
    case 'menus': return `${s.menus.points} pts par bonne réponse · 5 questions ouvertes par menu`;
    case 'addition': return `+${s.addition.points} / −${s.addition.points} par réponse`;
    case 'burger_de_la_mort': return 'L\'équipe en tête choisit son champion !';
    default: return '';
  }
}

function closeRoundModal() {
  document.getElementById('modal-round').style.display = 'none';
  const rk = ROUNDS[gs.currentRound];
  document.querySelectorAll('.game-zone').forEach(z => z.style.display = 'none');
  switch (rk) {
    case 'nuggets': startNuggets(); break;
    case 'sel_ou_poivre': startSpeedRound('sop'); break;
    case 'menus': startMenus(); break;
    case 'addition': startSpeedRound('addition'); break;
    case 'burger_de_la_mort': startDeath(); break;
  }
}

let _pendingNextRoundAction = null;

function confirmNextRound(customAction) {
  _pendingNextRoundAction = customAction || null;
  const modal = document.getElementById('modal-next-round');
  const btn = document.getElementById('btn-confirm-next-round');
  btn.onclick = () => { closeNextRoundModal(); if (_pendingNextRoundAction) _pendingNextRoundAction(); else nextRound(); };
  modal.style.display = 'flex';
}

function closeNextRoundModal() {
  document.getElementById('modal-next-round').style.display = 'none';
}

function nextRound() {
  stopTimer();
  gs.currentRound++;
  if (gs.currentRound >= ROUNDS.length) { clearGameState(); showResults(); return; }
  persistGameState();

  // Special case: Addition → Burger de la Mort uses finishAddition's winner announce
  // For all other transitions, show inter-round score recap
  showInterRoundRecap();
}

function showInterRoundRecap() {
  document.querySelectorAll('.game-zone').forEach(z => z.style.display = 'none');
  document.getElementById('zone-inter-round').style.display = 'flex';

  const nextRoundKey = ROUNDS[gs.currentRound];
  const nextInfo = ROUND_INFO[nextRoundKey];
  const prevRoundKey = ROUNDS[gs.currentRound - 1];
  const prevInfo = ROUND_INFO[prevRoundKey];

  document.getElementById('inter-round-title').textContent = `📊 Fin de ${prevInfo.icon} ${prevInfo.name}`;

  // Build ranking
  const sorted = TEAMS.map(t => ({ team: t, score: gs.scores[t] })).sort((a, b) => b.score - a.score);
  const medals = ['🥇', '🥈', '🥉', '4️⃣'];
  document.getElementById('inter-round-ranking').innerHTML = sorted.map((e, i) =>
    `<div class="inter-round-row${i === 0 ? ' inter-round-first' : ''}">
      <span class="inter-round-medal">${medals[i]}</span>
      <span class="inter-round-name" style="color:${TEAM_COLORS[e.team]}">${TEAM_LABELS[e.team]}</span>
      <span class="inter-round-score">${e.score} pts</span>
    </div>`
  ).join('');

  // Next round info
  document.getElementById('inter-round-next').innerHTML =
    `<div class="inter-round-next-label">Prochaine épreuve</div>
     <div class="inter-round-next-name">${nextInfo.icon} ${nextInfo.name}</div>`;
  document.getElementById('btn-inter-round-continue').textContent = `▶️ Lancer ${nextInfo.icon} ${nextInfo.name}`;
}

function interRoundContinue() {
  document.querySelectorAll('.game-zone').forEach(z => z.style.display = 'none');
  showRoundIntro(ROUNDS[gs.currentRound]);
}

// ======================== NUGGETS ========================
function startNuggets(resume) {
  document.getElementById('zone-nuggets').style.display = 'flex';
  if (!resume) { gs.nuggetsLevel = 0; gs.nuggetsTeamInLevel = 0; gs.nuggetsQuestionCount = 0; }
  loadNuggetsQuestion();
}

function loadNuggetsQuestion() {
  const level = NUGGETS_LEVELS[gs.nuggetsLevel];
  if (!level) { showToast('🟡 Nuggets terminé ! Passez à la suite.'); return; }
  const questions = QUESTIONS_DB.nuggets[level];
  if (!questions) return;

  const team = gs.teamOrder[gs.nuggetsTeamInLevel % gs.teamOrder.length];
  document.getElementById('nuggets-team-name').textContent = TEAM_LABELS[team];
  highlightActiveTeam(team);

  // Draw animation
  showQuestionDrawAnimation(questions, level, team, (question) => {
    gs.currentQuestion = question;
    gs.nuggetsQuestionCount++;
    const lvl = gs.nuggetsLevel + 1;
    document.getElementById('nuggets-q-number').textContent = `🟡 Nuggets — Question ${gs.nuggetsQuestionCount}`;
    document.getElementById('nuggets-q-text').textContent = question.question;
    const badge = document.getElementById('nuggets-level-badge');
    badge.textContent = LEVEL_LABELS[level]; badge.className = `nuggets-level-badge level-${lvl}`;

    // Reset overlays
    document.getElementById('nuggets-suspense').style.display = 'none';
    document.getElementById('nuggets-result').style.display = 'none';
    document.getElementById('nuggets-result').className = 'nuggets-result-overlay';

    renderNuggetsQCM(question);

    // Hide next buttons until answer
    document.getElementById('btn-next-question').style.display = 'none';
    document.getElementById('btn-next-round').style.display = 'none';

    // Timer (click-to-start: just display, don't auto-start)
    stopTimer();
    const timerSec = gs.settings.nuggets.timer;
    if (timerSec > 0) {
      document.getElementById('nuggets-timer-container').style.display = 'block';
      document.getElementById('nuggets-timer-hint').style.display = 'block';
      gs.timerTotal = timerSec; gs.timerRemaining = timerSec;
      gs.nuggetsTimerStarted = false;
      updateTimerDisplay('timer-progress', 'timer-text');
    } else {
      document.getElementById('nuggets-timer-container').style.display = 'none';
    }
  });
}

function showQuestionDrawAnimation(questions, level, team, callback) {
  const modal = document.getElementById('modal-question-draw');
  const strip = document.getElementById('roulette-strip');
  document.getElementById('question-draw-title').textContent = '🎰 Tirage de la question...';
  document.getElementById('question-draw-team').textContent = `Pour l'équipe ${TEAM_LABELS[team]}`;
  document.getElementById('question-draw-team').style.color = TEAM_COLORS[team];
  document.getElementById('question-draw-sub').textContent = LEVEL_LABELS[level];
  strip.innerHTML = '';
  const allQ = questions.map(q => q.question);
  for (let i = 0; i < 35; i++) {
    const div = document.createElement('div'); div.className = 'roulette-item';
    div.textContent = allQ[i % allQ.length]; strip.appendChild(div);
  }
  modal.style.display = 'flex';

  let available = questions.filter((_, i) => !gs.questionsUsed['nuggets_' + level].includes(i));
  if (!available.length) { gs.questionsUsed['nuggets_' + level] = []; available = questions; }
  const win = available[Math.floor(Math.random() * available.length)];
  gs.questionsUsed['nuggets_' + level].push(questions.indexOf(win));

  const final = document.createElement('div'); final.className = 'roulette-item final';
  final.textContent = win.question; strip.appendChild(final);

  const total = strip.children.length;
  const target = (total - 1) * 70;
  const start = performance.now();
  const dur = 2200;
  function anim(now) {
    const p = Math.min((now - start) / dur, 1);
    strip.style.transform = `translateY(-${(1 - Math.pow(1 - p, 3)) * target}px)`;
    if (p < 1) requestAnimationFrame(anim);
    else { playSound('correct'); setTimeout(() => { modal.style.display = 'none'; callback(win); }, 600); }
  }
  strip.style.transform = 'translateY(0)';
  requestAnimationFrame(anim);
}

function renderNuggetsQCM(question) {
  const container = document.getElementById('nuggets-qcm-choices');
  container.innerHTML = '';
  const indices = question.choices.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [indices[i],indices[j]]=[indices[j],indices[i]]; }
  const correctIdx = indices.indexOf(question.answer);

  indices.forEach((origIdx, displayIdx) => {
    const div = document.createElement('div'); div.className = 'qcm-choice';
    div.textContent = `${String.fromCharCode(65 + displayIdx)}. ${question.choices[origIdx]}`;
    div.onclick = () => nuggetsPick(div, displayIdx, correctIdx, container);
    container.appendChild(div);
  });
}

function nuggetsPick(el, selected, correct, container) {
  // Disable all
  container.querySelectorAll('.qcm-choice').forEach(c => { c.onclick = null; c.classList.add('disabled'); });
  el.classList.remove('disabled');
  el.style.borderColor = 'var(--color-accent)';
  stopTimer();

  // Suspense
  const suspense = document.getElementById('nuggets-suspense');
  suspense.style.display = 'flex';

  setTimeout(() => {
    suspense.style.display = 'none';
    const isCorrect = selected === correct;
    const resultEl = document.getElementById('nuggets-result');
    const team = gs.teamOrder[gs.nuggetsTeamInLevel % gs.teamOrder.length];
    const pts = gs.settings.nuggets.pts[gs.nuggetsLevel] || 1;

    // Highlight correct/wrong in QCM
    const choices = container.querySelectorAll('.qcm-choice');
    choices[correct].classList.add('correct-choice');
    if (!isCorrect) el.classList.add('wrong-choice');

    if (isCorrect) {
      resultEl.className = 'nuggets-result-overlay success';
      resultEl.innerHTML = `<div class="result-icon">✅</div><div class="result-text">CORRECT !</div><div class="result-points">+${pts} point${pts > 1 ? 's' : ''} pour ${TEAM_LABELS[team]}</div>`;
      addPoints(team, pts, 'nuggets');
      highlightScoreUp(team);
      playSound('correct');
    } else {
      const correctText = gs.currentQuestion.choices[gs.currentQuestion.answer];
      resultEl.className = 'nuggets-result-overlay failure';
      resultEl.innerHTML = `<div class="result-icon">❌</div><div class="result-text">MAUVAISE RÉPONSE</div><div class="result-correct-answer">La bonne réponse était : <strong>${correctText}</strong></div>`;
      playSound('wrong');
    }
    resultEl.style.display = 'flex';

    // Determine if this is the last nuggets question
    const isLastInLevel = (gs.nuggetsTeamInLevel + 1) >= gs.teamOrder.length;
    const isLastLevel = gs.nuggetsLevel >= (NUGGETS_LEVELS.length - 1);
    if (isLastInLevel && isLastLevel) {
      document.getElementById('btn-next-question').style.display = 'none';
      document.getElementById('btn-next-round').style.display = 'inline-flex';
    } else {
      document.getElementById('btn-next-question').style.display = 'inline-flex';
      document.getElementById('btn-next-round').style.display = 'none';
    }

    // Advance counters NOW so a refresh won't replay this question
    gs.nuggetsTeamInLevel++;
    if (gs.nuggetsTeamInLevel >= gs.teamOrder.length) {
      gs.nuggetsLevel++; gs.nuggetsTeamInLevel = 0;
    }
    persistGameState();

    // Auto-hide after 2.5s
    setTimeout(() => { resultEl.style.display = 'none'; }, 2500);
  }, 1500);
}

function nextQuestion() {
  // Counters already advanced in nuggetsPick, just load next
  if (gs.nuggetsLevel >= NUGGETS_LEVELS.length) {
    showToast('🟡 Nuggets terminé ! Passez à l\'épreuve suivante.');
    return;
  }
  loadNuggetsQuestion();
}

// ======================== SPEED ROUNDS (Sel ou Poivre / Addition) ========================
function startSpeedRound(type) {
  const zoneId = type === 'sop' ? 'zone-sop' : 'zone-addition';
  document.getElementById(zoneId).style.display = 'flex';
  const pts = type === 'sop' ? gs.settings.sop.points : gs.settings.addition.points;
  const gridId = type === 'sop' ? 'sop-score-grid' : 'add-score-grid';

  // Update labels
  if (type === 'sop') {
    document.getElementById('sop-pts-label').textContent = `+${pts}`;
    document.getElementById('sop-pts-label-neg').textContent = `−${pts}`;
  } else {
    document.getElementById('add-pts-label').textContent = `+${pts}`;
    document.getElementById('add-pts-label-neg').textContent = `−${pts}`;
  }

  const roundKey = type === 'sop' ? 'sel_ou_poivre' : 'addition';
  const grid = document.getElementById(gridId);
  grid.innerHTML = '';

  gs.teamOrder.forEach(team => {
    const card = document.createElement('div');
    card.className = 'speed-team-card';
    card.style.borderColor = TEAM_COLORS[team];
    card.innerHTML = `
      <div class="stc-name" style="color:${TEAM_COLORS[team]}">${TEAM_LABELS[team]}</div>
      <div class="stc-score" id="speed-${type}-${team}">${gs.scores[team]}</div>
      <div class="stc-buttons">
        <button class="btn btn-plus" onclick="speedPoint('${type}','${team}',${pts})">+${pts}</button>
        <button class="btn btn-minus" onclick="speedPoint('${type}','${team}',${-pts})">−${pts}</button>
      </div>`;
    grid.appendChild(card);
  });
}

function speedPoint(type, team, pts) {
  const roundKey = type === 'sop' ? 'sel_ou_poivre' : 'addition';
  gs.scores[team] += pts;
  gs.roundHistory[roundKey][team] += pts;
  updateScoreboard();
  persistGameState();

  // Update speed card display
  const el = document.getElementById(`speed-${type}-${team}`);
  if (el) { el.textContent = gs.scores[team]; }

  if (pts > 0) { highlightScoreUp(team); playSound('correct'); }
  else { highlightScoreDown(team); playSound('wrong'); }
}

// ======================== MENUS ========================
function startMenus(resume) {
  document.getElementById('zone-menus').style.display = 'flex';
  if (resume && gs.menusPlayOrder && gs.menusPlayOrder.length > 0 && gs.menusCurrentQ >= 0) {
    // Resume into play phase if menus were already picked
    if (Object.keys(gs.menusPicked).length >= gs.menusPickOrder.length) {
      document.getElementById('menus-ranking-phase').style.display = 'none';
      document.getElementById('menus-pick-phase').style.display = 'none';
      document.getElementById('menus-play-phase').style.display = 'block';
      gs.menusPlayIdx = gs.menusPlayIdx || 0;
      loadMenuQuestion();
      return;
    }
    // Resume into pick phase if ranking already done
    if (gs.menusPickOrder && gs.menusPickOrder.length > 0) {
      document.getElementById('menus-ranking-phase').style.display = 'none';
      document.getElementById('menus-pick-phase').style.display = 'block';
      document.getElementById('menus-play-phase').style.display = 'none';
      renderMenuGrid();
      updateMenusPickTeam();
      return;
    }
  }
  // Show ranking phase
  document.getElementById('menus-ranking-phase').style.display = 'block';
  document.getElementById('menus-pick-phase').style.display = 'none';
  document.getElementById('menus-play-phase').style.display = 'none';
  document.getElementById('menus-final-order').style.display = 'none';

  // Build ranking display
  const sorted = [...gs.teamOrder].sort((a, b) => gs.scores[b] - gs.scores[a]);
  const tieGroups = findTieGroups(sorted);
  const medals = ['🥇', '🥈', '🥉', '4️⃣'];
  const rankingList = document.getElementById('menus-ranking-list');
  rankingList.innerHTML = sorted.map((t, i) => {
    const isTied = tieGroups.some(g => g.includes(t));
    return `<div class="menus-ranking-row${isTied ? ' menus-ranking-tied' : ''}">
      <span class="menus-ranking-medal">${medals[i]}</span>
      <span class="menus-ranking-name" style="color:${TEAM_COLORS[t]}">${TEAM_LABELS[t]}</span>
      <span class="menus-ranking-score">${gs.scores[t]} pts</span>
      ${isTied ? '<span class="menus-ranking-tie-badge">⚡ EX-AEQUO</span>' : ''}
    </div>`;
  }).join('');

  const tiesEl = document.getElementById('menus-ranking-ties');
  const tieBtn = document.getElementById('btn-menus-tiebreak');

  if (tieGroups.length > 0) {
    const tieDescs = tieGroups.map(g => g.map(t => TEAM_LABELS[t]).join(' et ')).join(' · ');
    tiesEl.innerHTML = `⚡ Ex-aequo détecté ! ${tieDescs}`;
    tiesEl.style.display = 'block';
    tieBtn.style.display = 'inline-flex';
    // Store for tiebreak
    gs._menusSorted = sorted;
    gs._menusTieGroups = tieGroups;
  } else {
    tiesEl.style.display = 'none';
    tieBtn.style.display = 'none';
    // No ties — show final order directly
    showMenusFinalOrder(sorted);
  }
}

function launchMenusTiebreak() {
  document.getElementById('btn-menus-tiebreak').style.display = 'none';
  gs._tieGroups = gs._menusTieGroups;
  gs._tieSorted = gs._menusSorted;
  gs._tieIdx = 0;
  gs._tieResolved = [];
  resolveNextTieGroup();
}

function showMenusFinalOrder(orderedTeams) {
  gs.menusPickOrder = orderedTeams;
  const orderList = document.getElementById('menus-order-list');
  const labels = ['1er', '2ème', '3ème', '4ème'];
  orderList.innerHTML = orderedTeams.map((t, i) =>
    `<div class="menus-order-row">
      <span class="menus-order-pos">${labels[i]}</span>
      <span class="menus-order-name" style="color:${TEAM_COLORS[t]}">${TEAM_LABELS[t]}</span>
    </div>`
  ).join('');
  document.getElementById('menus-final-order').style.display = 'block';
}

function proceedToMenuPick() {
  document.getElementById('menus-ranking-phase').style.display = 'none';
  document.getElementById('menus-pick-phase').style.display = 'block';
  gs.menusCurrentTeamIdx = 0;
  gs.menusAvailable = Object.keys(QUESTIONS_DB.menus);
  gs.menusPicked = {};
  gs._tieResolved = null;
  gs._tieGroups = null;
  gs._menusTieGroups = null;
  gs._menusSorted = null;
  renderMenuGrid();
  updateMenusPickTeam();
  persistGameState();
}

function findTieGroups(sorted) {
  const groups = [];
  let i = 0;
  while (i < sorted.length) {
    let j = i + 1;
    while (j < sorted.length && gs.scores[sorted[j]] === gs.scores[sorted[i]]) j++;
    if (j - i > 1) groups.push(sorted.slice(i, j));
    i = j;
  }
  return groups;
}

function resolveNextTieGroup() {
  if (gs._tieIdx >= gs._tieGroups.length) {
    // All ties resolved — build final order
    const sorted = [...gs._tieSorted].sort((a, b) => {
      if (gs.scores[b] !== gs.scores[a]) return gs.scores[b] - gs.scores[a];
      const ra = gs._tieResolved.indexOf(a);
      const rb = gs._tieResolved.indexOf(b);
      if (ra !== -1 && rb !== -1) return ra - rb;
      return 0;
    });
    finishMenuPickOrder(sorted);
    return;
  }
  showTiebreakWheel(gs._tieGroups[gs._tieIdx]);
}

function showTiebreakWheel(teams) {
  const modal = document.getElementById('modal-tiebreak');
  const score = gs.scores[teams[0]];
  document.getElementById('tiebreak-desc').innerHTML = `Les équipes suivantes sont ex-aequo à <strong>${score} pts</strong>.<br>La roue va déterminer l'ordre de choix !`;
  document.getElementById('tiebreak-result').textContent = '';
  document.getElementById('btn-tiebreak-spin').style.display = 'inline-flex';
  document.getElementById('btn-tiebreak-done').style.display = 'none';

  gs._tieWheelTeams = [...teams];
  gs._tieWheelResolved = [];
  gs._wheelAngle = 0;
  drawWheel(teams, 0);
  modal.style.display = 'flex';
}

function drawWheel(teams, angle) {
  const canvas = document.getElementById('tiebreak-canvas');
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2, cy = canvas.height / 2, r = 130;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle * Math.PI / 180);

  const n = teams.length;
  const sliceAngle = (2 * Math.PI) / n;
  const COLORS_MAP = { ketchup: '#e74c3c', mayo: '#f1c40f', cheeseburger: '#e67e22', frites: '#f39c12' };
  const LABELS_MAP = { ketchup: '🍅 KETCHUP', mayo: '🥚 MAYO', cheeseburger: '🧀 CHEESE', frites: '🍟 FRITES' };

  teams.forEach((team, i) => {
    const startAngle = -Math.PI / 2 + i * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = COLORS_MAP[team] || '#888';
    ctx.fill();
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw label
    ctx.save();
    const midAngle = startAngle + sliceAngle / 2;
    ctx.rotate(midAngle);
    ctx.textAlign = 'center';
    ctx.fillStyle = (team === 'mayo' || team === 'frites') ? '#333' : '#fff';
    ctx.font = 'bold 14px "Fredoka One", cursive';
    ctx.fillText(LABELS_MAP[team] || team, r * 0.55, 5);
    ctx.restore();
  });

  ctx.restore();

  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, r + 2, 0, 2 * Math.PI);
  ctx.strokeStyle = '#e94560';
  ctx.lineWidth = 4;
  ctx.stroke();
}

function spinTiebreakWheel() {
  const teams = gs._tieWheelTeams;
  if (teams.length <= 1) {
    gs._tieWheelResolved.push(teams[0]);
    finalizeTieGroup();
    return;
  }

  document.getElementById('btn-tiebreak-spin').style.display = 'none';
  const n = teams.length;
  const sliceAngle = 360 / n;

  // Pick random winner — pointer is at top (0°/12 o'clock)
  const winIdx = Math.floor(Math.random() * n);
  // The wheel needs to rotate so that winIdx's slice center lands under the top pointer
  // Slice i center is at i * sliceAngle degrees from top
  const sliceCenter = winIdx * sliceAngle + sliceAngle / 2;
  // We need to rotate so that sliceCenter ends up at 0 (top), so rotate by -sliceCenter + full rotations
  const totalRotation = 360 * (5 + Math.random() * 3) - sliceCenter;

  const startAngle = gs._wheelAngle || 0;
  const endAngle = startAngle + totalRotation;
  const duration = 4000;
  const startTime = performance.now();

  function animateWheel(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentAngle = startAngle + (endAngle - startAngle) * eased;
    drawWheel(teams, currentAngle);

    if (progress < 1) {
      requestAnimationFrame(animateWheel);
    } else {
      gs._wheelAngle = currentAngle % 360;
      const winner = teams[winIdx];
      gs._tieWheelResolved.push(winner);
      gs._tieWheelTeams = teams.filter(t => t !== winner);
      playSound('correct');

      const pos = gs._tieWheelResolved.length;
      document.getElementById('tiebreak-result').innerHTML = `${TEAM_LABELS[winner]} choisit en ${pos === 1 ? '1er' : pos + 'ème'} !`;

      if (gs._tieWheelTeams.length <= 1) {
        if (gs._tieWheelTeams.length === 1) gs._tieWheelResolved.push(gs._tieWheelTeams[0]);
        setTimeout(() => finalizeTieGroup(), 800);
      } else {
        setTimeout(() => {
          gs._wheelAngle = 0;
          drawWheel(gs._tieWheelTeams, 0);
          document.getElementById('btn-tiebreak-spin').style.display = 'inline-flex';
        }, 600);
      }
    }
  }
  requestAnimationFrame(animateWheel);
}

function finalizeTieGroup() {
  gs._tieWheelResolved.forEach(t => { if (!gs._tieResolved.includes(t)) gs._tieResolved.push(t); });
  document.getElementById('btn-tiebreak-spin').style.display = 'none';
  document.getElementById('btn-tiebreak-done').style.display = 'inline-flex';
  const summary = gs._tieWheelResolved.map((t, i) => `${i + 1}. ${TEAM_LABELS[t]}`).join('  ·  ');
  document.getElementById('tiebreak-result').innerHTML = `Ordre : ${summary}`;
}

function closeTiebreakModal() {
  document.getElementById('modal-tiebreak').style.display = 'none';
  gs._tieIdx++;
  resolveNextTieGroup();
}

function finishMenuPickOrder(sorted) {
  document.getElementById('menus-ranking-ties').style.display = 'none';
  showMenusFinalOrder(sorted);
}

function renderMenuGrid() {
  const grid = document.getElementById('menus-grid');
  grid.innerHTML = '';
  gs.menusAvailable.forEach((name, idx) => {
    const picked = Object.values(gs.menusPicked).includes(name);
    const card = document.createElement('div');
    card.className = 'menu-card' + (picked ? ' picked' : '');
    const icon = name.split(' ')[0];
    const label = name.replace(/^[^\s]+\s/, '');
    card.innerHTML = `<span class="menu-icon">${icon}</span><span class="menu-number">Menu ${idx + 1}</span>${label}`;
    if (!picked) card.onclick = () => pickMenu(name);
    grid.appendChild(card);
  });
}

function updateMenusPickTeam() {
  if (gs.menusCurrentTeamIdx >= gs.menusPickOrder.length) return;
  const team = gs.menusPickOrder[gs.menusCurrentTeamIdx];
  document.getElementById('menus-pick-team').textContent = TEAM_LABELS[team];
  highlightActiveTeam(team);
}

function pickMenu(menuName) {
  const team = gs.menusPickOrder[gs.menusCurrentTeamIdx];
  gs.menusPicked[team] = menuName;
  gs.menusCurrentTeamIdx++;
  persistGameState();

  if (gs.menusCurrentTeamIdx < gs.menusPickOrder.length) {
    renderMenuGrid();
    updateMenusPickTeam();
  } else {
    // All picked — start playing menus in pick order
    renderMenuGrid();
    startMenusPlay();
  }
}

function startMenusPlay() {
  document.getElementById('menus-pick-phase').style.display = 'none';
  document.getElementById('menus-play-phase').style.display = 'block';
  gs.menusPlayOrder = [...gs.menusPickOrder];
  gs.menusPlayIdx = 0;
  gs.menusCurrentQ = 0;
  loadMenuQuestion();
}

function loadMenuQuestion() {
  if (gs.menusPlayIdx >= gs.menusPlayOrder.length) {
    showToast('📋 Épreuve des Menus terminée !');
    document.getElementById('menus-play-phase').style.display = 'none';
    return;
  }
  const team = gs.menusPlayOrder[gs.menusPlayIdx];
  const menuName = gs.menusPicked[team];
  const questions = QUESTIONS_DB.menus[menuName];

  if (gs.menusCurrentQ >= questions.length) {
    // This team's menu is done, next team
    gs.menusPlayIdx++;
    gs.menusCurrentQ = 0;
    loadMenuQuestion();
    return;
  }

  const q = questions[gs.menusCurrentQ];
  document.getElementById('menus-play-team').textContent = TEAM_LABELS[team];
  document.getElementById('menus-play-menu-name').textContent = menuName;
  document.getElementById('menus-q-number').textContent = `Question ${gs.menusCurrentQ + 1} / ${questions.length}`;
  document.getElementById('menus-q-text').textContent = q;
  highlightActiveTeam(team);

  // Show answer buttons, hide next buttons and feedback
  document.getElementById('menus-answer-buttons').style.display = 'flex';
  document.getElementById('menus-points-feedback').style.display = 'none';
  document.getElementById('menus-points-feedback').className = 'menus-points-feedback';
  document.getElementById('btn-menus-next').style.display = 'none';
  document.getElementById('btn-menus-next-round').style.display = 'none';

  // Timer (click-to-start)
  stopTimer();
  const timerSec = gs.settings.menus.timer;
  if (timerSec > 0) {
    document.getElementById('menus-timer-container').style.display = 'block';
    document.getElementById('menus-timer-hint').style.display = 'block';
    gs.timerTotal = timerSec; gs.timerRemaining = timerSec;
    gs.menusTimerStarted = false;
    updateTimerDisplay('menus-timer-progress', 'menus-timer-text');
  } else {
    document.getElementById('menus-timer-container').style.display = 'none';
  }
}

function menusAnswer(isCorrect) {
  const team = gs.menusPlayOrder[gs.menusPlayIdx];
  const menuName = gs.menusPicked[team];
  const pts = gs.settings.menus.points;
  const feedbackEl = document.getElementById('menus-points-feedback');

  // Hide answer buttons and stop timer
  document.getElementById('menus-answer-buttons').style.display = 'none';
  stopTimer();
  document.getElementById('menus-timer-container').style.display = 'none';

  if (isCorrect) {
    addPoints(team, pts, 'menus');
    highlightScoreUp(team);
    playSound('correct');
    feedbackEl.className = 'menus-points-feedback feedback-correct';
    feedbackEl.textContent = `✅ +${pts} point${pts > 1 ? 's' : ''} pour ${TEAM_LABELS[team]}`;
  } else {
    playSound('wrong');
    feedbackEl.className = 'menus-points-feedback feedback-incorrect';
    feedbackEl.textContent = `❌ Pas de point`;
  }
  feedbackEl.style.display = 'block';

  // Advance counters now (refresh-safe)
  gs.menusCurrentQ++;
  const isLastQ = gs.menusCurrentQ >= QUESTIONS_DB.menus[menuName].length;
  let isLastTeam = false;
  if (isLastQ) {
    isLastTeam = (gs.menusPlayIdx + 1) >= gs.menusPlayOrder.length;
  }
  persistGameState();

  // Show appropriate button
  if (isLastQ && isLastTeam) {
    document.getElementById('btn-menus-next').style.display = 'none';
    document.getElementById('btn-menus-next-round').style.display = 'inline-flex';
  } else if (isLastQ) {
    // Team finished — show transition button
    document.getElementById('btn-menus-next').style.display = 'none';
    document.getElementById('btn-menus-next-round').style.display = 'none';
    setTimeout(() => showMenusTransition(team, menuName), 800);
  } else {
    document.getElementById('btn-menus-next').style.display = 'inline-flex';
    document.getElementById('btn-menus-next-round').style.display = 'none';
  }
}

function showMenusTransition(finishedTeam, menuName) {
  document.getElementById('menus-play-phase').style.display = 'none';
  document.getElementById('menus-transition-phase').style.display = 'flex';

  const roundPts = gs.roundHistory.menus[finishedTeam];
  const totalPts = gs.scores[finishedTeam];
  const menuLabel = menuName;

  let summaryHTML = `<div class="mt-done-icon">✅</div>`;
  summaryHTML += `<h2 class="mt-done-team" style="color:${TEAM_COLORS[finishedTeam]}">${TEAM_LABELS[finishedTeam]}</h2>`;
  summaryHTML += `<p class="mt-done-menu">a terminé le <strong>${menuLabel}</strong></p>`;
  summaryHTML += `<div class="mt-done-scores">`;
  summaryHTML += `<span class="mt-score-round">Menus : <strong>+${roundPts} pts</strong></span>`;
  summaryHTML += `<span class="mt-score-total">Score total : <strong>${totalPts} pts</strong></span>`;
  summaryHTML += `</div>`;

  document.getElementById('menus-transition-summary').innerHTML = summaryHTML;

  // Next team info
  const nextPlayIdx = gs.menusPlayIdx + 1;
  if (nextPlayIdx < gs.menusPlayOrder.length) {
    const nextTeam = gs.menusPlayOrder[nextPlayIdx];
    const nextMenu = gs.menusPicked[nextTeam];
    let nextHTML = `<div class="mt-next-header">À suivre</div>`;
    nextHTML += `<p class="mt-next-team" style="color:${TEAM_COLORS[nextTeam]}">${TEAM_LABELS[nextTeam]}</p>`;
    nextHTML += `<p class="mt-next-menu">${nextMenu}</p>`;
    document.getElementById('menus-transition-next').innerHTML = nextHTML;
    document.getElementById('btn-menus-transition').textContent = `▶️ ${TEAM_LABELS[nextTeam]}, c'est à vous !`;
  }
}

function menusTransitionContinue() {
  document.getElementById('menus-transition-phase').style.display = 'none';
  document.getElementById('menus-play-phase').style.display = 'block';
  // Advance to next team
  gs.menusPlayIdx++;
  gs.menusCurrentQ = 0;
  persistGameState();
  loadMenuQuestion();
}

function menusNextQuestion() {
  loadMenuQuestion();
}

// ======================== WINNER ANNOUNCEMENT ========================
const WINNER_MESSAGES = [
  'Quelle performance ! Vous avez écrasé la concurrence ! 🔥',
  'Incroyable ! Vous êtes les rois du burger ! 👑',
  'Bravo ! Personne ne peut vous arrêter ! 💪',
  'Magnifique ! Les frites de la victoire sont pour vous ! 🎉',
  'Chapeau ! Vous avez tout dévoré sur votre passage ! 🍔'
];

function finishAddition() {
  stopTimer();
  // Show winner announcement zone
  document.querySelectorAll('.game-zone').forEach(z => z.style.display = 'none');
  document.getElementById('zone-winner-announce').style.display = 'flex';

  const sorted = TEAMS.map(t => ({ team: t, score: gs.scores[t] })).sort((a, b) => b.score - a.score);
  const winner = sorted[0].team;
  const TEAM_ICONS = { ketchup: '🍅', mayo: '🥚', cheeseburger: '🧀', frites: '🍟' };

  document.getElementById('winner-announce-icon').textContent = TEAM_ICONS[winner];
  document.getElementById('winner-announce-title').textContent = `${TEAM_LABELS[winner]} est en tête !`;
  document.getElementById('winner-announce-title').style.color = TEAM_COLORS[winner];
  const msg = WINNER_MESSAGES[Math.floor(Math.random() * WINNER_MESSAGES.length)];
  document.getElementById('winner-announce-msg').innerHTML = `${msg}<br><br>Mais attention… il reste le <strong>Burger de la Mort</strong> ! 💀`;

  // Render mini podium
  const medals = ['🥇','🥈','🥉','4️⃣'];
  const podiumEl = document.getElementById('winner-podium');
  podiumEl.innerHTML = sorted.map((e, i) =>
    `<div class="winner-rank-row${i === 0 ? ' winner-rank-first' : ''}">
      <span class="winner-rank-medal">${medals[i]}</span>
      <span class="winner-rank-name" style="color:${TEAM_COLORS[e.team]}">${TEAM_LABELS[e.team]}</span>
      <span class="winner-rank-score">${e.score} pts</span>
    </div>`
  ).join('');

  playSound('correct');
}

function proceedToDeath() {
  document.querySelectorAll('.game-zone').forEach(z => z.style.display = 'none');
  gs.currentRound = ROUNDS.indexOf('burger_de_la_mort');
  persistGameState();
  showRoundIntro('burger_de_la_mort');
}

// ======================== BURGER DE LA MORT ========================
function startDeath() {
  document.getElementById('zone-death').style.display = 'flex';
  // Find leading team
  const sorted = [...TEAMS].sort((a, b) => gs.scores[b] - gs.scores[a]);
  const winner = sorted[0];
  const banner = document.getElementById('death-winner-banner');
  banner.textContent = `${TEAM_LABELS[winner]} est en tête !`;
  banner.style.background = TEAM_COLORS[winner];
  banner.style.color = (winner === 'mayo' || winner === 'frites') ? '#333' : '#fff';
  highlightActiveTeam(winner);
  document.getElementById('death-choose-msg').textContent = `${TEAM_LABELS[winner]}, choisissez un membre de votre équipe pour relever le défi !`;
  document.getElementById('death-card').style.display = 'none';
  document.getElementById('death-answer').style.display = 'none';
  gs.deathUsed = gs.deathUsed || [];
}

function deathPickQuestion() {
  const questions = QUESTIONS_DB.burger_de_la_mort;
  let available = questions.filter((_, i) => !(gs.deathUsed || []).includes(i));
  if (!available.length) { gs.deathUsed = []; available = questions; }
  const q = available[Math.floor(Math.random() * available.length)];
  gs.deathUsed = gs.deathUsed || [];
  gs.deathUsed.push(questions.indexOf(q));
  gs.currentQuestion = q;

  document.getElementById('death-card').style.display = 'block';
  document.getElementById('death-q-text').textContent = q.question;
  document.getElementById('death-answer').style.display = 'none';

  // Set timer value
  gs.timerTotal = q.timer || gs.settings.death.timer;
  gs.timerRemaining = gs.timerTotal;
}

function deathShowAnswer() {
  if (!gs.currentQuestion) return;
  const el = document.getElementById('death-answer');
  el.textContent = `Réponse : ${gs.currentQuestion.answer}`;
  el.style.display = 'block';
}

function deathStartTimer() {
  stopTimer();
  document.getElementById('death-timer-container').style.display = 'block';
  gs.timerRemaining = gs.timerTotal;
  updateTimerDisplay('death-timer-progress', 'death-timer-text');
  startTimerWith('death-timer-progress', 'death-timer-text');
}

// ======================== SCORING ========================
function addPoints(team, pts, roundKey) {
  gs.scores[team] += pts;
  if (roundKey) gs.roundHistory[roundKey][team] += pts;
  updateScoreboard();
  persistGameState();
}

function updateScoreboard() {
  TEAMS.forEach(t => document.getElementById('pts-' + t).textContent = gs.scores[t]);
  // Reorder scoreboard bar to match team draw order
  if (gs.teamOrder && gs.teamOrder.length) {
    const bar = document.querySelector('.scoreboard-bar');
    gs.teamOrder.forEach(t => {
      const el = document.getElementById('score-' + t);
      if (el) bar.appendChild(el);
    });
  }
}

function highlightScoreUp(team) {
  const scoreEl = document.getElementById('score-' + team);
  const ptsEl = document.getElementById('pts-' + team);
  scoreEl.classList.add('score-up'); ptsEl.classList.remove('score-pop'); void ptsEl.offsetWidth; ptsEl.classList.add('score-pop');
  setTimeout(() => scoreEl.classList.remove('score-up'), 1200);
}

function highlightScoreDown(team) {
  const scoreEl = document.getElementById('score-' + team);
  const ptsEl = document.getElementById('pts-' + team);
  scoreEl.classList.add('score-down'); ptsEl.classList.remove('score-drop'); void ptsEl.offsetWidth; ptsEl.classList.add('score-drop');
  setTimeout(() => scoreEl.classList.remove('score-down'), 1200);
}

function highlightActiveTeam(team) {
  document.querySelectorAll('.team-score').forEach(el => el.classList.remove('active-team'));
  document.getElementById('score-' + team).classList.add('active-team');
}

// ======================== TIMER ========================
function startNuggetsTimer() {
  if (gs.nuggetsTimerStarted) return;
  gs.nuggetsTimerStarted = true;
  document.getElementById('nuggets-timer-hint').style.display = 'none';
  startTimerWith('timer-progress', 'timer-text');
}

function startMenusTimer() {
  if (gs.menusTimerStarted) return;
  gs.menusTimerStarted = true;
  document.getElementById('menus-timer-hint').style.display = 'none';
  startTimerWith('menus-timer-progress', 'menus-timer-text');
}

function startTimerWith(progressId, textId) {
  stopTimer();
  gs.timerInterval = setInterval(() => {
    gs.timerRemaining--;
    updateTimerDisplay(progressId, textId);
    if (gs.timerRemaining <= 0) {
      stopTimer(); playSound('timer');
      showToast('⏰ Temps écoulé ! Il faut répondre maintenant… sinon c\'est perdu ! 😉');
    }
  }, 1000);
}

function startTimer() {
  startTimerWith('timer-progress', 'timer-text');
}

function stopTimer() {
  if (gs.timerInterval) { clearInterval(gs.timerInterval); gs.timerInterval = null; }
}

function updateTimerDisplay(progressId, textId) {
  const r = gs.timerRemaining, t = gs.timerTotal;
  const progress = document.getElementById(progressId);
  const text = document.getElementById(textId);
  if (!progress || !text) return;
  text.textContent = r;
  const circ = 2 * Math.PI * 45;
  progress.style.strokeDasharray = circ;
  progress.style.strokeDashoffset = circ * (1 - r / t);
  progress.classList.remove('warning', 'danger');
  if (r <= 5) progress.classList.add('danger');
  else if (r <= t * 0.3) progress.classList.add('warning');
}

// ======================== RESULTS ========================
function showResults() {
  stopTimer(); showScreen('screen-results');
  // Mark game as finished but keep state for 'Continuer'
  gs.gameFinished = true;
  persistGameState();
  const sorted = TEAMS.map(t => ({ team: t, score: gs.scores[t] })).sort((a, b) => b.score - a.score);
  const heights = [250, 190, 140, 100]; const medals = ['🥇','🥈','🥉','4️⃣'];
  document.getElementById('podium').innerHTML = sorted.map((e, i) =>
    `<div class="podium-place"><div class="podium-rank">${medals[i]}</div><div class="podium-team-name">${TEAM_LABELS[e.team]}</div><div class="podium-bar" style="height:${heights[i]}px;background:var(--color-${e.team})">${e.score} pts</div></div>`
  ).join('');
  const rh = gs.roundHistory;
  let html = `<table><tr><th>Équipe</th><th>🟡</th><th>🧂</th><th>📋</th><th>🧾</th><th>💀</th><th>TOTAL</th></tr>`;
  sorted.forEach(e => {
    html += `<tr><td><strong>${TEAM_LABELS[e.team]}</strong></td><td>${rh.nuggets[e.team]}</td><td>${rh.sel_ou_poivre[e.team]}</td><td>${rh.menus[e.team]}</td><td>${rh.addition[e.team]}</td><td>${rh.burger_de_la_mort[e.team]}</td><td><strong>${e.score}</strong></td></tr>`;
  });
  document.getElementById('results-details').innerHTML = html + '</table>';
}

function resetGame() { stopTimer(); clearGameState(); updateContinueButton(); showScreen('screen-welcome'); }
function resetGameFull() { stopTimer(); clearGameState(); updateContinueButton(); showScreen('screen-welcome'); }

// ======================== UTILITIES ========================
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#2c3e50;color:#ecf0f1;padding:14px 28px;border-radius:50px;font-family:"Fredoka One",cursive;font-size:16px;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.4);transition:opacity 0.3s;pointer-events:none;'; document.body.appendChild(t); }
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(t._to); t._to = setTimeout(() => t.style.opacity = '0', 2500);
}

function playSound(type) {
  // Sons désactivés
}

// ======================== PERSISTENCE ========================
function persistGameState() {
  if (!gs.gameActive) return;
  const state = {
    scores: gs.scores,
    currentRound: gs.currentRound,
    teamOrder: gs.teamOrder,
    nuggetsLevel: gs.nuggetsLevel,
    nuggetsTeamInLevel: gs.nuggetsTeamInLevel,
    nuggetsQuestionCount: gs.nuggetsQuestionCount,
    questionsUsed: gs.questionsUsed,
    roundHistory: gs.roundHistory,
    gameActive: gs.gameActive,
    menusPicked: gs.menusPicked,
    menusCurrentTeamIdx: gs.menusCurrentTeamIdx,
    menusCurrentQ: gs.menusCurrentQ,
    menusPlayIdx: gs.menusPlayIdx,
    menusPlayOrder: gs.menusPlayOrder,
    menusPickOrder: gs.menusPickOrder,
    deathUsed: gs.deathUsed || [],
    gameFinished: gs.gameFinished || false
  };
  localStorage.setItem(LS_GAMESTATE, JSON.stringify(state));
}

function clearGameState() {
  gs.gameActive = false;
  localStorage.removeItem(LS_GAMESTATE);
}

function restoreGameState() {
  const raw = localStorage.getItem(LS_GAMESTATE);
  if (!raw) return false;
  try {
    const state = JSON.parse(raw);
    if (!state || !state.gameActive) return false;
    // Validate essential fields
    if (!state.teamOrder || !state.teamOrder.length || !state.scores || !state.roundHistory) {
      localStorage.removeItem(LS_GAMESTATE);
      return false;
    }
    if (typeof state.currentRound !== 'number' || state.currentRound < 0 || state.currentRound >= ROUNDS.length) {
      localStorage.removeItem(LS_GAMESTATE);
      return false;
    }
    Object.assign(gs, state);
    return true;
  } catch (e) { localStorage.removeItem(LS_GAMESTATE); return false; }
}

// ======================== KEYBOARD ========================
document.addEventListener('keydown', e => {
  if (!document.getElementById('screen-game').classList.contains('active')) return;
  if (e.key === 'ArrowRight') nextQuestion();
  else if (e.key === 'Escape') confirmNextRound();
  else if (e.key === 't' || e.key === 'T') startTimer();
});

// ======================== INIT ========================
function applySettingsToForm(s) {
  document.getElementById('set-nuggets-pts-1').value = s.nuggets.pts[0];
  document.getElementById('set-nuggets-pts-2').value = s.nuggets.pts[1];
  document.getElementById('set-nuggets-pts-3').value = s.nuggets.pts[2];
  document.getElementById('set-nuggets-pts-4').value = s.nuggets.pts[3];
  document.getElementById('set-nuggets-timer').value = s.nuggets.timer;
  document.getElementById('set-sop-points').value = s.sop.points;
  document.getElementById('set-menus-points').value = s.menus.points;
  document.getElementById('set-menus-timer').value = s.menus.timer;
  document.getElementById('set-addition-points').value = s.addition.points;
  document.getElementById('set-death-timer').value = s.death.timer;
  document.getElementById('set-team-order').value = s.general.teamOrder;
  document.getElementById('set-animateur-1').value = s.general.animateur1;
  document.getElementById('set-animateur-2').value = s.general.animateur2;
}

function resumeCurrentRound() {
  showScreen('screen-game');
  updateScoreboard();
  // Update round tabs
  document.querySelectorAll('.round-tab').forEach(tab => {
    tab.classList.remove('active', 'completed');
    if (ROUNDS.indexOf(tab.dataset.round) < gs.currentRound) tab.classList.add('completed');
  });
  const rk = ROUNDS[gs.currentRound];
  const tabEl = document.getElementById('tab-' + rk);
  if (tabEl) tabEl.classList.add('active');
  // Show correct zone
  document.querySelectorAll('.game-zone').forEach(z => z.style.display = 'none');
  switch (rk) {
    case 'nuggets': startNuggets(true); break;
    case 'sel_ou_poivre': startSpeedRound('sop'); break;
    case 'menus': startMenus(true); break;
    case 'addition': startSpeedRound('addition'); break;
    case 'burger_de_la_mort': startDeath(); break;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Load settings from localStorage or defaults
  let saved;
  try { saved = JSON.parse(localStorage.getItem(LS_SETTINGS)); } catch (e) {}
  const d = getDefaultSettings();
  // Merge saved over defaults (handles missing keys if settings evolve)
  const s = saved ? {
    nuggets: { ...d.nuggets, ...saved.nuggets },
    sop: { ...d.sop, ...saved.sop },
    menus: { ...d.menus, ...saved.menus },
    addition: { ...d.addition, ...saved.addition },
    death: { ...d.death, ...saved.death },
    general: { ...d.general, ...saved.general }
  } : d;
  gs.settings = s;
  applySettingsToForm(s);
  updateAnimateursDisplay();
  updateContinueButton();
});
