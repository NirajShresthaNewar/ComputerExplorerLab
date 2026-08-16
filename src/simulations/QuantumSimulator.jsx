import { useState } from 'react'
import { motion } from 'framer-motion'
import { Atom, Zap, Sparkles, RefreshCw, Layers, CheckCircle2, Play, GitCommit } from 'lucide-react'
import InfoPanel from '../components/InfoPanel'
import { computerTypes } from '../data/computerData'

export default function QuantumSimulator() {
  const [activeTab, setActiveTab] = useState('superposition') // 'superposition', 'maze', 'entanglement'

  // Stage 1: Classical Bit vs Qubit State
  const [isSpinning, setIsSpinning] = useState(false)
  const [measuredVal, setMeasuredVal] = useState(null) // null (in superposition), 0, or 1

  // Stage 2: Classical vs Quantum Maze Race State
  const [isRacing, setIsRacing] = useState(false)
  const [classicalStep, setClassicalStep] = useState(0) // 0 to 4
  const [quantumSuccess, setQuantumSuccess] = useState(false)

  // Stage 3: Quantum Entanglement State
  const [qubitAState, setQubitAState] = useState(1)

  // Stage 1 Actions
  const handleSpinQubit = () => {
    setIsSpinning(true)
    setMeasuredVal(null)
  }

  const handleMeasureQubit = () => {
    setIsSpinning(false)
    const collapsedResult = Math.random() < 0.5 ? 0 : 1
    setMeasuredVal(collapsedResult)
  }

  // Stage 2 Actions (Maze Race)
  const handleRunRace = () => {
    setIsRacing(true)
    setClassicalStep(0)
    setQuantumSuccess(false)

    // Classical computer tries paths 1, 2, 3, 4 one by one
    setTimeout(() => setClassicalStep(1), 600)
    setTimeout(() => setClassicalStep(2), 1200)
    setTimeout(() => setClassicalStep(3), 1800)
    setTimeout(() => setClassicalStep(4), 2400)

    // Quantum computer checks ALL paths in superposition in 1 step!
    setTimeout(() => setQuantumSuccess(true), 600)

    setTimeout(() => {
      setIsRacing(false)
    }, 3000)
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Interactive Mode Tabs */}
      <div className="glass rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-3">
            <Atom className="text-lab-cyan animate-spin" size={28} />
            <span>Quantum Computing Explorer</span>
          </h2>
          <p className="text-sm opacity-70 mt-1">
            Discover Qubits, Superposition, Parallel Speed, and Entanglement through interactive visual models.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1.5 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)]">
          <button
            onClick={() => setActiveTab('superposition')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'superposition'
                ? 'bg-lab-cyan text-slate-950 shadow-lg font-extrabold scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Sparkles size={16} />
            <span>1. Classical Bit vs Qubit</span>
          </button>

          <button
            onClick={() => setActiveTab('maze')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'maze'
                ? 'bg-lab-cyan text-slate-950 shadow-lg font-extrabold scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Play size={16} />
            <span>2. Quantum Parallel Race</span>
          </button>

          <button
            onClick={() => setActiveTab('entanglement')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'entanglement'
                ? 'bg-lab-cyan text-slate-950 shadow-lg font-extrabold scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <GitCommit size={16} />
            <span>3. Quantum Entanglement</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Interactive Stage Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* ============================================================== */}
          {/* STAGE 1: CLASSICAL BIT VS QUBIT (SUPERPOSITION) */}
          {/* ============================================================== */}
          {activeTab === 'superposition' && (
            <div className="glass rounded-3xl p-6 md:p-8 space-y-6 border border-white/10">
              <div className="border-b border-[var(--theme-border)] pb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="text-lab-cyan" size={22} />
                  The Spinning Coin Analogy (Superposition)
                </h3>
                <p className="text-xs opacity-70 mt-1">
                  A Classical Bit is a coin lying flat on a table (Fixed 0 or 1). A Quantum Qubit is a spinning coin in mid-air (Both 0 AND 1 at the exact same time!).
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Classical Bit Box */}
                <div className="p-5 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)] text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-60">Classical Bit (Normal Computer)</span>
                  <div className="w-24 h-24 mx-auto rounded-full bg-slate-800 border-4 border-slate-600 flex items-center justify-center text-3xl font-extrabold font-mono text-white shadow-inner">
                    1 (Heads)
                  </div>
                  <p className="text-xs opacity-75">
                    Fixed State: Can only be <strong>0 OR 1</strong> at any single moment.
                  </p>
                </div>

                {/* Qubit Superposition Box */}
                <div className="p-5 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)] text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-lab-cyan">Quantum Qubit (Quantum Computer)</span>

                  {/* Spinning Qubit Graphic */}
                  <motion.div
                    animate={isSpinning ? { rotateY: 360, rotateX: 360 } : {}}
                    transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
                    className={`w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center text-2xl font-extrabold font-mono shadow-2xl transition-all ${
                      isSpinning
                        ? 'bg-gradient-to-r from-lab-cyan via-purple-500 to-blue-600 border-lab-cyan shadow-lab-cyan/40 text-white'
                        : measuredVal !== null
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-lab-cyan/20 border-lab-cyan text-lab-cyan'
                    }`}
                  >
                    {isSpinning ? '|Ψ⟩' : measuredVal !== null ? `|${measuredVal}⟩` : '|0⟩ + |1⟩'}
                  </motion.div>

                  <p className="text-xs opacity-80 font-mono">
                    {isSpinning
                      ? '⚡ SUPERPOSITION: 50% |0⟩ + 50% |1⟩ (Spinning in 3D!)'
                      : measuredVal !== null
                      ? `🎯 MEASURED: Quantum Wave collapsed to definite |${measuredVal}⟩`
                      : 'Click "Spin Qubit" to put into Superposition!'}
                  </p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={handleSpinQubit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-lab-cyan to-blue-600 text-slate-950 font-extrabold text-xs shadow-lg transition-all hover:scale-105"
                >
                  <RefreshCw size={16} className={isSpinning ? 'animate-spin' : ''} />
                  <span>Spin Qubit (Superposition)</span>
                </button>

                <button
                  onClick={handleMeasureQubit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all hover:scale-105"
                >
                  <CheckCircle2 size={16} />
                  <span>Catch & Measure Qubit</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STAGE 2: QUANTUM PARALLELISM MAZE RACE */}
          {/* ============================================================== */}
          {activeTab === 'maze' && (
            <div className="glass rounded-3xl p-6 md:p-8 space-y-6 border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--theme-border)] pb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Play className="text-lab-cyan" size={22} />
                    Quantum Parallel Speed (Maze Solver Race)
                  </h3>
                  <p className="text-xs opacity-70 mt-1">
                    A normal computer tries 1 path at a time (Sequential). A Quantum Computer checks ALL 4 paths simultaneously in 1 step!
                  </p>
                </div>

                <button
                  onClick={handleRunRace}
                  disabled={isRacing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-lab-cyan to-blue-600 text-slate-950 font-extrabold text-xs shadow-lg transition-all hover:scale-105"
                >
                  <Play size={16} className={isRacing ? 'animate-pulse' : ''} />
                  <span>Start Parallel Race</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Classical Sequential Search */}
                <div className="p-5 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)] space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-2">
                    <span className="font-bold text-xs">Classical Computer (Sequential)</span>
                    <span className="text-[10px] font-mono opacity-70">O(N) Time</span>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    {[1, 2, 3, 4].map((path) => {
                      const isChecked = classicalStep >= path
                      const isWinningPath = path === 4 && classicalStep === 4
                      return (
                        <div
                          key={path}
                          className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                            isWinningPath
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                              : isChecked
                              ? 'bg-red-500/10 border-red-500/30 opacity-70'
                              : 'bg-white/5 border-white/10 opacity-50'
                          }`}
                        >
                          <span>Path #{path}: {path === 4 ? 'Target Exit' : 'Dead End'}</span>
                          <span>{isChecked ? (path === 4 ? '✅ WIN' : '❌ TRY AGAIN') : 'WAITING'}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-[10px] opacity-70 italic text-center">
                    Classical CPU takes {classicalStep} sequential steps to find the solution.
                  </div>
                </div>

                {/* Quantum Parallel Search */}
                <div className="p-5 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)] space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-2">
                    <span className="font-bold text-xs text-lab-cyan">Quantum Computer (Parallel)</span>
                    <span className="text-[10px] font-mono text-lab-cyan font-bold">O(1) Instant</span>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    {[1, 2, 3, 4].map((path) => (
                      <div
                        key={path}
                        className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                          quantumSuccess
                            ? 'bg-lab-cyan/20 border-lab-cyan text-lab-cyan font-bold shadow-md shadow-lab-cyan/10'
                            : 'bg-white/5 border-white/10 opacity-50'
                        }`}
                      >
                        <span>Path #{path} (Superposition Wave)</span>
                        <span>{quantumSuccess ? '⚡ EVALUATED IN PARALLEL' : 'WAITING'}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] font-mono text-lab-cyan font-bold text-center">
                    {quantumSuccess ? '⚡ QUANTUM SPEED: Evaluated all 4 paths at once in 1 step!' : 'Ready for quantum wave sweep...'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STAGE 3: QUANTUM ENTANGLEMENT */}
          {/* ============================================================== */}
          {activeTab === 'entanglement' && (
            <div className="glass rounded-3xl p-6 md:p-8 space-y-6 border border-white/10">
              <div className="border-b border-[var(--theme-border)] pb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <GitCommit className="text-purple-400" size={22} />
                  Quantum Entanglement ("Spooky Action at a Distance")
                </h3>
                <p className="text-xs opacity-70 mt-1">
                  When two Qubits become entangled, changing Qubit A instantly forces Qubit B to change its state — even if separated by light-years!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center relative">
                {/* Entanglement Laser Link Graphic */}
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-1 bg-gradient-to-r from-lab-cyan via-purple-500 to-emerald-400 animate-pulse z-10 shadow-lg shadow-purple-500/50" />

                {/* Qubit A */}
                <div className="p-6 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)] text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-lab-cyan">Qubit A (Input)</span>
                  <div className="w-20 h-20 mx-auto rounded-full bg-lab-cyan/20 border-4 border-lab-cyan flex items-center justify-center text-3xl font-extrabold font-mono text-white shadow-xl">
                    |{qubitAState}⟩
                  </div>
                  <button
                    onClick={() => setQubitAState((s) => (s === 1 ? 0 : 1))}
                    className="px-4 py-2 rounded-xl bg-lab-cyan text-slate-950 font-extrabold text-xs shadow-md transition-all hover:scale-105"
                  >
                    Flip Qubit A → |{qubitAState === 1 ? 0 : 1}⟩
                  </button>
                </div>

                {/* Qubit B (Entangled Mirror) */}
                <div className="p-6 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)] text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Qubit B (Entangled Mirror)</span>
                  <motion.div
                    key={qubitAState}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 mx-auto rounded-full bg-purple-500/20 border-4 border-purple-500 flex items-center justify-center text-3xl font-extrabold font-mono text-purple-300 shadow-xl"
                  >
                    |{qubitAState}⟩
                  </motion.div>
                  <div className="text-[10px] font-mono text-purple-300 font-bold">
                    ⚡ INSTANT MIRROR: State |{qubitAState}⟩ updated via entanglement link!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Info Panel Component */}
        <div className="space-y-6">
          <InfoPanel data={computerTypes.quantum} />
        </div>
      </div>
    </div>
  )
}
