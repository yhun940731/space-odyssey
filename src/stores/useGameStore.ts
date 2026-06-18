import { create } from 'zustand';

export type GameStatus = 'ready' | 'running' | 'paused';

type GameState = {
  status: GameStatus;
  start: () => void;
  pause: () => void;
  resume: () => void;
  togglePause: () => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  status: 'ready',
  start: () => set({ status: 'running' }),
  pause: () =>
    set((state) => ({
      status: state.status === 'running' ? 'paused' : state.status,
    })),
  resume: () =>
    set((state) => ({
      status: state.status === 'paused' ? 'running' : state.status,
    })),
  togglePause: () => {
    const { status } = get();

    if (status === 'ready') {
      return;
    }

    set({ status: status === 'running' ? 'paused' : 'running' });
  },
}));
