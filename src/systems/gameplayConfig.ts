export const gameplayConfig = {
  flight: {
    baseSpeed: 95,
    maxSpeed: 245,
    warpSpeed: 680,
    accelerationDamping: 2.8,
    steeringDamping: 5.5,
  },
  starField: {
    count: 3000,
    xRange: 700,
    yRange: 400,
    zMin: -2000,
    zMax: 500,
    recycleZ: 520,
  },
  planets: {
    count: 8,
    zMin: -3600,
    zMax: -900,
    recycleZ: 260,
  },
  nebulae: {
    count: 10,
    zMin: -4300,
    zMax: -1100,
    recycleZ: 300,
  },
  asteroids: {
    count: 40,
    zMin: -1800,
    zMax: 250,
    recycleZ: 320,
  },
  wormhole: {
    triggerDistance: 8000,
    approachingSeconds: 5,
    enteringSeconds: 2,
    tunnelSeconds: 4,
    exitingSeconds: 2,
  },
} as const;
