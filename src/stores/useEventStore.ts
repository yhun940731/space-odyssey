import { create } from 'zustand';
import { gameplayConfig } from '../systems/gameplayConfig';
import { useFlightStore } from './useFlightStore';

export type WormholeState = 'idle' | 'approaching' | 'entering' | 'tunnel' | 'exiting';

type EventState = {
  wormholeState: WormholeState;
  wormholeTimer: number;
  nextWormholeDistance: number;
  startWormhole: () => void;
  updateWormhole: (distance: number, delta: number) => void;
};

const durations = gameplayConfig.wormhole;

export const useEventStore = create<EventState>((set, get) => ({
  wormholeState: 'idle',
  wormholeTimer: 0,
  nextWormholeDistance: durations.triggerDistance,
  startWormhole: () => {
    if (get().wormholeState !== 'idle') {
      return;
    }

    set({ wormholeState: 'approaching', wormholeTimer: 0 });
  },
  updateWormhole: (distance, delta) => {
    const state = get();

    if (state.wormholeState === 'idle') {
      if (distance >= state.nextWormholeDistance) {
        get().startWormhole();
      }
      return;
    }

    const timer = state.wormholeTimer + delta;
    const flight = useFlightStore.getState();

    if (state.wormholeState === 'approaching' && timer >= durations.approachingSeconds) {
      flight.startWarp();
      set({ wormholeState: 'entering', wormholeTimer: 0 });
      return;
    }

    if (state.wormholeState === 'entering' && timer >= durations.enteringSeconds) {
      set({ wormholeState: 'tunnel', wormholeTimer: 0 });
      return;
    }

    if (state.wormholeState === 'tunnel' && timer >= durations.tunnelSeconds) {
      set({ wormholeState: 'exiting', wormholeTimer: 0 });
      return;
    }

    if (state.wormholeState === 'exiting' && timer >= durations.exitingSeconds) {
      flight.endWarp();
      flight.nextSector();
      set({
        wormholeState: 'idle',
        wormholeTimer: 0,
        nextWormholeDistance: distance + durations.triggerDistance,
      });
      return;
    }

    set({ wormholeTimer: timer });
  },
}));
