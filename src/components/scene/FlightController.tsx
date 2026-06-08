import { useFrame, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { MathUtils, PerspectiveCamera } from 'three';
import { useEventStore } from '../../stores/useEventStore';
import { useFlightStore } from '../../stores/useFlightStore';
import { getFlightInput, initInputSystem, disposeInputSystem } from '../../systems/inputSystem';
import { visualConfig } from '../../systems/visualConfig';

const getTargetFov = (state: ReturnType<typeof useEventStore.getState>['wormholeState']) => {
  if (state === 'approaching') {
    return visualConfig.camera.approachingFov;
  }

  if (state === 'entering' || state === 'tunnel') {
    return visualConfig.camera.warpFov;
  }

  return visualConfig.camera.normalFov;
};

const getShakeAmount = (state: ReturnType<typeof useEventStore.getState>['wormholeState']) => {
  if (state === 'idle') {
    return 0;
  }

  return visualConfig.camera.shake[state];
};

export const FlightController = () => {
  const { camera, clock } = useThree();

  useEffect(() => {
    initInputSystem();
    return disposeInputSystem;
  }, []);

  useFrame((_, delta) => {
    const input = getFlightInput();
    const flight = useFlightStore.getState();
    const event = useEventStore.getState();

    flight.setBoost(input.boost);
    flight.setSteering(input);
    flight.updateFlight(delta);
    event.updateWormhole(useFlightStore.getState().distance, delta);

    const updatedFlight = useFlightStore.getState();
    const updatedEvent = useEventStore.getState();
    const targetFov = getTargetFov(updatedEvent.wormholeState);
    const perspectiveCamera = camera as PerspectiveCamera;

    if (perspectiveCamera.isPerspectiveCamera) {
      perspectiveCamera.fov = MathUtils.damp(
        perspectiveCamera.fov,
        targetFov,
        visualConfig.camera.fovDamping,
        delta,
      );
      perspectiveCamera.updateProjectionMatrix();
    }

    const time = clock.elapsedTime;
    const shake = getShakeAmount(updatedEvent.wormholeState);
    camera.position.set(
      Math.sin(time * 11.7) * shake,
      Math.cos(time * 9.3) * shake,
      0,
    );
    camera.rotation.set(
      updatedFlight.pitch * 0.11 + Math.sin(time * 17.1) * shake * 0.18,
      updatedFlight.yaw * -0.13 + Math.cos(time * 13.8) * shake * 0.18,
      updatedFlight.roll * -0.18,
    );
  });

  return null;
};
