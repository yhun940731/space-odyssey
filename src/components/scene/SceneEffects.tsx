import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { qualityProfiles } from '../../systems/qualityConfig';

export const SceneEffects = () => {
  const quality = useSettingsStore((state) => state.quality);
  const postprocessingEnabled = useSettingsStore((state) => state.postprocessingEnabled);
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);
  const profile = qualityProfiles[quality];

  if (!postprocessingEnabled || reducedMotion || !profile.postprocessing) {
    return null;
  }

  return (
    <EffectComposer multisampling={quality === 'high' ? 4 : 0}>
      <Bloom intensity={quality === 'high' ? 0.46 : 0.32} luminanceThreshold={0.18} luminanceSmoothing={0.72} mipmapBlur />
      <Vignette offset={0.22} darkness={0.48} />
    </EffectComposer>
  );
};
