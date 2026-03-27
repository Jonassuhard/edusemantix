import { useState, useEffect } from 'react'

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Message pools per trigger
const MESSAGES = {
  foundIn3: [
    "T'es un robot ou quoi ? 🤖",
    "3 essais ? T'as lu le code source avoue 💻",
    "Ça c'est du speedrun 🏎️",
    "Einstein a quitté le chat 🧠",
    "Même Google il met plus de temps 🔍",
  ],
  foundIn5: [
    "Génie. Pur génie. Ou triche. 🧐",
    "5 essais, c'est chirurgical 🔬",
    "T'as un sixième sens ou quoi ? ✨",
    "Le mot tremblait en te voyant arriver 😤",
    "Impressionnant, je note ton nom 📝",
  ],
  foundIn10: [
    "Pas mal du tout, respect 👏",
    "10 essais, propre et net 🧹",
    "T'es chaud là, bien joué 🎯",
    "Efficace. T'embauches quand ? 💼",
    "En dessous de 10, c'est l'élite 👑",
  ],
  foundIn20: [
    "GG bien joué ! 🎯",
    "20 essais, c'est honnête ! 🤝",
    "Bien joué, t'as assuré 💪",
    "Solide performance, on valide ✅",
    "Le mot a résisté mais t'as gagné 🏆",
  ],
  foundOver100: [
    "100+ essais mais t'as jamais lâché. Guerrier. 💪",
    "La définition de la persévérance c'est toi 🫡",
    "Tu lâches rien hein ? Respect absolu 🦁",
    "C'était un marathon, pas un sprint 🏃‍♂️",
    "Obstination niveau over 9000 📈",
  ],
  foundOver50: [
    "La patience paie toujours 😮‍💨",
    "50+ essais, t'as souffert mais t'es là 🏅",
    "Le chemin était long mais la victoire est douce 🍯",
    "T'as vidé le dictionnaire avant de trouver 📖",
    "Bien joué ! Maintenant va boire un café ☕",
  ],
  foundEduservices: [
    "Tu connais trop bien le bureau 😂",
    "Eduservices n'a plus de secrets pour toi 🏢",
    "RH va te donner une prime pour ça 💰",
    "T'aurais pas lu le CLAUDE.md par hasard ? 📄",
    "Expert vie de bureau certifié 🪪",
  ],
  grandChelem: [
    "LE GRAND CHELEM ! T'es chaud patate 👑🔥",
    "3/3 ! T'es officiellement imbattable 🏆🏆🏆",
    "Triple combo ! Quelqu'un appelle les pompiers 🚒",
    "Hat-trick sémantique, c'est beau 🎩✨",
    "OK là c'est plus du jeu, c'est de l'art 🎨",
  ],
  firstGuessHot: [
    "Premier mot et déjà chaud ? Tu triches pas toi ça va ? 👀",
    "Premier essai dans le top 100... suspect 🕵️",
    "Coup de chance ou coup de génie ? 🎲",
    "T'as rêvé du mot cette nuit ? 💤",
    "Début en fanfare ! 🎺",
  ],
  rank999: [
    "C'EST CHAUD BOUILLANT ! T'y es presque 🫠",
    "Rang 999 ! Le mot est JUSTE LÀ 🔥🔥🔥",
    "Tu le frôles ! Un synonyme et c'est bon 💨",
    "SI PROCHE. Creuse dans cette direction ! ⛏️",
    "999/1000 je transpire pour toi 🥵",
  ],
  scoreNegative: [
    "T'es parti dans l'autre sens là 🧭",
    "Euh... c'est l'opposé du mot 🔄",
    "Score négatif, fallait oser 📉",
    "L'Antarctique t'envoie ses salutations 🐧",
    "Même en essayant exprès c'est dur de faire pire 😂",
    "Tu cherches le mot ou tu le fuis ? 🏃‍♂️💨",
    "Nul nul nul 📉📉📉",
    "C'est l'anti-réponse ça 🔄",
    "Le mot secret pleure de rire 😂",
    "T'as tapé au hasard avoue 🎲",
  ],
  scoreVeryNegative: [
    "MAIS C'EST L'OPPOSÉ TOTAL 🤯📉",
    "Record du score le plus bas ?? 🏆💀",
    "Nul nul nul nul NUL 📉📉📉📉📉",
    "Le mot a pris une ordonnance restrictive contre toi 📜🚫",
    "T'as fait exprès c'est pas possible 😂",
    "Impressionnant... dans le mauvais sens 🗿",
    "Anti-bingo ! Tu fais le contraire 🔄🏆",
    "For sure t'es perdu là 💯😭",
  ],
  threeNegatives: [
    "Antarctique vibes 🐧 T'as besoin d'un chocolat chaud ?",
    "3 négatifs d'affilée, tu bats des records 🏔️",
    "Température : 🧊🧊🧊 — je t'envoie une couverture",
    "Houston, on a un problème de trajectoire 🚀",
    "Le froid polaire s'installe... change de cap ! 🧊",
  ],
  fiveCold: [
    "C'est le Nord ici ❄️ Change de direction !",
    "5 froids d'affilée, faut recalculer la route 🗺️",
    "T'es perdu dans le blizzard, accroche-toi 🌨️",
    "Même un GPS ferait mieux 📍",
    "Essaie un mot COMPLÈTEMENT différent 🔀",
    "La banquise c'est par là-bas, pas par ici 🐻‍❄️",
  ],
  tenCold: [
    "T'as pas pris ta doudoune ? 🧥 Essaie un mot totalement différent",
    "10 froids... t'es gelé sur place 🥶 Change de thématique !",
    "Hypothermie sémantique détectée 🌡️ Réchauffe-toi !",
    "OK stop. Pense à un domaine COMPLÈTEMENT différent 🧠",
    "Le mot se cache ailleurs, très très ailleurs 🌍",
  ],
  firstHotAfterCold: [
    "Ça chauffe ENFIN ! T'as mangé quoi ce midi ? 🌶️",
    "De retour dans la course ! 🏁",
    "ENFIN du chaud ! Continue comme ça 🔥",
    "Le dégel est arrivé ! 🌸",
    "T'as trouvé la bonne piste, fonce ! 🎿",
    "De l'iceberg au volcan, quel comeback 🌋",
  ],
  bigScoreJump: [
    "ENFIN tu réfléchis ! 🧠💡",
    "Gros bond en avant ! T'as eu une illumination ? 💡",
    "+20 degrés d'un coup, impressionnant 📈",
    "Le cerveau vient de s'allumer 🔌",
    "Ça c'est un vrai saut quantique ⚛️",
    "De 0 à 100 réel vite 🚀",
  ],
  closeToFar: [
    "Mais pourquoi t'es reparti là-bas 😭",
    "Tu chauffais et tu repars au Pôle Nord ?! 🥶",
    "Non non non, reviens ! Tu y étais presque 😩",
    "Le mot pleure, tu l'as abandonné 😢",
    "Plot twist : tu t'éloignes du but 📖",
    "Demi-tour interdit ! 🚫",
  ],
  milestone25: [
    "25 essais, t'es échauffé maintenant 🏃",
    "25 mots, l'aventure commence vraiment 🎬",
    "Quart de centaine, ça avance ! 📊",
    "25 déjà ? Le temps passe vite quand on cherche 🕐",
  ],
  milestone50: [
    "50 essais... T'es au bureau ou tu joues ? 😏",
    "50 mots ! La moitié du dictionnaire y est passée 📚",
    "Demi-centaine atteinte, champion de la persévérance 🥈",
    "50 essais et toujours motivé ? T'es costaud 💪",
    "Ton manager va se poser des questions 🤨",
  ],
  milestone75: [
    "75... Sarah te regarde pas au moins ? 👀",
    "75 essais, tu bats le record du bureau ? 🏅",
    "Trois quarts de centaine, légende vivante 🗿",
    "75 mots, t'as essayé tous les prénoms du bureau ? 😂",
    "À ce stade c'est de l'art contemporain 🎨",
  ],
  milestone100: [
    "100 essais. Respect. Ou acharnement. Au choix. 💪",
    "CENTAINE ! 🎂 T'as mérité un gâteau",
    "100 essais, t'es entré dans la légende du jeu 🏛️",
    "Un centurion des mots, rien que ça 🗡️",
    "100 et t'abandonnes pas ? Chapeau bas 🎩",
  ],
  unknownWord: [
    "Ce mot existe pas dans mon dico 🤷",
    "Connais pas ! T'as inventé un mot ? 📝",
    "Pas dans le dictionnaire celui-là 📖",
    "Hmm, jamais entendu parler 🤔",
    "Ce mot n'est pas de ce monde 👽",
  ],
  fiveHot: [
    "You know the way 🐸",
    "T'es en feu là, le mot tremble 🔥",
    "5 chauds d'affilée, machine de guerre 💥",
    "Le thermomètre va exploser 🌡️💣",
    "T'es sur la bonne piste, fonce ! 🏎️",
  ],
}

// Easter egg messages triggered by specific words
// { text, anim } — anim maps to CSS class .egg-{anim}
const EASTER_EGGS = {
  'infirmiere': { text: "Coquinou 😏", anim: 'wiggle' },
  'infirmière': { text: "Coquinou 😏", anim: 'wiggle' },
  'docteur': { text: "Coquinou 😏", anim: 'wiggle' },
  'stethoscope': { text: "Coquinou 😏", anim: 'wiggle' },
  'glace': { text: "Ramène nous des glaçons 🧊", anim: 'snow' },
  'glacons': { text: "Ramène nous des glaçons 🧊", anim: 'snow' },
  'glaçons': { text: "Ramène nous des glaçons 🧊", anim: 'snow' },
  'froid': { text: "Ramène nous des glaçons 🧊", anim: 'snow' },
  'congélateur': { text: "Ramène nous des glaçons 🧊", anim: 'snow' },
  'mariage': { text: "C'est pour quand ? 💍", anim: 'heartbeat' },
  'fiançailles': { text: "C'est pour quand ? 💍", anim: 'heartbeat' },
  'noce': { text: "C'est pour quand ? 💍", anim: 'heartbeat' },
  'épouser': { text: "C'est pour quand ? 💍", anim: 'heartbeat' },
  'arabe': { text: "T'es raciste ou ? 🤨", anim: 'siren' },
  'noir': { text: "T'es raciste ou ? 🤨", anim: 'siren' },
  'blanc': { text: "T'es raciste ou ? 🤨", anim: 'siren' },
  'racisme': { text: "T'es raciste ou ? 🤨", anim: 'siren' },
  'drapeau': { text: "GAY! 🏳️‍🌈", anim: 'rainbow' },
  'arc-en-ciel': { text: "GAY! 🏳️‍🌈", anim: 'rainbow' },
  'joyeux': { text: "GAY! 🏳️‍🌈", anim: 'rainbow' },
  'rainbow': { text: "GAY! 🏳️‍🌈", anim: 'rainbow' },
  'fierté': { text: "GAY! 🏳️‍🌈", anim: 'rainbow' },
  'jonas': { text: "Le créateur du jeu 😛👑", anim: 'bounce' },
  'suhard': { text: "Le boss est dans la place 😎", anim: 'bounce' },
  // === COLLÈGUES EDUSERVICES ===
  'thomas': { text: "Thomas est dans la place ! 🎸", anim: 'bounce' },
  'lucie': { text: "Lucie la boss 👸✨", anim: 'heartbeat' },
  'megane': { text: "Mégane mode turbo 🏎️", anim: 'shake-gold' },
  'mégane': { text: "Mégane mode turbo 🏎️", anim: 'shake-gold' },
  'meigan': { text: "Mégane mode turbo 🏎️", anim: 'shake-gold' },
  'jade': { text: "Jade 💎 la pierre précieuse du bureau", anim: 'pop' },
  'keina': { text: "Keina dans la place ! 🌟", anim: 'bounce' },
  'noemie': { text: "Noémie la stratège 🧠", anim: 'glitch' },
  'noémie': { text: "Noémie la stratège 🧠", anim: 'glitch' },
  'joffrey': { text: "Joffrey... comme dans Game of Thrones ? 👑⚔️", anim: 'shake-gold' },
  'clementine': { text: "Oh la clémentine 🍊", anim: 'pop' },
  'clémentine': { text: "Oh la clémentine 🍊", anim: 'pop' },
  'claire': { text: "Claire comme de l'eau de roche 💧", anim: 'float' },
  'yassine': { text: "Le gardien du serveur 🔐", anim: 'glitch' },
  'michel': { text: "Michel, on touche pas au code ! 🖥️", anim: 'siren' },
  'tuer': { text: "Quintuple ⚔️", anim: 'shake-gold' },
  'tue': { text: "Quintuple ⚔️", anim: 'shake-gold' },
  'kill': { text: "Quintuple ⚔️", anim: 'shake-gold' },
  'jeu': { text: "Quintuple ⚔️", anim: 'shake-gold' },
  'lol': { text: "Quintuple ⚔️", anim: 'shake-gold' },
  'league': { text: "Quintuple ⚔️", anim: 'shake-gold' },
  'pentakill': { text: "Quintuple ⚔️", anim: 'shake-gold' },
  'tour': { text: "🛬▮▮", anim: 'plane' },
  'avion': { text: "🛬▮▮", anim: 'plane' },
  'septembre': { text: "🛬▮▮", anim: 'plane' },
  // Actu / pop culture
  'trump': { text: "Make EduSemantix Great Again 🇺🇸", anim: 'slide-politics' },
  'macron': { text: "En même temps... 🤷", anim: 'slide-politics' },
  'politique': { text: "On est pas à l'Assemblée ici 🏛️", anim: 'slide-politics' },
  'grève': { text: "C'est la France hein 🥖", anim: 'pop' },
  'métro': { text: "Métro, boulot, Semantix 🚇", anim: 'pop' },
  'ia': { text: "Je suis là aussi hein 🤖", anim: 'glitch' },
  'intelligence': { text: "Artificielle ou naturelle ? 🧠", anim: 'glitch' },
  'robot': { text: "Bip boop, je me sens visé 🤖", anim: 'glitch' },
  'chatgpt': { text: "Hé oh, c'est Claude ici ! 😤", anim: 'glitch' },
  'claude': { text: "C'est moi ! Enchanté 👋", anim: 'glitch' },
  'café': { text: "T'en veux un ? ☕", anim: 'float' },
  'lundi': { text: "Force et courage 💀", anim: 'pop' },
  'vendredi': { text: "ENFIN le weekend 🎉", anim: 'bounce' },
  'vacances': { text: "Emmène-moi avec toi 🏖️", anim: 'float' },
  'salaire': { text: "On en parle pas ici 🤫", anim: 'wiggle' },
  'patron': { text: "Chut il va t'entendre 🤫", anim: 'wiggle' },
  'pizza': { text: "Hawaïenne ou Margherita ? 🍕 (mauvaise réponse = exclusion)", anim: 'pop' },
  'bière': { text: "C'est pas encore l'heure 🍺... ou si ?", anim: 'float' },
  'apéro': { text: "Il est quelle heure ? 🍷", anim: 'float' },
  'dormir': { text: "Pas pendant le jeu ! 😴", anim: 'wiggle' },
  'ennui': { text: "Joue à EduSemantix plutôt 😏", anim: 'pop' },
  'toilettes': { text: "TMI 🚽", anim: 'pop' },
  'amour': { text: "C'est beau l'amour ❤️", anim: 'heartbeat' },
  'bisou': { text: "Pas au bureau 💋😳", anim: 'heartbeat' },
  'sarah': { text: "Elle est au courant que tu joues ? 👀", anim: 'wiggle' },
  'alternance': { text: "On est tous passés par là 📚", anim: 'pop' },
  'stage': { text: "Stagiaire un jour, stagiaire toujours ☕", anim: 'pop' },
  'réunion': { text: "La réunion qui aurait pu être un mail 📧", anim: 'slide-politics' },
  'teams': { text: "Tu veux dire la réunion de trop ? 💻", anim: 'glitch' },
  'excel': { text: "Pas de RECHERCHEV ici 📊", anim: 'glitch' },
  'powerpoint': { text: "Pas de slides, que des mots 📽️", anim: 'glitch' },
  'drupal': { text: "Jonas a des flashbacks 😱", anim: 'siren' },
  'wordpress': { text: "L'ennemi juré de Drupal 🗡️", anim: 'shake-gold' },
  'tiktok': { text: "Battle TikTok ISCOM quand ? 🎵", anim: 'bounce' },
  'instagram': { text: "Like et abonne-toi 📱", anim: 'pop' },
  'linkedin': { text: "Poste tes résultats sur LinkedIn 💼", anim: 'pop' },
  'maman': { text: "Elle serait fière de toi 🥹", anim: 'heartbeat' },
  'papa': { text: "Il serait fier de toi 🥹", anim: 'heartbeat' },
  'chat': { text: "Miaou 🐱", anim: 'bounce' },
  'chien': { text: "Ouaf 🐕", anim: 'bounce' },
  'fromage': { text: "On est en France quand même 🧀", anim: 'pop' },
  'baguette': { text: "Hon hon hon 🥖🇫🇷", anim: 'pop' },
  'croissant': { text: "Petit-déj au bureau ? 🥐", anim: 'float' },
  // === POP CULTURE & ACTU 2026 ===
  'mbappe': { text: "GOAAAT ⚽🐐", anim: 'bounce' },
  'mbappé': { text: "GOAAAT ⚽🐐", anim: 'bounce' },
  'football': { text: "SIUUUUU ⚽", anim: 'bounce' },
  'messi': { text: "D10S 🐐🇦🇷", anim: 'shake-gold' },
  'ronaldo': { text: "SIUUUUUU 🫡", anim: 'bounce' },
  'psg': { text: "Ici c'est Paris 🔴🔵", anim: 'bounce' },
  'marseille': { text: "A jamais les premiers 🤢", anim: 'wiggle' },
  'netflix': { text: "T'as pas du travail ? 🍿", anim: 'pop' },
  'spotify': { text: "🎵 C'est quoi ta top song ?", anim: 'float' },
  'tinder': { text: "Swipe right sur EduSemantix 💘", anim: 'heartbeat' },
  'uber': { text: "Le VTC du vocabulaire 🚗", anim: 'pop' },
  'mcdo': { text: "Un McFlurry et je reviens 🍦", anim: 'float' },
  'mcdonald': { text: "Ba da ba ba ba 🍟", anim: 'pop' },
  'kebab': { text: "Sauce blanche ou harissa ? 🥙", anim: 'pop' },
  'sushi': { text: "California ou Saumon ? 🍣", anim: 'float' },
  'starbucks': { text: "Un venti caramel macchiato svp ☕", anim: 'float' },
  'elon': { text: "To Mars and beyond 🚀", anim: 'plane' },
  'musk': { text: "X > Twitter, non ? 🤔", anim: 'glitch' },
  'twitter': { text: "C'est X maintenant papy 🐦", anim: 'glitch' },
  'snapchat': { text: "👻 Streaks ?", anim: 'bounce' },
  'youtube': { text: "Like & Subscribe 🔔", anim: 'pop' },
  'google': { text: "T'aurais pu googler au lieu de taper ça 🔍", anim: 'glitch' },
  'apple': { text: "Sent from my iPhone 📱", anim: 'pop' },
  'iphone': { text: "Envoyé de mon iPhone 📱", anim: 'pop' },
  'samsung': { text: "Team Android ? 🤖", anim: 'glitch' },
  'fortnite': { text: "Default dance 💃🕺", anim: 'bounce' },
  'minecraft': { text: "Creeper ? Aw man 🟩", anim: 'pop' },
  'gta': { text: "Wasted 💀", anim: 'siren' },
  'zelda': { text: "It's dangerous to go alone 🗡️", anim: 'shake-gold' },
  'mario': { text: "It's-a me! 🍄", anim: 'bounce' },
  'pokemon': { text: "Attrapez-les tous ! ⚡", anim: 'shake-gold' },
  'pikachu': { text: "Pika pika ! ⚡", anim: 'shake-gold' },
  'naruto': { text: "Believe it! 🍥", anim: 'bounce' },
  'anime': { text: "Nani?! 😱", anim: 'shake-gold' },
  'manga': { text: "On lit de droite à gauche 📖", anim: 'pop' },
  'one piece': { text: "KAIZOKU OU NI ORE WA NARU! 🏴‍☠️", anim: 'shake-gold' },
  // === MOTS DU QUOTIDIEN ===
  'argent': { text: "On en a jamais assez 💸", anim: 'shake-gold' },
  'riche': { text: "Un jour inchallah 💰", anim: 'shake-gold' },
  'pauvre': { text: "Fin de mois spotted 😭", anim: 'wiggle' },
  'faim': { text: "Midi c'est dans combien de temps ? 🍽️", anim: 'pop' },
  'manger': { text: "La vraie question du jour 🍔", anim: 'float' },
  'fatigue': { text: "ZzZzZz 😴💤", anim: 'wiggle' },
  'sommeil': { text: "5 minutes de plus... ⏰", anim: 'wiggle' },
  'réveil': { text: "Non. 🛏️", anim: 'siren' },
  'week-end': { text: "Vivement ! 🎊", anim: 'bounce' },
  'weekend': { text: "Vivement ! 🎊", anim: 'bounce' },
  'samedi': { text: "Grasse mat' méritée 😎", anim: 'float' },
  'dimanche': { text: "Le jour du Seigneur 🙏 (et du repos)", anim: 'float' },
  'mardi': { text: "Mardi c'est permis ? 🤔", anim: 'pop' },
  'mercredi': { text: "Mi-semaine, mi-motivation 📉", anim: 'wiggle' },
  'jeudi': { text: "Presque vendredi ! 🤞", anim: 'pop' },
  'soleil': { text: "Dehors au lieu de jouer ☀️", anim: 'bounce' },
  'pluie': { text: "Temps parfait pour jouer 🌧️", anim: 'snow' },
  'été': { text: "Vivement les vacances 🏖️", anim: 'float' },
  'hiver': { text: "Winter is coming ❄️", anim: 'snow' },
  'noël': { text: "HO HO HO 🎅", anim: 'bounce' },
  'noel': { text: "HO HO HO 🎅", anim: 'bounce' },
  'halloween': { text: "BOO 👻🎃", anim: 'siren' },
  'anniversaire': { text: "C'est le tien ? 🎂🎉", anim: 'bounce' },
  // === INSULTES LIGHT / PROVOC ===
  'nul': { text: "C'est toi qui l'es 😤", anim: 'wiggle' },
  'moche': { text: "Miroir miroir 🪞", anim: 'wiggle' },
  'bête': { text: "Celui qui le dit celui qui l'est 🤷", anim: 'pop' },
  'idiot': { text: "Le mot ne t'a rien fait 😢", anim: 'wiggle' },
  'con': { text: "Langage ! 🧼", anim: 'siren' },
  'merde': { text: "Oh le vilain mot 🫢", anim: 'siren' },
  'putain': { text: "Les enfants jouent aussi 👶", anim: 'siren' },
  // === RANDOM FUN ===
  'banane': { text: "🍌 Ring ring ring ring bananaphone", anim: 'bounce' },
  'ananas': { text: "Sur une pizza ? DÉBAT LANCÉ 🍍🍕", anim: 'shake-gold' },
  'patate': { text: "Purée ou frites ? 🍟", anim: 'pop' },
  'poulet': { text: "Nuggets ou blanc ? 🍗", anim: 'pop' },
  'eau': { text: "Stay hydrated 💧", anim: 'float' },
  'vin': { text: "Rouge ou blanc ? 🍷", anim: 'float' },
  'champagne': { text: "On fête quoi ? 🥂", anim: 'bounce' },
  'musique': { text: "🎵 Tourne le son !", anim: 'bounce' },
  'danse': { text: "💃🕺 Disco time", anim: 'bounce' },
  'rap': { text: "Wesh wesh 🎤", anim: 'shake-gold' },
  'chanter': { text: "La la la 🎶", anim: 'float' },
  'vacance': { text: "T'y penses déjà ? ✈️🏖️", anim: 'plane' },
  'paris': { text: "La plus belle ville du monde 🗼", anim: 'pop' },
  'france': { text: "Cocorico 🐓🇫🇷", anim: 'pop' },
  'japon': { text: "すごい ! 🇯🇵🌸", anim: 'bounce' },
  'chine': { text: "你好 🇨🇳", anim: 'pop' },
  'espagne': { text: "Olé ! 🇪🇸💃", anim: 'bounce' },
  'italie': { text: "Mamma mia 🇮🇹🤌", anim: 'pop' },
  'allemagne': { text: "Prost! 🇩🇪🍺", anim: 'float' },
  'angleterre': { text: "God save the King 🇬🇧👑", anim: 'slide-politics' },
  'bitcoin': { text: "To the moon 🚀🌙", anim: 'plane' },
  'crypto': { text: "HODL 💎🙌", anim: 'shake-gold' },
  'nft': { text: "C'est mort les NFT non ? 💀", anim: 'wiggle' },
  'tiktok': { text: "Oh no oh no oh no no no 🎵", anim: 'bounce' },
  'selfie': { text: "📸 Cheese !", anim: 'pop' },
  'gym': { text: "Do you even lift bro ? 💪", anim: 'shake-gold' },
  'sport': { text: "No pain no gain 🏋️", anim: 'bounce' },
  'courir': { text: "Run Forrest, run ! 🏃", anim: 'bounce' },
  'foot': { text: "GOOOOOAL ⚽", anim: 'shake-gold' },
  'basket': { text: "Kobe ! 🏀", anim: 'bounce' },
  'tennis': { text: "15-0 🎾", anim: 'pop' },
  'voiture': { text: "Vroum vroum 🏎️", anim: 'bounce' },
  'train': { text: "Encore en retard ? 🚄", anim: 'slide-politics' },
  'bus': { text: "T'as la carte ? 🚌", anim: 'pop' },
  'vélo': { text: "Tour de France vibes 🚴", anim: 'bounce' },
  'avenir': { text: "L'avenir appartient à ceux qui jouent à EduSemantix 🔮", anim: 'glitch' },
  'futur': { text: "Retour vers le futur ! ⚡🚗", anim: 'glitch' },
  'passé': { text: "C'est du passé, avance ! ⏩", anim: 'pop' },
  'temps': { text: "Le temps c'est de l'argent ⏰💰", anim: 'shake-gold' },
  'dieu': { text: "Il joue aussi à EduSemantix 🙏", anim: 'bounce' },
  'mort': { text: "RIP 💀⚰️", anim: 'siren' },
  'vie': { text: "La vie est belle 🌸", anim: 'heartbeat' },
  'terre': { text: "🌍 Notre seule planète (pour l'instant)", anim: 'float' },
  'espace': { text: "Houston, on a un problème 🚀", anim: 'plane' },
  'alien': { text: "👽 On n'est pas seuls", anim: 'glitch' },
  'zombie': { text: "The Walking Dead vibes 🧟", anim: 'siren' },
  'fantaisie': { text: "Final Fantasy 🗡️✨", anim: 'shake-gold' },
  'malade': { text: "Arrêt maladie incoming 🤒", anim: 'wiggle' },
  'médecin': { text: "Docteur, j'ai une addiction à EduSemantix 🏥", anim: 'wiggle' },
  'travail': { text: "Le truc qu'on fait entre deux parties 💼", anim: 'pop' },
  'boss': { text: "Final boss du vocabulaire 👹", anim: 'shake-gold' },
  'gagner': { text: "WINNING 🏆", anim: 'shake-gold' },
  'perdre': { text: "L est pas un L c'est une Leçon 📚", anim: 'wiggle' },
  'tricher': { text: "Anti-cheat activé 🛡️", anim: 'siren' },
  'aide': { text: "Débrouille-toi 😏", anim: 'wiggle' },
  'impossible': { text: "Impossible n'est pas EduSemantix 💪", anim: 'bounce' },
  'facile': { text: "GG EZ 😎", anim: 'pop' },
  'difficile': { text: "C'est ça qui est bon 🔥", anim: 'pop' },
  'abandonner': { text: "JAMAIS ! 🦁", anim: 'shake-gold' },
  'victoire': { text: "🏆 Pas encore, continue !", anim: 'bounce' },
  'champion': { text: "We are the champions 🎵👑", anim: 'shake-gold' },
  'légende': { text: "T'es une légende 🗿", anim: 'bounce' },
  'génie': { text: "Einstein serait fier 🧠", anim: 'glitch' },
  'cerveau': { text: "Utilise-le ! 🧠💡", anim: 'glitch' },
  'mot': { text: "Meta 🤯", anim: 'glitch' },
  'semantique': { text: "ULTRA META 🤯🤯🤯", anim: 'shake-gold' },
  'sémantique': { text: "ULTRA META 🤯🤯🤯", anim: 'shake-gold' },
  'cementix': { text: "C'est EduSemantix ici monsieur 😤", anim: 'siren' },
  'cemantix': { text: "C'est EduSemantix ici monsieur 😤", anim: 'siren' },
  'wordle': { text: "Mauvais jeu, t'es sur EduSemantix 😏", anim: 'wiggle' },
  'sutom': { text: "Pas mal mais EduSemantix > tout 👑", anim: 'bounce' },
  'eduservices': { text: "La maison mère 🏢", anim: 'pop' },
  'iscom': { text: "L'école de com' 📡", anim: 'pop' },
  'mydigitalschool': { text: "MDS dans la place 💻", anim: 'glitch' },
  'pigier': { text: "Coucou les voisins 👋", anim: 'pop' },
  'tunon': { text: "L'élégance à la française 🎩", anim: 'float' },
  'mbway': { text: "MBA gang 💼", anim: 'pop' },
  'studio-m': { text: "Les créatifs du groupe 🎨", anim: 'pop' },
  // === K-POP ===
  'kpop': { text: "Annyeonghaseyo ! 🇰🇷💜", anim: 'bounce' },
  'k-pop': { text: "Annyeonghaseyo ! 🇰🇷💜", anim: 'bounce' },
  'bts': { text: "Borahae 💜 ARMY dans la place", anim: 'rainbow' },
  'blackpink': { text: "BLACKPINK IN YOUR AREA 🖤💗", anim: 'shake-gold' },
  'twice': { text: "TT 🥺 OT9 forever", anim: 'heartbeat' },
  'stray': { text: "SKZ ! God's Menu 🍽️", anim: 'bounce' },
  'aespa': { text: "MY WORLD 🌐✨", anim: 'glitch' },
  'newjeans': { text: "Hype Boy 🐰", anim: 'bounce' },
  'ateez': { text: "HALAZIA ⚔️🏴‍☠️", anim: 'shake-gold' },
  'seventeen': { text: "Very Nice ! 👏", anim: 'bounce' },
  'enhypen': { text: "Given-Taken 🧛", anim: 'glitch' },
  'txt': { text: "0X1=LOVESONG 💔", anim: 'heartbeat' },
  'itzy': { text: "DALLA DALLA 💃", anim: 'bounce' },
  'lisa': { text: "LALISA 🔥 Money money", anim: 'shake-gold' },
  'jennie': { text: "SOLO 🖤", anim: 'pop' },
  'jungkook': { text: "Standing Next to You 🕺", anim: 'bounce' },
  'jimin': { text: "Like Crazy 💫", anim: 'heartbeat' },
  'coréen': { text: "사랑해 ! 🇰🇷", anim: 'bounce' },
  'corée': { text: "Hallyu wave 🌊🇰🇷", anim: 'bounce' },
  'kdrama': { text: "Oppa ! 😍", anim: 'heartbeat' },
  'doramas': { text: "Squid Game incoming 🦑", anim: 'siren' },
  // === MEMES FRANÇAIS ===
  'sur': { text: "For sure 💯", anim: 'pop' },
  'certain': { text: "Mais c'était sûr en fait 🤷", anim: 'pop' },
  'assassin': { text: "Assassino Capoutchino ☕🗡️", anim: 'ninja' },
  'café': { text: "Assassino Capoutchino ☕😏", anim: 'float' },
  'parti': { text: "ET C'EST PARTIII 🚀🎉", anim: 'bounce' },
  'commencer': { text: "Et c'est partiii ! 🏁", anim: 'bounce' },
  'bref': { text: "Bref, j'ai joué à EduSemantix 📺", anim: 'pop' },
  'quoi': { text: "Feur 🗿", anim: 'pop' },
  'ratio': { text: "Ratio + L + didn't ask 📉", anim: 'siren' },
  'seum': { text: "Le seum est réel 😤💀", anim: 'wiggle' },
  'flemme': { text: "La flemme cosmique 🌌😴", anim: 'wiggle' },
  'relou': { text: "T'es relou de taper ça 😒", anim: 'wiggle' },
  'cheh': { text: "Cheh bien fait 😂", anim: 'pop' },
  'wesh': { text: "Wesh wesh bien ou bien ? 🤙", anim: 'bounce' },
  'frère': { text: "Frérot 🤝", anim: 'pop' },
  'incroyable': { text: "INCROYAAAAABLE 🤯🔥", anim: 'shake-gold' },
  'ouf': { text: "C'est ouf frère 🤯", anim: 'bounce' },
  'chaud': { text: "C'est chaud patate 🥔🔥", anim: 'pop' },
  'grave': { text: "Trop grave en vrai 💀", anim: 'pop' },
  'tranquille': { text: "Tranquille Émile 😎✌️", anim: 'float' },
  'oklm': { text: "Au calme 😌", anim: 'float' },
  'boloss': { text: "Boloss toi-même 😤", anim: 'wiggle' },
  'bg': { text: "Beau gosse 😎✨", anim: 'bounce' },
  'miskine': { text: "Miskine le mot... 😢", anim: 'wiggle' },
  'wallah': { text: "Wallah c'est vrai ? 🤨", anim: 'pop' },
  'starfoullah': { text: "Starfoullah ce mot 😱", anim: 'siren' },
  'hein': { text: "Deux 🗿", anim: 'pop' },
  'non': { text: "Ah bah si pourtant 🤷", anim: 'wiggle' },
  'oui': { text: "Stiti 🐣", anim: 'pop' },
  'pourquoi': { text: "Pourquoi pas ? 🤔", anim: 'pop' },
  'comment': { text: "Taire 🤫", anim: 'wiggle' },
  'nice': { text: "Noice 👌", anim: 'pop' },
  'cool': { text: "Très cool très swag 😎", anim: 'pop' },
  'swag': { text: "YOLO SWAG 2012 vibes 🕶️", anim: 'bounce' },
  'goat': { text: "🐐 Greatest Of All Time", anim: 'shake-gold' },
  'slay': { text: "SLAY QUEEN 💅👑", anim: 'bounce' },
  'vibe': { text: "Vibe check ✅", anim: 'pop' },
  'sigma': { text: "Sigma grindset 🐺", anim: 'shake-gold' },
  'alpha': { text: "Patrick Bateman vibes 🪓", anim: 'siren' },
  'beta': { text: "Version bêta du joueur 🤖", anim: 'glitch' },
  'rizz': { text: "Rizz level: infinite ♾️😏", anim: 'bounce' },
  'sus': { text: "AMONG US 📮 sussy baka", anim: 'siren' },
  'among': { text: "📮 DUN DUN DUN DUN", anim: 'siren' },
  'bruh': { text: "Bruh moment 💀🗿", anim: 'pop' },
  'based': { text: "Based and redpilled 🔴", anim: 'shake-gold' },
  'cringe': { text: "Cringe detected 😬📸", anim: 'wiggle' },
  'karen': { text: "I want to speak to the manager 💇‍♀️", anim: 'siren' },
  'boomer': { text: "OK boomer 👴", anim: 'pop' },
  'zoomer': { text: "Skibidi rizz Ohio 🧠", anim: 'glitch' },
  'skibidi': { text: "Skibidi toilet 🚽🗿", anim: 'bounce' },
  'ohio': { text: "Only in Ohio 💀", anim: 'siren' },
  'gyatt': { text: "GYATT 🫣", anim: 'shake-gold' },
  'riz': { text: "Riz ou pâtes ? 🍚🍝 LE débat", anim: 'pop' },
  'pâtes': { text: "Carbonara > all 🍝", anim: 'float' },
  'poulet': { text: "Chicken wing chicken wing 🍗🎵", anim: 'bounce' },
  'chocolat': { text: "Noir > lait > blanc. Débat fermé 🍫", anim: 'pop' },
  'nutella': { text: "Direct dans le pot avec la cuillère 🥄", anim: 'float' },
  // === REFS FILMS/SÉRIES ===
  'matrix': { text: "Pilule rouge ou bleue ? 🔴🔵", anim: 'glitch' },
  'thanos': { text: "Perfectly balanced, as all things should be ♾️", anim: 'snap' },
  'batman': { text: "I'm Batman 🦇", anim: 'bat' },
  'spiderman': { text: "With great power... 🕷️🕸️", anim: 'spider' },
  'araignée': { text: "Spidey sense tingling 🕷️", anim: 'spider' },
  'avengers': { text: "AVENGERS... assemble ! 🛡️", anim: 'shield' },
  'squid': { text: "Mugunghwa kkoci pieot seumnida 🦑🔴", anim: 'siren' },
  'shrek': { text: "Shrek is love, Shrek is life 🟢", anim: 'bounce' },
  'disney': { text: "Hakuna Matata 🦁", anim: 'bounce' },
  'star': { text: "May the Force be with you ⭐", anim: 'force' },
  'jedi': { text: "The Force is strong with this one ⚔️", anim: 'force' },
  'harry': { text: "Yer a wizard Harry 🧙‍♂️⚡", anim: 'lightning' },
  'pikachu': { text: "PIKACHUUUU ⚡⚡⚡", anim: 'lightning' },
  'thor': { text: "THUNDER ! ⚡🔨", anim: 'lightning' },
  'foudre': { text: "⚡⚡⚡ BZZZZT", anim: 'lightning' },
  'éclair': { text: "Flash ! ⚡", anim: 'lightning' },
  'superman': { text: "It's a bird, it's a plane... 🦸‍♂️", anim: 'plane' },
  'hulk': { text: "HULK SMASH ! 💚👊", anim: 'shake-gold' },
  'ironman': { text: "I am Iron Man 🤖❤️", anim: 'glitch' },
  'wolverine': { text: "SNIKT ! 🐺🔪", anim: 'shake-gold' },
  'deadpool': { text: "Maximum effort ! 🫡💀", anim: 'bounce' },
  'captain': { text: "I can do this all day 🛡️", anim: 'shield' },
  'bouclier': { text: "Vibranium vibes 🛡️", anim: 'shield' },
  'seigneur': { text: "One ring to rule them all 💍🌋", anim: 'shake-gold' },
  'rapide': { text: "I am speed ⚡🏎️ — Flash McQueen", anim: 'bounce' },
  'famille': { text: "Family 🫡 — Dom Toretto", anim: 'shake-gold' },
  // === NEW ANIMATIONS MAPPING ===
  // 💚 Matrix
  'matrix': { text: "Pilule rouge ou bleue ? 🔴🔵", anim: 'matrix' },
  'neo': { text: "There is no spoon 🥄", anim: 'matrix' },
  'hacker': { text: "Hack the planet 💚💻", anim: 'matrix' },
  'pirate': { text: "YARR ! 🏴‍☠️🦜", anim: 'shake-gold' },
  'code': { text: "01100010 01101001 01110000 💻", anim: 'matrix' },
  'programmeur': { text: "It works on my machine 🤷‍♂️", anim: 'matrix' },
  'développeur': { text: "Stack Overflow to the rescue 💻", anim: 'matrix' },
  'bug': { text: "It's not a bug, it's a feature 🐛", anim: 'glitch' },
  // 🎆 Firework
  'fête': { text: "C'EST LA FÊTE ! 🎆🎉", anim: 'firework' },
  'fete': { text: "C'EST LA FÊTE ! 🎆🎉", anim: 'firework' },
  'célébrer': { text: "PARTY TIME ! 🎆🥳", anim: 'firework' },
  'bravo': { text: "BRAVO ! Standing ovation 👏🎆", anim: 'firework' },
  'gagné': { text: "VICTOIRE ! 🎆🏆", anim: 'firework' },
  'victoire': { text: "🎆 VICTOIRE ROYALE !", anim: 'firework' },
  'champagne': { text: "Pop pop pop ! 🍾🎆", anim: 'firework' },
  'nouvel-an': { text: "BONNE ANNÉE ! 🎆🥂", anim: 'firework' },
  'anniversaire': { text: "JOYEUX ANNIVERSAIRE ! 🎂🎆", anim: 'firework' },
  // 🌪️ Tornado
  'tornade': { text: "ATTENTION TORNADE ! 🌪️🏠🐄", anim: 'tornado' },
  'ouragan': { text: "Ouragan catégorie 5 ! 🌀💨", anim: 'tornado' },
  'tempête': { text: "La tempête arrive ! 🌪️⚡", anim: 'tornado' },
  'cyclone': { text: "ALERTE CYCLONE 🌀🚨", anim: 'tornado' },
  'vent': { text: "Ça souffle fort par ici 💨🌪️", anim: 'tornado' },
  'typhon': { text: "TYPHON EN APPROCHE 🌊🌪️", anim: 'tornado' },
  'chaos': { text: "C'EST LE CHAOS ! 🌪️💥🔥", anim: 'tornado' },
  'bordel': { text: "Quel bordel ! 🌪️😂", anim: 'tornado' },
  'désordre': { text: "Ton bureau en ce moment 🌪️📎", anim: 'tornado' },
  // 🌊 Ocean
  'mer': { text: "La mer, le soleil... 🌊☀️", anim: 'ocean' },
  'océan': { text: "20 000 lieues sous les mers 🌊🐙", anim: 'ocean' },
  'ocean': { text: "Sous l'océan, sous l'océan 🎵🌊", anim: 'ocean' },
  'plage': { text: "Bruit des vagues 🏖️🌊", anim: 'ocean' },
  'poisson': { text: "Nemo ? C'est toi ? 🐠", anim: 'ocean' },
  'requin': { text: "DUN DUN... DUN DUN... 🦈", anim: 'ocean' },
  'baleine': { text: "🐋 Free Willy vibes", anim: 'ocean' },
  'nager': { text: "Plouf ! 🏊🌊", anim: 'ocean' },
  'surf': { text: "Surf's up dude 🏄🌊", anim: 'ocean' },
  'bateau': { text: "Un jour j'aurai un yacht 🚢💰", anim: 'ocean' },
  'sous-marin': { text: "We all live in a yellow submarine 🎵🟡", anim: 'ocean' },
  'aquarium': { text: "Bloup bloup 🐡🫧", anim: 'ocean' },
  // 🚀 Rocket
  'fusée': { text: "3... 2... 1... DÉCOLLAGE ! 🚀", anim: 'rocket' },
  'fusee': { text: "3... 2... 1... DÉCOLLAGE ! 🚀", anim: 'rocket' },
  'espace': { text: "Houston, on a un problème 🚀", anim: 'rocket' },
  'nasa': { text: "That's one small step for man 🌙", anim: 'rocket' },
  'lune': { text: "To the moon ! 🌙🚀", anim: 'rocket' },
  'mars': { text: "Elon nous attend là-bas 🔴🚀", anim: 'rocket' },
  'étoile': { text: "Vers l'infini et au-delà ! ⭐🚀", anim: 'rocket' },
  'astronaute': { text: "Ground control to Major Tom 🧑‍🚀", anim: 'rocket' },
  'spacex': { text: "Ready for launch 🚀🔥", anim: 'rocket' },
  'satellite': { text: "En orbite ! 🛰️", anim: 'rocket' },
  'ovni': { text: "Les aliens sont parmi nous 🛸", anim: 'rocket' },
  // 🪩 Disco
  'disco': { text: "Stayin' alive 🪩🕺", anim: 'disco' },
  'danse': { text: "💃🕺 DISCO TIME !", anim: 'disco' },
  'danser': { text: "On va danser jusqu'au bout de la nuit 🪩", anim: 'disco' },
  'musique': { text: "🎵 DJ, envoie le son !", anim: 'disco' },
  'club': { text: "En boîte un mardi soir ? 🪩🤔", anim: 'disco' },
  'soirée': { text: "C'est la soirée ! 🪩🥳", anim: 'disco' },
  'fêter': { text: "ON FÊTE ! 🪩🎉", anim: 'disco' },
  'karaoké': { text: "My way... 🎤🪩", anim: 'disco' },
  'karaoke': { text: "Don't stop believin' 🎤🪩", anim: 'disco' },
  // 💥 Explosion
  'bombe': { text: "💣 BOOOOOM !", anim: 'explosion' },
  'explosion': { text: "💥 KABOOM !", anim: 'explosion' },
  'exploser': { text: "EXPLOSIONNNNN 💥🔥", anim: 'explosion' },
  'dynamite': { text: "🧨 BTS ou TNT ?", anim: 'explosion' },
  'nucléaire': { text: "☢️ Code rouge !", anim: 'explosion' },
  'guerre': { text: "⚔️💥 Pas de guerre ici, que des mots", anim: 'explosion' },
  'détruire': { text: "DESTRUCTION 💥🔥", anim: 'explosion' },
  'crash': { text: "💥 Le serveur a survécu cette fois", anim: 'explosion' },
  'boom': { text: "BOOM SHAKALAKA 💥🏀", anim: 'explosion' },
  'michael': { text: "THAT'S WHAT SHE SAID 💥😂", anim: 'explosion' },
  // 🌀 Portal
  'portail': { text: "Le portail s'ouvre... 🌀✨", anim: 'portal' },
  'portal': { text: "The cake is a lie 🎂🌀", anim: 'portal' },
  'dimension': { text: "Bienvenue dans une autre dimension 🌀", anim: 'portal' },
  'multivers': { text: "Multiverse of Madness 🌀🔮", anim: 'portal' },
  'strange': { text: "Doctor Strange vibes 🌀🧙", anim: 'portal' },
  'magie': { text: "Abracadabra 🌀🪄", anim: 'portal' },
  'sorcier': { text: "Expelliarmus ! 🌀🪄", anim: 'portal' },
  'magicien': { text: "Un magicien n'arrive jamais en retard 🧙🌀", anim: 'portal' },
  'mystère': { text: "La zone mystère 🌀🔮", anim: 'portal' },
  'voyage': { text: "Bon voyage ! 🌀✈️", anim: 'portal' },
  'téléportation': { text: "BEAM ME UP SCOTTY 🌀⭐", anim: 'portal' },
  'wormhole': { text: "Interstellar vibes 🌀🕳️", anim: 'portal' },
  'interstellar': { text: "MURPH ! 🌀😭", anim: 'portal' },
  'trou': { text: "Trou noir detected 🕳️🌀", anim: 'portal' },
  // 🌊 Tsunami
  'tsunami': { text: "ALERTE TSUNAMI ! Sauve qui peut 🌊💨", anim: 'tsunami' },
  'vague': { text: "La vague arrive ! 🌊🏄", anim: 'tsunami' },
  'inondation': { text: "Inondation en cours ! Sortez les bouées 🌊🛟", anim: 'tsunami' },
  'déluge': { text: "Le déluge ! Noé, t'es où ? 🌊🚢", anim: 'tsunami' },
  // 🌋 Volcano
  'volcan': { text: "ERUPTION IMMINENTE ! 🌋🔥", anim: 'volcano' },
  'éruption': { text: "Le volcan se réveille ! 🌋💥", anim: 'volcano' },
  'lave': { text: "LE SOL EST DE LA LAVE ! 🌋🦶🔥", anim: 'volcano' },
  'magma': { text: "Température : 1200°C 🌋🌡️", anim: 'volcano' },
  // 🕳️ BlackHole
  'trou-noir': { text: "Le trou noir t'aspire... 🕳️✨", anim: 'blackhole' },
  'galaxie': { text: "Une galaxie entière aspirée 🌌🕳️", anim: 'blackhole' },
  'cosmos': { text: "Lost in the cosmos 🌌🕳️", anim: 'blackhole' },
  'infini': { text: "L'infini et au-delà... vers le néant 🕳️♾️", anim: 'blackhole' },
  'néant': { text: "Le néant t'appelle 🕳️💀", anim: 'blackhole' },
  // 🦋 Butterfly
  'papillon': { text: "L'effet papillon 🦋✨", anim: 'butterfly' },
  'printemps': { text: "Le printemps est là ! 🦋🌸", anim: 'butterfly' },
  'fleur': { text: "Les fleurs s'ouvrent 🌺🦋", anim: 'butterfly' },
  'jardin': { text: "Bienvenue au jardin 🦋🌻", anim: 'butterfly' },
  'nature': { text: "Mère Nature approuve 🦋🌿", anim: 'butterfly' },
  // 🎰 Casino
  'casino': { text: "JACKPOT ! 🎰💰", anim: 'casino' },
  'chance': { text: "La chance sourit aux audacieux 🎰🍀", anim: 'casino' },
  'jackpot': { text: "JACKPOOOOT 777 ! 🎰🤑", anim: 'casino' },
  'loterie': { text: "Et le numéro gagnant est... 🎰🎫", anim: 'casino' },
  'poker': { text: "All-in 🎰♠️♥️", anim: 'casino' },
  'dé': { text: "Snake eyes ! 🎰🎲", anim: 'casino' },
  // 🥷 Ninja
  'ninja': { text: "Omae wa mou shindeiru 🥷💨", anim: 'ninja' },
  'samouraï': { text: "Honneur et discipline 🥷⚔️", anim: 'ninja' },
  'katana': { text: "La lame chante dans le vent 🥷🗡️", anim: 'ninja' },
  'ombre': { text: "L'ombre frappe 🥷🌑", anim: 'ninja' },
  // Additional mappings for existing animations
  'noyade': { text: "Au secours ! 🌊😱", anim: 'ocean' },
  'piscine': { text: "Plouf ! 🏊🌊", anim: 'ocean' },
  'météore': { text: "IMPACT IMMINENT ! ☄️💥", anim: 'explosion' },
  'comète': { text: "L'étoile filante passe ! ☄️🚀", anim: 'rocket' },
  'planète': { text: "Planète en orbite 🪐🚀", anim: 'rocket' },
  'laser': { text: "PEW PEW PEW 🔫✨", anim: 'force' },
  'sabre': { text: "Le sabre laser s'allume ⚔️✨", anim: 'force' },
  'champignon': { text: "Champignon atomique 🍄☁️💥", anim: 'explosion' },
  'feu': { text: "AU FEU ! 🔥🚒", anim: 'explosion' },
  'incendie': { text: "Appelez les pompiers ! 🔥🚒", anim: 'explosion' },
  'dragon': { text: "DRACARYS ! 🐉🔥", anim: 'explosion' },
}

function getFunMessage(guesses, lastResult, round, foundPerRound) {
  if (!lastResult) return null

  // Easter egg check — always takes priority for specific words
  if (lastResult.word) {
    const wordRaw = lastResult.word.toLowerCase().trim()
    const wordNorm = wordRaw.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const egg = EASTER_EGGS[wordRaw] || EASTER_EGGS[wordNorm]
    if (egg) {
      return { text: egg.text, type: 'easter', anim: egg.anim }
    }
  }

  // Unknown word
  if (lastResult.known === false) {
    return { text: pick(MESSAGES.unknownWord), type: 'cold' }
  }

  const guessCount = guesses.length
  const score = lastResult.score
  const rank = lastResult.rank
  const emoji = lastResult.emoji

  // Sort by guessNumber for streak detection (guesses array is sorted by score)
  const chronological = [...guesses].sort((a, b) => a.guessNumber - b.guessNumber)

  // 5 hot words in a row
  if (guessCount >= 5) {
    const last5 = chronological.slice(-5).map(g => g.emoji)
    if (last5.every(e => e === '🥵' || e === '🔥' || e === '😱')) {
      return { text: pick(MESSAGES.fiveHot), type: 'fire' }
    }
  }

  // BINGO messages
  if (lastResult.found) {
    // Check grand chelem first
    const allFound = foundPerRound && foundPerRound.every(Boolean)
    if (allFound) return { text: pick(MESSAGES.grandChelem), type: 'gold' }

    if (guessCount <= 3) return { text: pick(MESSAGES.foundIn3), type: 'gold' }
    if (guessCount <= 5) return { text: pick(MESSAGES.foundIn5), type: 'gold' }
    if (guessCount <= 10) return { text: pick(MESSAGES.foundIn10), type: 'gold' }
    if (guessCount <= 20) return { text: pick(MESSAGES.foundIn20), type: 'gold' }
    if (guessCount >= 100) return { text: pick(MESSAGES.foundOver100), type: 'gold' }
    if (guessCount >= 50) return { text: pick(MESSAGES.foundOver50), type: 'gold' }

    // Found Eduservices word (round 1)
    if (round === 1) return { text: pick(MESSAGES.foundEduservices), type: 'gold' }

    return { text: "Bien joué ! 🎉", type: 'gold' }
  }

  // First guess of the session and already hot
  if (guessCount === 1 && rank && rank >= 900) {
    return { text: pick(MESSAGES.firstGuessHot), type: 'warm' }
  }

  // Rank 999 — closest possible
  if (rank === 999) {
    return { text: pick(MESSAGES.rank999), type: 'fire' }
  }

  // Score very negative (< -10)
  if (score < -10) {
    return { text: pick(MESSAGES.scoreVeryNegative), type: 'cold' }
  }

  // Score negative (< -5)
  if (score < -5) {
    return { text: pick(MESSAGES.scoreNegative), type: 'cold' }
  }

  // 3 negative scores in a row
  if (guessCount >= 3) {
    const last3 = chronological.slice(-3).map(g => g.score)
    if (last3.every(s => s < 0)) {
      return { text: pick(MESSAGES.threeNegatives), type: 'cold' }
    }
  }

  // 10 cold in a row
  if (guessCount >= 10) {
    const last10 = chronological.slice(-10).map(g => g.emoji)
    if (last10.every(e => e === '🥶' || e === '🧊')) {
      return { text: pick(MESSAGES.tenCold), type: 'cold' }
    }
  }

  // 5 cold in a row
  if (guessCount >= 5) {
    const last5 = chronological.slice(-5).map(g => g.emoji)
    if (last5.every(e => e === '🥶' || e === '🧊')) {
      return { text: pick(MESSAGES.fiveCold), type: 'cold' }
    }
  }

  // First hot word after cold streak
  if ((emoji === '🥵' || emoji === '🔥' || emoji === '😱') && guessCount >= 5) {
    const prevGuesses = chronological.slice(-6, -1)
    const prevCold = prevGuesses.filter(g => g.emoji === '🥶' || g.emoji === '🧊').length
    if (prevCold >= 3) {
      return { text: pick(MESSAGES.firstHotAfterCold), type: 'warm' }
    }
  }

  // Big score jump (>20 points improvement)
  if (guessCount >= 2) {
    const prevBest = Math.max(...chronological.slice(0, -1).map(g => g.score))
    if (score > prevBest + 20) {
      return { text: pick(MESSAGES.bigScoreJump), type: 'warm' }
    }
  }

  // Close then far away
  if (guessCount >= 2) {
    const prev = chronological[chronological.length - 2]
    if (prev && prev.rank && prev.rank >= 900 && (!rank || rank < 100)) {
      return { text: pick(MESSAGES.closeToFar), type: 'cold' }
    }
  }

  // Milestone messages
  if (guessCount === 25) return { text: pick(MESSAGES.milestone25), type: 'neutral' }
  if (guessCount === 50) return { text: pick(MESSAGES.milestone50), type: 'neutral' }
  if (guessCount === 75) return { text: pick(MESSAGES.milestone75), type: 'neutral' }
  if (guessCount === 100) return { text: pick(MESSAGES.milestone100), type: 'neutral' }

  return null
}

const TYPE_STYLES = {
  gold: 'bg-temp-bingo/20 border-temp-bingo/30 text-temp-bingo',
  fire: 'bg-temp-hot/20 border-temp-hot/30 text-temp-hot',
  warm: 'bg-temp-warm/20 border-temp-warm/30 text-temp-warm',
  cold: 'bg-temp-ice/20 border-temp-ice/30 text-temp-ice',
  neutral: 'bg-accent-violet/20 border-accent-violet/30 text-accent-violet',
  easter: 'bg-accent-violet/20 border-accent-violet/40 text-white',
}

export default function FunMessage({ guesses, lastResult, round, foundPerRound, onEasterEgg, onBingo }) {
  const [message, setMessage] = useState(null)
  const [visible, setVisible] = useState(false)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    const msg = getFunMessage(guesses, lastResult, round, foundPerRound)
    if (msg) {
      setMessage(msg)
      setVisible(true)
      setAnimKey(k => k + 1)
      // Trigger overlay animation for easter eggs
      if (msg.anim && onEasterEgg) onEasterEgg(msg.anim)
      // Trigger confetti on bingo
      if (lastResult?.found && onBingo) onBingo()
      const duration = msg.anim === 'plane' || msg.anim === 'snow' ? 3000 : 4000
      const timer = setTimeout(() => setVisible(false), duration)
      return () => clearTimeout(timer)
    } else if (lastResult?.found && onBingo) {
      // Still show confetti even without a fun message
      onBingo()
    }
  }, [lastResult])

  if (!visible || !message) return null

  const animClass = message.anim ? `egg-${message.anim}` : ''

  return (
    <div
      key={animKey}
      className={`
        rounded-xl px-4 py-2.5 text-sm font-medium text-center border
        animate-slide-up transition-opacity
        ${TYPE_STYLES[message.type] || TYPE_STYLES.neutral}
        ${animClass}
      `}
    >
      {message.text}
    </div>
  )
}
