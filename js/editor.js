/* ============================================================
   BURGER QUIZ — Question Editor
   Manage custom Nuggets & Menus questions stored in localStorage
   ============================================================ */

const LS_CUSTOM_NUGGETS = 'burgerquiz_custom_nuggets';
const LS_CUSTOM_MENUS   = 'burgerquiz_custom_menus';

// ── Persistence helpers ──────────────────────────────────────
function editorLoadNuggets() {
  try { return JSON.parse(localStorage.getItem(LS_CUSTOM_NUGGETS)) || []; }
  catch { return []; }
}
function editorSaveNuggetsList(list) {
  localStorage.setItem(LS_CUSTOM_NUGGETS, JSON.stringify(list));
}
function editorLoadMenus() {
  try { return JSON.parse(localStorage.getItem(LS_CUSTOM_MENUS)) || []; }
  catch { return []; }
}
function editorSaveMenusList(list) {
  localStorage.setItem(LS_CUSTOM_MENUS, JSON.stringify(list));
}

// ── Tab switching ────────────────────────────────────────────
function editorSwitchTab(tab) {
  document.querySelectorAll('.editor-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.editor-tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('editor-tab-' + tab).classList.add('active');
}

// ── Theme dropdown logic ─────────────────────────────────────
function editorThemeSelectChange(sel) {
  const newInput = document.getElementById(sel.id.replace('-theme', '-theme-new'));
  if (sel.value === '__new__') {
    newInput.style.display = '';
    newInput.focus();
  } else {
    newInput.style.display = 'none';
    newInput.value = '';
  }
}

function editorGetTheme(prefix) {
  const sel = document.getElementById('ed-' + prefix + '-theme');
  const inp = document.getElementById('ed-' + prefix + '-theme-new');
  if (sel.value === '__new__') return inp.value.trim();
  return sel.value;
}

function editorRefreshThemeDropdowns() {
  const themes = editorGetAllThemes();
  ['nugget', 'menu'].forEach(prefix => {
    const sel = document.getElementById('ed-' + prefix + '-theme');
    const current = sel.value;
    // Keep first two options (placeholder + new)
    while (sel.options.length > 2) sel.remove(2);
    themes.forEach(th => {
      const opt = document.createElement('option');
      opt.value = th;
      opt.textContent = th;
      sel.appendChild(opt);
    });
    if (current && current !== '__new__') sel.value = current;
  });
  // Also update nuggets filter dropdown
  const filterSel = document.getElementById('ed-nugget-filter-theme');
  const filterVal = filterSel.value;
  while (filterSel.options.length > 1) filterSel.remove(1);
  themes.forEach(th => {
    const opt = document.createElement('option');
    opt.value = th;
    opt.textContent = th;
    filterSel.appendChild(opt);
  });
  filterSel.value = filterVal;
}

function editorGetAllThemes() {
  const themes = new Set();
  // From built-in questions
  if (typeof getAvailableThemes === 'function') {
    getAvailableThemes().forEach(t => themes.add(t));
  }
  // From custom nuggets
  editorLoadNuggets().forEach(q => q.theme && themes.add(q.theme));
  // From custom menus
  editorLoadMenus().forEach(m => m.theme && themes.add(m.theme));
  return [...themes].sort();
}

// ── Save a Nugget question ───────────────────────────────────
function editorSaveNugget() {
  const theme = editorGetTheme('nugget');
  const level = document.getElementById('ed-nugget-level').value;
  const fr = document.getElementById('ed-nugget-fr').value.trim();
  const en = document.getElementById('ed-nugget-en').value.trim();
  const c1fr = document.getElementById('ed-nugget-c1-fr').value.trim();
  const c2fr = document.getElementById('ed-nugget-c2-fr').value.trim();
  const c3fr = document.getElementById('ed-nugget-c3-fr').value.trim();
  const c4fr = document.getElementById('ed-nugget-c4-fr').value.trim();
  const c1en = document.getElementById('ed-nugget-c1-en').value.trim();
  const c2en = document.getElementById('ed-nugget-c2-en').value.trim();
  const c3en = document.getElementById('ed-nugget-c3-en').value.trim();
  const c4en = document.getElementById('ed-nugget-c4-en').value.trim();
  const answer = parseInt(document.getElementById('ed-nugget-answer').value);

  if (!theme) return showToast('Veuillez choisir ou créer un thème.');
  if (!fr)    return showToast('La question en français est obligatoire.');
  if (!c1fr || !c2fr || !c3fr || !c4fr) return showToast('Les 4 choix FR sont obligatoires.');

  const q = {
    fr, en: en || fr,
    choices_fr: [c1fr, c2fr, c3fr, c4fr],
    choices_en: [c1en || c1fr, c2en || c2fr, c3en || c3fr, c4en || c4fr],
    answer, theme, level,
    _custom: true, _id: Date.now()
  };

  const list = editorLoadNuggets();
  list.push(q);
  editorSaveNuggetsList(list);

  // Clear form
  ['ed-nugget-fr','ed-nugget-en','ed-nugget-c1-fr','ed-nugget-c2-fr','ed-nugget-c3-fr','ed-nugget-c4-fr','ed-nugget-c1-en','ed-nugget-c2-en','ed-nugget-c3-en','ed-nugget-c4-en'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('ed-nugget-answer').value = '0';

  editorInjectCustomQuestions();
  editorRefreshThemeDropdowns();
  editorRenderNuggetsList();
  showToast('Question Nuggets ajoutee !');
}

// ── Save a Menu ──────────────────────────────────────────────
function editorSaveMenu() {
  const theme = editorGetTheme('menu');
  const emoji = document.getElementById('ed-menu-emoji').value.trim() || '🍔';
  const name  = document.getElementById('ed-menu-name').value.trim();

  if (!theme) return showToast('Veuillez choisir ou créer un thème.');
  if (!name)  return showToast('Le nom du menu est obligatoire.');

  const questions = [];
  const qBlocks = document.querySelectorAll('#form-menu .editor-menu-q');
  for (const block of qBlocks) {
    const fr = block.querySelector('.ed-mq-fr').value.trim();
    const en = block.querySelector('.ed-mq-en').value.trim();
    const repFr = block.querySelector('.ed-mq-rep-fr').value.trim();
    const repEn = block.querySelector('.ed-mq-rep-en').value.trim();
    if (!fr) return showToast('Toutes les 5 questions FR sont obligatoires.');
    questions.push({
      fr, en: en || fr, theme,
      reponse_fr: repFr ? repFr.split(';').map(s => s.trim()).filter(Boolean) : [],
      reponse_en: repEn ? repEn.split(';').map(s => s.trim()).filter(Boolean) : []
    });
  }

  const menuKey = emoji + ' Menu ' + name;
  const menu = { key: menuKey, emoji, name, theme, questions, _custom: true, _id: Date.now() };

  const list = editorLoadMenus();
  list.push(menu);
  editorSaveMenusList(list);

  // Clear form
  document.getElementById('ed-menu-name').value = '';
  document.getElementById('ed-menu-emoji').value = '';
  qBlocks.forEach(block => {
    block.querySelector('.ed-mq-fr').value = '';
    block.querySelector('.ed-mq-en').value = '';
    block.querySelector('.ed-mq-rep-fr').value = '';
    block.querySelector('.ed-mq-rep-en').value = '';
  });

  editorInjectCustomQuestions();
  editorRefreshThemeDropdowns();
  editorRenderMenusList();
  showToast('Menu ajoute !');
}

// ── Delete helpers ───────────────────────────────────────────
function editorDeleteNugget(id) {
  const list = editorLoadNuggets().filter(q => q._id !== id);
  editorSaveNuggetsList(list);
  editorInjectCustomQuestions();
  editorRefreshThemeDropdowns();
  editorRenderNuggetsList();
  showToast('Question supprimee.');
}

function editorDeleteMenu(id) {
  const list = editorLoadMenus().filter(m => m._id !== id);
  editorSaveMenusList(list);
  editorInjectCustomQuestions();
  editorRefreshThemeDropdowns();
  editorRenderMenusList();
  showToast('Menu supprime.');
}

// ── Render lists ─────────────────────────────────────────────
function editorRenderNuggetsList() {
  const container = document.getElementById('editor-nuggets-list');
  const list = editorLoadNuggets();
  const filterTheme = document.getElementById('ed-nugget-filter-theme').value;
  const filterLevel = document.getElementById('ed-nugget-filter-level').value;

  const filtered = list.filter(q => {
    if (filterTheme && q.theme !== filterTheme) return false;
    if (filterLevel && q.level !== filterLevel) return false;
    return true;
  });

  if (!filtered.length) {
    container.innerHTML = '<p style="color:var(--color-text-dim);font-style:italic">Aucune question Nuggets custom pour le moment.</p>';
    return;
  }

  const levelLabels = { niveau_1: 'Niv.1', niveau_2: 'Niv.2', niveau_3: 'Niv.3', niveau_4: 'Niv.4' };
  container.innerHTML = filtered.map(q => {
    const choices = q.choices_fr.map((c, i) =>
      i === q.answer ? `<span class="eq-correct">${c}</span>` : c
    ).join(' · ');
    return `<div class="editor-q-card">
      <div class="eq-body">
        <span class="eq-theme">${q.theme}</span><span class="eq-level">${levelLabels[q.level] || q.level}</span>
        <div class="eq-text">${q.fr}</div>
        <div class="eq-choices">${choices}</div>
      </div>
      <button class="eq-delete" onclick="editorDeleteNugget(${q._id})">🗑️</button>
    </div>`;
  }).join('');
}

function editorRenderMenusList() {
  const container = document.getElementById('editor-menus-list');
  const list = editorLoadMenus();

  if (!list.length) {
    container.innerHTML = '<p style="color:var(--color-text-dim);font-style:italic">Aucun menu custom pour le moment.</p>';
    return;
  }

  container.innerHTML = list.map(m => {
    const qs = m.questions.map(q => `<li>${q.fr}</li>`).join('');
    return `<div class="editor-menu-card">
      <div class="em-header">
        <span class="em-title">${m.emoji} ${m.name}</span>
        <span class="em-theme">${m.theme}</span>
      </div>
      <ul class="em-questions">${qs}</ul>
      <div style="text-align:right;margin-top:10px">
        <button class="eq-delete" onclick="editorDeleteMenu(${m._id})">🗑️ Supprimer</button>
      </div>
    </div>`;
  }).join('');
}

// ── Inject custom questions into the game engine ─────────────
function editorInjectCustomQuestions() {
  // Nuggets: inject into Questions_Nuggets per level
  const customNuggets = editorLoadNuggets();
  // First, remove previously injected custom questions
  for (const lvl of ['niveau_1','niveau_2','niveau_3','niveau_4']) {
    Questions_Nuggets[lvl] = Questions_Nuggets[lvl].filter(q => !q._custom);
  }
  // Then add custom ones
  customNuggets.forEach(q => {
    const lvl = q.level || 'niveau_1';
    if (Questions_Nuggets[lvl]) {
      Questions_Nuggets[lvl].push(q);
    }
  });

  // Menus: inject into Questions_Menus
  const customMenus = editorLoadMenus();
  // Remove previously injected custom menus
  for (const key of Object.keys(Questions_Menus)) {
    if (Questions_Menus[key]._customMenu) delete Questions_Menus[key];
  }
  // Check each menu entry for _customMenu flag on questions array
  for (const key of Object.keys(Questions_Menus)) {
    if (Questions_Menus[key].length && Questions_Menus[key][0]._custom) {
      delete Questions_Menus[key];
    }
  }
  // Add custom menus
  customMenus.forEach(m => {
    const qs = m.questions.map(q => ({ ...q, _custom: true }));
    Questions_Menus[m.key] = qs;
    // Also register in MENUS_TITLES
    if (typeof MENUS_TITLES !== 'undefined') {
      MENUS_TITLES[m.key] = { fr: m.name, en: m.name };
    }
  });

  // Update QUESTIONS_DB compat layer
  if (typeof QUESTIONS_DB !== 'undefined') {
    QUESTIONS_DB.nuggets = Questions_Nuggets;
    QUESTIONS_DB.menus = Questions_Menus;
  }

  // Update THEME_LABELS with new themes
  const allThemes = editorGetAllThemes();
  allThemes.forEach(th => {
    if (typeof THEME_LABELS !== 'undefined' && !THEME_LABELS[th]) {
      THEME_LABELS[th] = { fr: th, en: th };
    }
  });
}

// ── Export / Import ──────────────────────────────────────────
function editorExportJSON() {
  const data = {
    nuggets: editorLoadNuggets(),
    menus: editorLoadMenus()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'burger_quiz_questions_' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Export termine !');
}

function editorImportJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.nuggets && Array.isArray(data.nuggets)) {
        const existing = editorLoadNuggets();
        // Re-assign IDs to avoid collisions
        data.nuggets.forEach(q => { q._id = Date.now() + Math.random() * 1000 | 0; q._custom = true; });
        editorSaveNuggetsList([...existing, ...data.nuggets]);
      }
      if (data.menus && Array.isArray(data.menus)) {
        const existing = editorLoadMenus();
        data.menus.forEach(m => { m._id = Date.now() + Math.random() * 1000 | 0; m._custom = true; });
        editorSaveMenusList([...existing, ...data.menus]);
      }
      editorInjectCustomQuestions();
      editorRefreshThemeDropdowns();
      editorRenderNuggetsList();
      editorRenderMenusList();
      showToast('Import reussi ! ' + (data.nuggets?.length || 0) + ' nuggets, ' + (data.menus?.length || 0) + ' menus.');
    } catch (err) {
      showToast('Erreur de format JSON.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function editorClearAll() {
  if (!confirm('Supprimer TOUTES les questions custom ? Cette action est irreversible.')) return;
  localStorage.removeItem(LS_CUSTOM_NUGGETS);
  localStorage.removeItem(LS_CUSTOM_MENUS);
  editorInjectCustomQuestions();
  editorRefreshThemeDropdowns();
  editorRenderNuggetsList();
  editorRenderMenusList();
  showToast('Toutes les questions custom ont ete supprimees.');
}

// ── Init on page load ────────────────────────────────────────
function editorInit() {
  editorInjectCustomQuestions();
  editorRefreshThemeDropdowns();
  editorRenderNuggetsList();
  editorRenderMenusList();
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', editorInit);
} else {
  editorInit();
}
