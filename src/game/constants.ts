export const COLORS = {
  grass: '#b3cf80', meadow: '#c0d991', softGrass: '#cfdda0',
  water: '#49bdc8', waterHighlight: '#bbf0e7', sky: '#c1e8ed',
  blossom: '#f3a9af', paleBlossom: '#ffc5ba',
  leaf: '#86b552', leafLight: '#a4c96b', trunk: '#97734f',
  stone: '#e7dfc4', stoneDark: '#bcbca3', path: '#efd299',
  roof: '#498e91', timber: '#b76d4e', gold: '#e8ba76',
  ivory: '#fff1dc', orange: '#ffa23e', cinnabar: '#ed7752',
  hair: '#4c3025', skin: '#edb98c', shorts: '#554537',
  shoe: '#eee6cc',
} as const;
export const REGION = {
  id: 'tianshan', name: 'Dancing Valley', zh: '天山 · 桃林谷',
  spawn: [2.7, 0, 11.8] as [number, number, number],
  dijiang: [2.5, 0, -5.2] as [number, number, number],
  bounds: { minX: -15.5, maxX: 15.5, minZ: -15.5, maxZ: 16 },
  encounterDistance: 3.9,
} as const;
export const KEY_ANATOMY = { legs: 6, wings: 4, facialFeatures: 0 } as const;
