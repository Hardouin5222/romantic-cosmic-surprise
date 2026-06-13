import { useMemo, useState } from "react";
import { Howl } from "howler";
import Scene from "./Scene";
import Overlay from "./Overlay";

export default function App() {
  const [started, setStarted] = useState(false);
  const [activePanel, setActivePanel] = useState(null);

  const sound = useMemo(() => {
    return new Howl({
      src: ["/music.mp3"],
      loop: true,
      volume: 0.38,
      html5: true,
    });
  }, []);

  const startExperience = () => {
    if (!started) {
      sound.play();
      setStarted(true);
    }
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#020817] text-white">
      <Scene
        started={started}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
      />

      <Overlay
        started={started}
        onStart={startExperience}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
      />
    </main>
  );
}
