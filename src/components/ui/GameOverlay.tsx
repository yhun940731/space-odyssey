import { useGameStore } from '../../stores/useGameStore';

export const GameOverlay = () => {
  const status = useGameStore((state) => state.status);
  const start = useGameStore((state) => state.start);
  const pause = useGameStore((state) => state.pause);
  const resume = useGameStore((state) => state.resume);

  if (status === 'running') {
    return (
      <button className="pause-button" type="button" onClick={pause} aria-label="Pause flight">
        <span className="pause-button__icon" aria-hidden="true" />
      </button>
    );
  }

  return (
    <section className="game-overlay" aria-live="polite">
      <div className="game-overlay__panel">
        <span className="game-overlay__kicker">{status === 'ready' ? 'Ready' : 'Paused'}</span>
        <h2>{status === 'ready' ? 'Cosmic Drift' : 'Drift Suspended'}</h2>
        <button
          className="game-overlay__button"
          type="button"
          onClick={status === 'ready' ? start : resume}
          aria-label={status === 'ready' ? 'Start flight' : 'Resume flight'}
        >
          <span className="game-overlay__play" aria-hidden="true" />
          <span>{status === 'ready' ? 'Start Flight' : 'Resume'}</span>
        </button>
      </div>
    </section>
  );
};
