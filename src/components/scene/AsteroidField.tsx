import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Mesh } from 'three';
import { useFlightStore } from '../../stores/useFlightStore';
import { useGameStore } from '../../stores/useGameStore';
import { advanceFlightPoint } from '../../systems/flightMotion';
import { gameplayConfig } from '../../systems/gameplayConfig';
import { createSeededRandom, randomBetween, randomSign } from '../../utils/random';

const config = gameplayConfig.asteroids;

type AsteroidFieldProps = {
  count?: number;
};

type AsteroidData = {
  position: [number, number, number];
  scale: number;
  rotationSpeed: [number, number, number];
};

const createAsteroid = (seed: number): AsteroidData => {
  const random = createSeededRandom(seed);
  const x = randomBetween(random, 220, 760) * randomSign(random);
  const y = randomBetween(random, 120, 430) * randomSign(random);

  return {
    position: [x, y, randomBetween(random, config.zMin, config.zMax)],
    scale: randomBetween(random, 6, 24),
    rotationSpeed: [
      randomBetween(random, -0.35, 0.35),
      randomBetween(random, -0.42, 0.42),
      randomBetween(random, -0.3, 0.3),
    ],
  };
};

export const AsteroidField = ({ count = config.count }: AsteroidFieldProps) => {
  const refs = useRef<Array<Mesh | null>>([]);
  const isRunning = useGameStore((state) => state.status === 'running');
  const asteroids = useMemo(
    () => Array.from({ length: count }, (_, index) => createAsteroid(7200 + index)),
    [count],
  );

  useFrame((_, delta) => {
    if (!isRunning) {
      return;
    }

    const flight = useFlightStore.getState();

    refs.current.forEach((mesh, index) => {
      if (!mesh) {
        return;
      }

      const asteroid = asteroids[index];
      advanceFlightPoint(mesh.position, flight, delta, {
        forwardScale: 0.95,
        slipScale: 0.06,
        turnScale: 1.24,
      });
      mesh.rotation.x += asteroid.rotationSpeed[0] * delta;
      mesh.rotation.y += asteroid.rotationSpeed[1] * delta;
      mesh.rotation.z += asteroid.rotationSpeed[2] * delta;

      if (mesh.position.z > config.recycleZ) {
        mesh.position.z = config.zMin - index * 55;
        mesh.position.x *= -1;
        mesh.position.y *= index % 2 === 0 ? 1 : -1;
      }

      if (mesh.position.x > 880) {
        mesh.position.x = -820;
      } else if (mesh.position.x < -880) {
        mesh.position.x = 820;
      }

      if (mesh.position.y > 520) {
        mesh.position.y = -480;
      } else if (mesh.position.y < -520) {
        mesh.position.y = 480;
      }
    });
  });

  return (
    <group>
      {asteroids.map((asteroid, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            refs.current[index] = mesh;
          }}
          position={asteroid.position}
          scale={asteroid.scale}
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#645f68" roughness={0.95} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
};
