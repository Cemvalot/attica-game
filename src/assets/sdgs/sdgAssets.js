const sdgModules = import.meta.glob('./*.svg.png', {
  query: '?url',
  import: 'default',
  eager: true,
});

const URL_BY_ID = Object.fromEntries(
  Object.entries(sdgModules).map(([path, url]) => {
    const match = path.match(/sdg-(\d+)\.svg\.png$/);
    if (!match) return [];
    return [Number(match[1]), url];
  })
);

export function getSdgIconUrl(sdgId) {
  return URL_BY_ID[sdgId] ?? null;
}
