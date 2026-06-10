import { create } from 'zustand';
import { gameplayConfig } from '../systems/gameplayConfig';

const damp = (current: number, target: number, smoothing: number, delta: number) =>
  current + (target - current) * (1 - Math.exp(-smoothing * delta));

export type SteeringInput = {
  yaw: number;
  pitch: number;
  roll?: number;
};

type FlightState = {
  speed: number;
  baseSpeed: number;
  maxSpeed: number;
  boost: boolean;
  distance: number;
  yaw: number;
  pitch: number;
  roll: number;
  isWarping: boolean;
  sector: number;
  setBoost: (value: boolean) => void;
  setSteering: (input: SteeringInput) => void;
  updateFlight: (delta: number) => void;
  startWarp: () => void;
  endWarp: () => void;
  nextSector: () => void;
};

export const useFlightStore = create<FlightState>((set, get) => ({
  speed: gameplayConfig.flight.baseSpeed,
  baseSpeed: gameplayConfig.flight.baseSpeed,
  maxSpeed: gameplayConfig.flight.maxSpeed,
  boost: false,
  distance: 0,
  yaw: 0,
  pitch: 0,
  roll: 0,
  isWarping: false,
  sector: 0,
  setBoost: (value) => set({ boost: value }),
  setSteering: (input) =>
    set((state) => ({
      yaw: damp(state.yaw, input.yaw, gameplayConfig.flight.steeringDamping, 1 / 60),
      pitch: damp(state.pitch, input.pitch, gameplayConfig.flight.steeringDamping, 1 / 60),
      roll: damp(state.roll, input.roll ?? 0, gameplayConfig.flight.steeringDamping, 1 / 60),
    })),
  updateFlight: (delta) =>
    set((state) => {
      const targetSpeed = state.isWarping
        ? gameplayConfig.flight.warpSpeed
        : state.boost
          ? state.maxSpeed
          : state.baseSpeed;
      const speed = damp(state.speed, targetSpeed, gameplayConfig.flight.accelerationDamping, delta);

      return {
        speed,
        distance: state.distance + speed * delta,
      };
    }),
  startWarp: () => set({ isWarping: true }),
  endWarp: () => set({ isWarping: false }),
  nextSector: () => set({ sector: get().sector + 1 }),
}));
