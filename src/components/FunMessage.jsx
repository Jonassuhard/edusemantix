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
const EASTER_EGGS = {
  'infirmiere': "Coquinou 😏",
  'infirmière': "Coquinou 😏",
  'docteur': "Coquinou 😏",
  'stethoscope': "Coquinou 😏",
  'glace': "Ramène nous des glaçons 🧊",
  'glacons': "Ramène nous des glaçons 🧊",
  'glaçons': "Ramène nous des glaçons 🧊",
  'froid': "Ramène nous des glaçons 🧊",
  'congélateur': "Ramène nous des glaçons 🧊",
  'mariage': "C'est pour quand ? 💍",
  'fiançailles': "C'est pour quand ? 💍",
  'noce': "C'est pour quand ? 💍",
  'épouser': "C'est pour quand ? 💍",
  'arabe': "T'es raciste ou ? 🤨",
  'noir': "T'es raciste ou ? 🤨",
  'blanc': "T'es raciste ou ? 🤨",
  'racisme': "T'es raciste ou ? 🤨",
  'drapeau': "GAY! 🏳️‍🌈",
  'arc-en-ciel': "GAY! 🏳️‍🌈",
  'joyeux': "GAY! 🏳️‍🌈",
  'rainbow': "GAY! 🏳️‍🌈",
  'fierté': "GAY! 🏳️‍🌈",
  'jonas': "😛",
  'suhard': "Le boss est dans la place 😎",
  'tuer': "Quintuple ⚔️",
  'tue': "Quintuple ⚔️",
  'kill': "Quintuple ⚔️",
  'jeu': "Quintuple ⚔️",
  'lol': "Quintuple ⚔️",
  'league': "Quintuple ⚔️",
  'pentakill': "Quintuple ⚔️",
  'tour': "🛬▮▮",
  'avion': "🛬▮▮",
  'septembre': "🛬▮▮",
  // Actu / pop culture
  'trump': "Make EduSemantix Great Again 🇺🇸",
  'macron': "En même temps... 🤷",
  'politique': "On est pas à l'Assemblée ici 🏛️",
  'grève': "C'est la France hein 🥖",
  'métro': "Métro, boulot, Semantix 🚇",
  'ia': "Je suis là aussi hein 🤖",
  'intelligence': "Artificielle ou naturelle ? 🧠",
  'robot': "Bip boop, je me sens visé 🤖",
  'chatgpt': "Hé oh, c'est Claude ici ! 😤",
  'claude': "C'est moi ! Enchanté 👋",
  'café': "T'en veux un ? ☕",
  'lundi': "Force et courage 💀",
  'vendredi': "ENFIN le weekend 🎉",
  'vacances': "Emmène-moi avec toi 🏖️",
  'salaire': "On en parle pas ici 🤫",
  'patron': "Chut il va t'entendre 🤫",
  'pizza': "Hawaïenne ou Margherita ? 🍕 (mauvaise réponse = exclusion)",
  'bière': "C'est pas encore l'heure 🍺... ou si ?",
  'apéro': "Il est quelle heure ? 🍷",
  'dormir': "Pas pendant le jeu ! 😴",
  'ennui': "Joue à EduSemantix plutôt 😏",
  'toilettes': "TMI 🚽",
  'amour': "C'est beau l'amour ❤️",
  'bisou': "Pas au bureau 💋😳",
  'sarah': "Elle est au courant que tu joues ? 👀",
  'alternance': "On est tous passés par là 📚",
  'stage': "Stagiaire un jour, stagiaire toujours ☕",
  'réunion': "La réunion qui aurait pu être un mail 📧",
  'teams': "Tu veux dire la réunion de trop ? 💻",
  'excel': "Pas de RECHERCHEV ici 📊",
  'powerpoint': "Pas de slides, que des mots 📽️",
  'drupal': "Jonas a des flashbacks 😱",
  'wordpress': "L'ennemi juré de Drupal 🗡️",
  'tiktok': "Battle TikTok ISCOM quand ? 🎵",
  'instagram': "Like et abonne-toi 📱",
  'linkedin': "Poste tes résultats sur LinkedIn 💼",
  'maman': "Elle serait fière de toi 🥹",
  'papa': "Il serait fier de toi 🥹",
  'chat': "Miaou 🐱",
  'chien': "Ouaf 🐕",
  'fromage': "On est en France quand même 🧀",
  'baguette': "Hon hon hon 🥖🇫🇷",
  'croissant': "Petit-déj au bureau ? 🥐",
}

function getFunMessage(guesses, lastResult, round, foundPerRound) {
  if (!lastResult) return null

  // Easter egg check — always takes priority for specific words
  if (lastResult.word) {
    const wordRaw = lastResult.word.toLowerCase().trim()
    const wordNorm = wordRaw.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const easterEgg = EASTER_EGGS[wordRaw] || EASTER_EGGS[wordNorm]
    if (easterEgg) {
      return { text: easterEgg, type: 'neutral' }
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

  // 5 hot words in a row
  if (guessCount >= 5) {
    const last5 = guesses.slice(-5).map(g => g.emoji)
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

  // Score negative (< -5)
  if (score < -5) {
    return { text: pick(MESSAGES.scoreNegative), type: 'cold' }
  }

  // 3 negative scores in a row
  if (guessCount >= 3) {
    const last3 = guesses.slice(-3).map(g => g.score)
    if (last3.every(s => s < 0)) {
      return { text: pick(MESSAGES.threeNegatives), type: 'cold' }
    }
  }

  // 10 cold in a row
  if (guessCount >= 10) {
    const last10 = guesses.slice(-10).map(g => g.emoji)
    if (last10.every(e => e === '🥶' || e === '🧊')) {
      return { text: pick(MESSAGES.tenCold), type: 'cold' }
    }
  }

  // 5 cold in a row
  if (guessCount >= 5) {
    const last5 = guesses.slice(-5).map(g => g.emoji)
    if (last5.every(e => e === '🥶' || e === '🧊')) {
      return { text: pick(MESSAGES.fiveCold), type: 'cold' }
    }
  }

  // First hot word after cold streak
  if ((emoji === '🥵' || emoji === '🔥' || emoji === '😱') && guessCount >= 5) {
    const prevGuesses = guesses.slice(-6, -1)
    const prevCold = prevGuesses.filter(g => g.emoji === '🥶' || g.emoji === '🧊').length
    if (prevCold >= 3) {
      return { text: pick(MESSAGES.firstHotAfterCold), type: 'warm' }
    }
  }

  // Big score jump (>20 points improvement)
  if (guessCount >= 2) {
    const prevBest = Math.max(...guesses.slice(0, -1).map(g => g.score))
    if (score > prevBest + 20) {
      return { text: pick(MESSAGES.bigScoreJump), type: 'warm' }
    }
  }

  // Close then far away
  if (guessCount >= 2) {
    const prev = guesses[guesses.length - 2]
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
  neutral: 'bg-accent-violet/20 border-accent-violet/30 text-accent-violet'
}

export default function FunMessage({ guesses, lastResult, round, foundPerRound }) {
  const [message, setMessage] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const msg = getFunMessage(guesses, lastResult, round, foundPerRound)
    if (msg) {
      setMessage(msg)
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [lastResult])

  if (!visible || !message) return null

  return (
    <div className={`
      rounded-xl px-4 py-2.5 text-sm font-medium text-center border
      animate-slide-up transition-opacity
      ${TYPE_STYLES[message.type] || TYPE_STYLES.neutral}
    `}>
      {message.text}
    </div>
  )
}
