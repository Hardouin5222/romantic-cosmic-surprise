import { useMemo, useState } from 'react';
import { Howl } from 'howler';
import Scene from './Scene.jsx';
import Overlay from './Overlay.jsx';

export default function App() {
  const [started, setStarted] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [musicReady, setMusicReady] = useState(false);

  const music = useMemo(
    () =>
      new Howl({
        src: ['/music.mp3'],
        loop: true,
        volume: 0.34,
        html5: true,
        onload: () => setMusicReady(true),
        onloaderror: () => setMusicReady(false)
      }),
    []
  );

  const begin = () => {
    setStarted(true);
    try {
      music.play();
    } catch (_) {}
  };

  return (
    <main className="app-shell">
      <Scene started={started} activePanel={activePanel} setActivePanel={setActivePanel} />
      <Overlay
        started={started}
        begin={begin}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        musicReady={musicReady}
      />
    </main>
  );
}
