/* ============================================================
   BURGER QUIZ — Question Editor
   - Custom Nuggets & Menus questions (created by user)
   - Overrides for built-in questions (modifications persisted in LS)
   ============================================================ */

const LS_CUSTOM_NUGGETS   = 'burgerquiz_custom_nuggets';
const LS_CUSTOM_MENUS     = 'burgerquiz_custom_menus';
const LS_OVERRIDE_NUGGETS = 'burgerquiz_override_nuggets';
const LS_OVERRIDE_MENUS   = 'burgerquiz_override_menus';

// Snapshots of the built-in questions (captured once)
let _ORIGINAL_NUGGETS = null;
let _ORIGINAL_MENUS   = null;

// Edit state
let _editMode   = null;  // null | 'nugget' | 'menu'
let _editingId  = null;  // 'builtin:niveau_1:0' | 'custom:<_id>' (nugget)  or  'builtin:<menuKey>' | 'custom:<_id>' (menu)

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
function editorLoadOverrideNuggets() {
  try { return JSON.parse(localStorage.getItem(LS_OVERRIDE_NUGGETS)) || {}; }
  catch { return {}; }
}
function editorSaveOverrideNuggets(obj) {
  localStorage.setItem(LS_OVERRIDE_NUGGETS, JSON.stringify(obj));
}
function editorLoadOverrideMenus() {
  try { return JSON.parse(localStorage.getItem(LS_OVERRIDE_MENUS)) || {}; }
  catch { return {}; }
}
function editorSaveOverrideMenus(obj) {
  localStorage.setItem(LS_OVERRIDE_MENUS, JSON.stringify(obj));
}

function editorCaptureOriginals() {
  if (!_ORIGINAL_NUGGETS) _ORIGINAL_NUGGETS = JSON.parse(JSON.stringify(Questions_Nuggets));
  if (!_ORIGINAL_MENUS)   _ORIGINAL_MENUS   = JSON.parse(JSON.stringify(Questions_Menus));
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
    while (sel.options.length > 2) sel.remove(2);
    themes.forEach(th => {
      const opt = document.createElement('option');
      opt.value = th;
      opt.textContent = th;
      sel.appendChild(opt);
    });
    if (current && current !== '__new__') sel.value = current;
  });
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
  if (typeof getAvailableThemes === 'function') {
    getAvailableThemes().forEach(t => themes.add(t));
  }
  editorLoadNuggets().forEach(q => q.theme && themes.add(q.theme));
  editorLoadMenus().forEach(m => m.theme && themes.add(m.theme));
  return [...themes].sort();
}

// ── Form helpers ─────────────────────────────────────────────
function editorClearNuggetForm() {
  ['ed-nugget-fr','ed-nugget-en','ed-nugget-c1-fr','ed-nugget-c2-fr','ed-nugget-c3-fr','ed-nugget-c4-fr','ed-nugget-c1-en','ed-nugget-c2-en','ed-nugget-c3-en','ed-nugget-c4-en','ed-nugget-theme-new'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('ed-nugget-theme').value = '';
  document.getElementById('ed-nugget-theme-new').style.display = 'none';
  document.getElementById('ed-nugget-answer').value = '0';
  document.getElementById('ed-nugget-level').value = 'niveau_1';
}

function editorClearMenuForm() {
  document.getElementById('ed-menu-name').value = '';
  document.getElementById('ed-menu-emoji').value = '';
  document.getElementById('ed-menu-theme').value = '';
  document.getElementById('ed-menu-theme-new').value = '';
  document.getElementById('ed-menu-theme-new').style.display = 'none';
  document.querySelectorAll('#form-menu .editor-menu-q').forEach(block => {
    block.querySelector('.ed-mq-fr').value = '';
    block.querySelector('.ed-mq-en').value = '';
    block.querySelector('.ed-mq-rep-fr').value = '';
    block.querySelector('.ed-mq-rep-en').value = '';
  });
}

function editorSetThemeInDropdown(prefix, theme) {
  const sel = document.getElementById('ed-' + prefix + '-theme');
  const inp = document.getElementById('ed-' + prefix + '-theme-new');
  let found = false;
  for (const opt of sel.options) {
    if (opt.value === theme) { sel.value = theme; found = true; break; }
  }
  if (!found && theme) {
    sel.value = '__new__';
    inp.style.display = '';
    inp.value = theme;
  } else {
    inp.style.display = 'none';
    inp.value = '';
  }
}

// ── Save Nugget (create or update) ───────────────────────────
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

  const data = {
    fr, en: en || fr,
    choices_fr: [c1fr, c2fr, c3fr, c4fr],
    choices_en: [c1en || c1fr, c2en || c2fr, c3en || c3fr, c4en || c4fr],
    answer, theme, level
  };

  if (_editMode === 'nugget' && _editingId) {
    if (_editingId.startsWith('builtin:')) {
      const parts = _editingId.split(':');
      const origLvl = parts[1];
      const origIdx = parseInt(parts[2]);
      const overrides = editorLoadOverrideNuggets();
      // If level changed, we move the override key (not the original index).
      // For simplicity: keep the override mapped to the original (level,index) pair,
      // with the "level" field inside overriding the effective level.
      overrides[`${origLvl}:${origIdx}`] = data;
      editorSaveOverrideNuggets(overrides);
    } else {
      const id = parseInt(_editingId.split(':')[1]);
      const list = editorLoadNuggets();
      const entry = list.find(x => x._id === id);
      if (entry) Object.assign(entry, data);
      editorSaveNuggetsList(list);
    }
    editorCancelEdit();
    editorInjectCustomQuestions();
    editorRefreshThemeDropdowns();
    editorRenderNuggetsList();
    showToast('Question modifiée !');
    return;
  }

  // Create new custom
  const q = { ...data, _custom: true, _id: Date.now() };
  const list = editorLoadNuggets();
  list.push(q);
  editorSaveNuggetsList(list);
  editorClearNuggetForm();
  editorInjectCustomQuestions();
  editorRefreshThemeDropdowns();
  editorRenderNuggetsList();
  showToast('Question Nuggets ajoutee !');
}

// ── Save Menu (create or update) ─────────────────────────────
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

  if (_editMode === 'menu' && _editingId) {
    if (_editingId.startsWith('builtin:')) {
      // Built-in menu override: store the new 5 questions, keyed by the original menu key.
      const origKey = _editingId.slice('builtin:'.length);
      const overrides = editorLoadOverrideMenus();
      overrides[origKey] = { questions, name, emoji, theme };
      editorSaveOverrideMenus(overrides);
    } else {
      const id = parseInt(_editingId.split(':')[1]);
      const list = editorLoadMenus();
      const entry = list.find(m => m._id === id);
      if (entry) {
        entry.emoji = emoji;
        entry.name = name;
        entry.theme = theme;
        entry.questions = questions;
        entry.key = emoji + ' Menu ' + name;
      }
      editorSaveMenusList(list);
    }
    editorCancelEdit();
    editorInjectCustomQuestions();
    editorRefreshThemeDropdowns();
    editorRenderMenusList();
    showToast('Menu modifié !');
    return;
  }

  // Create new custom menu
  const menuKey = emoji + ' Menu ' + name;
  const menu = { key: menuKey, emoji, name, theme, questions, _custom: true, _id: Date.now() };
  const list = editorLoadMenus();
  list.push(menu);
  editorSaveMenusList(list);
  editorClearMenuForm();
  editorInjectCustomQuestions();
  editorRefreshThemeDropdowns();
  editorRenderMenusList();
  showToast('Menu ajoute !');
}

// ── Edit flows ───────────────────────────────────────────────
function editorStartEditNugget(identifier) {
  let q;
  if (identifier.startsWith('builtin:')) {
    const parts = identifier.split(':');
    const lvl = parts[1]; const idx = parseInt(parts[2]);
    q = (Questions_Nuggets[lvl] || [])[idx];
  } else {
    const id = parseInt(identifier.split(':')[1]);
    q = editorLoadNuggets().find(x => x._id === id);
  }
  if (!q) return;

  editorSwitchTab('nuggets');
  editorRefreshThemeDropdowns();
  editorSetThemeInDropdown('nugget', q.theme || '');
  document.getElementById('ed-nugget-level').value = q.level || 'niveau_1';
  document.getElementById('ed-nugget-fr').value = q.fr || '';
  document.getElementById('ed-nugget-en').value = q.en || '';
  document.getElementById('ed-nugget-c1-fr').value = (q.choices_fr || [])[0] || '';
  document.getElementById('ed-nugget-c2-fr').value = (q.choices_fr || [])[1] || '';
  document.getElementById('ed-nugget-c3-fr').value = (q.choices_fr || [])[2] || '';
  document.getElementById('ed-nugget-c4-fr').value = (q.choices_fr || [])[3] || '';
  document.getElementById('ed-nugget-c1-en').value = (q.choices_en || [])[0] || '';
  document.getElementById('ed-nugget-c2-en').value = (q.choices_en || [])[1] || '';
  document.getElementById('ed-nugget-c3-en').value = (q.choices_en || [])[2] || '';
  document.getElementById('ed-nugget-c4-en').value = (q.choices_en || [])[3] || '';
  document.getElementById('ed-nugget-answer').value = q.answer != null ? q.answer : 0;

  _editMode = 'nugget';
  _editingId = identifier;
  editorUpdateFormMode('nugget');
  document.getElementById('form-nugget').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function editorStartEditMenu(identifier) {
  let name, emoji, theme, questions;
  if (identifier.startsWith('builtin:')) {
    const origKey = identifier.slice('builtin:'.length);
    const qs = Questions_Menus[origKey] || [];
    questions = qs;
    // Parse emoji + name from the key "🍔 Menu xyz"
    const m = origKey.match(/^(\S+)\s+Menu\s+(.+)$/);
    emoji = m ? m[1] : '🍔';
    name = m ? m[2] : origKey;
    theme = qs[0]?.theme || '';
  } else {
    const id = parseInt(identifier.split(':')[1]);
    const entry = editorLoadMenus().find(m => m._id === id);
    if (!entry) return;
    name = entry.name;
    emoji = entry.emoji;
    theme = entry.theme;
    questions = entry.questions;
  }

  editorSwitchTab('menus');
  editorRefreshThemeDropdowns();
  editorSetThemeInDropdown('menu', theme);
  document.getElementById('ed-menu-emoji').value = emoji;
  document.getElementById('ed-menu-name').value = name;
  const blocks = document.querySelectorAll('#form-menu .editor-menu-q');
  blocks.forEach((block, i) => {
    const q = questions[i] || { fr: '', en: '', reponse_fr: [], reponse_en: [] };
    block.querySelector('.ed-mq-fr').value = q.fr || '';
    block.querySelector('.ed-mq-en').value = q.en || '';
    block.querySelector('.ed-mq-rep-fr').value = (q.reponse_fr || []).join('; ');
    block.querySelector('.ed-mq-rep-en').value = (q.reponse_en || []).join('; ');
  });

  _editMode = 'menu';
  _editingId = identifier;
  editorUpdateFormMode('menu');
  document.getElementById('form-menu').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function editorUpdateFormMode(type) {
  const formId = type === 'nugget' ? 'form-nugget' : 'form-menu';
  const saveBtn = document.querySelector('#' + formId + ' .editor-actions .btn-accent');
  if (!saveBtn) return;
  if (_editMode) {
    saveBtn.textContent = '💾 Enregistrer les modifications';
    saveBtn.classList.add('btn-editing');
    // Add cancel button if missing
    let cancelBtn = saveBtn.parentNode.querySelector('.btn-cancel-edit');
    if (!cancelBtn) {
      cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn btn-secondary btn-cancel-edit';
      cancelBtn.textContent = '❌ Annuler';
      cancelBtn.onclick = editorCancelEdit;
      saveBtn.parentNode.appendChild(cancelBtn);
    }
    // Add banner
    let banner = document.querySelector('#' + formId + ' .editor-edit-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'editor-edit-banner';
      banner.textContent = type === 'nugget'
        ? '✏️ Mode édition — vous modifiez une question existante'
        : '✏️ Mode édition — vous modifiez un menu existant';
      document.getElementById(formId).insertBefore(banner, document.getElementById(formId).firstChild);
    }
  } else {
    saveBtn.textContent = type === 'nugget' ? '💾 Ajouter la question' : '💾 Ajouter le menu';
    saveBtn.classList.remove('btn-editing');
    const cancelBtn = document.querySelector('#' + formId + ' .btn-cancel-edit');
    if (cancelBtn) cancelBtn.remove();
    const banner = document.querySelector('#' + formId + ' .editor-edit-banner');
    if (banner) banner.remove();
  }
}

function editorCancelEdit() {
  const wasMode = _editMode;
  _editMode = null;
  _editingId = null;
  if (wasMode === 'nugget') { editorUpdateFormMode('nugget'); editorClearNuggetForm(); }
  if (wasMode === 'menu')   { editorUpdateFormMode('menu');   editorClearMenuForm(); }
}

// ── Reset one built-in override ──────────────────────────────
function editorResetNuggetOverride(origKey) {
  const overrides = editorLoadOverrideNuggets();
  delete overrides[origKey];
  editorSaveOverrideNuggets(overrides);
  editorInjectCustomQuestions();
  editorRenderNuggetsList();
  showToast('Modification annulée — question restaurée.');
}
function editorResetMenuOverride(origKey) {
  const overrides = editorLoadOverrideMenus();
  delete overrides[origKey];
  editorSaveOverrideMenus(overrides);
  editorInjectCustomQuestions();
  editorRenderMenusList();
  showToast('Modification annulée — menu restauré.');
}

// ── Delete custom ────────────────────────────────────────────
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
  const customList = editorLoadNuggets();
  const overrides = editorLoadOverrideNuggets();
  const filterTheme = document.getElementById('ed-nugget-filter-theme').value;
  const filterLevel = document.getElementById('ed-nugget-filter-level').value;
  const levelLabels = { niveau_1: 'Niv.1', niveau_2: 'Niv.2', niveau_3: 'Niv.3', niveau_4: 'Niv.4' };

  const rows = [];
  // Built-in questions (with overrides applied)
  for (const lvl of ['niveau_1','niveau_2','niveau_3','niveau_4']) {
    const origArr = (_ORIGINAL_NUGGETS && _ORIGINAL_NUGGETS[lvl]) || [];
    origArr.forEach((orig, idx) => {
      const key = `${lvl}:${idx}`;
      const ov  = overrides[key];
      const q   = ov ? { ...orig, ...ov } : orig;
      rows.push({ q, identifier: `builtin:${lvl}:${idx}`, type: 'builtin', level: q.level || lvl, hasOverride: !!ov, origKey: key });
    });
  }
  // Custom questions
  customList.forEach(q => {
    rows.push({ q, identifier: `custom:${q._id}`, type: 'custom', level: q.level, _id: q._id });
  });

  const filtered = rows.filter(r => {
    if (filterTheme && r.q.theme !== filterTheme) return false;
    if (filterLevel && r.level !== filterLevel) return false;
    return true;
  });

  if (!filtered.length) {
    container.innerHTML = '<p style="color:var(--color-text-dim);font-style:italic">Aucune question correspondante.</p>';
    return;
  }

  container.innerHTML = filtered.map(r => {
    const q = r.q;
    const choices = (q.choices_fr || []).map((c, i) =>
      i === q.answer ? `<span class="eq-correct">${c}</span>` : c
    ).join(' · ');
    let badge = '';
    if (r.type === 'custom') badge = '<span class="eq-badge-custom">custom</span>';
    else if (r.hasOverride) badge = '<span class="eq-badge-edited">modifiée</span>';
    const editBtn   = `<button class="btn btn-primary eq-edit" onclick="editorStartEditNugget('${r.identifier}')">✏️</button>`;
    let extraBtn = '';
    if (r.type === 'custom') {
      extraBtn = `<button class="eq-delete" onclick="editorDeleteNugget(${r._id})">🗑️</button>`;
    } else if (r.hasOverride) {
      extraBtn = `<button class="eq-delete" title="Restaurer l'original" onclick="editorResetNuggetOverride('${r.origKey}')">↺</button>`;
    }
    return `<div class="editor-q-card">
      <div class="eq-body">
        <span class="eq-theme">${q.theme || ''}</span><span class="eq-level">${levelLabels[r.level] || r.level}</span>${badge}
        <div class="eq-text">${q.fr || ''}</div>
        <div class="eq-choices">${choices}</div>
      </div>
      <div class="eq-actions">
        ${editBtn}
        ${extraBtn}
      </div>
    </div>`;
  }).join('');
}

function editorRenderMenusList() {
  const container = document.getElementById('editor-menus-list');
  const customList = editorLoadMenus();
  const overrides = editorLoadOverrideMenus();

  let html = '';

  // Built-in menus
  const builtinKeys = _ORIGINAL_MENUS ? Object.keys(_ORIGINAL_MENUS) : [];
  if (builtinKeys.length) {
    html += '<h4 class="editor-list-subtitle">Menus intégrés</h4>';
    html += builtinKeys.map(key => {
      const liveQs = Questions_Menus[key] || [];
      const theme = liveQs[0]?.theme || '-';
      const ov = overrides[key];
      const title = ov && ov.name ? `${ov.emoji || ''} Menu ${ov.name}` : key;
      const qs = liveQs.map(q => `<li>${q.fr}</li>`).join('');
      const badge = ov ? '<span class="eq-badge-edited">modifié</span>' : '';
      const resetBtn = ov ? `<button class="eq-delete" title="Restaurer l'original" onclick="editorResetMenuOverride('${key.replace(/'/g, "\\'")}')">↺ Restaurer</button>` : '';
      return `<div class="editor-menu-card">
        <div class="em-header">
          <span class="em-title">${title} ${badge}</span>
          <span class="em-theme">${theme}</span>
        </div>
        <ul class="em-questions">${qs}</ul>
        <div class="em-actions">
          <button class="btn btn-primary" onclick="editorStartEditMenu('builtin:${key.replace(/'/g, "\\'")}')">✏️ Modifier</button>
          ${resetBtn}
        </div>
      </div>`;
    }).join('');
  }

  // Custom menus
  if (customList.length) {
    html += '<h4 class="editor-list-subtitle" style="margin-top:20px">Menus personnalisés</h4>';
    html += customList.map(m => {
      const qs = m.questions.map(q => `<li>${q.fr}</li>`).join('');
      return `<div class="editor-menu-card">
        <div class="em-header">
          <span class="em-title">${m.emoji} ${m.name} <span class="eq-badge-custom">custom</span></span>
          <span class="em-theme">${m.theme}</span>
        </div>
        <ul class="em-questions">${qs}</ul>
        <div class="em-actions">
          <button class="btn btn-primary" onclick="editorStartEditMenu('custom:${m._id}')">✏️ Modifier</button>
          <button class="eq-delete" onclick="editorDeleteMenu(${m._id})">🗑️ Supprimer</button>
        </div>
      </div>`;
    }).join('');
  }

  if (!html) html = '<p style="color:var(--color-text-dim);font-style:italic">Aucun menu disponible.</p>';
  container.innerHTML = html;
}

// ── Inject (apply overrides + custom) into game engine ───────
function editorInjectCustomQuestions() {
  editorCaptureOriginals();

  // ── Nuggets ──
  const overrideN = editorLoadOverrideNuggets();
  const rebuilt = { niveau_1: [], niveau_2: [], niveau_3: [], niveau_4: [] };
  for (const lvl of ['niveau_1','niveau_2','niveau_3','niveau_4']) {
    const origArr = _ORIGINAL_NUGGETS[lvl] || [];
    origArr.forEach((orig, idx) => {
      const ov = overrideN[`${lvl}:${idx}`];
      const effective = ov ? { ...orig, ...ov } : { ...orig };
      const targetLvl = (ov && ov.level) ? ov.level : lvl;
      if (rebuilt[targetLvl]) rebuilt[targetLvl].push(effective);
    });
  }
  // Append custom
  editorLoadNuggets().forEach(q => {
    const lvl = q.level || 'niveau_1';
    if (rebuilt[lvl]) rebuilt[lvl].push({ ...q, _custom: true });
  });
  // Replace Questions_Nuggets arrays in-place
  for (const lvl of ['niveau_1','niveau_2','niveau_3','niveau_4']) {
    Questions_Nuggets[lvl] = rebuilt[lvl];
  }

  // ── Menus ──
  const overrideM = editorLoadOverrideMenus();
  // Remove current keys
  for (const k of Object.keys(Questions_Menus)) delete Questions_Menus[k];
  // Re-insert originals with overrides applied
  for (const origKey of Object.keys(_ORIGINAL_MENUS)) {
    const origQs = _ORIGINAL_MENUS[origKey];
    const ov = overrideM[origKey];
    if (ov && Array.isArray(ov.questions)) {
      Questions_Menus[origKey] = ov.questions.map(q => ({ ...q }));
    } else {
      Questions_Menus[origKey] = origQs.map(q => ({ ...q }));
    }
  }
  // Append custom menus
  editorLoadMenus().forEach(m => {
    const qs = m.questions.map(q => ({ ...q, _custom: true }));
    Questions_Menus[m.key] = qs;
    if (typeof MENUS_TITLES !== 'undefined') {
      MENUS_TITLES[m.key] = { fr: m.name, en: m.name };
    }
  });

  if (typeof QUESTIONS_DB !== 'undefined') {
    QUESTIONS_DB.nuggets = Questions_Nuggets;
    QUESTIONS_DB.menus   = Questions_Menus;
  }

  // New themes
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
    menus: editorLoadMenus(),
    overrides_nuggets: editorLoadOverrideNuggets(),
    overrides_menus: editorLoadOverrideMenus()
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
        data.nuggets.forEach(q => { q._id = Date.now() + Math.random() * 1000 | 0; q._custom = true; });
        editorSaveNuggetsList([...existing, ...data.nuggets]);
      }
      if (data.menus && Array.isArray(data.menus)) {
        const existing = editorLoadMenus();
        data.menus.forEach(m => { m._id = Date.now() + Math.random() * 1000 | 0; m._custom = true; });
        editorSaveMenusList([...existing, ...data.menus]);
      }
      if (data.overrides_nuggets && typeof data.overrides_nuggets === 'object') {
        const cur = editorLoadOverrideNuggets();
        editorSaveOverrideNuggets({ ...cur, ...data.overrides_nuggets });
      }
      if (data.overrides_menus && typeof data.overrides_menus === 'object') {
        const cur = editorLoadOverrideMenus();
        editorSaveOverrideMenus({ ...cur, ...data.overrides_menus });
      }
      editorInjectCustomQuestions();
      editorRefreshThemeDropdowns();
      editorRenderNuggetsList();
      editorRenderMenusList();
      showToast('Import reussi !');
    } catch (err) {
      showToast('Erreur de format JSON.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function editorClearAll() {
  if (!confirm('Supprimer TOUTES les modifications (custom + éditions de natives) ? Action irréversible.')) return;
  localStorage.removeItem(LS_CUSTOM_NUGGETS);
  localStorage.removeItem(LS_CUSTOM_MENUS);
  localStorage.removeItem(LS_OVERRIDE_NUGGETS);
  localStorage.removeItem(LS_OVERRIDE_MENUS);
  editorInjectCustomQuestions();
  editorRefreshThemeDropdowns();
  editorRenderNuggetsList();
  editorRenderMenusList();
  showToast('Tout a été restauré.');
}

// ── Init on page load ────────────────────────────────────────
function editorInit() {
  editorCaptureOriginals();
  editorInjectCustomQuestions();
  editorRefreshThemeDropdowns();
  editorRenderNuggetsList();
  editorRenderMenusList();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', editorInit);
} else {
  editorInit();
}
