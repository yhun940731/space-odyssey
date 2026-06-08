import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Mesh } from 'three';
import { useFlightStore } from '../../stores/useFlightStore';
import { gameplayConfig } from '../../systems/gameplayConfig';
import { createSeededRandom, randomBetween, randomSign } from '../../utils/random';

const config = gameplayConfig.asteroids;

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

export const AsteroidField = () => {
  const refs = useRef<Array<Mesh | null>>([]);
  const speed = useFlightStore((state) => state.speed);
  const asteroids = useMemo(
    () => Array.from({ length: config.count }, (_, index) => createAsteroid(7200 + index)),
    [],
  );

  useFrame((_, delta) => {
    refs.current.forEach((mesh, index) => {
      if (!mesh) {
        return;
      }

      const asteroid = asteroids[index];
      mesh.position.z += speed * delta * 0.95;
      mesh.rotation.x += asteroid.rotationSpeed[0] * delta;
      mesh.rotation.y += asteroid.rotationSpeed[1] * delta;
      mesh.rotation.z += asteroid.rotationSpeed[2] * delta;

      if (mesh.position.z > config.recycleZ) {
        mesh.position.z = config.zMin - index * 55;
        mesh.position.x *= -1;
        mesh.position.y *= index % 2 === 0 ? 1 : -1;
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
