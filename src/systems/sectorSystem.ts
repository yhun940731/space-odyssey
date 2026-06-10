export type SectorTheme = {
  name: string;
  backgroundColor: string;
  starColorA: string;
  starColorB: string;
  nebulaColors: readonly [string, string, string];
  planetPalette: readonly [string, string, string, string];
  fogColor: string;
};

const sectorThemes: readonly SectorTheme[] = [
  {
    name: 'Deep Blue',
    backgroundColor: '#020613',
    starColorA: '#c9f1ff',
    starColorB: '#7aa9ff',
    nebulaColors: ['#123e7d', '#1d6ca5', '#93d7ff'],
    planetPalette: ['#1a3766', '#315f98', '#7da8cc', '#0e1b32'],
    fogColor: '#07142a',
  },
  {
    name: 'Violet Dust',
    backgroundColor: '#080315',
    starColorA: '#ffe0ff',
    starColorB: '#a678ff',
    nebulaColors: ['#4d1b78', '#9b4dca', '#f0b6ff'],
    planetPalette: ['#32154e', '#704f99', '#c39ad8', '#170d2a'],
    fogColor: '#1b0c2d',
  },
  {
    name: 'Crimson Drift',
    backgroundColor: '#120303',
    starColorA: '#fff1d5',
    starColorB: '#ff7a6d',
    nebulaColors: ['#7c1f22', '#d9534f', '#ffb37a'],
    planetPalette: ['#54201f', '#9e4a3c', '#d98b63', '#1d0a0b'],
    fogColor: '#2c0909',
  },
  {
    name: 'Emerald Void',
    backgroundColor: '#01100c',
    starColorA: '#dcfff1',
    starColorB: '#5dffc7',
    nebulaColors: ['#0d4f3f', '#1b8f72', '#8dffd8'],
    planetPalette: ['#113d33', '#2c7b69', '#84c9ad', '#051b16'],
    fogColor: '#05251e',
  },
  {
    name: 'Pale Gold',
    backgroundColor: '#100c03',
    starColorA: '#fff8d4',
    starColorB: '#ffd76f',
    nebulaColors: ['#604414', '#ad8430', '#ffe2a0'],
    planetPalette: ['#4d3814', '#8d6c2a', '#d6bd77', '#1c1508'],
    fogColor: '#2a2008',
  },
];

export const getSectorTheme = (sector: number): SectorTheme =>
  sectorThemes[Math.abs(sector) % sectorThemes.length];
