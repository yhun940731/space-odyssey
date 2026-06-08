type KeyState = Record<string, boolean>;

export type FlightInputSnapshot = {
  yaw: number;
  pitch: number;
  roll: number;
  boost: boolean;
};

const keys: KeyState = {};
let initialized = false;

const handleKeyDown = (event: KeyboardEvent) => {
  keys[event.code] = true;
};

const handleKeyUp = (event: KeyboardEvent) => {
  keys[event.code] = false;
};

export const initInputSystem = () => {
  if (initialized || typeof window === 'undefined') {
    return;
  }

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  initialized = true;
};

export const disposeInputSystem = () => {
  if (!initialized || typeof window === 'undefined') {
    return;
  }

  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  initialized = false;
};

const pressed = (...codes: string[]) => codes.some((code) => keys[code]);

export const getFlightInput = (): FlightInputSnapshot => ({
  yaw: (pressed('KeyA', 'ArrowLeft') ? -1 : 0) + (pressed('KeyD', 'ArrowRight') ? 1 : 0),
  pitch: (pressed('KeyW', 'ArrowUp') ? -1 : 0) + (pressed('KeyS', 'ArrowDown') ? 1 : 0),
  roll: (pressed('KeyQ') ? -1 : 0) + (pressed('KeyE') ? 1 : 0),
  boost: pressed('Space', 'ShiftLeft', 'ShiftRight'),
});
