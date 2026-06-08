import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Color, Mesh } from 'three';
import { useFlightStore } from '../../stores/useFlightStore';
import { gameplayConfig } from '../../systems/gameplayConfig';
import { getSectorTheme } from '../../systems/sectorSystem';
import { createSeededRandom, randomBetween, randomFrom, randomSign } from '../../utils/random';

const config = gameplayConfig.planets;

type PlanetData = {
  position: [number, number, number];
  radius: number;
  color: string;
  emissive: string;
  drift: number;
};

const createPlanet = (seed: number, palette: readonly string[]): PlanetData => {
  const random = createSeededRandom(seed);
  const sideDistance = randomBetween(random, 420, 980);
  const y = randomBetween(random, -300, 340);

  return {
    position: [sideDistance * randomSign(random), y, randomBetween(random, config.zMin, config.zMax)],
    radius: randomBetween(random, 45, 150),
    color: randomFrom(random, palette),
    emissive: randomFrom(random, palette),
    drift: randomBetween(random, 0.4, 0.8),
  };
};

export const PlanetField = () => {
  const refs = useRef<Array<Mesh | null>>([]);
  const speed = useFlightStore((state) => state.speed);
  const sector = useFlightStore((state) => state.sector);
  const theme = getSectorTheme(sector);

  const planets = useMemo(
    () => Array.from({ length: config.count }, (_, index) => createPlanet(2100 + sector * 97 + index, theme.planetPalette)),
    [sector, theme.planetPalette],
  );

  useFrame((_, delta) => {
    refs.current.forEach((mesh, index) => {
      if (!mesh) {
        return;
      }

      const planet = planets[index];
      mesh.position.z += speed * delta * planet.drift;
      mesh.rotation.y += delta * 0.025;

      if (mesh.position.z > config.recycleZ) {
        const next = createPlanet(9000 + sector * 131 + index + Math.floor(speed), theme.planetPalette);
        mesh.position.set(next.position[0], next.position[1], next.position[2]);
        mesh.scale.setScalar(next.radius);
      }
    });
  });

  return (
    <group>
      {planets.map((planet, index) => (
        <mesh
          key={`${sector}-${index}`}
          ref={(mesh) => {
            refs.current[index] = mesh;
          }}
          position={planet.position}
          scale={planet.radius}
        >
          <sphereGeometry args={[1, 32, 16]} />
          <meshStandardMaterial
            color={planet.color}
            emissive={new Color(planet.emissive)}
            emissiveIntensity={0.18}
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
};
