const sdgModules = import.meta.glob('./sdgs-*.svg', {
  query: '?url',
  import: 'default',
  eager: true,
});

const URL_BY_ID = Object.fromEntries(
  Object.entries(sdgModules).map(([path, url]) => {
    const match = path.match(/sdgs-(\d+)\.svg$/);
    if (!match) return [];
    return [Number(match[1]), url];
  })
);

export function getSdgIconUrl(sdgId) {
  return URL_BY_ID[sdgId] ?? null;
}
