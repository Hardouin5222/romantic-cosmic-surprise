import { AnimatePresence, motion } from 'framer-motion';
import { floatingWords, panels } from './loveTexts.js';

export default function Overlay({ started, begin, activePanel, setActivePanel, musicReady }) {
  const panel = activePanel ? panels[activePanel] : null;

  return (
    <div className="overlay-root">
      <div className="cinema-gradient" />
      <AnimatePresence>{!started && <StartScreen begin={begin} musicReady={musicReady} />}</AnimatePresence>
      {started && <FloatingWords />}
      <AnimatePresence>{panel && <LoveModal panel={panel} close={() => setActivePanel(null)} />}</AnimatePresence>
      {started && !panel && <Hint />}
    </div>
  );
}

function StartScreen({ begin, musicReady }) {
  return (
    <motion.section
      className="start-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(18px)' }}
      transition={{ duration: 1.15, ease: 'easeInOut' }}
    >
      <motion.div className="start-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1 }}>
        <div className="small-overline">Для тебя</div>
        <h1>Маленькая вселенная открывается только для тебя</h1>
        <p>Некоторые чувства нельзя объяснить. Их можно только почувствовать сердцем.</p>
        <button onClick={begin} className="start-button">Ruhuma Dokun</button>
        <span className="music-note">{musicReady ? 'Музыка готова' : 'Музыка начнётся после касания'}</span>
      </motion.div>
    </motion.section>
  );
}

function FloatingWords() {
  return (
    <div className="floating-words">
      {floatingWords.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: [0.1, 0.55, 0.16], y: [22, -22, 22], x: [0, i % 2 ? 12 : -12, 0] }}
          transition={{ duration: 8 + (i % 7), delay: i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
          style={{ left: `${6 + ((i * 19) % 84)}%`, top: `${10 + ((i * 13) % 78)}%` }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

function Hint() {
  return (
    <motion.div className="hint-pill" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
      Коснись золотых сфер
    </motion.div>
  );
}

function LoveModal({ panel, close }) {
  return (
    <motion.div className="modal-backdrop" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.article
        className="love-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 90, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 55, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 90, damping: 18 }}
      >
        <div className="small-overline">{panel.trTitle}</div>
        <h2>{panel.title}</h2>
        <div className="poem-lines">
          {panel.lines.map((line, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.045, 1.2) }}>
              {line}
            </motion.p>
          ))}
        </div>
        <button onClick={close} className="close-button">Закрыть</button>
      </motion.article>
    </motion.div>
  );
}
