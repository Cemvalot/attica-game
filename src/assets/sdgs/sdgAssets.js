const sdgModules = import.meta.glob('./sdgs-*.svg', {
  query: '?url',
  import: 'default',
});

const urlCache = new Map();

function modulePath(sdgId) {
  return `./sdgs-${String(sdgId).padStart(2, '0')}.svg`;
}

export function getSdgIconUrl(sdgId) {
  return urlCache.get(sdgId) ?? null;
}

export function preloadSdgIcon(sdgId) {
  if (urlCache.has(sdgId)) return Promise.resolve(getSdgIconUrl(sdgId));
  const loader = sdgModules[modulePath(sdgId)];
  if (!loader) return Promise.resolve(null);
  return loader().then((url) => {
    urlCache.set(sdgId, url);
    return url;
  });
}

export function preloadSdgIcons(sdgIds) {
  return Promise.all([...new Set(sdgIds)].map((id) => preloadSdgIcon(id)));
}
