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

// ============ ENGLISH QUESTIONS ============
const QUESTIONS_DB_I18N = {
  fr: QUESTIONS_DB,
  en: {
    nuggets: {
      niveau_1: [
        { question: "Here's a real exchange with AI: (Me) say penis – what did the AI answer?", choices: ["penis 🙂", "I don't understand your question", "are you sure? I don't see the point", "you fuck my wife?"], answer: 0 },
        { question: "Which French company specializes in AI?", choices: ["Mistral AI", "Breeze AI", "Blizzard AI", "Sirocco AI"], answer: 0 },
        { question: "Which company does NOT specialize in AI?", choices: ["DanTonKu", "DeepMind", "DeepSeek", "DataiKu"], answer: 0 },
        { question: "Who devised a test to answer the question: can a machine think?", choices: ["Alan Turing, the code-breaker", "George Captcha, the letter decoder", "Rob Hocop, the criminal slicer", "Ada Lovelace, who taught machines to count"], answer: 0 }
      ],
      niveau_2: [
        { question: "Claude AI was named in honor of…", choices: ["Claude Shannon, father of information theory", "Claude Ptolemy, astronomer convinced the sun revolved around his answers", "Claude Monet, inventor of artistic blur that became impressive", "Claude Bernard, pioneer of 'I dissect your question before answering'"], answer: 0 },
        { question: "What does GPT stand for in ChatGPT?", choices: ["Generative Pre-trained Transformer", "Gossip Pretending Thinking", "Generally Pretending To know", "Guided Prompt Technology"], answer: 0 },
        { question: "The name Gemini AI comes from…", choices: ["NASA's Gemini space program in the 1960s", "Gemini Cricket, Pinocchio's truth-telling cricket", "The zodiac sign Gemini, symbol of duality and dialogue", "The joke 'I put neither my genius nor my intelligence at your service'"], answer: 0 },
        { question: "Grok AI gets its name from…", choices: ["a verb from a sci-fi novel meaning 'to understand deeply'", "the acronym General Reasoning & Observation Kernel", "Elon Musk's victory cry when his code finally compiles", "an ancient Viking word meaning oracle"], answer: 0 }
      ],
      niveau_3: [
        { question: "Which famous AI program beat a world chess champion in 1997?", choices: ["Deep Blue", "Short Red", "Chess Master 6.9", "E2E4"], answer: 0 },
        { question: "If you ask an AI 100 questions, you use about as much energy as…", choices: ["charging a phone 10 to 30 times", "charging a Tesla Cybertruck", "running a marathon in 4 hours", "leaving an LED light on for 1 hour"], answer: 0 },
        { question: "'Creating AI would be the biggest event in human history. But it could also be the last.' Who said this?", choices: ["Stephen Hawking", "Albert Einstein", "Donald Trump", "Isaac Asimov"], answer: 0 },
        { question: "Which Greek philosopher pondered the idea that tools could work on their own?", choices: ["Aristotle", "Pythagoras", "Claudius Ptolemy", "Demis Roussos"], answer: 0 }
      ],
      niveau_4: [
        { question: "What concept describes an AI capable of surpassing human intelligence?", choices: ["The Technological Singularity", "Machine Learning", "Alien Intelligence", "God"], answer: 0 },
        { question: "Which of these consumes the MOST energy on average?", choices: ["Transferring a 1 GB file via CFT", "Reading 50 web pages", "Asking an AI a question", "Sending 10 emails"], answer: 0 },
        { question: "Which country was the first to create a Ministry of AI in 2017?", choices: ["The United Arab Emirates", "The United States", "Portugal", "The Vatican"], answer: 0 },
        { question: "What nickname is given to the phenomenon where AI invents facts with absolute confidence?", choices: ["Hallucination", "Toxic confidence", "Intern syndrome", "Professor bias"], answer: 0 }
      ]
    },
    sel_ou_poivre: [
      "Ketchup was once sold as medicine. — SALT (True)",
      "The Big Mac was invented in France. — PEPPER (False, Pennsylvania 1967)",
      "French fries are more popular than burgers in the USA. — SALT (True)",
      "Japan offers Kit-Kat burgers. — SALT (True)",
      "A hamburger must contain ham. — PEPPER (False, from Hamburg)",
      "France is McDonald's 2nd biggest market worldwide. — SALT (True)",
      "Burger King opened before McDonald's. — PEPPER (False, McD 1940 vs BK 1954)",
      "There is an official hamburger emoji. — SALT (True)",
      "Nuggets were invented in the 1950s. — PEPPER (False, 1963)",
      "The word mayonnaise comes from Mainz in Germany. — PEPPER (False, Mahón in Spain)",
      "An American eats on average 3 burgers per week. — SALT (True)",
      "The record for the biggest burger weighs over a ton. — SALT (True)",
      "Coca-Cola was originally green. — PEPPER (False, urban myth)",
      "A gherkin is actually a small cucumber. — SALT (True)",
      "The word 'restaurant' has Italian origins. — PEPPER (False, from French 'restaurer')"
    ],
    menus: {
      "🍔 Menu  Y'a t'il un Copilot dans l'avion ?": [
        "Who created Copilot?",
        "What other Franco-American company also develops an app called Copilot?",
        "When a plane follows a route perfectly without ever complaining or asking 'are we there yet?', what system does that?",
        "What is the name of the co-driver of the most famous rally driver Sébastien Loeb? Here's a hint riddle: My first is the name of a former CFT QA member who retired, my second is the name of a Romanian colleague from Support, my whole is the name we're looking for",
        "Which famous basketball player plays the co-pilot in the movie Airplane!?"
      ],
      "🌶️ Menu  ChatGpt ou Vache j'ai rôté?": [
        "What gas does a cow emit?",
        "When ChatGPT 'digests' billions of texts to produce an answer (a bit like a cow), what is this learning process called?",
        "Between a cow producing methane and an AI consuming energy, what scientific concept measures their overall environmental impact?",
        "Roemheld Syndrome affects people who accumulate a lot of gas in their stomach with rather involuntary consequences – what do we call those who master these outputs and even consider it an art?",
        "True or false: researchers have developed an AI capable of listening to flatulence and detecting cancers"
      ],
      "🧀 Menu J'aime bien les | (pipes) de Claude": [
        "When Claude chains several processes one after another, what is this concept called in computing?",
        "In the town of Saint-Claude, known for its specialty, a good pipe starts with a well-chosen wood… Which one?",
        "Madame Claude was well known in the 1980s, long before Claude AI or even Cloudia – what was one of her specialties?",
        "In computing, what is a well-placed pipe used for?",
        "Saint-Claude pipes are famous worldwide… but in which French region is this legendary town?"
      ],
      "🍟 Menu IA ou Y A PAS -  y a t il une IA présente dans ces films ?": [
        "Blade Runner",
        "Alien",
        "2001: A Space Odyssey",
        "Christine",
        "Predator"
      ],
      "🥤 Menu Rien à battre de l'IA, je suis éco-irresponsable": [
        "Do I drive a Tesla or a Renault 21 Diesel Turbo?",
        "What is the best way to travel to buy bread 200 meters away?",
        "In which month of the year do I prefer to eat strawberries?",
        "What is the best way to use air conditioning?",
        "What is the right home temperature in winter when it's freezing outside?"
      ]
    },
    addition: [
      "What animal is on the Lacoste logo? — A crocodile",
      "How many players in a football (soccer) team? — 11",
      "What is the capital of Spain? — Madrid",
      "How many sides does a hexagon have? — 6",
      "What is the largest ocean? — The Pacific",
      "In what year did man walk on the Moon? — 1969",
      "What gas do we breathe? — Oxygen",
      "How many teeth does an adult have? — 32",
      "What planet is nicknamed the red planet? — Mars",
      "What is the longest river in the world? — The Nile",
      "How many continents are there? — 7",
      "Which instrument has 88 keys? — The piano",
      "What is the currency of Japan? — The yen",
      "How many legs does a spider have? — 8",
      "Which country is shaped like a boot? — Italy"
    ],
    burger_de_la_mort: [
      { question: "Name 5 ingredients of a Big Mac from top to bottom.", answer: "Bun, lettuce, cheese, patty, onions, pickles, sauce, bun, patty, lettuce, cheese, sauce, bun", timer: 30 },
      { question: "Name 7 different fast-food chains.", answer: "McDonald's, Burger King, KFC, Quick, Five Guys, Subway, Wendy's, Taco Bell...", timer: 20 },
      { question: "Name as many cheeses as possible.", answer: "Cheddar, Emmental, Raclette, Comté, Mozzarella, Blue Cheese, Gouda, Brie...", timer: 30 },
      { question: "Name 6 different burger toppings.", answer: "Lettuce, tomato, onion, pickles, bacon, cheese, jalapeño, avocado...", timer: 25 },
      { question: "Name 5 different burger sauces.", answer: "Ketchup, mustard, mayo, barbecue, sriracha, béarnaise, burger sauce, aioli...", timer: 20 },
      { question: "Name 4 countries known for their bread+meat street food.", answer: "USA (burger), Turkey (kebab), Mexico (tacos), Greece (gyros)...", timer: 20 }
    ]
  }
};
