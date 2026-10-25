/* ============================================================
   BURGER QUIZ — Banque "Sel ou Poivre" (pour l'éditeur uniquement)
   Ces questions sont consultables/éditables dans l'onglet
   Éditer > 🧂 Sel ou Poivre ; elles ne sont PAS utilisées en mode jeu
   (le jeu continue d'utiliser Questions_SelOuPoivre dans questions.js).
   Format 1 : { fr, en, answer: "sel" (Vrai) | "poivre" (Faux),
              explication_fr, explication_en, theme }
   Format 2 (classement multi-éléments) : { type: "classement", fr, en,
              options:[{key,fr,en}], items:[{fr,en,answer:<key>,note_fr?,note_en?}], theme }
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
  { fr: "Le mot restaurant est d'origine italienne.", en: "The word 'restaurant' has Italian origins.", answer: "poivre", explication_fr: "du français restaurer", explication_en: "from French 'restaurer'", theme: "Intelligence Artificielle" },
  { type: "classement", fr: "Robot, Bobo ou les deux ?", en: "Robot, Bobo (bourgeois-bohemian) or both?", options: [{"key":"robot","fr":"Robot","en":"Robot"},{"key":"bobo","fr":"Bobo","en":"Bobo"},{"key":"deux","fr":"Les deux","en":"Both"}], items: [
    {"fr":"Peut écrire un texte sur l'écologie qu'il ne comprend pas vraiment","en":"Can write a text about ecology that it doesn't really understand","answer":"deux"},
    {"fr":"Parle souvent d'écologie et d'empreinte carbone","en":"Often talks about ecology and carbon footprint","answer":"bobo"},
    {"fr":"Analyse des millions de données pour comprendre le programme du candidat de gauche","en":"Analyzes millions of data points to understand the left-wing candidate's platform","answer":"robot"},
    {"fr":"Te conseille de faire une détox digitale","en":"Advises you to do a digital detox","answer":"bobo"},
    {"fr":"Donne des conseils personnalisés pour améliorer ta vie","en":"Gives personalized advice to improve your life","answer":"deux"},
    {"fr":"Te recommande ce que tu dois manger","en":"Recommends what you should eat","answer":"deux"},
    {"fr":"Utilise des mots compliqués pour paraître intelligent","en":"Uses complicated words to sound smart","answer":"deux"},
    {"fr":"Te donne des conseils même quand tu n'as rien demandé","en":"Gives you advice even when you didn't ask","answer":"deux"},
    {"fr":"Donne des leçons de vie sans être irréprochable","en":"Lectures you about life without being beyond reproach","answer":"bobo"},
    {"fr":"Est capable de reconnaître ton visage","en":"Is able to recognize your face","answer":"robot"},
    {"fr":"Te suggère de méditer régulièrement","en":"Suggests you meditate regularly","answer":"bobo"},
    {"fr":"Peut devenir un peu agaçant à force","en":"Can get a bit annoying after a while","answer":"deux"},
    {"fr":"Est persuadé d'avoir une vision éclairée du monde","en":"Is convinced he has an enlightened view of the world","answer":"bobo"},
    {"fr":"Peut faire des erreurs absurdes malgré son intelligence","en":"Can make absurd mistakes despite its intelligence","answer":"deux"},
    {"fr":"Son nom vient de la langue tchèque","en":"Its name comes from the Czech language","answer":"robot","note_fr":"Attention : « bohème » fait penser à la Bohême, qui est en Tchéquie, mais c'est bien « robot » qui vient du tchèque.","note_en":"Careful: 'bohemian' makes you think of Bohemia, which is in Czechia, but it's 'robot' that comes from Czech."},
    {"fr":"Il est plutôt bohème","en":"He's rather bohemian","answer":"bobo"}
  ], theme: "Intelligence Artificielle" },
  { type: "classement", fr: "Mortel ou immortel (sauf si on le détruit, bien sûr) ?", en: "Mortal or immortal (unless destroyed, of course)?", options: [{"key":"mortel","fr":"Mortel","en":"Mortal"},{"key":"immortel","fr":"Immortel","en":"Immortal"}], items: [
    {"fr":"Goldorak","en":"Grendizer (Goldorak)","answer":"immortel"},
    {"fr":"Terminator T-800","en":"Terminator T-800","answer":"immortel"},
    {"fr":"Pinocchio","en":"Pinocchio","answer":"mortel"},
    {"fr":"Robocop","en":"RoboCop","answer":"mortel"},
    {"fr":"Wall-E","en":"WALL-E","answer":"immortel"},
    {"fr":"Le monstre de Frankenstein","en":"Frankenstein's monster","answer":"mortel"},
    {"fr":"Talos","en":"Talos","answer":"mortel"},
    {"fr":"ChatGPT","en":"ChatGPT","answer":"immortel"},
    {"fr":"La Connerie","en":"Stupidity","answer":"immortel"},
    {"fr":"L'immortelle jaune (fleur)","en":"The yellow immortelle (flower)","answer":"mortel"}
  ], theme: "Intelligence Artificielle" },
  { type: "classement", fr: "Artificiel, Biologique ou les deux ?", en: "Artificial, Biological or both?", options: [{"key":"artificiel","fr":"Artificiel","en":"Artificial"},{"key":"biologique","fr":"Biologique","en":"Biological"},{"key":"deux","fr":"Les deux","en":"Both"}], items: [
    {"fr":"Chia","en":"Chia","answer":"biologique"},
    {"fr":"Chat, j'ai pété !!!","en":"Chat, I farted!!!","answer":"biologique"},
    {"fr":"ChatGPT","en":"ChatGPT","answer":"artificiel"},
    {"fr":"HAL 9000","en":"HAL 9000","answer":"artificiel"},
    {"fr":"L'ADN","en":"DNA","answer":"deux","note_fr":"ADN synthétique et biologique — il y a débat.","note_en":"Synthetic and biological DNA — it's debatable."},
    {"fr":"Axolotl","en":"Axolotl","answer":"biologique"},
    {"fr":"Alien (xénomorphe)","en":"Alien (xenomorph)","answer":"deux"},
    {"fr":"Virus","en":"Virus","answer":"deux"},
    {"fr":"La soie","en":"Silk","answer":"biologique"},
    {"fr":"Le nylon","en":"Nylon","answer":"artificiel"},
    {"fr":"L'insuline","en":"Insulin","answer":"deux","note_fr":"Produite en labo et par le pancréas.","note_en":"Made in a lab and by the pancreas."},
    {"fr":"Le colorant rouge carmin (E120)","en":"Carmine red dye (E120)","answer":"biologique","note_fr":"Extrait de cochenilles. Si vous mangez des bonbons rouges, vous mangez des insectes. Bon appétit.","note_en":"Extracted from cochineal insects. If you eat red candy, you're eating bugs. Enjoy!"},
    {"fr":"Une belle paire de…","en":"A nice pair of…","answer":"deux"},
    {"fr":"Le diamant","en":"Diamond","answer":"deux","note_fr":"Formé naturellement dans le manteau terrestre depuis des milliards d'années, OU synthétisé en labo depuis les années 50. Votre bague de fiançailles peut venir d'une machine.","note_en":"Formed naturally in the Earth's mantle over billions of years, OR synthesized in a lab since the 1950s. Your engagement ring may come from a machine."},
    {"fr":"La lingerie","en":"Lingerie","answer":"deux","note_fr":"Si elle est en soie…","note_en":"If it's silk…"},
    {"fr":"Un rendez-vous Tinder","en":"A Tinder date","answer":"deux"},
    {"fr":"L'orgasme","en":"The orgasm","answer":"biologique"},
    {"fr":"Le Professeur Simon du capitaine Flam","en":"Professor Simon from Captain Future","answer":"deux"},
    {"fr":"C-3PO","en":"C-3PO","answer":"artificiel"}
  ], theme: "Intelligence Artificielle" }
];
