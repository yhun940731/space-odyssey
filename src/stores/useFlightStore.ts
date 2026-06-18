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
  driftX: number;
  driftY: number;
  turnYaw: number;
  turnPitch: number;
  isWarping: boolean;
  sector: number;
  setBoost: (value: boolean) => void;
  setSteering: (input: SteeringInput, delta: number) => void;
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
  driftX: 0,
  driftY: 0,
  turnYaw: 0,
  turnPitch: 0,
  isWarping: false,
  sector: 0,
  setBoost: (value) => set({ boost: value }),
  setSteering: (input, delta) =>
    set((state) => ({
      yaw: damp(state.yaw, input.yaw, gameplayConfig.flight.steeringDamping, delta),
      pitch: damp(state.pitch, input.pitch, gameplayConfig.flight.steeringDamping, delta),
      roll: damp(state.roll, input.roll ?? 0, gameplayConfig.flight.steeringDamping, delta),
    })),
  updateFlight: (delta) =>
    set((state) => {
      const targetSpeed = state.isWarping
        ? gameplayConfig.flight.warpSpeed
        : state.boost
          ? state.maxSpeed
          : state.baseSpeed;
      const speed = damp(state.speed, targetSpeed, gameplayConfig.flight.accelerationDamping, delta);
      const targetDriftX = state.yaw * speed * gameplayConfig.flight.steeringDriftScale;
      const targetDriftY = -state.pitch * speed * gameplayConfig.flight.steeringDriftScale;
      const targetTurnYaw = state.yaw * gameplayConfig.flight.yawTurnRate;
      const targetTurnPitch = state.pitch * gameplayConfig.flight.pitchTurnRate;

      return {
        speed,
        driftX: damp(state.driftX, targetDriftX, gameplayConfig.flight.driftDamping, delta),
        driftY: damp(state.driftY, targetDriftY, gameplayConfig.flight.driftDamping, delta),
        turnYaw: damp(state.turnYaw, targetTurnYaw, gameplayConfig.flight.turnDamping, delta),
        turnPitch: damp(state.turnPitch, targetTurnPitch, gameplayConfig.flight.turnDamping, delta),
        distance: state.distance + speed * delta,
      };
    }),
  startWarp: () => set({ isWarping: true }),
  endWarp: () => set({ isWarping: false }),
  nextSector: () => set({ sector: get().sector + 1 }),
}));
