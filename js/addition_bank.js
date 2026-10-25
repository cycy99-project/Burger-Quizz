/* ============================================================
   BURGER QUIZ — Banque "L'Addition" (pour l'éditeur uniquement)
   Consultable/éditable dans Éditer > 🧾 L'Addition ; NON utilisée en jeu.
   Format : { fr, en, answer_fr, answer_en, theme: "Culture générale" }
   ============================================================ */
const ADDITION_BANK = [
  {"fr":"Mais il bouffe quoi ? Popeye","en":"What on earth does he eat? Popeye","answer_fr":"Épinards","answer_en":"Spinach","theme":"Culture générale"},
  {"fr":"Mais il bouffe quoi ? Homer Simpson","en":"What on earth does he eat? Homer Simpson","answer_fr":"Donuts","answer_en":"Donuts","theme":"Culture générale"},
  {"fr":"Mais il bouffe quoi ? Hannibal Lecter","en":"What on earth does he eat? Hannibal Lecter","answer_fr":"La cervelle humaine","answer_en":"Human brain","theme":"Culture générale"},
  {"fr":"Mais il bouffe quoi ? Oum le Dauphin","en":"What on earth does he eat? Oum the Dolphin","answer_fr":"Galak","answer_en":"Galak (white chocolate bar)","theme":"Culture générale"},
  {"fr":"Mais il bouffe quoi ? Obélix","en":"What on earth does he eat? Obelix","answer_fr":"Sanglier","answer_en":"Wild boar","theme":"Culture générale"},
  {"fr":"Mais il bouffe quoi ? Garfield","en":"What on earth does he eat? Garfield","answer_fr":"Que de la malbouffe (lasagnes…)","answer_en":"Nothing but junk food (lasagna…)","theme":"Culture générale"},
  {"fr":"Mais il bouffe quoi ? Donkey Kong","en":"What on earth does he eat? Donkey Kong","answer_fr":"Bananes","answer_en":"Bananas","theme":"Culture générale"},
  {"fr":"Mais il bouffe quoi ? Le Gorille","en":"What on earth does he eat? The Gorilla","answer_fr":"Feuilles, fruits, racines et fleurs","answer_en":"Leaves, fruits, roots and flowers","theme":"Culture générale"},
  {"fr":"Mais il bouffe quoi ? Les Tortues Ninja","en":"What on earth does he eat? The Ninja Turtles","answer_fr":"Pizzas","answer_en":"Pizzas","theme":"Culture générale"},
  {"fr":"Mais il bouffe quoi ? Le Koala","en":"What on earth does he eat? The Koala","answer_fr":"Feuilles d'eucalyptus","answer_en":"Eucalyptus leaves","theme":"Culture générale"},
  {"fr":"Mais il bouffe quoi ? Pac-Man","en":"What on earth does he eat? Pac-Man","answer_fr":"Pastilles","answer_en":"Pac-dots (pellets)","theme":"Culture générale"},
  {"fr":"Mais il bouffe quoi ? Le Marsupilami","en":"What on earth does he eat? The Marsupilami","answer_fr":"Fruits / Piranhas","answer_en":"Fruit / Piranhas","theme":"Culture générale"},
  {"fr":"Mais il bouffe quoi ? Casimir","en":"What on earth does he eat? Casimir","answer_fr":"Boulgi boulga","answer_en":"Boulgi boulga","theme":"Culture générale"},
  {"fr":"La réponse se finit en « AM » : un nom d'équipe de foot","en":"The answer ends in \"AM\": a football team name","answer_fr":"Ajax Amsterdam, Fulham, Feyenoord Rotterdam, Tottenham, West Ham…","answer_en":"Ajax Amsterdam, Fulham, Feyenoord Rotterdam, Tottenham, West Ham…","theme":"Culture générale"},
  {"fr":"La réponse se finit en « AM » : une phrase magique","en":"The answer ends in \"AM\": a magic phrase","answer_fr":"Amstramgram","answer_en":"Amstramgram","theme":"Culture générale"},
  {"fr":"La réponse se finit en « AM » : un verbe conjugué au passé simple","en":"The answer ends in \"AM\": a verb in the simple past (French)","answer_fr":"Nous mangeâmes","answer_en":"Nous mangeâmes","theme":"Culture générale"},
  {"fr":"La réponse se finit en « AM » : un lieu où l'on peut acheter et fumer des pétards tranquille","en":"The answer ends in \"AM\": a place where you can buy and smoke joints in peace","answer_fr":"Amsterdam","answer_en":"Amsterdam","theme":"Culture générale"},
  {"fr":"La réponse se finit en « AM » : un instrument de musique","en":"The answer ends in \"AM\": a musical instrument","answer_fr":"Tam-tam","answer_en":"Tam-tam","theme":"Culture générale"},
  {"fr":"La réponse se finit en « AM » : elles sont super fortes en créneaux","en":"The answer ends in \"AM\": they are great at parallel parking","answer_fr":"Femmes, dames","answer_en":"Women, ladies","theme":"Culture générale"},
  {"fr":"La réponse se finit en « AM » : un jeu de société","en":"The answer ends in \"AM\": a board game","answer_fr":"Les dames","answer_en":"Checkers (« les dames »)","theme":"Culture générale"},
  {"fr":"La réponse se finit en « AM » : l'oncle de cousin américain","en":"The answer ends in \"AM\": the American cousin's uncle","answer_fr":"Sam","answer_en":"Sam","theme":"Culture générale"},
  {"fr":"La réponse se finit en « AM » : le garage d'Ali Baba","en":"The answer ends in \"AM\": ali Baba's garage","answer_fr":"Sésame","answer_en":"Sesame","theme":"Culture générale"},
  {"fr":"La réponse se finit en « AM » : un animal","en":"The answer ends in \"AM\": an animal","answer_fr":"Hippopotame","answer_en":"Hippopotamus","theme":"Culture générale"},
  {"fr":"La réponse se finit en « AM » : une sorte de poubelle informatique","en":"The answer ends in \"AM\": a kind of computer trash bin","answer_fr":"Spam","answer_en":"Spam","theme":"Culture générale"},
  {"fr":"La réponse se finit en « AM » : une boutique de lingerie","en":"The answer ends in \"AM\": a lingerie shop","answer_fr":"Etam","answer_en":"Etam","theme":"Culture générale"},
  {"fr":"La réponse se finit en « AM » : la ville de Batman","en":"The answer ends in \"AM\": batman's city","answer_fr":"Gotham","answer_en":"Gotham","theme":"Culture générale"}
];
