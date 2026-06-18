import type { QualityLevel } from '../stores/useSettingsStore';

export type QualityProfile = {
  dpr: [number, number];
  antialias: boolean;
  starCount: number;
  planetCount: number;
  nebulaCount: number;
  asteroidCount: number;
  postprocessing: boolean;
};

export const qualityProfiles: Record<QualityLevel, QualityProfile> = {
  low: {
    dpr: [1, 1],
    antialias: false,
    starCount: 1500,
    planetCount: 5,
    nebulaCount: 5,
    asteroidCount: 22,
    postprocessing: false,
  },
  medium: {
    dpr: [1, 1.5],
    antialias: true,
    starCount: 2600,
    planetCount: 7,
    nebulaCount: 8,
    asteroidCount: 34,
    postprocessing: true,
  },
  high: {
    dpr: [1, 1.85],
    antialias: true,
    starCount: 3600,
    planetCount: 9,
    nebulaCount: 10,
    asteroidCount: 48,
    postprocessing: true,
  },
};
