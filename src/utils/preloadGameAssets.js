import { preloadGameImage } from '../assets/images/GameImage';
import { sdgImageKey } from '../assets/images/imageMap';
import {
  CONNECT_GAME,
  MATCH_GAME,
  ECO_SPEED_GAME,
  MENU_GAMES,
} from '../data/games';

const chunkLoaders = {
  connectSDG: () => import('../components/games/GameConnectSDG'),
  matchSDG: () => import('../components/games/GameMatchSDG'),
  ecoSpeed: () => import('../components/games/GameEcoSpeed'),
};

function imageKeysForGame(gameId) {
  switch (gameId) {
    case 'connectSDG':
      return CONNECT_GAME.levels.flatMap((level) =>
        level.pairs.map((pair) => pair.image ?? sdgImageKey(pair.sdgId))
      );
    case 'matchSDG':
      return MATCH_GAME.levels.map((level) => sdgImageKey(level.scene.imageSdgId, 2));
    case 'ecoSpeed':
      return ECO_SPEED_GAME.items.map((item) => item.image);
    default:
      return [];
  }
}

export function preloadMenuImages() {
  return Promise.all(MENU_GAMES.map((g) => preloadGameImage(g.image)));
}

export function preloadGameChunk(gameId) {
  const load = chunkLoaders[gameId];
  return load ? load() : Promise.resolve();
}

export function preloadGameImages(gameId) {
  const keys = [...new Set(imageKeysForGame(gameId))];
  return Promise.all(keys.map((key) => preloadGameImage(key)));
}

export function preloadAllGameChunks() {
  return Promise.all(Object.values(chunkLoaders).map((load) => load()));
}

export function warmGameForPlay(gameId) {
  return Promise.all([preloadGameChunk(gameId), preloadGameImages(gameId)]);
}
