// Official Greek SDG tiles — icons in src/assets/sdgs/sdgs-{id}.svg
export const SDGS = [
  { id: 1, short: 'SDG 1', title: 'Μηδενική φτώχεια', color: '#E5243B' },
  { id: 2, short: 'SDG 2', title: 'Μηδενική πείνα', color: '#DDA63A' },
  { id: 3, short: 'SDG 3', title: 'Καλή υγεία και ευημερία', color: '#4C9F38' },
  { id: 4, short: 'SDG 4', title: 'Ποιοτική Εκπαίδευση', color: '#C5192D' },
  { id: 5, short: 'SDG 5', title: 'Ισότητα των φύλων', color: '#FF3A21' },
  { id: 6, short: 'SDG 6', title: 'Καθαρό νερό και αποχέτευση', color: '#26BDE2' },
  { id: 7, short: 'SDG 7', title: 'Φτηνή και καθαρή ενέργεια', color: '#FCC30B' },
  { id: 8, short: 'SDG 8', title: 'Αξιοπρεπής εργασία και οικονομική ανάπτυξη', color: '#A21942' },
  { id: 9, short: 'SDG 9', title: 'Βιομηχανία καινοτομία και υποδομές', color: '#FD6925' },
  { id: 10, short: 'SDG 10', title: 'Λιγότερες ανισότητες', color: '#DD1367' },
  { id: 11, short: 'SDG 11', title: 'Βιώσιμες πόλεις και κοινότητες', color: '#FF8C0A' },
  { id: 12, short: 'SDG 12', title: 'Υπεύθυνη κατανάλωση και παραγωγή', color: '#BF8B2E' },
  { id: 13, short: 'SDG 13', title: 'Δράση για το κλίμα', color: '#3F7E44' },
  { id: 14, short: 'SDG 14', title: 'Ζωή στο νερό', color: '#0A97D9' },
  { id: 15, short: 'SDG 15', title: 'Ζωή στη στεριά', color: '#56C02B' },
  { id: 16, short: 'SDG 16', title: 'Ειρήνη, Δικαιοσύνη και ισχυροί Θεσμοί', color: '#00689D' },
  { id: 17, short: 'SDG 17', title: 'Συνεργασία για τους στόχους', color: '#19486A' },
];

export const SDG_MAP = Object.fromEntries(SDGS.map((s) => [s.id, s]));

export function getSdg(id) {
  return SDG_MAP[id];
}
