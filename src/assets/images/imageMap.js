/**
 * Game images — add files under src/assets/images/
 *
 * Παιχνίδι 1 (Σύνδεσε): sdg1.jpg … sdg17.jpg
 * Παιχνίδι 2 (Ταιριάζει):  sdg1-2.jpg … sdg17-2.jpg
 *
 * Supported: .jpg .jpeg .png .webp
 */

/** @param {number} sdgId @param {1 | 2} [game=1] */
export function sdgImageKey(sdgId, game = 1) {
  return game === 2 ? `sdg${sdgId}-2` : `sdg${sdgId}`;
}

const sdgEntries = (suffix = '') =>
  Object.fromEntries(
    Array.from({ length: 17 }, (_, i) => {
      const id = i + 1;
      const key = suffix ? `sdg${id}-2` : `sdg${id}`;
      return [key, `${key}.jpg`];
    })
  );

export const IMAGE_MAP = {
  ...sdgEntries(),
  ...sdgEntries('-2'),

  // Menu (προαιρετικά)
  'menu-connect': 'menu-connect.jpg',
  'menu-match': 'menu-match.jpg',
  'menu-eco-speed': 'menu-eco-speed.jpg',

  // Παιχνίδι 3 — Eco Speed
  'eco-reusable-bottle': 'eco-reusable-bottle.jpg',
  'eco-beach-trash': 'eco-beach-trash.jpg',
  'eco-lights-off': 'eco-lights-off.jpg',
  'eco-ocean-plastic': 'eco-ocean-plastic.jpg',
  'eco-bicycle': 'eco-bicycle.jpg',
  'eco-running-tap': 'eco-running-tap.jpg',
  'eco-planting-tree': 'eco-planting-tree.jpg',
  'eco-car-pollution': 'eco-car-pollution.jpg',
};
