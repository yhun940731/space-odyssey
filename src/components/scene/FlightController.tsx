import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { MathUtils, PerspectiveCamera, Vector3 } from 'three';
import { useEventStore } from '../../stores/useEventStore';
import { useFlightStore } from '../../stores/useFlightStore';
import { useGameStore } from '../../stores/useGameStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { getFlightInput, getGameInputActions, initInputSystem, disposeInputSystem } from '../../systems/inputSystem';
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
  const desiredCameraPosition = useMemo(() => new Vector3(), []);
  const desiredLookTarget = useMemo(() => new Vector3(), []);
  const currentLookTarget = useMemo(() => new Vector3(0, 0, visualConfig.camera.thirdPerson.lookZ), []);
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);

  useEffect(() => {
    initInputSystem();
    return disposeInputSystem;
  }, []);

  useFrame((_, delta) => {
    const actions = getGameInputActions();
    const game = useGameStore.getState();

    if (actions.start) {
      game.start();
    }

    if (actions.pause) {
      game.togglePause();
    }

    if (useGameStore.getState().status !== 'running') {
      return;
    }

    const input = getFlightInput();
    const flight = useFlightStore.getState();
    const event = useEventStore.getState();

    flight.setBoost(input.boost);
    flight.setSteering(input, delta);
    flight.updateFlight(delta);
    event.updateWormhole(useFlightStore.getState().distance, delta);

    const updatedFlight = useFlightStore.getState();
    const updatedEvent = useEventStore.getState();
    const targetFov = reducedMotion ? visualConfig.camera.normalFov : getTargetFov(updatedEvent.wormholeState);
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
    const shake = reducedMotion ? 0 : getShakeAmount(updatedEvent.wormholeState);
    const shipTargetX = updatedFlight.yaw * visualConfig.playerShip.maxStrafeX;
    const shipTargetY = -updatedFlight.pitch * visualConfig.playerShip.maxLiftY;
    const turnLookX = updatedFlight.turnYaw * (reducedMotion ? 2.4 : 5.5);
    const cameraConfig = visualConfig.camera.thirdPerson;

    desiredCameraPosition.set(
      shipTargetX * cameraConfig.followX + Math.sin(time * 11.7) * shake,
      cameraConfig.height + shipTargetY * cameraConfig.followY + Math.cos(time * 9.3) * shake,
      cameraConfig.distance,
    );
    desiredLookTarget.set(
      shipTargetX * cameraConfig.lookX + turnLookX,
      shipTargetY * cameraConfig.lookY,
      cameraConfig.lookZ,
    );

    camera.position.x = MathUtils.damp(
      camera.position.x,
      desiredCameraPosition.x,
      visualConfig.camera.followDamping,
      delta,
    );
    camera.position.y = MathUtils.damp(
      camera.position.y,
      desiredCameraPosition.y,
      visualConfig.camera.followDamping,
      delta,
    );
    camera.position.z = MathUtils.damp(
      camera.position.z,
      desiredCameraPosition.z,
      visualConfig.camera.followDamping,
      delta,
    );
    currentLookTarget.x = MathUtils.damp(
      currentLookTarget.x,
      desiredLookTarget.x,
      visualConfig.camera.lookDamping,
      delta,
    );
    currentLookTarget.y = MathUtils.damp(
      currentLookTarget.y,
      desiredLookTarget.y,
      visualConfig.camera.lookDamping,
      delta,
    );
    currentLookTarget.z = MathUtils.damp(
      currentLookTarget.z,
      desiredLookTarget.z,
      visualConfig.camera.lookDamping,
      delta,
    );
    camera.lookAt(currentLookTarget);
    camera.rotation.z += reducedMotion ? 0 : updatedFlight.turnYaw * -0.08 + updatedFlight.roll * -0.04;
  });

  return null;
};
