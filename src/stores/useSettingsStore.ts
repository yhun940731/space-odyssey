import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type QualityLevel = 'low' | 'medium' | 'high';

type SettingsState = {
  quality: QualityLevel;
  audioEnabled: boolean;
  volume: number;
  postprocessingEnabled: boolean;
  reducedMotion: boolean;
  setQuality: (quality: QualityLevel) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  setPostprocessingEnabled: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
};

const clampVolume = (volume: number) => Math.min(1, Math.max(0, volume));

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      quality: 'medium',
      audioEnabled: false,
      volume: 0.42,
      postprocessingEnabled: true,
      reducedMotion: false,
      setQuality: (quality) => set({ quality }),
      setAudioEnabled: (audioEnabled) => set({ audioEnabled }),
      setVolume: (volume) => set({ volume: clampVolume(volume) }),
      setPostprocessingEnabled: (postprocessingEnabled) => set({ postprocessingEnabled }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
    }),
    {
      name: 'cosmic-drift-settings',
    },
  ),
);
