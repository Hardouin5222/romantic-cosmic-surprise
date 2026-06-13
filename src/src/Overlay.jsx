import { AnimatePresence, motion } from 'framer-motion';
import { floatingWords, panels } from './data/loveTexts.js';

export default function Overlay({ started, onStart, activePanel, setActivePanel }) {
  const panel = activePanel ? panels[activePanel] : null;
  return (
    <div className="overlay">
      <div className="cinematic-gradient" />
      <AnimatePresence>
        {!started && (
          <motion.section className="start-screen" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04, filter: 'blur(14px)' }} transition={{ duration: 1.15, ease: 'easeInOut' }}>
            <motion.div className="start-card" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
              <p className="eyebrow">Для тебя, моя вселенная</p>
              <h1>Открой маленькую вселенную внутри сердца</h1>
              <p className="lead">Некоторые чувства не рассказывают. Их только проживают — тихо, глубоко, как свет между звёздами.</p>
              <button onClick={onStart} className="start-button">Ruhuma Dokun</button>
              <p className="hint">нажми — и пусть всё начнётся нежно</p>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {started && (
        <>
          <motion.div className="top-pill" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>Нажми на золотые сферы</motion.div>
          <div className="floating-words">
            {floatingWords.map((word, i) => (
              <motion.span key={`${word}-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: [0.08, 0.36, 0.12], y: [16, -20, 16] }} transition={{ duration: 8 + (i % 6), repeat: Infinity, delay: i * 0.35 }} style={{ left: `${5 + ((i * 19) % 86)}%`, top: `${10 + ((i * 23) % 76)}%` }}>{word}</motion.span>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {panel && (
          <motion.div className="modal-backdrop" onClick={() => setActivePanel(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.article className="poem-panel" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 72, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 42, scale: 0.96 }} transition={{ type: 'spring', stiffness: 105, damping: 19 }}>
              <div className="panel-head">
                <p>{panel.subtitle}</p>
                <button onClick={() => setActivePanel(null)}>×</button>
              </div>
              <h2>{panel.title}</h2>
              <small>{panel.tr}</small>
              <div className="poem-body">{panel.body}</div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
