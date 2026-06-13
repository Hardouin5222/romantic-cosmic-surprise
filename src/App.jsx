import { useMemo, useState } from 'react'
import { Howl } from 'howler'
import Scene from './Scene.jsx'
import Overlay from './Overlay.jsx'

export default function App() {
  const [started, setStarted] = useState(false)
  const [activePanel, setActivePanel] = useState(null)

  const music = useMemo(() => new Howl({
    src: ['/music.mp3'],
    html5: true,
    loop: true,
    volume: 0.42
  }), [])

  function start() {
    if (!started) {
      try { music.play() } catch {}
      setStarted(true)
    }
  }

  return (
    <main className="app-shell">
      <Scene started={started} activePanel={activePanel} setActivePanel={setActivePanel} />
      <Overlay started={started} onStart={start} activePanel={activePanel} setActivePanel={setActivePanel} />
    </main>
  )
}
