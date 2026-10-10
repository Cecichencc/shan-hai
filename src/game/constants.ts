export const COLORS = {
  grass: '#99cf7b', meadow: '#a5d783', softGrass: '#bde196',
  water: '#74cbd9', waterHighlight: '#a1e4ef', sky: '#9ddffa',
  blossom: '#f4a7c1', paleBlossom: '#f9ceda',
  leaf: '#7abb70', leafLight: '#a9d68a', trunk: '#9e795f',
  stone: '#b9c8bd', stoneDark: '#90acaa', path: '#f2dcb0',
  roof: '#48727c', timber: '#c08a69', gold: '#e9bf85',
  ivory: '#ffeedb', orange: '#ffc07f', cinnabar: '#ec8d69',
  hair: '#68554d', skin: '#f5c9aa', shorts: '#635751',
  bag: '#7b9a8f', shoe: '#d0d7ce',
} as const;
export const REGION = {
  id: 'tianshan', name: 'Dancing Valley', zh: '天山 · 桃林谷',
  spawn: [3, 0, 22] as [number, number, number],
  dijiang: [8, 0, -22] as [number, number, number],
  bounds: { minX: -41, maxX: 41, minZ: -39, maxZ: 35 },
  encounterDistance: 8,
} as const;
export const KEY_ANATOMY = { legs: 6, wings: 4, facialFeatures: 0 } as const;
