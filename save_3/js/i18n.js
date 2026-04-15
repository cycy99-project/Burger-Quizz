/* ============================================================
   BURGER QUIZ - Internationalization (i18n)
   v2.1 — FR / EN
   ============================================================ */

const LS_LANG = 'burgerquiz_lang';

const I18N = {
  // ======== WELCOME SCREEN ========
  welcome_subtitle_both:    { fr: 'Les Animateurs : {0} & {1}', en: 'Presenters: {0} & {1}' },
  welcome_subtitle_one:     { fr: 'Animateur : {0}', en: 'Presenter: {0}' },
  welcome_subtitle_default: { fr: 'Les Animateurs', en: 'The Presenters' },
  btn_settings:             { fr: '⚙️ Paramètres', en: '⚙️ Settings' },
  btn_continue:             { fr: '▶️ Continuer la partie', en: '▶️ Continue Game' },
  btn_start:                { fr: '🎬 LANCER LA PARTIE !', en: '🎬 START GAME!' },

  // ======== CONFIRM MODAL ========
  modal_confirm_title:      { fr: '⚠️ Partie en cours', en: '⚠️ Game in progress' },
  modal_confirm_text:       { fr: 'Une partie est déjà en cours.<br>Voulez-vous vraiment tout recommencer à zéro ?', en: 'A game is already in progress.<br>Do you really want to start over?' },
  modal_confirm_no:         { fr: 'Non, annuler', en: 'No, cancel' },
  modal_confirm_yes:        { fr: 'Oui, nouvelle partie !', en: 'Yes, new game!' },

  // ======== SETTINGS ========
  settings_title:           { fr: '⚙️ Paramètres du Jeu', en: '⚙️ Game Settings' },
  settings_nuggets_title:   { fr: '🟡 Épreuve 1 : Nuggets', en: '🟡 Round 1: Nuggets' },
  settings_nuggets_desc:    { fr: 'QCM à 4 choix, 4 niveaux de difficulté croissante. 1 question par équipe par niveau. Tirage au sort animé + suspense avant la réponse.', en: '4-choice MCQ, 4 increasing difficulty levels. 1 question per team per level. Animated draw + suspense before the answer.' },
  settings_pts_lvl1:        { fr: 'Points niveau 1 (très facile)', en: 'Points level 1 (very easy)' },
  settings_pts_lvl2:        { fr: 'Points niveau 2', en: 'Points level 2' },
  settings_pts_lvl3:        { fr: 'Points niveau 3', en: 'Points level 3' },
  settings_pts_lvl4:        { fr: 'Points niveau 4 (le plus dur)', en: 'Points level 4 (hardest)' },
  settings_timer:           { fr: 'Timer par question (sec, 0 = sans)', en: 'Timer per question (sec, 0 = off)' },
  settings_sop_title:       { fr: '🧂 Épreuve 2 : Sel ou Poivre', en: '🧂 Round 2: Salt or Pepper' },
  settings_sop_desc:        { fr: "Questions de rapidité ! L'animateur lit les questions en salle. Toutes les équipes jouent ensemble. Bonne réponse = +X, Mauvaise = −X. L'animateur clique +/− par équipe.", en: "Speed questions! The presenter reads questions live. All teams play together. Right answer = +X, Wrong = −X. Presenter clicks +/− per team." },
  settings_sop_pts:         { fr: 'Points (+X / −X)', en: 'Points (+X / −X)' },
  settings_menus_title:     { fr: '📋 Épreuve 3 : Les Menus', en: '📋 Round 3: The Menus' },
  settings_menus_desc:      { fr: "5 menus de 5 questions ouvertes. L'équipe 1ère au classement choisit son menu en premier, puis la 2ème, etc. L'animateur lit la question et juge la réponse.", en: "5 menus of 5 open questions. The leading team picks their menu first, then 2nd, etc. The presenter reads the question and judges the answer." },
  settings_menus_pts:       { fr: 'Points par bonne réponse', en: 'Points per correct answer' },
  settings_menus_timer:     { fr: 'Timer par question (sec, 0 = sans)', en: 'Timer per question (sec, 0 = off)' },
  settings_addition_title:  { fr: "🧾 Épreuve 4 : L'Addition", en: '🧾 Round 4: The Bill' },
  settings_addition_desc:   { fr: "Questions de rapidité en salle ! Toutes les équipes jouent ensemble. Bonne réponse = +X, Mauvaise = −X. L'animateur clique +/− par équipe.", en: "Speed questions live! All teams play together. Right answer = +X, Wrong = −X. Presenter clicks +/− per team." },
  settings_addition_pts:    { fr: 'Points (+X / −X)', en: 'Points (+X / −X)' },
  settings_death_title:     { fr: '💀 Épreuve 5 : Burger de la Mort', en: '💀 Round 5: Burger of Death' },
  settings_death_desc:      { fr: "Épreuve finale réservée à l'équipe en tête ! Défi chronométré en salle, géré par l'animateur.", en: "Final round for the leading team! Timed challenge live, managed by the presenter." },
  settings_death_timer:     { fr: 'Timer par défaut (sec, 0 = sans)', en: 'Default timer (sec, 0 = off)' },
  settings_general_title:   { fr: '🏆 Règles Générales', en: '🏆 General Rules' },
  settings_anim1:           { fr: 'Animateur 1', en: 'Presenter 1' },
  settings_anim2:           { fr: 'Animateur 2', en: 'Presenter 2' },
  settings_team_order:      { fr: 'Ordre des équipes', en: 'Team order' },
  settings_order_random:    { fr: '🎲 Tirage au sort (animé)', en: '🎲 Random draw (animated)' },
  settings_order_ketchup:   { fr: 'Ketchup commence', en: 'Ketchup first' },
  settings_order_mayo:      { fr: 'Mayo commence', en: 'Mayo first' },
  settings_order_cheese:    { fr: 'Cheeseburger commence', en: 'Cheeseburger first' },
  settings_order_frites:    { fr: 'Frites commence', en: 'Fries first' },
  btn_back:                 { fr: '← Retour', en: '← Back' },
  btn_save:                 { fr: '💾 Sauvegarder', en: '💾 Save' },
  toast_settings_saved:     { fr: 'Paramètres sauvegardés !', en: 'Settings saved!' },

  // ======== GAME SCREEN — ROUND TABS ========
  tab_nuggets:              { fr: '🟡 Nuggets', en: '🟡 Nuggets' },
  tab_sop:                  { fr: '🧂 Sel ou Poivre', en: '🧂 Salt or Pepper' },
  tab_menus:                { fr: '📋 Menus', en: '📋 Menus' },
  tab_addition:             { fr: "🧾 L'Addition", en: '🧾 The Bill' },
  tab_death:                { fr: '💀 Burger de la Mort', en: '💀 Burger of Death' },

  // ======== ROUND INTRO ========
  round_name_nuggets:       { fr: 'Nuggets', en: 'Nuggets' },
  round_name_sop:           { fr: 'Sel ou Poivre', en: 'Salt or Pepper' },
  round_name_menus:         { fr: 'Les Menus', en: 'The Menus' },
  round_name_addition:      { fr: "L'Addition", en: 'The Bill' },
  round_name_death:         { fr: 'Burger de la Mort', en: 'Burger of Death' },
  round_desc_nuggets:       { fr: "QCM à 4 choix, 4 niveaux de difficulté croissante.\nChaque équipe répond à 1 question par niveau.\nTirage au sort animé, puis suspense avant le résultat !", en: "4-choice MCQ, 4 increasing difficulty levels.\nEach team answers 1 question per level.\nAnimated draw, then suspense before the result!" },
  round_desc_sop:           { fr: "Questions de rapidité lues par l'animateur en salle !\nToutes les équipes jouent en même temps,\nla plus rapide répond !", en: "Speed questions read by the presenter live!\nAll teams play at the same time,\nthe fastest answers!" },
  round_desc_menus:         { fr: "5 menus de 5 questions ouvertes chacun.\nL'équipe en tête choisit son menu en premier,\npuis la 2ème, etc. L'animateur lit la question et juge la réponse.", en: "5 menus of 5 open questions each.\nThe leading team picks their menu first,\nthen 2nd, etc. The presenter reads and judges." },
  round_desc_addition:      { fr: "Questions de rapidité en salle !\nToutes les équipes jouent ensemble.\nBonne réponse = gros points, Mauvaise = gros malus !", en: "Speed questions live!\nAll teams play together.\nRight answer = big points, Wrong = big penalty!" },
  round_desc_death:         { fr: "Épreuve finale réservée à l'équipe en tête !\nL'équipe doit choisir un membre pour relever le défi.\nDéfi chronométré en salle, géré par les animateurs.", en: "Final round for the leading team!\nThe team must choose a member for the challenge.\nTimed challenge live, managed by the presenters." },
  btn_round_start:          { fr: "C'est Parti ! 🍔", en: "Let's Go! 🍔" },

  // ======== SCORING LABELS ========
  scoring_nuggets:          { fr: 'Niv.1: {0}pt · Niv.2: {1}pts · Niv.3: {2}pts · Niv.4: {3}pts', en: 'Lv.1: {0}pt · Lv.2: {1}pts · Lv.3: {2}pts · Lv.4: {3}pts' },
  scoring_sop:              { fr: '+{0} / −{0} par réponse', en: '+{0} / −{0} per answer' },
  scoring_menus:            { fr: '{0} pts par bonne réponse · 5 questions ouvertes par menu', en: '{0} pts per correct answer · 5 open questions per menu' },
  scoring_addition:         { fr: '+{0} / −{0} par réponse', en: '+{0} / −{0} per answer' },
  scoring_death:            { fr: "L'équipe en tête choisit son champion !", en: 'The leading team picks their champion!' },

  // ======== NUGGETS ========
  nuggets_turn:             { fr: "C'est au tour de :", en: "It's the turn of:" },
  nuggets_q_label:          { fr: '🟡 Nuggets — Question {0}', en: '🟡 Nuggets — Question {0}' },
  level_1:                  { fr: '⭐ Niveau 1 — Très Facile', en: '⭐ Level 1 — Very Easy' },
  level_2:                  { fr: '⭐⭐ Niveau 2', en: '⭐⭐ Level 2' },
  level_3:                  { fr: '⭐⭐⭐ Niveau 3', en: '⭐⭐⭐ Level 3' },
  level_4:                  { fr: '💀 Niveau 4 — Expert', en: '💀 Level 4 — Expert' },
  btn_next_question:        { fr: '➡️ Question suivante', en: '➡️ Next Question' },
  btn_next_round:           { fr: '⏭️ Prochaine épreuve', en: '⏭️ Next Round' },
  timer_hint:               { fr: '👆 Cliquez pour lancer', en: '👆 Click to start' },
  result_correct:           { fr: 'CORRECT !', en: 'CORRECT!' },
  result_wrong:             { fr: 'MAUVAISE RÉPONSE', en: 'WRONG ANSWER' },
  result_points:            { fr: '+{0} point{1} pour {2}', en: '+{0} point{1} for {2}' },
  result_correct_was:       { fr: 'La bonne réponse était :', en: 'The correct answer was:' },
  question_draw_title:      { fr: '🎰 Tirage de la question...', en: '🎰 Drawing the question...' },
  question_draw_team:       { fr: "Pour l'équipe {0}", en: 'For team {0}' },
  toast_nuggets_done:       { fr: '🟡 Nuggets terminé ! Passez à la suite.', en: '🟡 Nuggets done! Move to the next round.' },
  toast_nuggets_next:       { fr: "🟡 Nuggets terminé ! Passez à l'épreuve suivante.", en: '🟡 Nuggets done! Move to the next round.' },

  // ======== SPEED ROUNDS (SoP / Addition) ========
  sop_title:                { fr: '🧂 Sel ou Poivre — Questions de rapidité', en: '🧂 Salt or Pepper — Speed Questions' },
  sop_rule:                 { fr: "L'animateur lit les questions. Les équipes buzzent. Bonne réponse = <strong class=\"pts-plus\">{0}</strong> · Mauvaise = <strong class=\"pts-minus\">{1}</strong>", en: "The presenter reads questions. Teams buzz. Right answer = <strong class=\"pts-plus\">{0}</strong> · Wrong = <strong class=\"pts-minus\">{1}</strong>" },
  addition_title:           { fr: "🧾 L'Addition — Questions de rapidité", en: '🧾 The Bill — Speed Questions' },
  addition_rule:            { fr: "L'animateur lit les questions. Toutes les équipes jouent ensemble !<br>Bonne réponse = <strong class=\"pts-plus\">{0}</strong> · Mauvaise = <strong class=\"pts-minus\">{1}</strong>", en: "The presenter reads questions. All teams play together!<br>Right answer = <strong class=\"pts-plus\">{0}</strong> · Wrong = <strong class=\"pts-minus\">{1}</strong>" },
  btn_round_next:           { fr: '⏭️ Épreuve suivante', en: '⏭️ Next Round' },

  // ======== MENUS ========
  menus_ranking_title:      { fr: '📊 Classement avant les Menus', en: '📊 Rankings before Menus' },
  menus_tie_badge:          { fr: '⚡ EX-AEQUO', en: '⚡ TIED' },
  menus_tie_detected:       { fr: '⚡ Ex-aequo détecté ! {0}', en: '⚡ Tie detected! {0}' },
  menus_tie_and:            { fr: ' et ', en: ' and ' },
  btn_tiebreak:             { fr: '🎡 Lancer le tirage au sort', en: '🎡 Spin the wheel' },
  menus_order_title:        { fr: '📋 Ordre de choix des menus', en: '📋 Menu pick order' },
  btn_choose_menus:         { fr: '🍔 Choisir les menus !', en: '🍔 Pick the menus!' },
  menus_pick_turn:          { fr: "C'est au tour de : {0} de choisir un menu", en: "It's {0}'s turn to pick a menu" },
  menus_q_label:            { fr: 'Question {0} / {1}', en: 'Question {0} / {1}' },
  btn_correct:              { fr: '✅ CORRECT', en: '✅ CORRECT' },
  btn_incorrect:            { fr: '❌ INCORRECT', en: '❌ INCORRECT' },
  menus_pts_correct:        { fr: '✅ +{0} point{1} pour {2}', en: '✅ +{0} point{1} for {2}' },
  menus_pts_incorrect:      { fr: '❌ Pas de point', en: '❌ No points' },
  menus_done:               { fr: '📋 Épreuve des Menus terminée !', en: '📋 Menus round complete!' },
  mt_done_menu:             { fr: 'a terminé le', en: 'finished' },
  mt_score_round:           { fr: 'Menus : <strong>+{0} pts</strong>', en: 'Menus: <strong>+{0} pts</strong>' },
  mt_score_total:           { fr: 'Score total : <strong>{0} pts</strong>', en: 'Total score: <strong>{0} pts</strong>' },
  mt_next_header:           { fr: 'À suivre', en: 'Up next' },
  mt_btn_next_team:         { fr: "▶️ {0}, c'est à vous !", en: '▶️ {0}, your turn!' },

  // ======== TIEBREAK WHEEL ========
  tiebreak_title:           { fr: '🎰 Ex-aequo !', en: '🎰 Tiebreaker!' },
  tiebreak_desc:            { fr: "Les équipes suivantes sont ex-aequo à <strong>{0} pts</strong>.<br>La roue va déterminer l'ordre de choix !", en: 'The following teams are tied at <strong>{0} pts</strong>.<br>The wheel will determine the pick order!' },
  btn_spin:                 { fr: '🎡 Lancer la roue !', en: '🎡 Spin the wheel!' },
  btn_tiebreak_done:        { fr: '✅ Continuer', en: '✅ Continue' },
  tiebreak_picks:           { fr: '{0} choisit en {1} !', en: '{0} picks {1}!' },
  tiebreak_order:           { fr: 'Ordre :', en: 'Order:' },
  ordinal_1:                { fr: '1er', en: '1st' },
  ordinal_2:                { fr: '2ème', en: '2nd' },
  ordinal_3:                { fr: '3ème', en: '3rd' },
  ordinal_4:                { fr: '4ème', en: '4th' },

  // ======== TEAM DRAW ========
  team_draw_title:          { fr: "🎲 Tirage au sort de l'ordre !", en: '🎲 Random team order draw!' },
  btn_draw_start:           { fr: '🎲 Lancer le tirage !', en: '🎲 Start the draw!' },

  // ======== INTER-ROUND RECAP ========
  inter_round_title:        { fr: '📊 Fin de {0} {1}', en: '📊 End of {0} {1}' },
  inter_round_next_label:   { fr: 'Prochaine épreuve', en: 'Next round' },
  inter_round_btn:          { fr: '▶️ Lancer {0} {1}', en: '▶️ Start {0} {1}' },

  // ======== CONFIRM NEXT ROUND ========
  modal_next_title:         { fr: '⏭️ Épreuve suivante', en: '⏭️ Next round' },
  modal_next_text:          { fr: "Êtes-vous sûr de vouloir passer à l'épreuve suivante ?", en: 'Are you sure you want to move to the next round?' },
  modal_next_no:            { fr: 'Non, rester', en: 'No, stay' },
  modal_next_yes:           { fr: 'Oui, on passe !', en: "Yes, let's go!" },

  // ======== WINNER ANNOUNCEMENT ========
  winner_in_lead:           { fr: '{0} est en tête !', en: '{0} is in the lead!' },
  winner_but_death:         { fr: 'Mais attention… il reste le <strong>Burger de la Mort</strong> ! 💀', en: 'But beware… the <strong>Burger of Death</strong> remains! 💀' },
  btn_proceed_death:        { fr: '💀 Passer au Burger de la Mort', en: '💀 Proceed to Burger of Death' },

  // ======== BURGER DE LA MORT ========
  death_title:              { fr: '💀 Burger de la Mort', en: '💀 Burger of Death' },
  death_rule:               { fr: "Épreuve finale réservée à l'équipe en tête !", en: 'Final round for the leading team!' },
  death_choose:             { fr: '{0}, choisissez un membre de votre équipe pour relever le défi !', en: '{0}, choose a team member to take on the challenge!' },
  death_answer:              { fr: 'Réponse : {0}', en: 'Answer: {0}' },
  btn_home:                 { fr: '🏠 Retour au Menu principal', en: '🏠 Back to Main Menu' },

  // ======== RESULTS ========
  results_title:            { fr: '🏆 FIN DU BURGER QUIZ !', en: '🏆 END OF BURGER QUIZ!' },
  results_team:             { fr: 'Équipe', en: 'Team' },
  results_total:            { fr: 'TOTAL', en: 'TOTAL' },
  btn_new_game:             { fr: '🔄 Nouvelle Partie', en: '🔄 New Game' },

  // ======== TOASTS ========
  toast_time_up:            { fr: "⏰ Temps écoulé ! Il faut répondre maintenant… sinon c'est perdu ! 😉", en: '⏰ Time\'s up! Answer now… or lose it! 😉' },
  toast_invalid_save:       { fr: '⚠️ Sauvegarde invalide ou absente. Lancez une nouvelle partie !', en: '⚠️ Invalid or missing save. Start a new game!' },
  toast_game_restored:      { fr: '🔄 Partie en cours restaurée !', en: '🔄 Game in progress restored!' },
  toast_results:            { fr: '🏆 Voici les résultats de la dernière partie !', en: '🏆 Here are the results of the last game!' },

  // ======== WINNER MESSAGES ========
  winner_msg_1:             { fr: 'Quelle performance ! Vous avez écrasé la concurrence ! 🔥', en: 'What a performance! You crushed the competition! 🔥' },
  winner_msg_2:             { fr: 'Incroyable ! Vous êtes les rois du burger ! 👑', en: 'Incredible! You are the burger kings! 👑' },
  winner_msg_3:             { fr: 'Bravo ! Personne ne peut vous arrêter ! 💪', en: "Amazing! No one can stop you! 💪" },
  winner_msg_4:             { fr: 'Magnifique ! Les frites de la victoire sont pour vous ! 🎉', en: 'Magnificent! The victory fries are yours! 🎉' },
  winner_msg_5:             { fr: 'Chapeau ! Vous avez tout dévoré sur votre passage ! 🍔', en: 'Hats off! You devoured everything in your path! 🍔' },
};

// ======== HELPER ========
let _currentLang = 'fr';

function getLang() { return _currentLang; }

function setLang(lang) {
  _currentLang = lang;
  localStorage.setItem(LS_LANG, lang);
  document.documentElement.lang = lang;
}

function t(key, ...args) {
  const entry = I18N[key];
  if (!entry) return key;
  let str = entry[_currentLang] || entry['fr'] || key;
  args.forEach((arg, i) => { str = str.replace(`{${i}}`, arg); });
  return str;
}

function initLang() {
  const saved = localStorage.getItem(LS_LANG);
  _currentLang = (saved === 'en') ? 'en' : 'fr';
  document.documentElement.lang = _currentLang;
}
