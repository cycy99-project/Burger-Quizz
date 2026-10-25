/* ============================================================
   BURGER QUIZ — Éditeur des banques "L'Addition" et "Burger de la Mort"
   - Questions natives : js/addition_bank.js / js/bdm_bank.js (lecture seule ici)
   - Questions ajoutées dans l'éditeur : localStorage
   - Thème unique : Culture générale ; non utilisées en mode jeu
   ============================================================ */

const BANK_THEME = 'Culture générale';
const BANKS = {
  add: { ls: 'burgerquiz_custom_addition', label: 'Addition', timer: false,
         native: () => (typeof ADDITION_BANK !== 'undefined' ? ADDITION_BANK : []) },
  bdm: { ls: 'burgerquiz_custom_bdm', label: 'Burger de la Mort', timer: true,
         native: () => (typeof BDM_BANK !== 'undefined' ? BDM_BANK : []) }
};
const _bankEditing = {};

function bankLoad(k) {
  try { return JSON.parse(localStorage.getItem(BANKS[k].ls)) || []; } catch { return []; }
}
function bankSaveList(k, list) { localStorage.setItem(BANKS[k].ls, JSON.stringify(list)); }
function bankEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
const bankEl = (k, s) => document.getElementById(`ed-${k}-${s}`);

function bankClearForm(k) {
  ['fr', 'en', 'ans-fr', 'ans-en'].forEach(s => { bankEl(k, s).value = ''; });
  if (BANKS[k].timer) bankEl(k, 'timer').value = 30;
  _bankEditing[k] = null;
  bankEl(k, 'save').textContent = '💾 Ajouter la question';
  bankEl(k, 'cancel').style.display = 'none';
}

function bankSave(k) {
  const fr = bankEl(k, 'fr').value.trim();
  const ansFr = bankEl(k, 'ans-fr').value.trim();
  if (!fr) return showToast('La question en français est obligatoire.');
  if (!ansFr) return showToast('La réponse en français est obligatoire.');
  const data = {
    fr, en: bankEl(k, 'en').value.trim() || fr,
    answer_fr: ansFr, answer_en: bankEl(k, 'ans-en').value.trim() || ansFr,
    theme: BANK_THEME
  };
  if (BANKS[k].timer) data.timer = parseInt(bankEl(k, 'timer').value) || 30;
  const list = bankLoad(k);
  if (_bankEditing[k]) {
    const entry = list.find(x => x._id === _bankEditing[k]);
    if (entry) Object.assign(entry, data);
    showToast('Question modifiée !');
  } else {
    list.push({ ...data, _custom: true, _id: Date.now() });
    showToast('Question ajoutée !');
  }
  bankSaveList(k, list);
  bankClearForm(k);
  bankRenderList(k);
}

function bankStartEdit(k, id) {
  const q = bankLoad(k).find(x => x._id === id);
  if (!q) return;
  _bankEditing[k] = id;
  bankEl(k, 'fr').value = q.fr;
  bankEl(k, 'en').value = q.en;
  bankEl(k, 'ans-fr').value = q.answer_fr;
  bankEl(k, 'ans-en').value = q.answer_en;
  if (BANKS[k].timer) bankEl(k, 'timer').value = q.timer || 30;
  bankEl(k, 'save').textContent = '💾 Enregistrer les modifications';
  bankEl(k, 'cancel').style.display = '';
  document.getElementById('form-' + k).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function bankDelete(k, id) {
  bankSaveList(k, bankLoad(k).filter(q => q._id !== id));
  if (_bankEditing[k] === id) bankClearForm(k);
  bankRenderList(k);
  showToast('Question supprimée.');
}

function bankRenderList(k) {
  const cfg = BANKS[k];
  const search = bankEl(k, 'search').value.trim().toLowerCase();
  const rows = [...cfg.native().map(q => ({ q, builtin: true })), ...bankLoad(k).map(q => ({ q, builtin: false }))]
    .filter(r => !search || (r.q.fr + ' ' + r.q.answer_fr).toLowerCase().includes(search));
  bankEl(k, 'count').textContent = `${rows.length} question(s)`;
  const box = document.getElementById(`editor-${k}-list`);
  if (!rows.length) {
    box.innerHTML = '<p style="color:var(--color-text-dim);font-style:italic">Aucune question.</p>';
    return;
  }
  box.innerHTML = rows.map(r => {
    const q = r.q;
    const badge = r.builtin ? '<span class="eq-badge-edited">fichier</span>' : '<span class="eq-badge-custom">custom</span>';
    const timer = cfg.timer ? `<span class="eq-level">⏱ ${q.timer || 30}s</span>` : '';
    const actions = r.builtin ? '' :
      `<button class="btn btn-primary eq-edit" onclick="bankStartEdit('${k}', ${q._id})">✏️</button>
       <button class="eq-delete" onclick="bankDelete('${k}', ${q._id})">🗑️</button>`;
    return `<div class="editor-q-card"><div class="eq-body">
      <span class="eq-theme">${bankEsc(q.theme || BANK_THEME)}</span>${badge}${timer}
      <div class="eq-text">${bankEsc(q.fr)}</div>
      <div class="eq-choices"><span class="eq-correct">✅ ${bankEsc(q.answer_fr)}</span></div>
    </div><div class="eq-actions">${actions}</div></div>`;
  }).join('');
}

function bankInit() { Object.keys(BANKS).forEach(bankRenderList); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bankInit);
else bankInit();
