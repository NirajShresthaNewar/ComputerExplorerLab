import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RefreshCw,
  Printer,
  Monitor,
  Keyboard,
  Sparkles,
  ArrowRight,
  Tv,
  Layers,
  BookOpen,
} from 'lucide-react'

// Quiz Questions Bank covering Input, Output, Softcopy, Hardcopy, and Monitor Types
const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: 'Input vs Output',
    question: 'Which of the following is an INPUT device used to capture physical paper documents into digital images?',
    options: ['Laser Printer', 'Flatbed Scanner', 'Projector', 'Speakers'],
    correct: 1,
    explanation: 'A Scanner is an Input device because it takes physical documents and sends digital images into the computer.',
  },
  {
    id: 2,
    category: 'Softcopy vs Hardcopy',
    question: 'What is the main difference between Softcopy output and Hardcopy output?',
    options: [
      'Softcopy is permanent on paper; Hardcopy is temporary on screen',
      'Softcopy is temporary digital output (screen/audio); Hardcopy is physical printed output (paper)',
      'Softcopy uses mouse input; Hardcopy uses keyboard input',
      'There is no difference between them',
    ],
    correct: 1,
    explanation: 'Softcopy output is digital & temporary (e.g., monitor display), whereas Hardcopy output is physical & permanent (e.g., printed paper).',
  },
  {
    id: 3,
    category: 'Hardcopy Output',
    question: 'Which device produces HARDCOPY output?',
    options: ['LCD Monitor', 'Headphones', 'Laser Printer', 'Multimedia Projector'],
    correct: 2,
    explanation: 'A Laser Printer produces physical paper prints (Hardcopy), while monitors, headphones, and projectors produce Softcopy output.',
  },
  {
    id: 4,
    category: 'Softcopy Output',
    question: 'A teacher projects a science lesson onto a large classroom wall screen. What type of output is this?',
    options: ['Hardcopy Output', 'Softcopy Output', 'Input Signal', 'Secondary Storage'],
    correct: 1,
    explanation: 'A Projector displays visual information dynamically on a surface (Softcopy Output).',
  },
  {
    id: 5,
    category: 'Types of Monitors',
    question: 'Which older, bulky type of monitor used heavy glass vacuum tubes and electron beams?',
    options: ['OLED Monitor', 'CRT (Cathode Ray Tube)', 'LED Monitor', 'LCD Monitor'],
    correct: 1,
    explanation: 'CRT (Cathode Ray Tube) monitors were heavy, boxy monitors used in older computers before flat screens were invented.',
  },
  {
    id: 6,
    category: 'Types of Monitors',
    question: 'Which modern monitor technology uses organic compounds where EACH PIXEL generates its own light for true deep blacks?',
    options: ['CRT', 'LCD', 'OLED (Organic LED)', 'Dot Matrix'],
    correct: 2,
    explanation: 'OLED (Organic Light Emitting Diode) pixels generate their own light without needing a backlight, providing perfect black levels.',
  },
  {
    id: 7,
    category: 'Hardcopy Output',
    question: 'An architect needs to print huge, high-precision engineering blueprints on large paper rolls. Which device should they use?',
    options: ['Dot Matrix Printer', 'Plotter', 'Computer Monitor', 'Webcam'],
    correct: 1,
    explanation: 'A Plotter is a specialized Hardcopy output device designed to print large-format architectural blueprints and engineering diagrams.',
  },
  {
    id: 8,
    category: 'Input Devices',
    question: 'A cashier at a supermarket scans the barcode on a cereal box. What type of device is the Barcode Scanner?',
    options: ['Input Device', 'Softcopy Output Device', 'Hardcopy Output Device', 'Storage Drive'],
    correct: 0,
    explanation: 'A Barcode Reader is an Input device that reads optical codes and sends product numbers into the store computer system.',
  },
  {
    id: 9,
    category: 'Types of Monitors',
    question: 'How does an LED monitor differ from a standard LCD monitor?',
    options: [
      'LED monitors use light-emitting diodes as a backlight, making them thinner and more energy efficient',
      'LED monitors produce hardcopy paper output',
      'LED monitors use heavy cathode ray vacuum tubes',
      'LCD monitors do not use liquid crystals',
    ],
    correct: 0,
    explanation: 'LED monitors are a type of LCD screen that use energy-efficient Light Emitting Diodes (LEDs) for backlighting.',
  },
  {
    id: 10,
    category: 'Input vs Output',
    question: 'Which of the following devices acts as BOTH an Input and an Output device?',
    options: ['Optical Mouse', 'Touchscreen Display', 'Laser Printer', 'Keyboard'],
    correct: 1,
    explanation: 'A Touchscreen acts as an Output device (displays screen images) and an Input device (detects finger touches).',
  },
]

// Monitor Types Data Cards for Reference
const MONITOR_TYPES = [
  {
    name: 'CRT (Cathode Ray Tube)',
    tag: 'Older / Heavy',
    desc: 'Bulky box-shaped monitors with heavy glass tubes and electron guns. Used in early computers.',
    tech: 'Electron beam firing onto a fluorescent screen.',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40',
  },
  {
    name: 'LCD (Liquid Crystal Display)',
    tag: 'Flat Screen',
    desc: 'Thin, flat display using liquid crystals blocked or passed by light from CCFL fluorescent lamps.',
    tech: 'Liquid crystal molecules + CCFL backlight.',
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40',
  },
  {
    name: 'LED (Light Emitting Diode)',
    tag: 'Modern / Energy Efficient',
    desc: 'Popular flat monitors using energy-efficient LEDs to illuminate liquid crystal displays.',
    tech: 'Liquid crystals + LED array backlight.',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40',
  },
  {
    name: 'OLED (Organic LED)',
    tag: 'Premium / Self-Emissive',
    desc: 'Ultra-thin, vibrant display where every single pixel emits its own light, creating true deep blacks.',
    tech: 'Self-emissive organic pixel diodes (No backlight needed).',
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/40',
  },
]

export default function QuizPage() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [activeTab, setActiveTab] = useState('quiz') // 'quiz', 'monitors', 'sorting'

  // Sorting Game State
  const [draggedItems, setDraggedItems] = useState([
    { id: 'item1', name: 'Keyboard', category: 'input' },
    { id: 'item2', name: 'Laser Printer', category: 'hardcopy' },
    { id: 'item3', name: 'LED Monitor', category: 'softcopy' },
    { id: 'item4', name: 'Optical Mouse', category: 'input' },
    { id: 'item5', name: 'Speakers', category: 'softcopy' },
    { id: 'item6', name: 'Plotter', category: 'hardcopy' },
    { id: 'item7', name: 'Flatbed Scanner', category: 'input' },
    { id: 'item8', name: 'Projector', category: 'softcopy' },
  ])
  const [userCategories, setUserCategories] = useState({
    input: [],
    softcopy: [],
    hardcopy: [],
  })

  const currentQ = QUIZ_QUESTIONS[currentIdx]

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return // Prevent changing answer
    setSelectedOption(idx)

    if (idx === currentQ.correct) {
      setScore((s) => s + 10)
    }
  }

  const handleNextQuestion = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((i) => i + 1)
      setSelectedOption(null)
      setAnsweredCount((c) => c + 1)
    } else {
      setShowResult(true)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentIdx(0)
    setSelectedOption(null)
    setScore(0)
    setShowResult(false)
    setAnsweredCount(0)
  }

  const handlePlaceItem = (item, targetCategory) => {
    setUserCategories((prev) => {
      // Remove from existing
      const nextInput = prev.input.filter((i) => i.id !== item.id)
      const nextSoft = prev.softcopy.filter((i) => i.id !== item.id)
      const nextHard = prev.hardcopy.filter((i) => i.id !== item.id)

      if (targetCategory === 'input') nextInput.push(item)
      if (targetCategory === 'softcopy') nextSoft.push(item)
      if (targetCategory === 'hardcopy') nextHard.push(item)

      return { input: nextInput, softcopy: nextSoft, hardcopy: nextHard }
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header & Tab Selector */}
      <div className="glass rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-3">
            <HelpCircle className="text-lab-cyan" size={28} />
            <span>Hardware & Peripherals Knowledge Lab</span>
          </h1>
          <p className="text-sm opacity-70 mt-1">
            Test your knowledge on Input, Output, Softcopy, Hardcopy devices, and Monitor types!
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-1.5 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)]">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-lab-cyan text-slate-950 shadow-lg font-extrabold scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Award size={16} />
            <span>1. Device Knowledge Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('monitors')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'monitors'
                ? 'bg-lab-cyan text-slate-950 shadow-lg font-extrabold scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Tv size={16} />
            <span>2. Types of Monitors</span>
          </button>

          <button
            onClick={() => setActiveTab('sorting')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sorting'
                ? 'bg-lab-cyan text-slate-950 shadow-lg font-extrabold scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Layers size={16} />
            <span>3. Category Sorter Game</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: KNOWLEDGE QUIZ */}
      {/* ==================================================================== */}
      {activeTab === 'quiz' && (
        <div className="max-w-4xl mx-auto space-y-6">
          {!showResult ? (
            <div className="glass rounded-3xl p-6 md:p-8 space-y-6 border border-white/10 shadow-2xl">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-lab-cyan/20 text-lab-cyan border border-lab-cyan/30">
                    Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                  <h3 className="text-xs font-semibold opacity-70 mt-2">
                    Topic: {currentQ.category}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold opacity-60">Score</span>
                  <div className="text-2xl font-extrabold font-mono text-lab-cyan">{score} pts</div>
                </div>
              </div>

              {/* Question Text */}
              <div className="text-lg md:text-xl font-bold leading-snug">
                {currentQ.question}
              </div>

              {/* Options Grid */}
              <div className="space-y-3">
                {currentQ.options.map((optText, optIdx) => {
                  const isSelected = selectedOption === optIdx
                  const isCorrectOpt = optIdx === currentQ.correct
                  let optStyle =
                    'bg-[var(--theme-bg-panel)] border-[var(--theme-border)] opacity-90 hover:opacity-100'

                  if (selectedOption !== null) {
                    if (isCorrectOpt) {
                      optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-lg'
                    } else if (isSelected) {
                      optStyle = 'bg-red-500/20 border-red-500 text-red-300 font-bold'
                    } else {
                      optStyle = 'opacity-40 border-transparent'
                    }
                  }

                  return (
                    <motion.button
                      key={optIdx}
                      whileHover={selectedOption === null ? { scale: 1.01 } : {}}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 text-sm font-medium ${optStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-white/10 font-mono font-bold text-xs flex items-center justify-center">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{optText}</span>
                      </div>

                      {selectedOption !== null && (
                        <div>
                          {isCorrectOpt && <CheckCircle2 className="text-emerald-400" size={20} />}
                          {isSelected && !isCorrectOpt && <XCircle className="text-red-400" size={20} />}
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Explanation & Next Button */}
              {selectedOption !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-2"
                >
                  <div
                    className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                      selectedOption === currentQ.correct
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-red-500/10 border-red-500/40 text-red-300'
                    }`}
                  >
                    <div className="font-bold mb-1 flex items-center gap-1.5">
                      <BookOpen size={16} />
                      <span>{selectedOption === currentQ.correct ? 'Correct!' : 'Incorrect!'}</span>
                    </div>
                    {currentQ.explanation}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-lab-cyan to-blue-600 text-slate-950 font-extrabold text-sm shadow-xl hover:scale-105 transition-all"
                    >
                      <span>
                        {currentIdx + 1 < QUIZ_QUESTIONS.length ? 'Next Question' : 'View Final Score'}
                      </span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            /* Result Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-3xl p-8 text-center space-y-6 border border-white/10 shadow-2xl"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-lab-cyan/20 border-4 border-lab-cyan text-lab-cyan flex items-center justify-center shadow-2xl">
                <Award size={40} />
              </div>

              <div>
                <h2 className="text-3xl font-extrabold">Quiz Completed!</h2>
                <p className="text-sm opacity-70 mt-1">Here is how you performed in Hardware & Peripherals:</p>
              </div>

              <div className="p-6 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)] inline-block min-w-[240px]">
                <span className="text-xs uppercase font-bold tracking-wider opacity-60">Final Score</span>
                <div className="text-5xl font-extrabold font-mono text-lab-cyan mt-1">{score} / 100</div>
                <div className="text-xs font-semibold text-emerald-400 mt-2">
                  {score >= 80 ? '🌟 Outstanding Master!' : score >= 50 ? '👍 Great Job!' : '📚 Keep Learning!'}
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={handleRestartQuiz}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-lab-cyan text-slate-950 font-extrabold text-sm shadow-xl hover:scale-105 transition-all"
                >
                  <RefreshCw size={18} />
                  <span>Try Again</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: TYPES OF MONITORS (CRT, LCD, LED, OLED) */}
      {/* ==================================================================== */}
      {activeTab === 'monitors' && (
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Tv className="text-lab-cyan" size={24} />
              <span>4 Main Types of Computer Monitors</span>
            </h2>
            <p className="text-xs opacity-70 mt-1">
              Explore how display technology evolved from heavy vacuum tubes to energy-efficient liquid crystals and self-emissive OLED pixels!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {MONITOR_TYPES.map((mon, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border bg-gradient-to-br ${mon.color} space-y-4 shadow-xl backdrop-blur-md`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold font-mono px-3 py-1 rounded-full bg-white/10 opacity-90 border border-white/10">
                    {mon.tag}
                  </span>
                  <Tv size={24} className="opacity-60" />
                </div>

                <h3 className="text-xl font-extrabold">{mon.name}</h3>
                <p className="text-xs opacity-85 leading-relaxed">{mon.desc}</p>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10 text-xs font-mono">
                  <span className="opacity-60 block text-[10px] uppercase">How It Works:</span>
                  <span className="text-lab-cyan font-bold">{mon.tech}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: CATEGORY SORTER GAME */}
      {/* ==================================================================== */}
      {activeTab === 'sorting' && (
        <div className="glass rounded-3xl p-6 md:p-8 space-y-6 border border-white/10">
          <div className="border-b border-[var(--theme-border)] pb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Layers className="text-lab-cyan" size={22} />
              Interactive Device Classifier Game
            </h3>
            <p className="text-xs opacity-70 mt-1">
              Click any device below to place it into the correct category box: **Input Device**, **Softcopy Output**, or **Hardcopy Output**!
            </p>
          </div>

          {/* Unsorted Items Pool */}
          <div className="p-4 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70 block">
              Device Items (Click to categorize):
            </span>
            <div className="flex flex-wrap gap-2">
              {draggedItems.map((item) => {
                const isPlaced =
                  userCategories.input.some((i) => i.id === item.id) ||
                  userCategories.softcopy.some((i) => i.id === item.id) ||
                  userCategories.hardcopy.some((i) => i.id === item.id)

                if (isPlaced) return null

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    className="p-3 rounded-xl bg-white/10 border border-white/20 font-bold text-xs cursor-pointer flex items-center gap-2 shadow-md"
                  >
                    <span>{item.name}</span>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => handlePlaceItem(item, 'input')}
                        className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px] hover:bg-blue-500/40"
                        title="Place in Input"
                      >
                        Input
                      </button>
                      <button
                        onClick={() => handlePlaceItem(item, 'softcopy')}
                        className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] hover:bg-cyan-500/40"
                        title="Place in Softcopy"
                      >
                        Softcopy
                      </button>
                      <button
                        onClick={() => handlePlaceItem(item, 'hardcopy')}
                        className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] hover:bg-emerald-500/40"
                        title="Place in Hardcopy"
                      >
                        Hardcopy
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* 3 Category Drop Zones */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Input Zone */}
            <div className="p-5 bg-blue-500/10 rounded-2xl border border-blue-500/30 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Keyboard size={18} />
                <span>Input Devices</span>
              </div>
              <div className="space-y-2 min-h-[120px]">
                {userCategories.input.map((item) => (
                  <div key={item.id} className="p-2.5 bg-blue-500/20 rounded-xl text-xs font-bold text-blue-200 flex justify-between items-center">
                    <span>{item.name}</span>
                    {item.category === 'input' ? (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    ) : (
                      <XCircle size={16} className="text-red-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Softcopy Zone */}
            <div className="p-5 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Monitor size={18} />
                <span>Softcopy Output (Screen / Sound)</span>
              </div>
              <div className="space-y-2 min-h-[120px]">
                {userCategories.softcopy.map((item) => (
                  <div key={item.id} className="p-2.5 bg-cyan-500/20 rounded-xl text-xs font-bold text-cyan-200 flex justify-between items-center">
                    <span>{item.name}</span>
                    {item.category === 'softcopy' ? (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    ) : (
                      <XCircle size={16} className="text-red-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hardcopy Zone */}
            <div className="p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Printer size={18} />
                <span>Hardcopy Output (Paper Print)</span>
              </div>
              <div className="space-y-2 min-h-[120px]">
                {userCategories.hardcopy.map((item) => (
                  <div key={item.id} className="p-2.5 bg-emerald-500/20 rounded-xl text-xs font-bold text-emerald-200 flex justify-between items-center">
                    <span>{item.name}</span>
                    {item.category === 'hardcopy' ? (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    ) : (
                      <XCircle size={16} className="text-red-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
