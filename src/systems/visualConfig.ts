export const visualConfig = {
  camera: {
    normalFov: 75,
    approachingFov: 85,
    warpFov: 108,
    fovDamping: 3.2,
    shake: {
      approaching: 0.018,
      entering: 0.035,
      tunnel: 0.05,
      exiting: 0.015,
    },
  },
  starField: {
    normalSize: 1.6,
    warpSize: 4.2,
    normalOpacity: 0.86,
    warpOpacity: 1,
  },
  wormhole: {
    portalZ: -720,
    ringSegments: 96,
    tubeSegments: 12,
  },
} as const;
