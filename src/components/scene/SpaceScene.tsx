import { Canvas } from '@react-three/fiber';
import { useFlightStore } from '../../stores/useFlightStore';
import { getSectorTheme } from '../../systems/sectorSystem';
import { AsteroidField } from './AsteroidField';
import { FlightController } from './FlightController';
import { NebulaField } from './NebulaField';
import { PlanetField } from './PlanetField';
import { StarField } from './StarField';
import { Wormhole } from './Wormhole';

const SceneContents = () => {
  const sector = useFlightStore((state) => state.sector);
  const theme = getSectorTheme(sector);

  return (
    <>
      <color attach="background" args={[theme.backgroundColor]} />
      <fog attach="fog" args={[theme.fogColor, 1200, 4700]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[5, 7, 8]} intensity={0.8} color={theme.starColorA} />
      <mesh position={[0, 0, -18]}>
        <sphereGeometry args={[0.65, 24, 16]} />
        <meshStandardMaterial color={theme.starColorA} emissive={theme.starColorB} emissiveIntensity={0.18} />
      </mesh>
      <FlightController />
      <StarField />
      <NebulaField />
      <PlanetField />
      <AsteroidField />
      <Wormhole />
    </>
  );
};

export const SpaceScene = () => (
  <Canvas
    gl={{ antialias: true }}
    camera={{ fov: 75, near: 0.1, far: 5000, position: [0, 0, 0] }}
    dpr={[1, 1.75]}
  >
    <SceneContents />
  </Canvas>
);
