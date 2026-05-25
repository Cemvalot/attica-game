import { SDG_MAP } from './sdgs';

export const SCORE_PER_QUESTION = 11;
export const SCORE_PER_GAME = 33;
/** @deprecated use SCORE_PER_GAME — kept for menu score display */
export const GAME_WEIGHT = SCORE_PER_GAME;

export const BRAND_NAME = 'Attica Green Expo';

export const APP_COPY = {
  welcomeTitle: 'Παίζουμε για τον Πλανήτη!',
  welcomeSubtitle: 'Μάθε για τη βιωσιμότητα μέσα από μικρά παιχνίδια',
  startButton: 'Ξεκίνα',
  instructionsButton: 'Οδηγίες',
  menuTitle: 'Διάλεξε παιχνίδι',
  home: 'Αρχική',
  replay: 'Παίξε ξανά',
  check: 'Υποβολή',
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

/** Games 1 & 2: share of correct answers → up to 33% total. */
export function scoreForGame(correct, total) {
  if (!total) return 0;
  return (correct / total) * SCORE_PER_GAME;
}

/** Game 1: one completed level → up to 11% (3 connections per level). */
export function scoreForConnectLevel(correct, total = 3) {
  if (!total) return 0;
  return (correct / total) * SCORE_PER_QUESTION;
}

/** Game 3: speed challenge contributes up to 33% of total. */
export function scoreForEcoSpeed(correct, total) {
  if (!total) return 0;
  return (correct / total) * SCORE_PER_GAME;
}

export function roundTotalScore(rawScore) {
  return Math.min(100, Math.round(rawScore / 10) * 10);
}

export function getBadge(roundedScore) {
  if (roundedScore >= 75) {
    return { id: 'hero', label: 'Eco Hero', icon: 'hero' };
  }
  if (roundedScore >= 50) {
    return { id: 'guardian', label: 'Green Guardian', icon: 'guardian' };
  }
  return { id: 'enthusiast', label: 'Eco Enthusiast', icon: 'enthusiast' };
}

export function sumGameScores(scores) {
  return GAME_IDS.reduce((sum, id) => sum + (scores[id] ?? 0), 0);
}

// —— Game 1: Connect SDG → Action (3 levels × 3 pairs, 11% each) ——
export const CONNECT_GAME = {
  id: 'connectSDG',
  pairsPerLevel: 3,
  levels: [
    {
      id: 1,
      title: 'Επίπεδο 1',
      subtitle: 'Κλίμα, ενέργεια & νερό',
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
    },
    {
      id: 2,
      title: 'Επίπεδο 2',
      subtitle: 'Πόλη, υγεία & θάλασσα',
      pairs: [
        {
          sdgId: 11,
          actionId: 'city-cycling',
          actionText: 'Πηγαίνουμε με ποδήλατο για βιώσιμες μετακινήσεις.',
          illustration: 'cycling-kids',
          feedbackCorrect: 'Σωστά! Το ποδήλατο βοηθά τις βιώσιμες πόλεις.',
          feedbackWrong: 'Σκέψου βιώσιμες μετακινήσεις στην πόλη.',
        },
        {
          sdgId: 3,
          actionId: 'health-bike',
          actionText: 'Κινούμαστε με ποδήλατο για καλή υγεία.',
          illustration: 'bicycle',
          feedbackCorrect: 'Σωστά! Η άσκηση βοηθά την υγεία μας.',
          feedbackWrong: 'Σκέψου υγεία και ευημερία.',
        },
        {
          sdgId: 14,
          actionId: 'beach-cleanup',
          actionText: 'Καθαρίζουμε την παραλία από σκουπίδια.',
          illustration: 'beach-cleanup',
          feedbackCorrect: 'Σωστά! Η καθαρή θάλασσα προστατεύει τη ζωή στο νερό.',
          feedbackWrong: 'Σκέψου προστασία της θάλασσας και των ακτών.',
        },
      ],
    },
    {
      id: 3,
      title: 'Επίπεδο 3',
      subtitle: 'Φύση, μεταφορές & κατανάλωση',
      pairs: [
        {
          sdgId: 15,
          actionId: 'protect-forest',
          actionText: 'Προστατεύουμε τα δέντρα και τα δάση.',
          illustration: 'forest',
          feedbackCorrect: 'Σωστά! Τα δάση σχετίζονται με τη ζωή στη στεριά.',
          feedbackWrong: 'Σκέψου προστασία της φύσης στη στεριά.',
        },
        {
          sdgId: 9,
          actionId: 'city-bus',
          actionText: 'Παίρνουμε το λεωφορείο αντί για ιδιωτικό αυτοκίνητο.',
          illustration: 'city-bus',
          feedbackCorrect: 'Σωστά! Οι συλλογικές μεταφορές μειώνουν τους ρύπους.',
          feedbackWrong: 'Σκέψου βιώσιμες μεταφορές και υποδομές.',
        },
        {
          sdgId: 12,
          actionId: 'reusable-bottle',
          actionText: 'Χρησιμοποιούμε επαναχρησιμοποιήσιμο μπουκάλι νερού.',
          illustration: 'reusable-bottle',
          feedbackCorrect: 'Σωστά! Λιγότερα πλαστικά, υπεύθυνη κατανάλωση.',
          feedbackWrong: 'Σκέψου υπεύθυνη κατανάλωση και παραγωγή.',
        },
      ],
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
      feedbackWrong: 'Η θάλασσα σχετίζεται με τον στόχο «Ζωή στο νερό».',
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
      'Ολοκλήρωσε και τα 3 για να δεις το σήμα σου!',
    ],
  },
  {
    title: 'Σύνδεσε τον SDG',
    lines: [
      'Πάτα έναν SDG πάνω.',
      'Μετά πάτα τη σωστή δράση κάτω.',
      '3 επίπεδα — σε κάθε ένα σύνδεσε 3 SDG με 3 δράσεις (11% το καθένα).',
      'Πάτα «Υποβολή» όταν τελειώσεις.',
      'Σε λάθος απάντηση έχεις 1 προσπάθεια ακόμα.',
    ],
  },
  {
    title: 'Ποιος SDG ταιριάζει;',
    lines: [
      'Κοίτα την εικόνα.',
      'Διάλεξε όλους τους σωστούς SDG.',
      'Χωρίς επιπλέον επιλογές!',
      'Πάτα «Υποβολή» — σε λάθος έχεις 1 προσπάθεια ακόμα.',
    ],
  },
  {
    title: 'Eco Speed Challenge',
    lines: [
      '2 λεπτά!',
      'Απόφασε γρήγορα: καλό ή όχι για τον πλανήτη.',
      'Σε λάθος απάντηση προχωράς στην επόμενη κάρτα.',
      'Όσο πιο γρήγορα, τόσο καλύτερα!',
    ],
  },
];
