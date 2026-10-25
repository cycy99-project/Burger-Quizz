/* ============================================================
   BURGER QUIZ — Banque "Sel ou Poivre" (pour l'éditeur uniquement)
   Ces questions sont consultables/éditables dans l'onglet
   Éditer > 🧂 Sel ou Poivre ; elles ne sont PAS utilisées en mode jeu
   (le jeu continue d'utiliser Questions_SelOuPoivre dans questions.js).
   Format : { fr, en, answer: "sel" (Vrai) | "poivre" (Faux),
              explication_fr, explication_en, theme }
   ============================================================ */

const SOP_BANK = [
  { fr: "Le ketchup était autrefois vendu comme médicament.", en: "Ketchup was once sold as medicine.", answer: "sel", explication_fr: "", explication_en: "", theme: "Intelligence Artificielle" },
  { fr: "Le Big Mac a été inventé en France.", en: "The Big Mac was invented in France.", answer: "poivre", explication_fr: "Pennsylvanie 1967", explication_en: "Pennsylvania 1967", theme: "Intelligence Artificielle" },
  { fr: "Les frites sont plus populaires que les burgers aux USA.", en: "French fries are more popular than burgers in the USA.", answer: "sel", explication_fr: "", explication_en: "", theme: "Intelligence Artificielle" },
  { fr: "Le Japon propose des burgers au Kit-Kat.", en: "Japan offers Kit-Kat burgers.", answer: "sel", explication_fr: "", explication_en: "", theme: "Intelligence Artificielle" },
  { fr: "Un hamburger contient obligatoirement du jambon.", en: "A hamburger must contain ham.", answer: "poivre", explication_fr: "de Hambourg", explication_en: "from Hamburg", theme: "Intelligence Artificielle" },
  { fr: "La France est le 2e marché McDonald's au monde.", en: "France is McDonald's 2nd biggest market worldwide.", answer: "sel", explication_fr: "", explication_en: "", theme: "Intelligence Artificielle" },
  { fr: "Burger King a ouvert avant McDonald's.", en: "Burger King opened before McDonald's.", answer: "poivre", explication_fr: "McDo 1940 vs BK 1954", explication_en: "McD 1940 vs BK 1954", theme: "Intelligence Artificielle" },
  { fr: "Il existe un emoji officiel du hamburger.", en: "There is an official hamburger emoji.", answer: "sel", explication_fr: "", explication_en: "", theme: "Intelligence Artificielle" },
  { fr: "Les nuggets ont été inventés dans les années 1950.", en: "Nuggets were invented in the 1950s.", answer: "poivre", explication_fr: "1963", explication_en: "1963", theme: "Intelligence Artificielle" },
  { fr: "Le mot mayonnaise vient de Mayence en Allemagne.", en: "The word mayonnaise comes from Mainz in Germany.", answer: "poivre", explication_fr: "Mahón en Espagne", explication_en: "Mahón in Spain", theme: "Intelligence Artificielle" },
  { fr: "Un Américain mange en moyenne 3 burgers/semaine.", en: "An American eats on average 3 burgers per week.", answer: "sel", explication_fr: "", explication_en: "", theme: "Intelligence Artificielle" },
  { fr: "Le record du plus gros burger pèse plus d'une tonne.", en: "The record for the biggest burger weighs over a ton.", answer: "sel", explication_fr: "", explication_en: "", theme: "Intelligence Artificielle" },
  { fr: "Le Coca-Cola était vert à l'origine.", en: "Coca-Cola was originally green.", answer: "poivre", explication_fr: "mythe urbain", explication_en: "urban myth", theme: "Intelligence Artificielle" },
  { fr: "Le cornichon est en réalité un petit concombre.", en: "A gherkin is actually a small cucumber.", answer: "sel", explication_fr: "", explication_en: "", theme: "Intelligence Artificielle" },
  { fr: "Le mot restaurant est d'origine italienne.", en: "The word 'restaurant' has Italian origins.", answer: "poivre", explication_fr: "du français restaurer", explication_en: "from French 'restaurer'", theme: "Intelligence Artificielle" }
];
