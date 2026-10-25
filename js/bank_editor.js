/* ============================================================
   BURGER QUIZ — Éditeur des banques "L'Addition" et "Burger de la Mort"
   - Questions natives : js/addition_bank.js / js/bdm_bank.js (lecture seule ici)
   - Questions ajoutées dans l'éditeur : localStorage
   - Thème unique : Culture générale ; non utilisées en mode jeu
   - Affichage groupé : par série (Addition) ou par burger (Burger de la Mort)
   ============================================================ */

const BANK_THEME = 'Culture générale';
const BANKS = {
  add: { ls: 'burgerquiz_custom_addition', timer: false, group: 'serie_fr', groupEn: 'serie_en', icon: '🧾',
         native: () => (typeof ADDITION_BANK !== 'undefined' ? ADDITION_BANK : []) },
  bdm: { ls: 'burgerquiz_custom_bdm', timer: true, group: 'burger', icon: '🍔',
         native: () => (typeof BDM_BANK !== 'undefined' ? BDM_BANK : []) }
};
const _bankEditing = {};
const _bankOpen = { add: new Set(), bdm: new Set() };

function bankToggle(k, name, open) {
  if (open) _bankOpen[k].add(name); else _bankOpen[k].delete(name);
}

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
  bankEl(k, 'group').value = '';
  if (bankEl(k, 'group-en')) bankEl(k, 'group-en').value = '';
  _bankEditing[k] = null;
  bankEl(k, 'save').textContent = '💾 Ajouter la question';
  bankEl(k, 'cancel').style.display = 'none';
}

function bankSave(k) {
  const cfg = BANKS[k];
  const fr = bankEl(k, 'fr').value.trim();
  const ansFr = bankEl(k, 'ans-fr').value.trim();
  const group = bankEl(k, 'group').value.trim();
  if (!group) return showToast(cfg.timer ? 'Le nom du burger est obligatoire.' : 'Le titre de la série est obligatoire.');
  if (!fr) return showToast('La question en français est obligatoire.');
  if (!ansFr) return showToast('La réponse en français est obligatoire.');
  const data = {
    fr, en: bankEl(k, 'en').value.trim() || fr,
    answer_fr: ansFr, answer_en: bankEl(k, 'ans-en').value.trim() || ansFr,
    theme: BANK_THEME
  };
  data[cfg.group] = group;
  if (cfg.groupEn) data[cfg.groupEn] = bankEl(k, 'group-en').value.trim() || group;
  if (cfg.timer) data.timer = parseInt(bankEl(k, 'timer').value) || 30;
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
  const cfg = BANKS[k];
  const q = bankLoad(k).find(x => x._id === id);
  if (!q) return;
  _bankEditing[k] = id;
  bankEl(k, 'fr').value = q.fr;
  bankEl(k, 'en').value = q.en;
  bankEl(k, 'ans-fr').value = q.answer_fr;
  bankEl(k, 'ans-en').value = q.answer_en;
  bankEl(k, 'group').value = q[cfg.group] || '';
  if (cfg.groupEn) bankEl(k, 'group-en').value = q[cfg.groupEn] || '';
  if (cfg.timer) bankEl(k, 'timer').value = q.timer || 30;
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
  const all = [...cfg.native().map(q => ({ q, builtin: true })), ...bankLoad(k).map(q => ({ q, builtin: false }))];
  const groupOf = q => q[cfg.group] || 'Sans groupe';
  const names = [...new Set(all.map(r => groupOf(r.q)))];

  const sel = bankEl(k, 'filter-group');
  const prev = sel.value;
  sel.innerHTML = '<option value="">Tous</option>' + names.map(n => `<option value="${bankEsc(n)}">${bankEsc(n)}</option>`).join('');
  sel.value = names.includes(prev) ? prev : '';
  bankEl(k, 'group-list').innerHTML = names.map(n => `<option value="${bankEsc(n)}">`).join('');

  const rows = all
    .filter(r => !sel.value || groupOf(r.q) === sel.value)
    .filter(r => !search || (r.q.fr + ' ' + r.q.answer_fr + ' ' + groupOf(r.q)).toLowerCase().includes(search));
  bankEl(k, 'count').textContent = `${rows.length} question(s) · ${new Set(rows.map(r => groupOf(r.q))).size} ${cfg.timer ? 'burger(s)' : 'série(s)'}`;

  const box = document.getElementById(`editor-${k}-list`);
  if (!rows.length) {
    box.innerHTML = '<p style="color:var(--color-text-dim);font-style:italic">Aucune question.</p>';
    return;
  }
  const groups = new Map();
  rows.forEach(r => { const g = groupOf(r.q); if (!groups.has(g)) groups.set(g, []); groups.get(g).push(r); });
  box.innerHTML = [...groups].map(([name, items]) => {
    const lis = items.map(({ q, builtin }, i) => {
      const badge = builtin ? '' : '<span class="eq-badge-custom">custom</span>';
      const timer = cfg.timer ? `<span class="eq-level">⏱ ${q.timer || 30}s</span>` : '';
      const actions = builtin ? '' :
        ` <button class="btn btn-primary eq-edit" onclick="bankStartEdit('${k}', ${q._id})">✏️</button>
          <button class="eq-delete" onclick="bankDelete('${k}', ${q._id})">🗑️</button>`;
      return `<li>${i + 1}. ${bankEsc(q.fr)} ${badge}${timer}
        <div class="em-answers">✅ ${bankEsc(q.answer_fr)}</div>${actions}</li>`;
    }).join('');
    const open = search || _bankOpen[k].has(name) ? ' open' : '';
    return `<details class="editor-menu-card"${open} ontoggle="bankToggle('${k}', this.dataset.name, this.open)" data-name="${bankEsc(name)}">
      <summary class="em-header"><span class="em-title">${cfg.icon} ${bankEsc(name)}</span>
        <span class="em-theme">${items.length} question(s) · ${BANK_THEME}</span></summary>
      <ul class="em-questions">${lis}</ul>
    </details>`;
  }).join('');
}

function bankInit() { Object.keys(BANKS).forEach(bankRenderList); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bankInit);
else bankInit();
