import { useEffect, useRef } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { createAmbientAudio } from '../../systems/audioSystem';

type AmbientAudioHandle = ReturnType<typeof createAmbientAudio>;

export const AmbientAudio = () => {
  const audioRef = useRef<AmbientAudioHandle | null>(null);
  const status = useGameStore((state) => state.status);
  const audioEnabled = useSettingsStore((state) => state.audioEnabled);
  const volume = useSettingsStore((state) => state.volume);

  useEffect(() => {
    if (!audioEnabled) {
      audioRef.current?.dispose();
      audioRef.current = null;
      return;
    }

    audioRef.current ??= createAmbientAudio();
    audioRef.current.setVolume(volume);
    audioRef.current.setActive(status === 'running');
  }, [audioEnabled, status, volume]);

  useEffect(
    () => () => {
      audioRef.current?.dispose();
      audioRef.current = null;
    },
    [],
  );

  return null;
};
