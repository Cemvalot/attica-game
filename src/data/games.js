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
  check: 'Υποβολή',
  continue: 'Συνέχεια',
  correct: 'Σωστό!',
  wrong: 'Λάθος!',
  good: 'Καλό για τον πλανήτη',
  bad: 'Όχι καλό για τον πλανήτη',
  finalTitle: 'Μπράβο!',
  finalSubtitle: 'Ολοκλήρωσες όλα τα παιχνίδια!',
};

export const GAME_IDS = ['connectSDG', 'matchSDG', 'ecoSpeed'];

export const MENU_GAMES = [
  {
    id: 'connectSDG',
    title: 'Σύνδεσε τον SDG με τη δράση',
    subtitle: 'Σύνδεσε κάθε στόχο με τη σωστή δράση',
    image: 'menu-connect',
    color: '#2d9f4f',
  },
  {
    id: 'matchSDG',
    title: 'Ποιος SDG ταιριάζει;',
    subtitle: 'Διάλεξε τον σωστό στόχο από την εικόνα',
    image: 'menu-match',
    color: '#1a8fc4',
  },
  {
    id: 'ecoSpeed',
    title: 'Eco Speed Challenge',
    subtitle: 'Γρήγορες αποφάσεις για τον πλανήτη',
    image: 'menu-eco-speed',
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

/** Game 2: one scene per level → share of 33% split evenly across levels. */
export function scoreForMatchLevel(correct, levelCount) {
  if (!levelCount) return 0;
  return (correct / 1) * (SCORE_PER_GAME / levelCount);
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
          feedbackCorrect: 'Σωστά! Τα δέντρα βοηθούν το κλίμα.',
          feedbackWrong: 'Αυτός ο στόχος σχετίζεται με το κλίμα και τα δέντρα.',
        },
        {
          sdgId: 7,
          actionId: 'lights-off',
          actionText: 'Σβήνουμε τα φώτα όταν δεν τα χρειαζόμαστε.',
          feedbackCorrect: 'Σωστά! Εξοικονομούμε ενέργεια.',
          feedbackWrong: 'Σκέψου ενέργεια και φώτα.',
        },
        {
          sdgId: 6,
          actionId: 'close-tap',
          actionText: 'Κλείνουμε τη βρύση για να προστατεύουμε το νερό.',
          feedbackCorrect: 'Σωστά! Το νερό είναι πολύτιμο.',
          feedbackWrong: 'Σκέψου προστασία του νερού.',
        },
      ],
    },
    {
      id: 2,
      title: 'Επίπεδο 2',
      subtitle: 'Ισότητα, συμπερίληψη & ειρήνη',
      pairs: [
        {
          sdgId: 5,
          actionId: 'equal-rights-play',
          actionText: 'Ίσα δικαιώματα',
          actionDetail: 'Αγόρια και κορίτσια παίζουν μαζί',
          feedbackCorrect:
            'Σωστά! Το να παίζουν αγόρια και κορίτσια μαζί σχετίζεται με την ισότητα των φύλων.',
          feedbackWrong: 'Σκέψου ίσα δικαιώματα για αγόρια και κορίτσια.',
        },
        {
          sdgId: 2,
          actionId: 'all-equal-together',
          actionText: 'Όλοι είμαστε ίσοι',
          actionDetail: 'Παιδιά διαφορετικών χωρών παίζουν μαζί',
          feedbackCorrect:
            'Σωστά! Όταν όλοι παίζουν μαζί χωρίς διακρίσεις, σχετίζεται με τη μηδενική πείνα — φαγητό και ευκαιρίες για όλους.',
          feedbackWrong:
            'Σκέψου μηδενική πείνα και ίσες ευκαιρίες για όλα τα παιδιά.',
        },
        {
          sdgId: 16,
          actionId: 'live-peacefully',
          actionText: 'Ζούμε ειρηνικά',
          actionDetail: 'Παιδιά δίνουν τα χέρια',
          feedbackCorrect:
            'Σωστά! Όταν δίνουμε τα χέρια μας, σχετίζεται με ειρήνη, δικαιοσύνη και ισχυρούς θεσμούς.',
          feedbackWrong: 'Σκέψου ειρήνη και δικαιοσύνη.',
        },
      ],
    },
    {
      id: 3,
      title: 'Επίπεδο 3',
      subtitle: 'Υγεία, κατανάλωση & εκπαίδευση',
      pairs: [
        {
          sdgId: 3,
          actionId: 'healthy-sports',
          actionText: 'Ζούμε υγιεινά',
          feedbackCorrect:
            'Σωστά! Ο αθλητισμός και η άσκηση σχετίζονται με την καλή υγεία και ευημερία.',
          feedbackWrong: 'Σκέψου υγεία και ευημερία.',
        },
        {
          sdgId: 12,
          actionId: 'no-food-waste',
          actionText: 'Δεν σπαταλάμε φαγητό',
          feedbackCorrect:
            'Σωστά! Όταν τρώμε όλο το φαγητό μας, σπαταλάμε λιγότερο — υπεύθυνη κατανάλωση.',
          feedbackWrong: 'Σκέψου υπεύθυνη κατανάλωση και λιγότερη σπατάλη.',
        },
        {
          sdgId: 4,
          actionId: 'education-for-all',
          actionText: 'Η εκπαίδευση για όλους',
          feedbackCorrect:
            'Σωστά! Το διάβασμα και η μάθηση σχετίζονται με την ποιοτική εκπαίδευση.',
          feedbackWrong: 'Σκέψου ποιοτική εκπαίδευση για όλους.',
        },
      ],
    },
  ],
};

// —— Game 2: Match SDG to whole scene (3 levels × 1 scene) ——
export const MATCH_GAME = {
  id: 'matchSDG',
  levelsPerGame: 3,
  levels: [
    {
      id: 1,
      title: 'Επίπεδο 1',
      subtitle: 'Πράσινο σχολείο',
      scene: {
        imageSdgId: 13,
        label: 'Ένα πιο πράσινο σχολείο',
        sceneHint:
          'Παιδιά έρχονται στο σχολείο με ποδήλατα, το κτήριο χρησιμοποιεί ηλιακή ενέργεια και υπάρχουν χώροι ανακύκλωσης και πράσινοι κήποι για την προστασία του περιβάλλοντος.',
        correctSdgIds: [4, 7, 13],
        optionSdgIds: [2, 4, 7, 13, 14, 16],
        feedbackCorrect:
          'Μπράβο! Το πράσινο σχολείο σχετίζεται με την εκπαίδευση, την καθαρή ενέργεια και τη δράση για το κλίμα.',
        feedbackWrong:
          'Σκέψου ποιοτική εκπαίδευση, φθηνή και καθαρή ενέργεια και δράση για το κλίμα.',
      },
    },
    {
      id: 2,
      title: 'Επίπεδο 2',
      subtitle: 'Υγιεινή διατροφή',
      scene: {
        imageSdgId: 2,
        label: 'Υγιεινό φαγητό για όλους',
        sceneHint:
          'Τα παιδιά μοιράζονται υγιεινά γεύματα, φρούτα και λαχανικά στο σχολείο, μαθαίνοντας τη σημασία της σωστής διατροφής, της συνεργασίας και της φροντίδας της υγείας τους.',
        correctSdgIds: [2, 3, 4],
        optionSdgIds: [2, 3, 4, 7, 13, 15],
        feedbackCorrect:
          'Σωστά! Η υγιεινή διατροφή συνδέεται με τη μηδενική πείνα, την καλή υγεία και την ποιοτική εκπαίδευση.',
        feedbackWrong:
          'Σκέψου μηδενική πείνα, καλή υγεία και ποιοτική εκπαίδευση.',
      },
    },
    {
      id: 3,
      title: 'Επίπεδο 3',
      subtitle: 'Συνεργασία & ισότητα',
      scene: {
        imageSdgId: 10,
        label: "Φίλοι απ' όλο τον κόσμο",
        sceneHint:
          'Παιδιά από διαφορετικές χώρες και κουλτούρες παίζουν, συνεργάζονται και χτίζουν μαζί, μαθαίνοντας τη σημασία της φιλίας, της ισότητας και του σεβασμού στη διαφορετικότητα.',
        correctSdgIds: [5, 10, 16],
        optionSdgIds: [5, 7, 10, 13, 14, 16],
        feedbackCorrect:
          'Τέλεια! Η φιλία και η συνεργασία συνδέονται με την ισότητα των φύλων, τις λιγότερες ανισότητες και την ειρήνη.',
        feedbackWrong:
          'Σκέψου ισότητα των φύλων, λιγότερες ανισότητες και ειρήνη.',
      },
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
    { id: 1, label: 'Επαναχρησιμοποιούμενο παγούρι', image: 'eco-reusable-bottle', isGood: true },
    { id: 2, label: 'Σκουπίδια στην παραλία', image: 'eco-beach-trash', isGood: false },
    { id: 3, label: 'Σβηστό φως', image: 'eco-lights-off', isGood: true },
    { id: 4, label: 'Πλαστικά στη θάλασσα', image: 'eco-ocean-plastic', isGood: false },
    { id: 5, label: 'Ποδήλατο', image: 'eco-bicycle', isGood: true },
    { id: 6, label: 'Βρύση που τρέχει άσκοπα', image: 'eco-running-tap', isGood: false },
    { id: 7, label: 'Παιδιά φυτεύουν δέντρο', image: 'eco-planting-tree', isGood: true },
    { id: 8, label: 'Καπνός από αυτοκίνητα', image: 'eco-car-pollution', isGood: false },
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
      'Σε λάθος συνεχίζεις στο επόμενο επίπεδο.',
    ],
  },
  {
    title: 'Ποιος SDG ταιριάζει;',
    lines: [
      '3 επίπεδα — κάθε σκηνή είναι ολόκληρη εικόνα (όχι μία δράση).',
      'Κοίτα την εικόνα και διάλεξε όλους τους σωστούς SDG.',
      'Χωρίς επιπλέον επιλογές!',
      'Πάτα «Υποβολή» — σε λάθος προχωράς στην επόμενη σκηνή.',
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
