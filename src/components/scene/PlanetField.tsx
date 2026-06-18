import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Color, Mesh } from 'three';
import { useFlightStore } from '../../stores/useFlightStore';
import { useGameStore } from '../../stores/useGameStore';
import { advanceFlightPoint } from '../../systems/flightMotion';
import { gameplayConfig } from '../../systems/gameplayConfig';
import { getSectorTheme } from '../../systems/sectorSystem';
import { createSeededRandom, randomBetween, randomFrom, randomSign } from '../../utils/random';

const config = gameplayConfig.planets;

type PlanetFieldProps = {
  count?: number;
};

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

export const PlanetField = ({ count = config.count }: PlanetFieldProps) => {
  const refs = useRef<Array<Mesh | null>>([]);
  const sector = useFlightStore((state) => state.sector);
  const isRunning = useGameStore((state) => state.status === 'running');
  const theme = getSectorTheme(sector);

  const planets = useMemo(
    () => Array.from({ length: count }, (_, index) => createPlanet(2100 + sector * 97 + index, theme.planetPalette)),
    [count, sector, theme.planetPalette],
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

      const planet = planets[index];
      advanceFlightPoint(mesh.position, flight, delta, {
        forwardScale: planet.drift,
        slipScale: planet.drift * 0.03,
        turnScale: planet.drift * 0.82,
      });
      mesh.rotation.y += delta * 0.025;

      if (mesh.position.z > config.recycleZ) {
        const next = createPlanet(9000 + sector * 131 + index + Math.floor(flight.speed), theme.planetPalette);
        mesh.position.set(next.position[0], next.position[1], next.position[2]);
        mesh.scale.setScalar(next.radius);
      }

      if (mesh.position.x > 1250) {
        mesh.position.x = -1180;
      } else if (mesh.position.x < -1250) {
        mesh.position.x = 1180;
      }

      if (mesh.position.y > 760) {
        mesh.position.y = -700;
      } else if (mesh.position.y < -760) {
        mesh.position.y = 700;
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
