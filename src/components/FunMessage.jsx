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
  'jonas': { text: "😛", anim: 'bounce' },
  'suhard': { text: "Le boss est dans la place 😎", anim: 'bounce' },
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
  neutral: 'bg-accent-violet/20 border-accent-violet/30 text-accent-violet',
  easter: 'bg-accent-violet/20 border-accent-violet/40 text-white',
}

export default function FunMessage({ guesses, lastResult, round, foundPerRound }) {
  const [message, setMessage] = useState(null)
  const [visible, setVisible] = useState(false)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    const msg = getFunMessage(guesses, lastResult, round, foundPerRound)
    if (msg) {
      setMessage(msg)
      setVisible(true)
      setAnimKey(k => k + 1) // Force re-trigger animation
      const duration = msg.anim === 'plane' || msg.anim === 'snow' ? 3000 : 4000
      const timer = setTimeout(() => setVisible(false), duration)
      return () => clearTimeout(timer)
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
