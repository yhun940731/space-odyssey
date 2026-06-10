export type SeededRandom = () => number;

export const createSeededRandom = (seed: number): SeededRandom => {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
};

export const randomBetween = (random: SeededRandom, min: number, max: number) =>
  min + (max - min) * random();

export const randomSign = (random: SeededRandom) => (random() > 0.5 ? 1 : -1);

export const randomFrom = <T>(random: SeededRandom, values: readonly T[]) =>
  values[Math.floor(random() * values.length) % values.length];
