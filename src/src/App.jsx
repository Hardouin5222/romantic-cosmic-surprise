import { useMemo, useRef, useState } from 'react';
import { Howl } from 'howler';
import Scene from './Scene.jsx';
import Overlay from './Overlay.jsx';

export default function App() {
  const [started, setStarted] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const soundRef = useRef(null);

  const sound = useMemo(() => {
    const h = new Howl({
      src: ['/music.mp3'],
      loop: true,
      volume: 0.33,
      html5: true,
      onloaderror: () => console.warn('music.mp3 bulunamadı. public/music.mp3 ekleyebilirsin.'),
      onplayerror: () => console.warn('Tarayıcı sesi engelledi; butona tekrar dokunulabilir.')
    });
    soundRef.current = h;
    return h;
  }, []);

  function startExperience() {
    if (!started) {
      try { sound.play(); } catch { /* müzik dosyası yoksa deneyim yine başlar */ }
      setStarted(true);
    }
  }

  return (
    <main className="app-shell">
      <Scene started={started} activePanel={activePanel} setActivePanel={setActivePanel} />
      <Overlay started={started} onStart={startExperience} activePanel={activePanel} setActivePanel={setActivePanel} />
    </main>
  );
}
