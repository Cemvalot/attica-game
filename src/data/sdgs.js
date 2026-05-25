// Official UN SDG tiles — icons in src/assets/sdgs/sdg-{id}.svg.png
export const SDGS = [
  { id: 3, short: 'SDG 3', title: 'Καλή Υγεία και Ευημερία', color: '#4CAF50' },
  { id: 6, short: 'SDG 6', title: 'Καθαρό Νερό και Αποχέτευση', color: '#26BDE2' },
  { id: 7, short: 'SDG 7', title: 'Καθαρή και Προσιτή Ενέργεια', color: '#FCC30B' },
  { id: 11, short: 'SDG 11', title: 'Βιώσιμες Πόλεις και Κοινότητες', color: '#FD6925' },
  { id: 13, short: 'SDG 13', title: 'Δράση για το Κλίμα', color: '#3F7E44' },
  { id: 14, short: 'SDG 14', title: 'Ζωή στο Νερό', color: '#0A97D9' },
  { id: 15, short: 'SDG 15', title: 'Ζωή στη Στεριά', color: '#56C02B' },
];

export const SDG_MAP = Object.fromEntries(SDGS.map((s) => [s.id, s]));

export function getSdg(id) {
  return SDG_MAP[id];
}
