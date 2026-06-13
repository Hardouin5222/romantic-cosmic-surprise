import { AnimatePresence, motion } from "framer-motion";

const panels = {
  path: {
    title: "Путь любви",
    subtitle: "Aşkın yolu",
    body: `Когда ты вступаешь на любой путь, кроме любви, ты заранее строишь планы, думаешь, рассчитываешь и прокладываешь себе дорогу. Но есть только один путь, который не подчиняется расчёту, — это путь любви, твой путь.

На путь любви входят сердцем, следуя туда, куда ведёт сердце. Ты бросаешь себя туда, откуда доносится зов Возлюбленной. Теперь ты — Меджнун. Какие расчёты делал Меджнун, когда ушёл в пустыню? Он отпустил себя в океан любви.

И я тоже хочу отдать себя тебе. Моя логика, мой разум, мой ум больше мне не помогают. Перед тобой у меня есть только сердце — готовое повиноваться тебе ради твоего счастья.`,
  },

  fire: {
    title: "Огонь любви",
    subtitle: "Aşkın ateşi",
    body: `Я хочу любить тебя так сильно и скучать по тебе, как по горящему огню. Если бы твои слёзы были огнём, я пил бы этот огонь глоток за глотком. Если бы ты добавила яд в огонь своих слёз, я пил бы его как источник жизни.

Огонь, который ты зажигаешь в моём сердце, становится дворцом из роз, а твой яд — розовым шербетом. Когда я пью яд любви, розы расцветают на моих губах и в моём дыхании.

Если бы ты была сладкой смертью, я прибежал бы к тебе, зная, что ты спрячешь в своих глазах частицу рая и укроешь нас обоих своими веками.

Я хочу любить тебя так сильно и скучать по тебе так яростно, что лунный свет, струящийся из моего левого глаза, проникал бы в твою жизнь, как вода Кевсера. Твоя улыбка стала бы мельницей ветра в моей жизни, так кружила бы мне голову, что ослабила бы мой разум, и я захотел бы почувствовать себя безумцем, заблудившимся в пустынях.

Если однажды море в твоём сердце высохнет от засухи, я сожму свои глаза, как облака, и пролью свои слёзы дождём в море моего сердца. Так море моего сердца оживёт снова.

Будь птицей надежды с чисто белыми перьями в моём сердце. Возьми меня на одно из своих крыльев, и полетим к золотозвёздному горизонту моего сердца.`,
  },

  stars: {
    title: "Мои звёзды",
    subtitle: "Yıldızlara saçılan sözler",
    body: `Любимая моя, сияющая луна моя, мой самый близкий друг, султанша всех красавиц.

Причина моей жизни, мой рай, мой Кевсер, моя весна, моя радость, смысл моих дней.

Моя улыбающаяся роза, источник моей радости, вкус в моём напитке, светлая лампада моих ночей.

Мой апельсиновый свет, мой гранат, моё сокровище, моя нетронутая любовь в этом мире.

Султан Египта в моём сердце, мой Юсуф, смысл моего существования, мой Стамбул, мой Караман, любовь, равная всем землям Анатолии и Рума.

Мой Бадахшан, мой Кыпчак, мой Багдад, мой Хорасан. Красавица с прекрасными волосами, с бровями как лук, с сияющими глазами.

У твоих дверей я всегда восхваляю тебя, будто мне поручено только одно — славить тебя вечно.`,
  },
};

const floatingWords = [
  "любимая моя",
  "моя весна",
  "моё сокровище",
  "сияющая луна",
  "мой рай",
  "свет моих ночей",
  "султанша сердца",
  "моя роза",
  "мой Кевсер",
];

export default function Overlay({ started, onStart, activePanel, setActivePanel }) {
  const panel = activePanel ? panels[activePanel] : null;

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,8,23,0.18)_45%,rgba(0,0,0,0.55)_100%)]" />

      {started && (
        <div className="absolute inset-0 overflow-hidden">
          {floatingWords.map((word, index) => (
            <motion.span
              key={word}
              className="absolute text-[10px] tracking-[0.35em] text-amber-100/35"
              initial={{ opacity: 0, y: 18 }}
              animate={{
                opacity: [0.12, 0.45, 0.18],
                y: [18, -18, 18],
              }}
              transition={{
                duration: 7 + index,
                repeat: Infinity,
                delay: index * 0.45,
              }}
              style={{
                left: `${8 + ((index * 13) % 78)}%`,
                top: `${12 + ((index * 17) % 72)}%`,
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}

      <AnimatePresence>
        {!started && (
          <motion.section
            className="pointer-events-auto absolute inset-0 flex items-center justify-center px-6"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          >
            <div className="max-w-sm rounded-[2rem] border border-amber-200/20 bg-white/[0.07] px-7 py-8 text-center shadow-2xl shadow-amber-500/10 backdrop-blur-2xl">
              <p className="mb-3 text-[10px] uppercase tracking-[0.55em] text-amber-100/50">
                Для тебя
              </p>

              <h1 className="font-serif text-4xl leading-[0.95] text-amber-50">
                Открывается маленькая вселенная
              </h1>

              <p className="mx-auto mt-5 max-w-xs text-sm leading-6 text-slate-200/70">
                Иногда некоторые чувства невозможно выразить словами.
              </p>

              <button
                onClick={onStart}
                className="mt-7 rounded-full border border-amber-200/30 bg-amber-200/90 px-7 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_35px_rgba(255,215,0,0.24)] transition hover:scale-105 hover:bg-amber-100"
              >
                Ruhuma Dokun
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {panel && (
          <motion.div
            className="pointer-events-auto absolute inset-0 flex items-end justify-center bg-black/25 px-4 pb-5 pt-20 backdrop-blur-[2px] sm:items-center"
            onClick={() => setActivePanel(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.article
              onClick={(e) => e.stopPropagation()}
              className="max-h-[76vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-amber-100/20 bg-[#07111f]/70 p-6 text-left shadow-2xl shadow-black/50 backdrop-blur-2xl"
              initial={{ opacity: 0, y: 70, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 95, damping: 18 }}
            >
              <p className="text-[10px] uppercase tracking-[0.5em] text-amber-200/60">
                {panel.subtitle}
              </p>

              <h2 className="mt-2 font-serif text-3xl text-amber-50">
                {panel.title}
              </h2>

              <div className="mt-5 whitespace-pre-line text-[15px] leading-8 text-slate-100/82">
                {panel.body}
              </div>

              <button
                onClick={() => setActivePanel(null)}
                className="mt-6 rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm text-amber-50"
              >
                Закрыть
              </button>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
