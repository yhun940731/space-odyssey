import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  MathUtils,
  MeshBasicMaterial,
} from 'three';
import { useFlightStore } from '../../stores/useFlightStore';
import { useGameStore } from '../../stores/useGameStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { visualConfig } from '../../systems/visualConfig';

const shipConfig = visualConfig.playerShip;

const createWingGeometry = (side: -1 | 1) => {
  const geometry = new BufferGeometry();

  geometry.setAttribute(
    'position',
    new Float32BufferAttribute(
      [
        0.28 * side, -0.03, -1.35,
        2.35 * side, -0.12, 0.15,
        0.56 * side, -0.02, 1.25,
      ],
      3,
    ),
  );
  geometry.computeVertexNormals();

  return geometry;
};

export const PlayerShip = () => {
  const groupRef = useRef<Group>(null);
  const leftEngineRef = useRef<MeshBasicMaterial>(null);
  const rightEngineRef = useRef<MeshBasicMaterial>(null);
  const leftTrailRef = useRef<MeshBasicMaterial>(null);
  const rightTrailRef = useRef<MeshBasicMaterial>(null);
  const isRunning = useGameStore((state) => state.status === 'running');
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);
  const leftWingGeometry = useMemo(() => createWingGeometry(-1), []);
  const rightWingGeometry = useMemo(() => createWingGeometry(1), []);

  useFrame((_, delta) => {
    if (!isRunning) {
      return;
    }

    const ship = groupRef.current;

    if (!ship) {
      return;
    }

    const flight = useFlightStore.getState();
    const targetX = flight.yaw * shipConfig.maxStrafeX;
    const targetY = -flight.pitch * shipConfig.maxLiftY;
    const motionScale = reducedMotion ? 0.55 : 1;
    const targetRoll = (-flight.yaw * shipConfig.bankScale - flight.roll * shipConfig.rollScale) * motionScale;
    const targetPitch = flight.pitch * shipConfig.pitchScale * motionScale;
    const targetYaw = -flight.yaw * shipConfig.yawScale * motionScale;
    const enginePower = flight.boost || flight.isWarping ? 1 : 0;

    ship.position.x = MathUtils.damp(ship.position.x, targetX, shipConfig.motionDamping, delta);
    ship.position.y = MathUtils.damp(ship.position.y, targetY, shipConfig.motionDamping, delta);
    ship.rotation.x = MathUtils.damp(ship.rotation.x, targetPitch, shipConfig.rotationDamping, delta);
    ship.rotation.y = MathUtils.damp(ship.rotation.y, targetYaw, shipConfig.rotationDamping, delta);
    ship.rotation.z = MathUtils.damp(ship.rotation.z, targetRoll, shipConfig.rotationDamping, delta);

    [leftEngineRef.current, rightEngineRef.current].forEach((material) => {
      if (!material) {
        return;
      }

      material.opacity = MathUtils.damp(material.opacity, 0.58 + enginePower * 0.34, 9, delta);
    });

    [leftTrailRef.current, rightTrailRef.current].forEach((material) => {
      if (!material) {
        return;
      }

      material.opacity = MathUtils.damp(material.opacity, 0.2 + enginePower * 0.5, 9, delta);
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, shipConfig.z]} scale={shipConfig.scale}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.48]}>
        <coneGeometry args={[0.62, 4.45, 5, 1]} />
        <meshStandardMaterial
          color="#dbe9f8"
          emissive="#1d3d63"
          emissiveIntensity={0.18}
          metalness={0.68}
          roughness={0.28}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.04, 0.62]}>
        <cylinderGeometry args={[0.5, 0.34, 2.25, 8]} />
        <meshStandardMaterial
          color="#6d8096"
          emissive="#0a1726"
          emissiveIntensity={0.12}
          metalness={0.54}
          roughness={0.34}
        />
      </mesh>

      <mesh position={[0, 0.35, -1.2]} scale={[0.42, 0.18, 0.68]}>
        <sphereGeometry args={[1, 20, 10]} />
        <meshStandardMaterial
          color="#9bd7ff"
          emissive="#4cbcff"
          emissiveIntensity={0.4}
          metalness={0.18}
          roughness={0.18}
        />
      </mesh>

      <mesh geometry={leftWingGeometry}>
        <meshStandardMaterial
          color="#9eb6cc"
          emissive="#162943"
          emissiveIntensity={0.16}
          metalness={0.58}
          roughness={0.38}
          side={DoubleSide}
        />
      </mesh>
      <mesh geometry={rightWingGeometry}>
        <meshStandardMaterial
          color="#9eb6cc"
          emissive="#162943"
          emissiveIntensity={0.16}
          metalness={0.58}
          roughness={0.38}
          side={DoubleSide}
        />
      </mesh>

      <mesh position={[-0.34, -0.05, 1.7]}>
        <sphereGeometry args={[0.16, 16, 8]} />
        <meshBasicMaterial
          ref={leftEngineRef}
          color="#7de8ff"
          transparent
          opacity={0.58}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0.34, -0.05, 1.7]}>
        <sphereGeometry args={[0.16, 16, 8]} />
        <meshBasicMaterial
          ref={rightEngineRef}
          color="#7de8ff"
          transparent
          opacity={0.58}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[-0.34, -0.05, 2.28]}>
        <coneGeometry args={[0.14, 1.25, 16]} />
        <meshBasicMaterial
          ref={leftTrailRef}
          color="#63d8ff"
          transparent
          opacity={0.2}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0.34, -0.05, 2.28]}>
        <coneGeometry args={[0.14, 1.25, 16]} />
        <meshBasicMaterial
          ref={rightTrailRef}
          color="#63d8ff"
          transparent
          opacity={0.2}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <pointLight color="#7de8ff" intensity={0.7} distance={8} position={[0, -0.05, 1.75]} />
    </group>
  );
};
