import { AnimatePresence, motion } from 'framer-motion'
import { floatingWords, lovePanels } from './loveTexts.js'

const panelMap = Object.fromEntries(lovePanels.map(p => [p.id, p]))

export default function Overlay({ started, onStart, activePanel, setActivePanel }) {
  const panel = activePanel ? panelMap[activePanel] : null

  return <div className="overlay">
    <div className="soft-gradient" />

    <AnimatePresence>
      {!started && <motion.section className="start-screen" initial={{opacity:1}} exit={{opacity:0, filter:'blur(14px)', scale:1.03}} transition={{duration:1.05, ease:'easeInOut'}}>
        <motion.div className="start-card" initial={{y:22, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:.9, ease:'easeOut'}}>
          <div className="eyebrow">ДЛЯ ТЕБЯ</div>
          <h1>Маленькая вселенная<br/>открывается<br/>только для тебя</h1>
          <p>Некоторые чувства нельзя объяснить. Их можно только почувствовать сердцем.</p>
          <button onClick={onStart} className="start-button">Коснись моей души</button>
          <span className="music-note">Музыка начнётся после касания</span>
        </motion.div>
      </motion.section>}
    </AnimatePresence>

    {started && <>
      <div className="hint">Коснись золотых сфер</div>
      <div className="floating-words">
        {floatingWords.map((w, i) => <motion.span key={w} className="floating-word" style={{left:`${6 + (i*17)%84}%`, top:`${10 + (i*23)%78}%`}} animate={{opacity:[.08,.32,.10], y:[0,-18,0]}} transition={{duration:9 + (i%5), repeat:Infinity, delay:i*.42}}>{w}</motion.span>)}
      </div>
    </>}

    <AnimatePresence>
      {panel && <motion.div className="modal-backdrop" onClick={() => setActivePanel(null)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
        <motion.article className="love-panel" onClick={(e) => e.stopPropagation()} initial={{opacity:0, y:90, scale:.96}} animate={{opacity:1, y:0, scale:1}} exit={{opacity:0, y:55, scale:.97}} transition={{type:'spring', stiffness:92, damping:18}}>
          <div className="panel-topline">{panel.small}</div>
          <h2>{panel.title}</h2>
          <div className="panel-body">{panel.body}</div>
          <button className="close-button" onClick={() => setActivePanel(null)}>Закрыть</button>
        </motion.article>
      </motion.div>}
    </AnimatePresence>
  </div>
}
