import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { BufferAttribute, BufferGeometry, Color, PointsMaterial } from 'three';
import { useFlightStore } from '../../stores/useFlightStore';
import { useEventStore } from '../../stores/useEventStore';
import { useGameStore } from '../../stores/useGameStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { gameplayConfig } from '../../systems/gameplayConfig';
import { advanceFlightBufferPoint } from '../../systems/flightMotion';
import { getSectorTheme } from '../../systems/sectorSystem';
import { visualConfig } from '../../systems/visualConfig';
import { createSeededRandom, randomBetween } from '../../utils/random';

const config = gameplayConfig.starField;

type StarFieldProps = {
  count?: number;
};

export const StarField = ({ count = config.count }: StarFieldProps) => {
  const materialRef = useRef<PointsMaterial>(null);
  const sector = useFlightStore((state) => state.sector);
  const isWarping = useFlightStore((state) => state.isWarping);
  const wormholeState = useEventStore((state) => state.wormholeState);
  const isRunning = useGameStore((state) => state.status === 'running');
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);
  const theme = getSectorTheme(sector);

  const geometry = useMemo(() => {
    const random = createSeededRandom(1337);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorA = new Color(theme.starColorA);
    const colorB = new Color(theme.starColorB);
    const mixedColor = new Color();

    for (let index = 0; index < count; index += 1) {
      const i = index * 3;
      positions[i] = randomBetween(random, -config.xRange, config.xRange);
      positions[i + 1] = randomBetween(random, -config.yRange, config.yRange);
      positions[i + 2] = randomBetween(random, config.zMin, config.zMax);

      mixedColor.copy(colorA).lerp(colorB, random());
      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    const bufferGeometry = new BufferGeometry();
    bufferGeometry.setAttribute('position', new BufferAttribute(positions, 3));
    bufferGeometry.setAttribute('color', new BufferAttribute(colors, 3));
    return bufferGeometry;
  }, [count, theme.starColorA, theme.starColorB]);

  useFrame((_, delta) => {
    if (!isRunning) {
      return;
    }

    const flight = useFlightStore.getState();
    const positions = geometry.getAttribute('position') as BufferAttribute;
    const positionArray = positions.array as Float32Array;
    const warpMultiplier = isWarping || wormholeState !== 'idle' ? (reducedMotion ? 1.25 : 2.4) : 1;

    for (let index = 0; index < count; index += 1) {
      const xIndex = index * 3;
      const yIndex = xIndex + 1;
      const zIndex = index * 3 + 2;

      advanceFlightBufferPoint(positionArray, xIndex, flight, delta, {
        forwardScale: warpMultiplier,
        slipScale: 0.08,
        turnScale: 1.25,
      });

      if (positionArray[xIndex] < -config.xRange) {
        positionArray[xIndex] = config.xRange;
      } else if (positionArray[xIndex] > config.xRange) {
        positionArray[xIndex] = -config.xRange;
      }

      if (positionArray[yIndex] < -config.yRange) {
        positionArray[yIndex] = config.yRange;
      } else if (positionArray[yIndex] > config.yRange) {
        positionArray[yIndex] = -config.yRange;
      }

      if (positionArray[zIndex] > config.recycleZ) {
        positionArray[xIndex] = ((index * 97) % (config.xRange * 2)) - config.xRange;
        positionArray[yIndex] = ((index * 53) % (config.yRange * 2)) - config.yRange;
        positionArray[zIndex] = config.zMin;
      }
    }

    positions.needsUpdate = true;

    if (materialRef.current) {
      const warpAmount = !reducedMotion && (isWarping || wormholeState === 'entering' || wormholeState === 'tunnel') ? 1 : 0;
      materialRef.current.size = visualConfig.starField.normalSize +
        (visualConfig.starField.warpSize - visualConfig.starField.normalSize) * warpAmount;
      materialRef.current.opacity = visualConfig.starField.normalOpacity +
        (visualConfig.starField.warpOpacity - visualConfig.starField.normalOpacity) * warpAmount;
    }
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        ref={materialRef}
        vertexColors
        transparent
        opacity={visualConfig.starField.normalOpacity}
        size={visualConfig.starField.normalSize}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};
