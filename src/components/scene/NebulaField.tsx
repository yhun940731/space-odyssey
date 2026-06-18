import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, CanvasTexture, Mesh } from 'three';
import { useFlightStore } from '../../stores/useFlightStore';
import { useGameStore } from '../../stores/useGameStore';
import { advanceFlightPoint } from '../../systems/flightMotion';
import { gameplayConfig } from '../../systems/gameplayConfig';
import { getSectorTheme } from '../../systems/sectorSystem';
import { createSeededRandom, randomBetween, randomFrom, randomSign } from '../../utils/random';

const config = gameplayConfig.nebulae;

type NebulaFieldProps = {
  count?: number;
};

type NebulaData = {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  drift: number;
};

const createNebulaTexture = (color: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');

  if (context) {
    const gradient = context.createRadialGradient(128, 128, 8, 128, 128, 128);
    gradient.addColorStop(0, `${color}88`);
    gradient.addColorStop(0.45, `${color}30`);
    gradient.addColorStop(1, `${color}00`);
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
  }

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const createNebula = (seed: number, colors: readonly string[]): NebulaData => {
  const random = createSeededRandom(seed);
  const x = randomBetween(random, 450, 1200) * randomSign(random);

  return {
    position: [x, randomBetween(random, -360, 420), randomBetween(random, config.zMin, config.zMax)],
    scale: [randomBetween(random, 360, 760), randomBetween(random, 220, 520), 1],
    color: randomFrom(random, colors),
    drift: randomBetween(random, 0.25, 0.55),
  };
};

export const NebulaField = ({ count = config.count }: NebulaFieldProps) => {
  const refs = useRef<Array<Mesh | null>>([]);
  const sector = useFlightStore((state) => state.sector);
  const isRunning = useGameStore((state) => state.status === 'running');
  const theme = getSectorTheme(sector);

  const nebulae = useMemo(
    () => Array.from({ length: count }, (_, index) => createNebula(5100 + sector * 223 + index, theme.nebulaColors)),
    [count, sector, theme.nebulaColors],
  );
  const textures = useMemo(() => nebulae.map((nebula) => createNebulaTexture(nebula.color)), [nebulae]);

  useEffect(() => () => textures.forEach((texture) => texture.dispose()), [textures]);

  useFrame((_, delta) => {
    if (!isRunning) {
      return;
    }

    const flight = useFlightStore.getState();

    refs.current.forEach((mesh, index) => {
      if (!mesh) {
        return;
      }

      const nebula = nebulae[index];
      advanceFlightPoint(mesh.position, flight, delta, {
        forwardScale: nebula.drift,
        slipScale: nebula.drift * 0.02,
        turnScale: nebula.drift * 0.5,
      });
      mesh.rotation.z += delta * 0.006 * (index % 2 === 0 ? 1 : -1);

      if (mesh.position.z > config.recycleZ) {
        mesh.position.z = config.zMin - index * 120;
        mesh.position.x *= -1;
      }

      if (mesh.position.x > 1450) {
        mesh.position.x = -1320;
      } else if (mesh.position.x < -1450) {
        mesh.position.x = 1320;
      }

      if (mesh.position.y > 820) {
        mesh.position.y = -760;
      } else if (mesh.position.y < -820) {
        mesh.position.y = 760;
      }
    });
  });

  return (
    <group>
      {nebulae.map((nebula, index) => (
        <mesh
          key={`${sector}-${index}`}
          ref={(mesh) => {
            refs.current[index] = mesh;
          }}
          position={nebula.position}
          scale={nebula.scale}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={textures[index]}
            transparent
            opacity={0.42}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};
