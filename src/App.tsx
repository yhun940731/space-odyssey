import { AmbientAudio } from './components/audio/AmbientAudio';
import { SpaceScene } from './components/scene/SpaceScene';
import { GameOverlay } from './components/ui/GameOverlay';
import { HUD } from './components/ui/HUD';
import { SettingsPanel } from './components/ui/SettingsPanel';
import { TouchControls } from './components/ui/TouchControls';

export const App = () => (
  <main className="app-shell">
    <SpaceScene />
    <HUD />
    <SettingsPanel />
    <TouchControls />
    <GameOverlay />
    <AmbientAudio />
  </main>
);
