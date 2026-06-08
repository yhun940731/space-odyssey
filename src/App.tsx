import { SpaceScene } from './components/scene/SpaceScene';
import { HUD } from './components/ui/HUD';

export const App = () => (
  <main className="app-shell">
    <SpaceScene />
    <HUD />
  </main>
);
