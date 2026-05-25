/**
 * Game images — add files under src/assets/images/
 *
 * Παιχνίδι 1: custom image-*.jpg + sdg4/6/7/13.jpg (επίπεδο 1 & εκπαίδευση)
 * Παιχνίδι 2: sdg2-2.jpg, sdg10-2.jpg, sdg13-2.jpg
 */

/** @param {number} sdgId @param {1 | 2} [game=1] */
export function sdgImageKey(sdgId, game = 1) {
  return game === 2 ? `sdg${sdgId}-2` : `sdg${sdgId}`;
}

export const IMAGE_MAP = {
  // Παιχνίδι 1 — default action photos (όπου δεν υπάρχει image-*)
  sdg4: 'sdg4.jpg',
  sdg6: 'sdg6.jpg',
  sdg7: 'sdg7.jpg',
  sdg13: 'sdg13.jpg',

  // Παιχνίδι 1 — custom action scenes
  'image-2': 'image-2.jpg',
  'image-3': 'image-3.jpg',
  'image-4': 'image-4.jpg',
  'image-5': 'image-5.jpg',
  'image-6': 'image-6.jpg',

  // Παιχνίδι 2 — σκηνές
  'sdg2-2': 'sdg2-2.jpg',
  'sdg10-2': 'sdg10-2.jpg',
  'sdg13-2': 'sdg13-2.jpg',

  // Menu
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
