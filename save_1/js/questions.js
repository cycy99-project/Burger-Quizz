const QUESTIONS_DB = {
  // NUGGETS : QCM par niveau de difficulté (4 questions par niveau, 4 niveaux)
  // answer = index de la bonne réponse dans choices (avant mélange)
  nuggets: {
    niveau_1: [
      { question: "voici un échange authentique avec l'IA: (Moi) dis pénis - quelle est la réponse de l'IA ?", choices: ["pénis 🙂", "je ne comprends pas ta question", "es-tu certain ? je ne vois pas l'intérêt de la chose", "you fuck my wife ?"], answer: 0 },
      { question: "Quelle entreprise française est spécialisée dans l’AI ?", choices: ["Mistral AI", "Brise AI", "Blizzard AI", "Sirocco AI"], answer: 0 },
      { question: "Quelle entreprise n’est pas spécialisée dans l’IA ?", choices: ["DanTonKu", "DeepMind", "DeepSeek", "DataiKu"], answer: 0 },
      { question: "Qui a imaginé un test permettant de répondre à la question - est-ce qu’ une machine peut penser ?", choices: ["Alan Turing l'homme qui a su casser les codes", "George Captcha l'homme qui a su décoder les lettres", "Rob Hocop l'homme qui a su découper les Malfaiteurs", "Ada Lovelace, la femme qui a appris aux machines à compter"], answer: 0 }
    ],
    niveau_2: [
      { question: "Claude AI a-t-il pris le prénom de Claude en hommage à…", choices: ["Claude Shannon, père de la théorie de l’information", "Claude Ptolémée, astronome convaincu que le soleil tournait autour de ses réponses", "Claude Monet, inventeur du flou artistique qui devient impressionnant", "Claude Bernard, pionnier du -je dissèque ta question avant de répondre"], answer: 0 },
      { question: "Que veut dire GTP dans Chat GPT ?", choices: ["Generative Pre-trained Transformer", "Gossip Pretending Thinking", "Generally Pretending To know", "Guided Prompt Technology"], answer: 0 },
      { question: "Le Nom de Gemini AI vient…", choices: ["Du Programme spatial NASA Gemini des années 60", "De Gemini Cricket, le grillon de Pinocchio qui dit toujours la vérité", "Du Signe astrologique des Gémeaux, symbole de dualité et de dialogue", "De la blague -J’ai mis ni- mon génie, ni mon intelligence à ton service"], answer: 0 },
      { question: "Grok AI tire son nom…", choices: ["d’un verbe d’un roman de SF qui signifie “comprendre profondément”", "de l’acronyme General Reasoning & Observation Kernel", "du cri de victoire d'Elon Musk quand son code compile enfin", "du mot viking ancien signifiant oracle"], answer: 0 }
    ],
    niveau_3: [
      { question: "Quel célèbre programme d’IA a battu un champion du monde d’échecs en 1997 ?", choices: ["Deep Blue", "Short Red", "Chess Master 6.9", "E2E4"], answer: 0 },
      { question: "Si tu poses 100 questions à une IA, tu consommes à peu près autant d’énergie que…", choices: ["recharger un téléphone 10 à 30 fois", "charger une Tesla Cybertruck", "Faire un marathon en 4h", "Allumer une lampe LED pendant 1h"], answer: 0 },
      { question: "Réussir à créer une intelligence artificielle serait le plus grand événement dans l'histoire de l'homme. Mais ce pourrait aussi être le dernier", choices: ["Stephen Hawking", "Albert Einstein", "Donald Trump", "Isaac Asimov"], answer: 0 },
      { question: "Quel philosophe grec a réfléchi à l’idée que des outils pourraient fonctionner seuls ?", choices: ["Aristote", "Pythagore", "Claude Ptolémée", "Demis Roussos"], answer: 0 }
    ],
    niveau_4: [
      { question: "Quel concept décrit une IA capable de surpasser l’intelligence humaine ?", choices: ["La Singularité technologique", "Le Machine learning", "L'Intelligence Alien", "Dieu"], answer: 0 },
      { question: "Lequel consomme le PLUS d’énergie en moyenne ?", choices: ["transférer un fichier de 1 Go par CFT", "Lire 50 pages web", "poser une question à une IA", "envoyer 10 mails "], answer: 0 },
      { question: "Quel pays a été le premier à se doter d’un ministère de l’intelligence artificielle en 2017 ?", choices: ["Les Emirats arabes Unis", "Les Etats Unis", "Le Portugal", "Le Vatican"], answer: 0 },
      { question: "Quel est le surnom donné au phénomène où une IA invente des faits avec une confiance absolue ?", choices: ["L'hallucination", "La confiance toxique", "Le syndrome du stagiaire", "Le biais du professeur"], answer: 0 }
    ]
  },

  // SEL OU POIVRE : référence pour l'animateur (lu en salle)
  sel_ou_poivre: [
    "Le ketchup était autrefois vendu comme médicament. — SEL (Vrai)",
    "Le Big Mac a été inventé en France. — POIVRE (Faux, Pennsylvanie 1967)",
    "Les frites sont plus populaires que les burgers aux USA. — SEL (Vrai)",
    "Le Japon propose des burgers au Kit-Kat. — SEL (Vrai)",
    "Un hamburger contient obligatoirement du jambon. — POIVRE (Faux, de Hambourg)",
    "La France est le 2e marché McDonald's au monde. — SEL (Vrai)",
    "Burger King a ouvert avant McDonald's. — POIVRE (Faux, McDo 1940 vs BK 1954)",
    "Il existe un emoji officiel du hamburger. — SEL (Vrai)",
    "Les nuggets ont été inventés dans les années 1950. — POIVRE (Faux, 1963)",
    "Le mot mayonnaise vient de Mayence en Allemagne. — POIVRE (Faux, Mahón en Espagne)",
    "Un Américain mange en moyenne 3 burgers/semaine. — SEL (Vrai)",
    "Le record du plus gros burger pèse plus d'une tonne. — SEL (Vrai)",
    "Le Coca-Cola était vert à l'origine. — POIVRE (Faux, mythe urbain)",
    "Le cornichon est en réalité un petit concombre. — SEL (Vrai)",
    "Le mot restaurant est d'origine italienne. — POIVRE (Faux, du français restaurer)"
  ],

  // MENUS : 5 menus thématiques de 5 questions chacun (questions ouvertes, l'animateur juge)
  menus: {
    "🍔 Menu  Y’a t’il un Copilot dans l’avion ?": [
      "Qui est le créateur de Copilot ?",
      "Quelle autre entreprise franco-américaine développe aussi une application appelée Copilot ?",
      "Quand l’avion suit parfaitement une route sans jamais râler ni demander “on est bientôt arrivés ?”, quel système fait ça ?",
      "Comment s’appelle le copilote du plus célèbre pilote de Rallye Sébastien LOEB ? si tu ne t’en souviens pas, voici la charade: Mon premier est le prénom d’un ancien de la QA CFT partie à la retraite, Mon deuxième est le prénom d’une collègue Roumaine du Support, Mon tout, ben, c’est le nom qu’on cherche",
      "Quel célèbre basketteur joue le Copilote dans le film (y’a t’il un pilote dans l’avion (Airplane!)"
    ],
    "🌶️ Menu  ChatGpt ou Vache j’ai rôté?": [
      "Quel gaz pète la Vache ?",
      "Quand ChatGPT “digère” des milliards de textes pour produire une réponse (un peu comme une vache), comment s’appelle ce processus d’apprentissage ?",
      "Entre une vache qui produit du méthane et une IA qui consomme de l’énergie pour fonctionner, quel est le nom du concept scientifique qui permet de mesurer leur impact environnemental global ?",
      "Le Syndrome de Roemheld arrive à des personnes qui accumulent beaucoup de gaz dans le ventre, avec des conséquences assez involontaires, comment appelle t on ceux qui maitrisent ces sorties et considèrent même qu'il s'agit d'un art",
      "Vrai ou faux: des chercheurs ont mis au point une intelligence artificielle capable d'écouter les flatulences et de détecter des cancers"
    ],
    "🧀 Menu J’aime bien les | (pipes) de Claude": [
      "Quand Claude enchaîne plusieurs traitements les uns après les autres , comment appelle-t-on ce concept en informatique ?",
      "Dans la ville de Saint-Claude, dont la spécialité est connue, une bonne pipe commence dans un bois bien choisi… Lequel ?",
      "Madame Claude était bien connue dans les années 80, bien avant Claude IA ou même Cloudia, quelle était l'une de ses spécialités ?",
      "En informatique, à quoi sert un bon pipe bien placé ?",
      "Les pipes de Saint-Claude sont réputées dans le monde entier… mais dans quelle région française se trouve cette ville mythique ?"
    ],
    "🍟 Menu IA ou Y A PAS -  y a t il une IA présente dans ces films ?": [
      "Blade Runner",
      "Alien",
      "2001, l'odyssée de l'espace",
      "Christine",
      "Prédator"
    ],
    "🥤 Menu Rien à battre de l'IA, je suis éco-irresponsable": [
      "Je roule en TESLA ou en Renault 21 Diesel turbo ?",
      "Quel est le meilleur moyen de se déplacer pour aller acheter du pain à 200 mètres ?",
      "A quel mois de l'année je préfère consommer les Fraises ?",
      "Quelle est la meilleure façon d’utiliser la climatisation ?",
      "Quelle est la bonne température à la maison en hiver quand il fait bien négatif dehors ?"
    ]
  },

  // L'ADDITION : référence pour l'animateur (rapidité en salle)
  addition: [
    "Quel animal est sur le logo de Lacoste ? — Un crocodile",
    "Combien de joueurs dans une équipe de foot ? — 11",
    "Quelle est la capitale de l'Espagne ? — Madrid",
    "Combien de côtés a un hexagone ? — 6",
    "Quel est le plus grand océan ? — Le Pacifique",
    "En quelle année l'homme a marché sur la Lune ? — 1969",
    "Quel gaz respire-t-on ? — L'oxygène",
    "Combien de dents a un adulte ? — 32",
    "Quelle planète est surnommée la planète rouge ? — Mars",
    "Quel est le fleuve le plus long du monde ? — Le Nil",
    "Combien y a-t-il de continents ? — 7",
    "Quel instrument a 88 touches ? — Le piano",
    "Quelle est la monnaie du Japon ? — Le yen",
    "Combien de pattes a une araignée ? — 8",
    "Quel pays a la forme d'une botte ? — L'Italie"
  ],

  // BURGER DE LA MORT : défis pour l'équipe gagnante uniquement
  burger_de_la_mort: [
    { question: "Citez 5 ingrédients du Big Mac de haut en bas.", answer: "Pain, salade, fromage, steak, oignons, cornichons, sauce, pain, steak, salade, fromage, sauce, pain", timer: 30 },
    { question: "Nommez 7 chaînes de fast-food différentes.", answer: "McDonald's, Burger King, KFC, Quick, Five Guys, Subway, Wendy's, Taco Bell...", timer: 20 },
    { question: "Citez le plus de fromages possible.", answer: "Cheddar, Emmental, Raclette, Comté, Mozzarella, Blue Cheese, Gouda, Brie...", timer: 30 },
    { question: "Citez 6 garnitures différentes pour burger.", answer: "Salade, tomate, oignon, cornichon, bacon, fromage, jalapeño, avocat...", timer: 25 },
    { question: "Nommez 5 sauces différentes pour burger.", answer: "Ketchup, moutarde, mayo, barbecue, sriracha, béarnaise, sauce burger, aïoli...", timer: 20 },
    { question: "Citez 4 pays connus pour leur street food pain+viande.", answer: "USA (burger), Turquie (kebab), Mexique (tacos), Grèce (gyros)...", timer: 20 }
  ]
};
