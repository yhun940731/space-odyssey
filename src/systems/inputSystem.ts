type KeyState = Record<string, boolean>;

export type FlightInputSnapshot = {
  yaw: number;
  pitch: number;
  roll: number;
  boost: boolean;
};

const keys: KeyState = {};
const consumedActions: KeyState = {};
const virtualInput: FlightInputSnapshot = {
  yaw: 0,
  pitch: 0,
  roll: 0,
  boost: false,
};
let initialized = false;

const handledCodes = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
  'KeyQ',
  'KeyE',
  'Space',
  'ShiftLeft',
  'ShiftRight',
  'Enter',
  'Escape',
  'KeyP',
]);

const handleKeyDown = (event: KeyboardEvent) => {
  if (handledCodes.has(event.code)) {
    event.preventDefault();
  }

  keys[event.code] = true;
};

const handleKeyUp = (event: KeyboardEvent) => {
  if (handledCodes.has(event.code)) {
    event.preventDefault();
  }

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

const consumePressed = (action: string, ...codes: string[]) => {
  const isPressed = pressed(...codes);

  if (!isPressed) {
    consumedActions[action] = false;
    return false;
  }

  if (consumedActions[action]) {
    return false;
  }

  consumedActions[action] = true;
  return true;
};

const clampAxis = (value: number) => Math.min(1, Math.max(-1, value));

export const getFlightInput = (): FlightInputSnapshot => ({
  yaw: clampAxis((pressed('KeyA', 'ArrowLeft') ? -1 : 0) + (pressed('KeyD', 'ArrowRight') ? 1 : 0) + virtualInput.yaw),
  pitch: clampAxis((pressed('KeyW', 'ArrowUp') ? -1 : 0) + (pressed('KeyS', 'ArrowDown') ? 1 : 0) + virtualInput.pitch),
  roll: clampAxis((pressed('KeyQ') ? -1 : 0) + (pressed('KeyE') ? 1 : 0) + virtualInput.roll),
  boost: pressed('Space', 'ShiftLeft', 'ShiftRight') || virtualInput.boost,
});

export const getGameInputActions = () => ({
  start: consumePressed('start', 'Enter'),
  pause: consumePressed('pause', 'Escape', 'KeyP'),
});

export const setVirtualInput = (input: Partial<FlightInputSnapshot>) => {
  virtualInput.yaw = input.yaw ?? virtualInput.yaw;
  virtualInput.pitch = input.pitch ?? virtualInput.pitch;
  virtualInput.roll = input.roll ?? virtualInput.roll;
  virtualInput.boost = input.boost ?? virtualInput.boost;
};

export const clearVirtualInput = () => {
  virtualInput.yaw = 0;
  virtualInput.pitch = 0;
  virtualInput.roll = 0;
  virtualInput.boost = false;
};
