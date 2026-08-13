import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Heart, X, Lock, Check, Flame, Award, Trophy, Sparkles,
  Landmark, RotateCcw, ArrowRight, Star, Crown, PartyPopper, Zap,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* DATA */
/* ------------------------------------------------------------------ */

const UNITS = [
  {
    id: "u1",
    latin: "SALVE!",
    german: "Erste Wörter & Begrüßung",
    lessons: [
      {
        id: "u1-l1",
        title: "Begrüßung",
        exercises: [
          { type: "mc", q: "Was bedeutet „salve“?", options: ["Hallo", "Tschüss", "Danke", "Bitte"], correct: 0 },
          { type: "mc", q: "Wie sagt man „Leb wohl“ auf Latein?", options: ["Salve", "Vale", "Amicus", "Puella"], correct: 1 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "amicus", accept: ["freund"] },
          { type: "mc", q: "„Amica“ bedeutet …", options: ["Freundin", "Lehrer", "Junge", "Mädchen"], correct: 0 },
        ],
      },
      {
        id: "u1-l2",
        title: "Personen",
        exercises: [
          { type: "mc", q: "„Puer“ bedeutet …", options: ["Junge", "Mädchen", "Lehrer", "Freund"], correct: 0 },
          { type: "mc", q: "„Puella“ bedeutet …", options: ["Freundin", "Lehrerin", "Mädchen", "Frau"], correct: 2 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "magister", accept: ["lehrer"] },
          { type: "mc", q: "Was bedeutet „quis“?", options: ["wer", "was", "wo", "warum"], correct: 0 },
        ],
      },
      {
        id: "u1-l3",
        title: "Erste Sätze",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Junge ist ein Freund.“", words: ["Puer", "amicus", "est"], correct: ["Puer", "amicus", "est"] },
          { type: "mc", q: "„Puella laeta est.“ bedeutet …", options: ["Das Mädchen ist fröhlich.", "Der Junge ist fröhlich.", "Das Mädchen ist traurig.", "Der Lehrer ist fröhlich."], correct: 0 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Die Lehrerin ist eine Freundin.“", words: ["Magistra", "amica", "est"], correct: ["Magistra", "amica", "est"] },
          { type: "mc", q: "„Puer amicus est.“ bedeutet …", options: ["Der Lehrer ist ein Freund.", "Das Mädchen ist eine Freundin.", "Der Junge ist ein Freund.", "Der Junge ist fröhlich."], correct: 2 },
        ],
      },
    ],
  },
  {
    id: "u2",
    latin: "FAMILIA ROMANA",
    german: "a-Deklination",
    lessons: [
      {
        id: "u2-l1",
        title: "Wortschatz",
        exercises: [
          { type: "mc", q: "„Rosa“ bedeutet …", options: ["Rose", "Wald", "Wasser", "Insel"], correct: 0 },
          { type: "mc", q: "„Silva“ bedeutet …", options: ["Straße", "Wald", "Erde", "Familie"], correct: 1 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "aqua", accept: ["wasser"] },
          { type: "mc", q: "„Insula“ bedeutet …", options: ["Insel", "Rose", "Tochter", "Heimat"], correct: 0 },
        ],
      },
      {
        id: "u2-l2",
        title: "Nominativ & Akkusativ",
        exercises: [
          { type: "mc", q: "Welche Endung hat der Akkusativ Singular der a-Deklination?", options: ["-am", "-a", "-ae", "-is"], correct: 0 },
          { type: "mc", q: "Wähle die richtige Form: „Puella ___ videt.“ (Das Mädchen sieht die Rose.)", options: ["rosa", "rosam", "rosae", "rosis"], correct: 1 },
          { type: "mc", q: "Wähle die richtige Form: „Puella ___ videt.“ (Das Mädchen sieht den Wald.)", options: ["silva", "silvae", "silvam", "silvis"], correct: 2 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Das Mädchen sieht die Rose.“", words: ["Puella", "rosam", "videt"], correct: ["Puella", "rosam", "videt"] },
        ],
      },
      {
        id: "u2-l3",
        title: "Sätze bilden",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Die Tochter trägt das Wasser.“", words: ["Filia", "aquam", "portat"], correct: ["Filia", "aquam", "portat"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Die Familie sieht den Weg.“", words: ["Familia", "viam", "videt"], correct: ["Familia", "viam", "videt"] },
          { type: "mc", q: "„Puella silvam amat.“ bedeutet …", options: ["Das Mädchen liebt den Wald.", "Der Wald liebt das Mädchen.", "Das Mädchen sieht den Wald.", "Die Familie liebt den Wald."], correct: 0 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "via", accept: ["weg", "straße", "strasse"] },
        ],
      },
    ],
  },
  {
    id: "u3",
    latin: "IN FORO",
    german: "o-Deklination & Verben",
    lessons: [
      {
        id: "u3-l1",
        title: "Wortschatz",
        exercises: [
          { type: "mc", q: "„Servus“ bedeutet …", options: ["Herr", "Sklave", "Gott", "Tempel"], correct: 1 },
          { type: "mc", q: "„Dominus“ bedeutet …", options: ["Herr", "Sklave", "Volk", "Markt"], correct: 0 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "templum", accept: ["tempel"] },
          { type: "mc", q: "„Forum“ bedeutet …", options: ["Tempel", "Markt/Forum", "Gott", "Volk"], correct: 1 },
        ],
      },
      {
        id: "u3-l2",
        title: "Verben konjugieren",
        exercises: [
          { type: "mc", q: "„Ich liebe“ heißt …", options: ["amo", "amas", "amat", "amant"], correct: 0 },
          { type: "mc", q: "„Du rufst“ heißt …", options: ["voco", "vocas", "vocat", "vocamus"], correct: 1 },
          { type: "mc", q: "„Er/Sie arbeitet“ heißt …", options: ["laboro", "laboras", "laborat", "laborant"], correct: 2 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Sklave ruft den Herrn.“", words: ["Servus", "dominum", "vocat"], correct: ["Servus", "dominum", "vocat"] },
        ],
      },
      {
        id: "u3-l3",
        title: "Sätze im Forum",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Das Volk betrachtet den Gott.“", words: ["Populus", "deum", "spectat"], correct: ["Populus", "deum", "spectat"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Herr liebt den Tempel.“", words: ["Dominus", "templum", "amat"], correct: ["Dominus", "templum", "amat"] },
          { type: "mc", q: "„Servus in foro laborat.“ bedeutet …", options: ["Der Sklave arbeitet auf dem Forum.", "Der Herr liebt das Forum.", "Das Volk arbeitet im Tempel.", "Der Sklave ruft den Herrn."], correct: 0 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "deus", accept: ["gott"] },
        ],
      },
    ],
  },
  {
    id: "u4",
    latin: "FAMILIA ET RES",
    german: "Dativ & Genitiv",
    lessons: [
      {
        id: "u4-l1",
        title: "Genitiv – wem gehört's?",
        exercises: [
          { type: "mc", q: "Welche Endung hat der Genitiv Singular der a-Deklination?", options: ["-ae", "-am", "-a", "-is"], correct: 0 },
          { type: "mc", q: "Wähle die richtige Form: „liber ___“ (das Buch des Mädchens)", options: ["puellae", "puellam", "puella", "puellis"], correct: 0 },
          { type: "mc", q: "Wähle die richtige Form: „liber ___“ (das Buch des Sklaven)", options: ["servo", "servum", "servi", "servus"], correct: 2 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "liber", accept: ["buch"] },
        ],
      },
      {
        id: "u4-l2",
        title: "Dativ – wem gibt man etwas?",
        exercises: [
          { type: "mc", q: "Welche Endung hat der Dativ Singular der a-Deklination?", options: ["-ae", "-am", "-a", "-arum"], correct: 0 },
          { type: "mc", q: "Wähle die richtige Form: „Pater ___ librum dat.“ (Der Vater gibt der Tochter das Buch.)", options: ["filiam", "filia", "filiae", "filias"], correct: 2 },
          { type: "mc", q: "Wähle die richtige Form: „Domina ___ rosam dat.“ (Die Herrin gibt dem Sklaven eine Rose.)", options: ["servo", "servi", "servum", "servus"], correct: 0 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Vater gibt der Tochter das Buch.“", words: ["Pater", "filiae", "librum", "dat"], correct: ["Pater", "filiae", "librum", "dat"] },
        ],
      },
      {
        id: "u4-l3",
        title: "Gemischte Sätze",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Die Sklavin gibt dem Herrn Wasser.“", words: ["Ancilla", "domino", "aquam", "dat"], correct: ["Ancilla", "domino", "aquam", "dat"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Bruder gibt der Schwester eine Rose.“", words: ["Frater", "sorori", "rosam", "dat"], correct: ["Frater", "sorori", "rosam", "dat"] },
          { type: "mc", q: "„Servus narrat fabulam.“ bedeutet …", options: ["Der Sklave erzählt eine Geschichte.", "Der Sklave gibt ein Buch.", "Die Geschichte erzählt den Sklaven.", "Der Sklave liest ein Buch."], correct: 0 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "narrare", accept: ["erzählen"] },
        ],
      },
    ],
  },
  {
    id: "u5",
    latin: "DEI ET DEAE",
    german: "Götter & Mythologie",
    lessons: [
      {
        id: "u5-l1",
        title: "Die Götter",
        exercises: [
          { type: "mc", q: "Wer ist der oberste Gott der Römer?", options: ["Iuppiter", "Mars", "Neptunus", "Apollo"], correct: 0 },
          { type: "mc", q: "Wer ist die Göttin der Liebe?", options: ["Minerva", "Venus", "Diana", "Iuno"], correct: 1 },
          { type: "mc", q: "Wer ist der Gott des Meeres?", options: ["Vulcanus", "Mercurius", "Neptunus", "Mars"], correct: 2 },
          { type: "mc", q: "Wer ist der Gott des Krieges?", options: ["Mars", "Apollo", "Iuppiter", "Mercurius"], correct: 0 },
        ],
      },
      {
        id: "u5-l2",
        title: "Mythologische Sätze",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Iuppiter ruft die Götter.“", words: ["Iuppiter", "deos", "vocat"], correct: ["Iuppiter", "deos", "vocat"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Venus liebt die Rose.“", words: ["Venus", "rosam", "amat"], correct: ["Venus", "rosam", "amat"] },
          { type: "mc", q: "„Minerva populum servat.“ bedeutet …", options: ["Minerva beschützt das Volk.", "Das Volk beschützt Minerva.", "Minerva liebt das Volk.", "Minerva ruft das Volk."], correct: 0 },
          { type: "mc", q: "Diana ist die Göttin …", options: ["der Jagd", "des Krieges", "des Meeres", "des Handels"], correct: 0 },
        ],
      },
      {
        id: "u5-l3",
        title: "Abschlusstest",
        exercises: [
          { type: "mc", q: "Welche Endung hat der Akkusativ Singular der a-Deklination?", options: ["-am", "-ae", "-a", "-is"], correct: 0 },
          { type: "mc", q: "Welche Endung hat der Dativ Singular der o-Deklination?", options: ["-i", "-o", "-um", "-us"], correct: 1 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Apollo betrachtet das Volk.“", words: ["Apollo", "populum", "spectat"], correct: ["Apollo", "populum", "spectat"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Juno erzählt der Göttin eine Geschichte.“", words: ["Iuno", "deae", "fabulam", "narrat"], correct: ["Iuno", "deae", "fabulam", "narrat"] },
          { type: "mc", q: "„Mars servum vocat.“ bedeutet …", options: ["Mars ruft den Sklaven.", "Der Sklave ruft Mars.", "Mars liebt den Sklaven.", "Der Sklave beschützt Mars."], correct: 0 },
        ],
      },
    ],
  },
];

const FLAT_LESSONS = UNITS.flatMap((u) => u.lessons.map((l) => ({ ...l, unitId: u.id })));

const RANKS = [
  { min: 0, title: "Tiro", sub: "Rekrut" },
  { min: 50, title: "Discipulus", sub: "Schüler" },
  { min: 150, title: "Quaestor", sub: "Schatzmeister" },
  { min: 300, title: "Aedilis", sub: "Ädil" },
  { min: 500, title: "Praetor", sub: "Prätor" },
  { min: 800, title: "Consul", sub: "Konsul" },
  { min: 1200, title: "Caesar", sub: "Imperator" },
];

function getRank(xp) {
  let current = RANKS[0];
  let next = RANKS[1];
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].min) {
      current = RANKS[i];
      next = RANKS[i + 1] || null;
    }
  }
  return { current, next };
}

const BADGES = [
  { id: "first", title: "Prima Lectio", desc: "Erste Lektion abgeschlossen", icon: Sparkles },
  { id: "perfect", title: "Sine Errore", desc: "Eine Lektion ohne Fehler gemeistert", icon: Star },
  { id: "unit", title: "Cursus Confectus", desc: "Eine ganze Einheit gemeistert", icon: Trophy },
  { id: "xp150", title: "Centurio", desc: "150 XP gesammelt", icon: Award },
  { id: "streak5", title: "Quinque Dies", desc: "Serie von 5 Tagen", icon: Flame },
];

const UNIT_GRADIENTS = [
  "linear-gradient(135deg, #7C3AED, #EC4899)",
  "linear-gradient(135deg, #F59E0B, #EF4444)",
  "linear-gradient(135deg, #059669, #14B8A6)",
  "linear-gradient(135deg, #2563EB, #7C3AED)",
  "linear-gradient(135deg, #EF4444, #F59E0B)",
];

const CONFETTI_COLORS = ["#E8483A", "#FFB627", "#2EC4B6", "#7C3AED", "#EC4899", "#3B82F6"];
const GOLD_COLORS = ["#FFB627", "#FFD166", "#F59E0B", "#FFE08C"];

/* ------------------------------------------------------------------ */
/* HELPERS */
/* ------------------------------------------------------------------ */

function normalize(s) {
  return s.trim().toLowerCase().replace(/[.,!?;:]/g, "");
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    let raf;
    function step(ts) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

/* ------------------------------------------------------------------ */
/* SMALL VISUAL COMPONENTS */
/* ------------------------------------------------------------------ */

function Laurel({ size = 56, color = "#A8730B" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="absolute inset-0 pointer-events-none">
      <g stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round">
        <path d="M20 85 C10 65, 12 35, 30 15" />
        <path d="M20 78 C24 78, 28 74, 26 68" />
        <path d="M18 66 C22 66, 26 62, 24 56" />
        <path d="M18 54 C22 54, 26 50, 24 44" />
        <path d="M20 42 C24 42, 28 38, 26 32" />
        <path d="M24 30 C28 30, 31 27, 29 22" />
        <path d="M80 85 C90 65, 88 35, 70 15" />
        <path d="M80 78 C76 78, 72 74, 74 68" />
        <path d="M82 66 C78 66, 74 62, 76 56" />
        <path d="M82 54 C78 54, 74 50, 76 44" />
        <path d="M80 42 C76 42, 72 38, 74 32" />
        <path d="M76 30 C72 30, 69 27, 71 22" />
      </g>
    </svg>
  );
}

function StoneRoad() {
  return (
    <div
      className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-2 rounded-full"
      style={{
        background:
          "repeating-linear-gradient(180deg, #FFB627 0px, #FFB627 10px, transparent 10px, transparent 20px)",
        opacity: 0.5,
      }}
    />
  );
}

function Confetti({ pieceCount = 60, gold = false }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: pieceCount }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1.4,
        rotate: Math.random() * 360,
        color: (gold ? GOLD_COLORS : CONFETTI_COLORS)[i % (gold ? GOLD_COLORS.length : CONFETTI_COLORS.length)],
        width: 5 + Math.random() * 6,
        height: 8 + Math.random() * 8,
        drift: (Math.random() - 0.5) * 120,
      })),
    [pieceCount, gold]
  );
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.width,
            height: p.height,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--drift": `${p.drift}px`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function FloatingXp({ item }) {
  if (!item) return null;
  return (
    <div key={item.id} className="float-xp-pop fixed top-16 right-6 z-40 pointer-events-none">
      <span className="font-display text-lg text-[#FFB627] drop-shadow" style={{ WebkitTextStroke: "1px #7A2E24" }}>
        +{item.amount} XP
      </span>
    </div>
  );
}

function ComboToast({ text }) {
  if (!text) return null;
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none combo-pop">
      <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white px-4 py-2 rounded-full shadow-lg font-display text-sm tracking-wide">
        <Zap size={16} fill="white" /> {text}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN APP */
/* ------------------------------------------------------------------ */

export default function App() {
  const [screen, setScreen] = useState("path");
  const [xp, setXp] = useState(30);
  const [streak, setStreak] = useState(3);
  const [hearts, setHearts] = useState(5);
  const [completed, setCompleted] = useState(new Set());
  const [unlockedBadges, setUnlockedBadges] = useState(new Set());
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [lastCompletedId, setLastCompletedId] = useState(null);

  const [idx, setIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [combo, setCombo] = useState(0);

  const [selected, setSelected] = useState(null);
  const [text, setText] = useState("");
  const [bank, setBank] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const [floatXp, setFloatXp] = useState(null);
  const [comboToast, setComboToast] = useState(null);
  const [heartShake, setHeartShake] = useState(false);

  const [newBadges, setNewBadges] = useState([]);
  const [newStreakValue, setNewStreakValue] = useState(0);

  const rank = getRank(xp);

  const currentLesson = useMemo(
    () => FLAT_LESSONS.find((l) => l.id === currentLessonId) || null,
    [currentLessonId]
  );
  const exercises = currentLesson ? currentLesson.exercises : [];
  const ex = exercises[idx];

  useEffect(() => {
    if (!ex) return;
    setSelected(null);
    setText("");
    setChecked(false);
    setIsCorrect(null);
    if (ex.type === "order") {
      setBank(shuffle(ex.words));
      setAnswer([]);
    }
  }, [idx, currentLessonId]);

  useEffect(() => {
    if (!floatXp) return;
    const t = setTimeout(() => setFloatXp(null), 850);
    return () => clearTimeout(t);
  }, [floatXp]);

  useEffect(() => {
    if (!comboToast) return;
    const t = setTimeout(() => setComboToast(null), 1300);
    return () => clearTimeout(t);
  }, [comboToast]);

  function isUnlocked(lessonId) {
    const i = FLAT_LESSONS.findIndex((l) => l.id === lessonId);
    if (i === 0) return true;
    return completed.has(FLAT_LESSONS[i - 1].id);
  }

  function startLesson(lessonId) {
    setCurrentLessonId(lessonId);
    setIdx(0);
    setMistakes(0);
    setSessionXp(0);
    setCombo(0);
    setHearts(5);
    setScreen("lesson");
  }

  function retryLesson() {
    setIdx(0);
    setMistakes(0);
    setSessionXp(0);
    setCombo(0);
    setHearts(5);
    setScreen("lesson");
  }

  function toggleOrderWord(word, from) {
    if (checked) return;
    if (from === "bank") {
      setBank((b) => {
        const i = b.indexOf(word);
        const nb = [...b];
        nb.splice(i, 1);
        return nb;
      });
      setAnswer((a) => [...a, word]);
    } else {
      setAnswer((a) => {
        const i = a.indexOf(word);
        const na = [...a];
        na.splice(i, 1);
        return na;
      });
      setBank((b) => [...b, word]);
    }
  }

  function canCheck() {
    if (!ex) return false;
    if (ex.type === "mc") return selected !== null;
    if (ex.type === "translate") return text.trim().length > 0;
    if (ex.type === "order") return answer.length === ex.words.length;
    return false;
  }

  function handleCheck() {
    let correct = false;
    if (ex.type === "mc") correct = selected === ex.correct;
    if (ex.type === "translate") correct = ex.accept.includes(normalize(text));
    if (ex.type === "order") correct = answer.join("|") === ex.correct.join("|");

    setIsCorrect(correct);
    setChecked(true);

    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const bonus = newCombo >= 3 ? 5 : 0;
      const gain = 10 + bonus;
      setSessionXp((v) => v + gain);
      setFloatXp({ id: Date.now(), amount: gain });
      if (newCombo >= 3) setComboToast(`COMBO x${newCombo}! 🔥`);
    } else {
      setCombo(0);
      setMistakes((m) => m + 1);
      setHearts((h) => Math.max(0, h - 1));
      setHeartShake(true);
      setTimeout(() => setHeartShake(false), 500);
    }
  }

  function handleContinue() {
    if (hearts === 0 && !isCorrect) {
      setScreen("failed");
      return;
    }
    if (idx + 1 < exercises.length) {
      setIdx((i) => i + 1);
    } else {
      finishLesson();
    }
  }

  function finishLesson() {
    const wasFirst = completed.size === 0;
    const perfect = mistakes === 0;
    const nextCompleted = new Set(completed);
    nextCompleted.add(currentLessonId);
    setCompleted(nextCompleted);
    setLastCompletedId(currentLessonId);

    const totalXp = xp + sessionXp;
    setXp(totalXp);
    const newStreak = streak + 1;
    setStreak(newStreak);
    setNewStreakValue(newStreak);

    const unit = UNITS.find((u) => u.id === currentLesson.unitId);
    const unitJustCompleted = unit.lessons.every((l) => nextCompleted.has(l.id));

    const earned = [];
    if (wasFirst) earned.push("first");
    if (perfect) earned.push("perfect");
    if (unitJustCompleted) earned.push("unit");
    if (totalXp >= 150) earned.push("xp150");
    if (newStreak >= 5) earned.push("streak5");

    const freshlyNew = earned.filter((id) => !unlockedBadges.has(id));
    if (freshlyNew.length) {
      setUnlockedBadges((prev) => {
        const s = new Set(prev);
        freshlyNew.forEach((id) => s.add(id));
        return s;
      });
    }
    setNewBadges(freshlyNew);
    setScreen("summary");
  }

  /* -------------------------------- PATH SCREEN -------------------------------- */

  if (screen === "path") {
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
        <FontImport />
        <div className="w-full max-w-md bg-[#FFF6E9] min-h-screen pb-24">
          <div className="sticky top-0 z-20 bg-[#FFFBF2]/95 backdrop-blur border-b border-[#F0DFC0] px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                  style={{ background: "linear-gradient(135deg, #E8483A, #FFB627)" }}
                >
                  <Landmark size={19} color="#FFFBF2" />
                </div>
                <div>
                  <div
                    className="font-display text-[16px] tracking-wide leading-none bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(90deg, #E8483A, #C2410C)" }}
                  >
                    LINGUA LATINA
                  </div>
                  <div className="text-[10px] text-[#8B5CF6] mt-0.5 italic font-semibold">
                    Roma te vocat! 🏛️
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatPill icon={<Flame size={15} color="#FF7A1A" fill="#FF7A1A" />} value={streak} />
                <StatPill icon={<Heart size={15} color="#E8483A" fill="#E8483A" />} value={hearts} />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[11px] font-bold text-[#C2410C] tracking-wide">
                  {rank.current.title.toUpperCase()} · {rank.current.sub}
                </span>
                <span className="text-[11px] text-[#8A7F68] font-mono">
                  {xp} XP{rank.next ? ` / ${rank.next.min}` : " · MAX"}
                </span>
              </div>
              <div className="h-2 rounded-full bg-[#F0DFC0] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    background: "linear-gradient(90deg, #FFB627, #E8483A)",
                    width: rank.next
                      ? `${Math.min(100, ((xp - rank.current.min) / (rank.next.min - rank.current.min)) * 100)}%`
                      : "100%",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
            {BADGES.map((b) => {
              const on = unlockedBadges.has(b.id);
              const Icon = b.icon;
              return (
                <div
                  key={b.id}
                  title={b.desc}
                  className={`shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center ${
                    on ? "bg-gradient-to-br from-[#FFE08C] to-[#FFB627] border-[#F59E0B]" : "bg-[#EFE6D4] border-[#E4D7BA] grayscale opacity-60"
                  }`}
                >
                  <Icon size={20} color={on ? "#7A2E00" : "#8A7F68"} />
                </div>
              );
            })}
          </div>

          <div className="relative px-4 pt-2">
            {UNITS.map((unit, uIdx) => (
              <div key={unit.id} className="relative">
                <UnitBanner unit={unit} completed={completed} gradient={UNIT_GRADIENTS[uIdx % UNIT_GRADIENTS.length]} />
                <div className="relative py-4">
                  <StoneRoad />
                  <div className="flex flex-col gap-7 relative">
                    {unit.lessons.map((lesson) => {
                      const gIdx = FLAT_LESSONS.findIndex((l) => l.id === lesson.id);
                      const offset = Math.round(Math.sin(gIdx * 0.9) * 70);
                      const isDone = completed.has(lesson.id);
                      const unlocked = isUnlocked(lesson.id);
                      const isNext =
                        unlocked && !isDone && FLAT_LESSONS.findIndex((l) => !completed.has(l.id)) === gIdx;
                      const justPopped = lesson.id === lastCompletedId;
                      return (
                        <div
                          key={lesson.id}
                          className="relative flex justify-center"
                          style={{ transform: `translateX(${offset}px)` }}
                        >
                          <button
                            onClick={() => unlocked && startLesson(lesson.id)}
                            disabled={!unlocked}
                            className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 ${
                              !unlocked ? "bg-[#DCCFA9] cursor-not-allowed" : isDone ? "bg-gradient-to-br from-[#FFD166] to-[#FFB627]" : "bg-gradient-to-br from-[#F0533D] to-[#E8483A]"
                            } ${isNext ? "ring-4 ring-[#E8483A]/25 animate-bounce-slow" : ""} ${justPopped ? "animate-pop-in" : ""}`}
                          >
                            {isDone && <Laurel size={80} />}
                            {!unlocked ? (
                              <Lock size={22} color="#8A7F5E" />
                            ) : isDone ? (
                              <Check size={24} color="#FFFBF2" strokeWidth={3} />
                            ) : (
                              <Star size={22} color="#FFFBF2" fill="#FFFBF2" />
                            )}
                          </button>
                          <div className="absolute text-[10px] text-[#6B5F4E] font-semibold w-28 text-center" style={{ top: "68px" }}>
                            {lesson.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------- LESSON SCREEN -------------------------------- */

  if (screen === "lesson" && ex) {
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
        <FontImport />
        <FloatingXp item={floatXp} />
        <ComboToast text={comboToast} />
        <div className="w-full max-w-md bg-[#FFF6E9] min-h-screen flex flex-col">
          <div className="px-4 pt-4 pb-2 flex items-center gap-3">
            <button onClick={() => setScreen("path")} className="text-[#8A7F68]">
              <X size={22} />
            </button>
            <div className="flex-1 h-2.5 rounded-full bg-[#F0DFC0] overflow-hidden flex gap-0.5 p-0.5">
              {exercises.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-colors ${
                    i < idx ? "bg-[#2EC4B6]" : i === idx ? "bg-[#FFB627]" : "bg-transparent"
                  }`}
                />
              ))}
            </div>
            <div className={`flex items-center gap-1 text-[#E8483A] font-bold text-sm ${heartShake ? "animate-shake" : ""}`}>
              <Heart size={17} fill="#E8483A" color="#E8483A" />
              {hearts}
            </div>
          </div>

          <div className="flex-1 px-5 pt-6 pb-40">
            <div className="text-[11px] tracking-widest text-[#C2410C] font-bold mb-2">
              {currentLesson.title.toUpperCase()}
            </div>

            {ex.type === "mc" && (
              <div>
                <h2 className="font-display text-xl text-[#2B241D] mb-6 leading-snug">{ex.q}</h2>
                <div className="grid grid-cols-1 gap-3">
                  {ex.options.map((opt, i) => {
                    const isSel = selected === i;
                    let style = "border-[#F0DFC0] bg-white text-[#2B241D]";
                    if (checked && i === ex.correct) style = "border-[#2EC4B6] bg-[#2EC4B6]/15 text-[#2B241D] animate-pop-in";
                    else if (checked && isSel && i !== ex.correct) style = "border-[#E8483A] bg-[#E8483A]/10 text-[#2B241D]";
                    else if (isSel) style = "border-[#E8483A] bg-[#E8483A]/10 text-[#2B241D]";
                    return (
                      <button
                        key={i}
                        disabled={checked}
                        onClick={() => setSelected(i)}
                        className={`text-left px-4 py-3.5 rounded-xl border-2 font-serif-latin text-[15px] transition-colors ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {ex.type === "translate" && (
              <div>
                <h2 className="font-display text-base text-[#8A7F68] mb-2">{ex.prompt}</h2>
                <div className="font-serif-latin text-3xl text-[#2B241D] italic mb-8">{ex.latin}</div>
                <input
                  disabled={checked}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Deine Antwort auf Deutsch"
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-[#F0DFC0] bg-white text-[#2B241D] text-[15px] focus:outline-none focus:border-[#E8483A]"
                />
              </div>
            )}

            {ex.type === "order" && (
              <div>
                <h2 className="font-display text-base text-[#2B241D] mb-6 leading-snug">{ex.prompt}</h2>
                <div className="min-h-[64px] border-b-2 border-[#F0DFC0] flex flex-wrap gap-2 items-start pb-3 mb-6">
                  {answer.map((w, i) => (
                    <button
                      key={w + i}
                      onClick={() => toggleOrderWord(w, "answer")}
                      className="px-3.5 py-2 rounded-lg bg-[#E8483A] text-white font-serif-latin text-[15px] animate-pop-in shadow-sm"
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {bank.map((w, i) => (
                    <button
                      key={w + i}
                      onClick={() => toggleOrderWord(w, "bank")}
                      className="px-3.5 py-2 rounded-lg bg-white border-2 border-[#F0DFC0] text-[#2B241D] font-serif-latin text-[15px]"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className={`fixed bottom-0 left-0 right-0 flex justify-center border-t-2 transition-colors ${
              checked ? (isCorrect ? "bg-[#DFF5E9] border-[#2EC4B6]" : "bg-[#FBE2DC] border-[#E8483A]") : "bg-[#FFFBF2] border-[#F0DFC0]"
            }`}
          >
            <div className="w-full max-w-md px-5 py-4">
              {checked && (
                <div className="flex items-center gap-2 mb-3">
                  <div className={isCorrect ? "animate-pop-in" : ""}>
                    {isCorrect ? <Check size={22} color="#0E7A5F" strokeWidth={3} /> : <X size={20} color="#B4291D" />}
                  </div>
                  <div>
                    <div className={`font-display text-sm ${isCorrect ? "text-[#0E7A5F]" : "text-[#B4291D]"}`}>
                      {isCorrect ? "OPTIME! · Richtig!" : "NON RECTE · Nicht ganz."}
                    </div>
                    {!isCorrect && (
                      <div className="text-[13px] text-[#6B5F4E] mt-0.5">
                        Richtige Antwort:{" "}
                        <span className="font-semibold text-[#2B241D]">
                          {ex.type === "mc" && ex.options[ex.correct]}
                          {ex.type === "translate" && ex.accept[0]}
                          {ex.type === "order" && ex.correct.join(" ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {!checked ? (
                <button
                  onClick={handleCheck}
                  disabled={!canCheck()}
                  className={`w-full py-3.5 rounded-xl font-display text-sm tracking-wide transition-all ${
                    canCheck() ? "bg-gradient-to-r from-[#F0533D] to-[#E8483A] text-white shadow-md" : "bg-[#E4D7BA] text-[#A79A7E] cursor-not-allowed"
                  }`}
                >
                  PRÜFEN
                </button>
              ) : (
                <button
                  onClick={handleContinue}
                  className={`w-full py-3.5 rounded-xl font-display text-sm tracking-wide flex items-center justify-center gap-2 shadow-md ${
                    isCorrect ? "bg-gradient-to-r from-[#2EC4B6] to-[#0E9E85] text-white" : "bg-gradient-to-r from-[#E8483A] to-[#B4291D] text-white"
                  }`}
                >
                  WEITER <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------- FAILED SCREEN -------------------------------- */

  if (screen === "failed") {
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
        <FontImport />
        <div className="w-full max-w-md min-h-screen flex flex-col items-center justify-center px-8 text-center">
          <Heart size={56} color="#E8483A" className="mb-5 animate-shake" />
          <h1 className="font-display text-2xl text-[#2B241D] mb-2">KEINE LEBEN MEHR</h1>
          <p className="text-[#6B5F4E] text-[14px] mb-8">
            Deine Herzen sind aufgebraucht. Versuch die Lektion „{currentLesson.title}“ noch einmal.
          </p>
          <button
            onClick={retryLesson}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F0533D] to-[#E8483A] text-white font-display text-sm tracking-wide flex items-center justify-center gap-2 mb-3 shadow-md"
          >
            <RotateCcw size={16} /> NOCHMAL VERSUCHEN
          </button>
          <button onClick={() => setScreen("path")} className="text-[#8A7F68] text-[13px] underline">
            Zurück zum Pfad
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------- SUMMARY SCREEN -------------------------------- */

  if (screen === "summary") {
    const accuracy = Math.round((exercises.length / (exercises.length + mistakes)) * 100);
    const perfect = mistakes === 0;
    const animatedXp = useCountUp(sessionXp, 900);
    const streakMilestone = newStreakValue > 0 && newStreakValue % 5 === 0;

    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9] relative overflow-hidden">
        <FontImport />
        <Confetti pieceCount={perfect ? 90 : 55} gold={perfect} />
        <div className="w-full max-w-md min-h-screen flex flex-col items-center px-8 pt-16 pb-10 relative z-10">
          <div className="relative w-24 h-24 mb-4 flex items-center justify-center animate-pop-in">
            <Laurel size={112} color="#F59E0B" />
            <Trophy size={34} color="#FFB627" fill="#FFE08C" />
          </div>
          <h1
            className="font-display text-3xl mb-1 bg-clip-text text-transparent"
            style={{ backgroundImage: perfect ? "linear-gradient(90deg, #E8483A, #F59E0B, #2EC4B6, #7C3AED)" : "linear-gradient(90deg, #E8483A, #F59E0B)" }}
          >
            {perfect ? "OPTIME!" : "BENE FACTUM!"}
          </h1>
          <p className="text-[#6B5F4E] text-[14px] mb-8">
            {perfect ? "Perfekt, ganz ohne Fehler! 🎉" : "Gut gemacht — Lektion abgeschlossen."}
          </p>

          <div className="w-full grid grid-cols-3 gap-3 mb-6">
            <SummaryStat label="XP" value={`+${animatedXp}`} color="#F59E0B" />
            <SummaryStat label="Genauigkeit" value={`${accuracy}%`} color="#0E9E85" />
            <SummaryStat label="Serie" value={streak} color="#E8483A" />
          </div>

          {streakMilestone && (
            <div className="w-full mb-6 rounded-xl px-4 py-3 flex items-center gap-3 shadow-md animate-pop-in" style={{ background: "linear-gradient(135deg, #FF7A1A, #E8483A)" }}>
              <PartyPopper size={22} color="white" />
              <div className="text-white">
                <div className="font-display text-sm">{newStreakValue} TAGE SERIE!</div>
                <div className="text-[12px] opacity-90">Du bist on fire — weiter so!</div>
              </div>
            </div>
          )}

          {newBadges.length > 0 && (
            <div className="w-full mb-8">
              <div className="text-[11px] tracking-widest text-[#8A7F68] font-bold mb-3">NEUE AUSZEICHNUNG</div>
              {newBadges.map((id, i) => {
                const b = BADGES.find((x) => x.id === id);
                const Icon = b.icon;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-3 bg-white border-2 border-[#FFD166] rounded-xl px-4 py-3 mb-2 shadow-sm animate-pop-in"
                    style={{ animationDelay: `${i * 0.12}s` }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFE08C] to-[#FFB627] flex items-center justify-center shrink-0">
                      <Icon size={18} color="#7A2E00" />
                    </div>
                    <div>
                      <div className="font-display text-[13px] text-[#2B241D]">{b.title}</div>
                      <div className="text-[12px] text-[#6B5F4E]">{b.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setScreen("path")}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F0533D] to-[#E8483A] text-white font-display text-sm tracking-wide mt-auto shadow-md"
          >
            WEITER
          </button>
        </div>
      </div>
    );
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* UI SUBCOMPONENTS */
/* ------------------------------------------------------------------ */

function StatPill({ icon, value }) {
  return (
    <div className="flex items-center gap-1 bg-white border border-[#F0DFC0] rounded-full px-2.5 py-1 shadow-sm">
      {icon}
      <span className="text-[13px] font-bold text-[#2B241D] font-mono">{value}</span>
    </div>
  );
}

function SummaryStat({ label, value, color }) {
  return (
    <div className="bg-white border-2 border-[#F0DFC0] rounded-xl py-3 text-center shadow-sm">
      <div className="font-display text-lg" style={{ color }}>
        {value}
      </div>
      <div className="text-[10px] text-[#8A7F68] tracking-wide mt-0.5">{label}</div>
    </div>
  );
}

function UnitBanner({ unit, completed, gradient }) {
  const done = unit.lessons.filter((l) => completed.has(l.id)).length;
  return (
    <div className="rounded-2xl px-5 py-4 my-4 shadow-md" style={{ background: gradient }}>
      <div className="text-[10px] tracking-widest text-white/80 font-bold mb-1">
        {done}/{unit.lessons.length} LEKTIONEN
      </div>
      <div className="font-display text-lg text-white tracking-wide">{unit.latin}</div>
      <div className="text-[12px] text-white/85">{unit.german}</div>
    </div>
  );
}

function FontImport() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;1,8..60,500&family=Inter:wght@400;500;600;700&display=swap');
      .font-display { font-family: 'Cinzel', serif; }
      .font-serif-latin { font-family: 'Source Serif 4', serif; }
      body, button, input { font-family: 'Inter', sans-serif; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

      @keyframes popIn {
        0% { transform: scale(0.4); opacity: 0; }
        60% { transform: scale(1.12); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-pop-in { animation: popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

      @keyframes bounceSlow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
      .animate-bounce-slow { animation: bounceSlow 1.6s ease-in-out infinite; }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-4px); }
        40% { transform: translateX(4px); }
        60% { transform: translateX(-3px); }
        80% { transform: translateX(3px); }
      }
      .animate-shake { animation: shake 0.4s ease-in-out; }

      @keyframes floatXpPop {
        0% { transform: translateY(0) scale(0.6); opacity: 0; }
        20% { transform: translateY(-6px) scale(1.15); opacity: 1; }
        100% { transform: translateY(-40px) scale(1); opacity: 0; }
      }
      .float-xp-pop { animation: floatXpPop 0.85s ease-out both; }

      @keyframes comboPop {
        0% { transform: translateX(-50%) scale(0.5); opacity: 0; }
        25% { transform: translateX(-50%) scale(1.1); opacity: 1; }
        85% { transform: translateX(-50%) scale(1); opacity: 1; }
        100% { transform: translateX(-50%) scale(0.9); opacity: 0; }
      }
      .combo-pop { animation: comboPop 1.3s ease-out both; }

      @keyframes confettiFall {
        0% { transform: translateY(-40px) translateX(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(720px) translateX(var(--drift)) rotate(540deg); opacity: 0; }
      }
      .confetti-piece {
        position: absolute;
        top: 0;
        border-radius: 2px;
        animation-name: confettiFall;
        animation-timing-function: ease-in;
        animation-fill-mode: forwards;
      }
    `}</style>
  );
}
