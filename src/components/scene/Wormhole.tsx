import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { AdditiveBlending, Color, MathUtils, Mesh, MeshStandardMaterial } from 'three';
import { useEventStore } from '../../stores/useEventStore';
import { useFlightStore } from '../../stores/useFlightStore';
import { useGameStore } from '../../stores/useGameStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { getSectorTheme } from '../../systems/sectorSystem';
import { visualConfig } from '../../systems/visualConfig';

const stateVisuals = {
  idle: { scale: 0, opacity: 0, z: visualConfig.wormhole.portalZ },
  approaching: { scale: 18, opacity: 0.42, z: -980 },
  entering: { scale: 48, opacity: 0.82, z: -620 },
  tunnel: { scale: 94, opacity: 0.95, z: -260 },
  exiting: { scale: 120, opacity: 0.12, z: -160 },
} as const;

export const Wormhole = () => {
  const ringRef = useRef<Mesh>(null);
  const innerRef = useRef<Mesh>(null);
  const wormholeState = useEventStore((state) => state.wormholeState);
  const sector = useFlightStore((state) => state.sector);
  const isRunning = useGameStore((state) => state.status === 'running');
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);
  const theme = getSectorTheme(sector);

  useFrame((_, delta) => {
    if (!isRunning) {
      return;
    }

    const visual = stateVisuals[wormholeState];

    [ringRef.current, innerRef.current].forEach((mesh, index) => {
      if (!mesh) {
        return;
      }

      const targetScale = visual.scale * (index === 0 ? 1 : 0.72);
      const nextScale = MathUtils.damp(mesh.scale.x, targetScale, 4, delta);
      const spinScale = reducedMotion ? 0.25 : 1;
      mesh.scale.setScalar(nextScale);
      mesh.position.z = MathUtils.damp(mesh.position.z, visual.z, 4, delta);
      mesh.rotation.z += delta * (index === 0 ? 0.72 : -1.1) * (wormholeState === 'tunnel' ? 2.4 : 1) * spinScale;

      const material = mesh.material as MeshStandardMaterial;
      material.opacity = MathUtils.damp(material.opacity, visual.opacity, 5, delta);
      material.emissiveIntensity = MathUtils.damp(
        material.emissiveIntensity,
        wormholeState === 'tunnel' ? 2.6 : 1.2,
        3,
        delta,
      );
    });
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={ringRef} position={[0, 0, visualConfig.wormhole.portalZ]} scale={0}>
        <torusGeometry args={[1, 0.1, visualConfig.wormhole.tubeSegments, visualConfig.wormhole.ringSegments]} />
        <meshStandardMaterial
          color={theme.starColorB}
          emissive={new Color(theme.nebulaColors[1])}
          emissiveIntensity={1.2}
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={innerRef} position={[0, 0, visualConfig.wormhole.portalZ - 8]} scale={0}>
        <torusGeometry args={[1, 0.045, 8, visualConfig.wormhole.ringSegments]} />
        <meshStandardMaterial
          color={theme.starColorA}
          emissive={new Color(theme.nebulaColors[2])}
          emissiveIntensity={1.6}
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
