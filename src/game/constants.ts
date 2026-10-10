export const COLORS = {
  grass: '#a6d68a', meadow: '#b3dc94', softGrass: '#c3e2a8',
  water: '#71cad9', waterHighlight: '#cbf2f1', sky: '#a9dff2',
  blossom: '#f6a9c4', paleBlossom: '#f9cbd9',
  leaf: '#80bd75', leafLight: '#a9d68a', trunk: '#a38265',
  stone: '#d8d7c5', stoneDark: '#adbab0', path: '#f0e0be',
  roof: '#527e86', timber: '#bc8668', gold: '#e9bf85',
  ivory: '#fff1dc', orange: '#ffad78', cinnabar: '#eb8667',
  hair: '#68554d', skin: '#ffd8ba', shorts: '#6e6158',
  bag: '#7b9a8f', shoe: '#e8e4da',
} as const;
export const REGION = {
  id: 'tianshan', name: 'Dancing Valley', zh: '天山 · 桃林谷',
  spawn: [4.7, 0, 26] as [number,number,number],
  dijiang: [6, 0, -22] as [number,number,number],
  bounds: { minX: -38, maxX: 38, minZ: -39, maxZ: 37 },
  encounterDistance: 6,
} as const;
export const KEY_ANATOMY = { legs: 6, wings: 4, facialFeatures: 0 } as const;
