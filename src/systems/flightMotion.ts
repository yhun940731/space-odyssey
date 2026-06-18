type FlightMotionState = {
  speed: number;
  driftX: number;
  driftY: number;
  turnYaw: number;
  turnPitch: number;
};

type MotionOptions = {
  forwardScale: number;
  turnScale?: number;
  slipScale?: number;
};

type MutablePoint = {
  x: number;
  y: number;
  z: number;
};

const resolveMotion = (
  motion: FlightMotionState,
  delta: number,
  { forwardScale, turnScale = 1, slipScale = 0 }: MotionOptions,
) => ({
  forwardStep: motion.speed * delta * forwardScale,
  slipX: motion.driftX * delta * slipScale,
  slipY: motion.driftY * delta * slipScale,
  yawAngle: motion.turnYaw * delta * turnScale,
  pitchAngle: motion.turnPitch * delta * turnScale,
});

export const advanceFlightPoint = (
  point: MutablePoint,
  motion: FlightMotionState,
  delta: number,
  options: MotionOptions,
) => {
  const { forwardStep, slipX, slipY, yawAngle, pitchAngle } = resolveMotion(motion, delta, options);
  const yawCos = Math.cos(yawAngle);
  const yawSin = Math.sin(yawAngle);
  const pitchCos = Math.cos(pitchAngle);
  const pitchSin = Math.sin(pitchAngle);
  const yawedX = point.x * yawCos + point.z * yawSin;
  const yawedZ = point.z * yawCos - point.x * yawSin;
  const pitchedY = point.y * pitchCos - yawedZ * pitchSin;
  const pitchedZ = yawedZ * pitchCos + point.y * pitchSin;

  point.x = yawedX - slipX;
  point.y = pitchedY - slipY;
  point.z = pitchedZ + forwardStep;
};

export const advanceFlightBufferPoint = (
  positions: Float32Array,
  xIndex: number,
  motion: FlightMotionState,
  delta: number,
  options: MotionOptions,
) => {
  const { forwardStep, slipX, slipY, yawAngle, pitchAngle } = resolveMotion(motion, delta, options);
  const yawCos = Math.cos(yawAngle);
  const yawSin = Math.sin(yawAngle);
  const pitchCos = Math.cos(pitchAngle);
  const pitchSin = Math.sin(pitchAngle);
  const yIndex = xIndex + 1;
  const zIndex = xIndex + 2;
  const x = positions[xIndex];
  const y = positions[yIndex];
  const z = positions[zIndex];
  const yawedX = x * yawCos + z * yawSin;
  const yawedZ = z * yawCos - x * yawSin;
  const pitchedY = y * pitchCos - yawedZ * pitchSin;
  const pitchedZ = yawedZ * pitchCos + y * pitchSin;

  positions[xIndex] = yawedX - slipX;
  positions[yIndex] = pitchedY - slipY;
  positions[zIndex] = pitchedZ + forwardStep;
};
