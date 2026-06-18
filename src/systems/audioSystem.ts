type AmbientAudio = {
  setActive: (active: boolean) => void;
  setVolume: (volume: number) => void;
  dispose: () => void;
};

const createNoiseBuffer = (context: AudioContext) => {
  const length = context.sampleRate * 2;
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  return buffer;
};

export const createAmbientAudio = (): AmbientAudio => {
  const context = new AudioContext();
  const master = context.createGain();
  const droneGain = context.createGain();
  const harmonyGain = context.createGain();
  const noiseGain = context.createGain();
  const lowpass = context.createBiquadFilter();
  const bandpass = context.createBiquadFilter();
  const drone = context.createOscillator();
  const harmony = context.createOscillator();
  const lfo = context.createOscillator();
  const lfoGain = context.createGain();
  const noise = context.createBufferSource();

  master.gain.value = 0;
  droneGain.gain.value = 0.06;
  harmonyGain.gain.value = 0.025;
  noiseGain.gain.value = 0.018;
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 420;
  lowpass.Q.value = 0.7;
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 960;
  bandpass.Q.value = 0.4;

  drone.type = 'sine';
  drone.frequency.value = 54;
  harmony.type = 'triangle';
  harmony.frequency.value = 81;
  lfo.type = 'sine';
  lfo.frequency.value = 0.035;
  lfoGain.gain.value = 0.018;
  noise.buffer = createNoiseBuffer(context);
  noise.loop = true;

  drone.connect(droneGain);
  harmony.connect(harmonyGain);
  noise.connect(bandpass);
  bandpass.connect(noiseGain);
  lfo.connect(lfoGain);
  lfoGain.connect(droneGain.gain);
  droneGain.connect(lowpass);
  harmonyGain.connect(lowpass);
  lowpass.connect(master);
  noiseGain.connect(master);
  master.connect(context.destination);

  drone.start();
  harmony.start();
  lfo.start();
  noise.start();

  let targetVolume = 0.42;

  return {
    setActive: (active) => {
      if (active) {
        void context.resume();
      }

      master.gain.setTargetAtTime(active ? targetVolume * 0.28 : 0, context.currentTime, 0.08);
    },
    setVolume: (volume) => {
      targetVolume = Math.min(1, Math.max(0, volume));
      master.gain.setTargetAtTime(targetVolume * 0.28, context.currentTime, 0.08);
    },
    dispose: () => {
      drone.stop();
      harmony.stop();
      lfo.stop();
      noise.stop();
      void context.close();
    },
  };
};
