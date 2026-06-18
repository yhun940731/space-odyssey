import type { PointerEvent } from 'react';
import { useEffect, useState } from 'react';
import { clearVirtualInput, setVirtualInput } from '../../systems/inputSystem';

type TouchAction = 'left' | 'right' | 'up' | 'down' | 'rollLeft' | 'rollRight' | 'boost';

const resolveInput = (active: Set<TouchAction>) => ({
  yaw: (active.has('left') ? -1 : 0) + (active.has('right') ? 1 : 0),
  pitch: (active.has('up') ? -1 : 0) + (active.has('down') ? 1 : 0),
  roll: (active.has('rollLeft') ? -1 : 0) + (active.has('rollRight') ? 1 : 0),
  boost: active.has('boost'),
});

export const TouchControls = () => {
  const [active, setActive] = useState<Set<TouchAction>>(() => new Set());

  useEffect(() => {
    setVirtualInput(resolveInput(active));
  }, [active]);

  useEffect(
    () => () => {
      clearVirtualInput();
    },
    [],
  );

  const setAction = (action: TouchAction, enabled: boolean) => {
    setActive((current) => {
      const next = new Set(current);

      if (enabled) {
        next.add(action);
      } else {
        next.delete(action);
      }

      return next;
    });
  };

  const bindAction = (action: TouchAction) => ({
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      setAction(action, true);
    },
    onPointerUp: (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setAction(action, false);
    },
    onPointerCancel: () => setAction(action, false),
    onPointerLeave: () => setAction(action, false),
  });

  return (
    <div className="touch-controls" aria-label="Touch flight controls">
      <div className="touch-controls__stick" aria-label="Turn and pitch controls">
        <button className="touch-button touch-button--up" type="button" aria-label="Climb" {...bindAction('up')}>
          <span className="touch-button__arrow touch-button__arrow--up" aria-hidden="true" />
        </button>
        <button className="touch-button touch-button--left" type="button" aria-label="Turn left" {...bindAction('left')}>
          <span className="touch-button__arrow touch-button__arrow--left" aria-hidden="true" />
        </button>
        <button className="touch-button touch-button--right" type="button" aria-label="Turn right" {...bindAction('right')}>
          <span className="touch-button__arrow touch-button__arrow--right" aria-hidden="true" />
        </button>
        <button className="touch-button touch-button--down" type="button" aria-label="Dive" {...bindAction('down')}>
          <span className="touch-button__arrow touch-button__arrow--down" aria-hidden="true" />
        </button>
      </div>

      <div className="touch-controls__actions">
        <button className="touch-button touch-button--small" type="button" aria-label="Roll left" {...bindAction('rollLeft')}>
          Q
        </button>
        <button className="touch-button touch-button--boost" type="button" aria-label="Boost" {...bindAction('boost')}>
          Boost
        </button>
        <button className="touch-button touch-button--small" type="button" aria-label="Roll right" {...bindAction('rollRight')}>
          E
        </button>
      </div>
    </div>
  );
};
