import { Canvas } from '@react-three/fiber';
import { useFlightStore } from '../../stores/useFlightStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { qualityProfiles } from '../../systems/qualityConfig';
import { getSectorTheme } from '../../systems/sectorSystem';
import { visualConfig } from '../../systems/visualConfig';
import { AsteroidField } from './AsteroidField';
import { FlightController } from './FlightController';
import { NebulaField } from './NebulaField';
import { PlanetField } from './PlanetField';
import { PlayerShip } from './PlayerShip';
import { SceneEffects } from './SceneEffects';
import { StarField } from './StarField';
import { Wormhole } from './Wormhole';

type SceneContentsProps = {
  profile: (typeof qualityProfiles)[keyof typeof qualityProfiles];
};

const SceneContents = ({ profile }: SceneContentsProps) => {
  const sector = useFlightStore((state) => state.sector);
  const theme = getSectorTheme(sector);

  return (
    <>
      <color attach="background" args={[theme.backgroundColor]} />
      <fog attach="fog" args={[theme.fogColor, 1200, 4700]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[5, 7, 8]} intensity={0.8} color={theme.starColorA} />
      <mesh position={[0, 14, -160]}>
        <sphereGeometry args={[1.4, 24, 16]} />
        <meshStandardMaterial color={theme.starColorA} emissive={theme.starColorB} emissiveIntensity={0.42} />
      </mesh>
      <FlightController />
      <StarField count={profile.starCount} />
      <NebulaField count={profile.nebulaCount} />
      <PlanetField count={profile.planetCount} />
      <AsteroidField count={profile.asteroidCount} />
      <Wormhole />
      <PlayerShip />
      <SceneEffects />
    </>
  );
};

export const SpaceScene = () => {
  const quality = useSettingsStore((state) => state.quality);
  const profile = qualityProfiles[quality];

  return (
    <Canvas
      gl={{ antialias: profile.antialias, powerPreference: 'high-performance' }}
      camera={{
        fov: visualConfig.camera.normalFov,
        near: 0.1,
        far: 5000,
        position: [0, visualConfig.camera.thirdPerson.height, visualConfig.camera.thirdPerson.distance],
      }}
      dpr={profile.dpr}
    >
      <SceneContents profile={profile} />
    </Canvas>
  );
};
