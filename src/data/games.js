import { SDG_MAP } from './sdgs';

export const GAME_WEIGHT = 100 / 3;

export const APP_COPY = {
  welcomeTitle: 'Παίζουμε για τον Πλανήτη!',
  welcomeSubtitle: 'Μάθε για τη βιωσιμότητα μέσα από μικρά παιχνίδια',
  startButton: 'Ξεκίνα',
  instructionsButton: 'Οδηγίες',
  menuTitle: 'Διάλεξε παιχνίδι',
  home: 'Αρχική',
  replay: 'Παίξε ξανά',
  check: 'Παράδοση',
  retryHint: 'Έχεις ακόμα 1 προσπάθεια.',
  continue: 'Συνέχεια',
  tryAgain: 'Δοκίμασε ξανά',
  correct: 'Σωστό!',
  wrong: 'Λάθος!',
  good: 'Καλό για τον πλανήτη',
  bad: 'Όχι καλό για τον πλανήτη',
  playAgain: 'Παίξε ξανά',
  finalTitle: 'Μπράβο!',
  finalSubtitle: 'Ολοκλήρωσες όλα τα παιχνίδια!',
};

export const GAME_IDS = ['connectSDG', 'matchSDG', 'ecoSpeed'];

export const MENU_GAMES = [
  {
    id: 'connectSDG',
    title: 'Σύνδεσε τον SDG με τη δράση',
    subtitle: 'Σύνδεσε κάθε στόχο με τη σωστή δράση',
    illustration: 'connect',
    color: '#2d9f4f',
  },
  {
    id: 'matchSDG',
    title: 'Ποιος SDG ταιριάζει;',
    subtitle: 'Διάλεξε τον σωστό στόχο από την εικόνα',
    illustration: 'match',
    color: '#1a8fc4',
  },
  {
    id: 'ecoSpeed',
    title: 'Eco Speed Challenge',
    subtitle: 'Γρήγορες αποφάσεις για τον πλανήτη',
    illustration: 'speed',
    color: '#e6a817',
  },
];

/** Score contribution for one game (0 – 33.33…) */
export function scoreForGame(correct, total) {
  if (!total) return 0;
  return (correct / total) * GAME_WEIGHT;
}

export function roundTotalScore(rawScore) {
  return Math.min(100, Math.round(rawScore / 10) * 10);
}

export function getBadge(roundedScore) {
  if (roundedScore >= 80) {
    return { id: 'hero', label: 'Eco Hero', icon: 'hero' };
  }
  if (roundedScore >= 40) {
    return { id: 'protector', label: 'Planet Protector', icon: 'protector' };
  }
  return { id: 'explorer', label: 'Eco Explorer', icon: 'explorer' };
}

export function sumGameScores(scores) {
  return GAME_IDS.reduce((sum, id) => sum + (scores[id] ?? 0), 0);
}

// —— Game 1: Connect SDG → Action ——
export const CONNECT_GAME = {
  id: 'connectSDG',
  pairs: [
    {
      sdgId: 13,
      actionId: 'plant-trees',
      actionText: 'Φυτεύουμε δέντρα και βοηθάμε το κλίμα.',
      illustration: 'planting-tree',
      feedbackCorrect: 'Σωστά! Τα δέντρα βοηθούν το κλίμα.',
      feedbackWrong: 'Αυτός ο στόχος σχετίζεται με το κλίμα και τα δέντρα.',
    },
    {
      sdgId: 7,
      actionId: 'lights-off',
      actionText: 'Σβήνουμε τα φώτα όταν δεν τα χρειαζόμαστε.',
      illustration: 'lights-off',
      feedbackCorrect: 'Σωστά! Εξοικονομούμε ενέργεια.',
      feedbackWrong: 'Σκέψου ενέργεια και φώτα.',
    },
    {
      sdgId: 6,
      actionId: 'close-tap',
      actionText: 'Κλείνουμε τη βρύση για να προστατεύουμε το νερό.',
      illustration: 'save-water-tap',
      feedbackCorrect: 'Σωστά! Το νερό είναι πολύτιμο.',
      feedbackWrong: 'Σκέψου προστασία του νερού.',
    },
  ],
};

// —— Game 2: Match SDG to scene ——
export const MATCH_GAME = {
  id: 'matchSDG',
  scenes: [
    {
      id: 1,
      illustration: 'planting-tree',
      label: 'Παιδιά φυτεύουν και ποτίζουν δέντρα',
      correctSdgIds: [13, 15],
      optionSdgIds: [3, 6, 11, 13, 14, 15],
      feedbackCorrect: 'Μπράβο! Τα δέντρα σχετίζονται με το κλίμα και τη ζωή στη στεριά.',
      feedbackWrong: 'Δοκίμασε ξανά! Σκέψου κλίμα και φύση στη στεριά.',
    },
    {
      id: 2,
      illustration: 'cycling-kids',
      label: 'Παιδιά πηγαίνουν με ποδήλατο',
      correctSdgIds: [11, 3],
      optionSdgIds: [3, 7, 11, 13, 14, 15],
      feedbackCorrect: 'Σωστά! Το ποδήλατο βοηθά την υγεία και τις βιώσιμες πόλεις.',
      feedbackWrong: 'Σκέψου υγεία και βιώσιμες μετακινήσεις.',
    },
    {
      id: 3,
      illustration: 'beach-cleanup',
      label: 'Παιδιά καθαρίζουν την παραλία',
      correctSdgIds: [14],
      optionSdgIds: [6, 7, 11, 13, 14, 15],
      feedbackCorrect: 'Τέλεια! Η καθαρή παραλία σχετίζεται με τη ζωή στο νερό.',
      feedbackWrong: 'Η θάλασσα σχετίζεται με το SDG για τη ζωή στο νερό.',
    },
  ],
};

export function matchSelectionIsCorrect(selected, correct) {
  if (selected.length !== correct.length) return false;
  const a = [...selected].sort((x, y) => x - y);
  const b = [...correct].sort((x, y) => x - y);
  return a.every((v, i) => v === b[i]);
}

// —— Game 3: Eco Speed ——
export const ECO_SPEED_GAME = {
  id: 'ecoSpeed',
  durationSeconds: 120,
  items: [
    { id: 1, label: 'Επαναχρησιμοποιούμενο παγούρι', illustration: 'reusable-bottle', isGood: true },
    { id: 2, label: 'Σκουπίδια στην παραλία', illustration: 'beach-trash', isGood: false },
    { id: 3, label: 'Σβηστό φως', illustration: 'lights-off', isGood: true },
    { id: 4, label: 'Πλαστικά στη θάλασσα', illustration: 'ocean-plastic', isGood: false },
    { id: 5, label: 'Ποδήλατο', illustration: 'bicycle', isGood: true },
    { id: 6, label: 'Βρύση που τρέχει άσκοπα', illustration: 'running-tap', isGood: false },
    { id: 7, label: 'Παιδιά φυτεύουν δέντρο', illustration: 'planting-tree', isGood: true },
    { id: 8, label: 'Καπνός από αυτοκίνητα', illustration: 'car-pollution', isGood: false },
  ],
};

export const INSTRUCTIONS = [
  {
    title: 'Πώς παίζεις',
    lines: [
      'Διάλεξε ένα από τα 3 παιχνίδια.',
      'Κάθε παιχνίδι δίνει πόντους για το τελικό σκορ.',
      'Ολοκλήρωσε και τα 3 για το μεγάλο βραβείο!',
    ],
  },
  {
    title: 'Σύνδεσε τον SDG',
    lines: [
      'Πάτα έναν SDG αριστερά.',
      'Μετά πάτα τη σωστή δράση δεξιά.',
      'Πάτα «Παράδοση» όταν τελειώσεις.',
      'Σε λάθος απάντηση έχεις 1 προσπάθεια ακόμα.',
    ],
  },
  {
    title: 'Ποιος SDG ταιριάζει;',
    lines: [
      'Κοίτα την εικόνα.',
      'Διάλεξε όλους τους σωστούς SDG.',
      'Χωρίς επιπλέον επιλογές!',
      'Πάτα «Παράδοση» — σε λάθος έχεις 1 προσπάθεια ακόμα.',
    ],
  },
  {
    title: 'Eco Speed Challenge',
    lines: [
      '2 λεπτά!',
      'Απόφασε γρήγορα: καλό ή όχι για τον πλανήτη.',
      'Σε λάθος απάντηση έχεις 1 προσπάθεια ακόμα.',
      'Όσο πιο γρήγορα, τόσο καλύτερα!',
    ],
  },
];
