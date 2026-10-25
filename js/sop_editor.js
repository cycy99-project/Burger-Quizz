/* ============================================================
   BURGER QUIZ — Éditeur "Sel ou Poivre" (banque par thème)
   - Questions natives : js/sop_bank.js (SOP_BANK, lecture seule ici)
   - Questions ajoutées dans l'éditeur : localStorage
   - Non utilisées en mode jeu
   ============================================================ */

const LS_CUSTOM_SOP = 'burgerquiz_custom_sop';
let _sopEditingId = null;

function editorLoadSop() {
  try { return JSON.parse(localStorage.getItem(LS_CUSTOM_SOP)) || []; }
  catch { return []; }
}
function editorSaveSopList(list) {
  localStorage.setItem(LS_CUSTOM_SOP, JSON.stringify(list));
}

function sopAllThemes() {
  const themes = new Set(typeof editorGetAllThemes === 'function' ? editorGetAllThemes() : []);
  (typeof SOP_BANK !== 'undefined' ? SOP_BANK : []).forEach(q => q.theme && themes.add(q.theme));
  editorLoadSop().forEach(q => q.theme && themes.add(q.theme));
  return [...themes].sort();
}

function sopRefreshThemeDropdowns() {
  const themes = sopAllThemes();
  const fill = (sel, keep) => {
    const cur = sel.value;
    while (sel.options.length > keep) sel.remove(keep);
    themes.forEach(th => {
      const o = document.createElement('option');
      o.value = th; o.textContent = th;
      sel.appendChild(o);
    });
    if (cur) sel.value = cur;
  };
  fill(document.getElementById('ed-sop-theme'), 2);
  fill(document.getElementById('ed-sop-filter-theme'), 1);
}

function sopEscape(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function editorClearSopForm() {
  ['ed-sop-fr', 'ed-sop-en', 'ed-sop-expl-fr', 'ed-sop-expl-en', 'ed-sop-theme-new'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('ed-sop-theme').value = '';
  document.getElementById('ed-sop-theme-new').style.display = 'none';
  document.getElementById('ed-sop-answer').value = 'sel';
  _sopEditingId = null;
  document.getElementById('ed-sop-save').textContent = '💾 Ajouter la question';
  document.getElementById('ed-sop-cancel').style.display = 'none';
}

function editorSaveSop() {
  const theme = editorGetTheme('sop');
  const fr = document.getElementById('ed-sop-fr').value.trim();
  const en = document.getElementById('ed-sop-en').value.trim();
  if (!theme) return showToast('Veuillez choisir ou créer un thème.');
  if (!fr)    return showToast('L\'affirmation en français est obligatoire.');
  const data = {
    fr, en: en || fr,
    answer: document.getElementById('ed-sop-answer').value,
    explication_fr: document.getElementById('ed-sop-expl-fr').value.trim(),
    explication_en: document.getElementById('ed-sop-expl-en').value.trim(),
    theme
  };
  const list = editorLoadSop();
  if (_sopEditingId) {
    const entry = list.find(x => x._id === _sopEditingId);
    if (entry) Object.assign(entry, data);
    showToast('Question modifiée !');
  } else {
    list.push({ ...data, _custom: true, _id: Date.now() });
    showToast('Question Sel ou Poivre ajoutée !');
  }
  editorSaveSopList(list);
  editorClearSopForm();
  sopRefreshThemeDropdowns();
  editorRenderSopList();
}

function editorStartEditSop(id) {
  const q = editorLoadSop().find(x => x._id === id);
  if (!q) return;
  _sopEditingId = id;
  sopRefreshThemeDropdowns();
  document.getElementById('ed-sop-theme').value = q.theme;
  document.getElementById('ed-sop-theme-new').style.display = 'none';
  document.getElementById('ed-sop-fr').value = q.fr;
  document.getElementById('ed-sop-en').value = q.en;
  document.getElementById('ed-sop-answer').value = q.answer;
  document.getElementById('ed-sop-expl-fr').value = q.explication_fr || '';
  document.getElementById('ed-sop-expl-en').value = q.explication_en || '';
  document.getElementById('ed-sop-save').textContent = '💾 Enregistrer les modifications';
  document.getElementById('ed-sop-cancel').style.display = '';
  document.getElementById('form-sop').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function editorDeleteSop(id) {
  editorSaveSopList(editorLoadSop().filter(q => q._id !== id));
  if (_sopEditingId === id) editorClearSopForm();
  sopRefreshThemeDropdowns();
  editorRenderSopList();
  showToast('Question supprimée.');
}

function editorRenderSopList() {
  const container = document.getElementById('editor-sop-list');
  const filterTheme  = document.getElementById('ed-sop-filter-theme').value;
  const filterAnswer = document.getElementById('ed-sop-filter-answer').value;
  const rows = [];
  (typeof SOP_BANK !== 'undefined' ? SOP_BANK : []).forEach(q => rows.push({ q, builtin: true }));
  editorLoadSop().forEach(q => rows.push({ q, builtin: false }));
  const filtered = rows.filter(r =>
    (!filterTheme || r.q.theme === filterTheme) && (!filterAnswer || r.q.answer === filterAnswer));

  document.getElementById('ed-sop-count').textContent = `${filtered.length} question(s)`;
  if (!filtered.length) {
    container.innerHTML = '<p style="color:var(--color-text-dim);font-style:italic">Aucune question correspondante.</p>';
    return;
  }
  container.innerHTML = filtered.map(r => {
    const q = r.q;
    if (q.type === 'classement') return sopRenderClassement(q);
    const ans = q.answer === 'sel' ? '🧂 SEL (Vrai)' : '🌶️ POIVRE (Faux)';
    const badge = r.builtin ? '<span class="eq-badge-edited">fichier</span>' : '<span class="eq-badge-custom">custom</span>';
    const actions = r.builtin ? '' :
      `<button class="btn btn-primary eq-edit" onclick="editorStartEditSop(${q._id})">✏️</button>
       <button class="eq-delete" onclick="editorDeleteSop(${q._id})">🗑️</button>`;
    return `<div class="editor-q-card">
      <div class="eq-body">
        <span class="eq-theme">${sopEscape(q.theme)}</span>${badge}
        <div class="eq-text">${sopEscape(q.fr)}</div>
        <div class="eq-choices"><span class="eq-correct">${ans}</span>${q.explication_fr ? ' · ' + sopEscape(q.explication_fr) : ''}</div>
      </div>
      <div class="eq-actions">${actions}</div>
    </div>`;
  }).join('');
}

// Question de type "classement" : un titre, des options, et une liste d'éléments à classer
function sopRenderClassement(q) {
  const label = k => { const o = q.options.find(x => x.key === k); return o ? o.fr : k; };
  const opts = q.options.map(o => sopEscape(o.fr)).join(' / ');
  const items = q.items.map(i =>
    `<li>${sopEscape(i.fr)} → <span class="eq-correct">${sopEscape(label(i.answer))}</span>${i.note_fr ? ' <em>(' + sopEscape(i.note_fr) + ')</em>' : ''}</li>`).join('');
  return `<div class="editor-q-card">
    <div class="eq-body">
      <span class="eq-theme">${sopEscape(q.theme)}</span><span class="eq-badge-edited">fichier</span><span class="eq-level">classement · ${q.items.length} éléments</span>
      <div class="eq-text">${sopEscape(q.fr)}</div>
      <div class="eq-choices">Options : ${opts}</div>
      <details><summary>Voir les éléments et réponses</summary><ul>${items}</ul></details>
    </div>
    <div class="eq-actions"></div>
  </div>`;
}

function sopInit() {
  sopRefreshThemeDropdowns();
  editorRenderSopList();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', sopInit);
} else {
  sopInit();
}
