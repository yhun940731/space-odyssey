import type { ChangeEvent } from 'react';
import { useState } from 'react';
import type { QualityLevel } from '../../stores/useSettingsStore';
import { useSettingsStore } from '../../stores/useSettingsStore';

export const SettingsPanel = () => {
  const [open, setOpen] = useState(false);
  const quality = useSettingsStore((state) => state.quality);
  const audioEnabled = useSettingsStore((state) => state.audioEnabled);
  const volume = useSettingsStore((state) => state.volume);
  const postprocessingEnabled = useSettingsStore((state) => state.postprocessingEnabled);
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);
  const setQuality = useSettingsStore((state) => state.setQuality);
  const setAudioEnabled = useSettingsStore((state) => state.setAudioEnabled);
  const setVolume = useSettingsStore((state) => state.setVolume);
  const setPostprocessingEnabled = useSettingsStore((state) => state.setPostprocessingEnabled);
  const setReducedMotion = useSettingsStore((state) => state.setReducedMotion);

  const handleQualityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setQuality(event.target.value as QualityLevel);
  };

  return (
    <div className="settings">
      <button
        className="settings__trigger"
        type="button"
        aria-label={open ? 'Close settings' : 'Open settings'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="settings__gear" aria-hidden="true" />
      </button>

      {open && (
        <section className="settings__panel" aria-label="Flight settings">
          <div className="settings__header">
            <h2>Settings</h2>
          </div>

          <label className="settings__field">
            <span>Quality</span>
            <select value={quality} onChange={handleQualityChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label className="settings__toggle">
            <input
              type="checkbox"
              checked={audioEnabled}
              onChange={(event) => setAudioEnabled(event.target.checked)}
            />
            <span>Audio</span>
          </label>

          <label className="settings__field">
            <span>Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              disabled={!audioEnabled}
            />
          </label>

          <label className="settings__toggle">
            <input
              type="checkbox"
              checked={postprocessingEnabled}
              onChange={(event) => setPostprocessingEnabled(event.target.checked)}
            />
            <span>Bloom</span>
          </label>

          <label className="settings__toggle">
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(event) => setReducedMotion(event.target.checked)}
            />
            <span>Reduce motion</span>
          </label>
        </section>
      )}
    </div>
  );
};
