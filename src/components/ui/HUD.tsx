import { useEventStore } from '../../stores/useEventStore';
import { useFlightStore } from '../../stores/useFlightStore';
import { getSectorTheme } from '../../systems/sectorSystem';

export const HUD = () => {
  const speed = useFlightStore((state) => state.speed);
  const distance = useFlightStore((state) => state.distance);
  const boost = useFlightStore((state) => state.boost);
  const sector = useFlightStore((state) => state.sector);
  const isWarping = useFlightStore((state) => state.isWarping);
  const wormholeState = useEventStore((state) => state.wormholeState);
  const theme = getSectorTheme(sector);

  return (
    <aside className="hud" aria-label="Flight information">
      <div className="hud__header">
        <span className="hud__eyebrow">MVP build</span>
        <h1>Cosmic Drift</h1>
      </div>
      <dl className="hud__stats">
        <div>
          <dt>Speed</dt>
          <dd>{speed.toFixed(0)}</dd>
        </div>
        <div>
          <dt>Distance</dt>
          <dd>{distance.toFixed(0)}</dd>
        </div>
        <div>
          <dt>Sector</dt>
          <dd>{sector + 1} · {theme.name}</dd>
        </div>
        <div>
          <dt>Boost</dt>
          <dd>{boost ? 'engaged' : 'idle'}</dd>
        </div>
        <div>
          <dt>Warp</dt>
          <dd>{isWarping ? 'active' : wormholeState}</dd>
        </div>
      </dl>
      <div className="hud__controls">
        <strong>Controls</strong>
        <span>WASD / Arrow Keys: steer</span>
        <span>Q/E: roll</span>
        <span>Space/Shift: boost</span>
      </div>
    </aside>
  );
};
