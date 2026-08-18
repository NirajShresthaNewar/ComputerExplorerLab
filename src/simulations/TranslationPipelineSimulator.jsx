import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code,
  Cpu,
  Zap,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  RotateCcw,
  Play,
  Sparkles,
  Binary,
  Layers,
} from 'lucide-react'
import InfoPanel from '../components/InfoPanel'
import { computerTypes } from '../data/computerData'

const PROGRAMS = [
  {
    id: 'hello',
    label: 'Print("Hello, World!")',
    highLevel: 'Print("Hello, World!")',
    assembly: [
      'MOV  AX, 0900h    ; Prepare print routine',
      'MOV  DX, msg_str  ; Load string address → DX',
      'INT  21h          ; Call OS print interrupt',
      'MOV  AX, 4C00h    ; Set exit code 0',
      'INT  21h          ; Terminate program',
    ],
    binary: ['01001000 01100101', '01101100 01101100', '01101111 00100000', '01010111 01101111', '00100001 00000000'],
    bits: '01001000011001010110110001101100011011110010000001010111011011110111001000100001',
  },
  {
    id: 'add',
    label: 'x = 5 + 3 → Print(x)',
    highLevel: 'x = 5 + 3\nPrint(x)',
    assembly: [
      'MOV  AX, 0005h    ; Load value 5 into register AX',
      'ADD  AX, 0003h    ; Add value 3 → AX now = 8',
      'MOV  BX, AX       ; Store result 8 in BX',
      'MOV  DL, BL       ; Move result to output register',
      'INT  21h          ; Call OS to display result',
    ],
    binary: ['10110000 00000101', '00000100 00000011', '10001001 11000011', '10001010 11010011', '11001101 00100001'],
    bits: '1011000000000101000001000000001110001001110000111000101011010011',
  },
  {
    id: 'loop',
    label: 'FOR i = 1 TO 3 → Print(i)',
    highLevel: 'FOR i = 1 TO 3\n  Print(i)\nEND FOR',
    assembly: [
      'MOV  CX, 0003h    ; Set loop counter = 3',
      'MOV  BX, 0001h    ; Initialize i = 1',
      'LOOP_START:        ; Label to return to',
      'ADD  BX, 0001h    ; Increment i by 1',
      'LOOP LOOP_START   ; Repeat until CX = 0',
    ],
    binary: ['10110001 00000011', '10111011 00000001', '00000000 10000000', '10000011 11000001', '11100010 11111011'],
    bits: '101100010000001110111011000000010000000010000000100000111100000111100010',
  },
]

const STAGES = [
  {
    id: 'high',
    name: 'Stage 1',
    label: 'High-Level Language',
    sublabel: 'Human-readable code',
    color: 'from-emerald-500 to-teal-600',
    accent: 'emerald',
    glow: 'shadow-emerald-500/30',
  },
  {
    id: 'assembly',
    name: 'Stage 2',
    label: 'Assembly Language',
    sublabel: 'CPU register mnemonics',
    color: 'from-amber-500 to-orange-600',
    accent: 'amber',
    glow: 'shadow-amber-500/30',
  },
  {
    id: 'machine',
    name: 'Stage 3',
    label: 'Machine Code',
    sublabel: 'Binary bytes (0s & 1s)',
    color: 'from-purple-500 to-violet-600',
    accent: 'purple',
    glow: 'shadow-purple-500/30',
  },
  {
    id: 'hardware',
    name: 'Stage 4',
    label: 'Hardware LED Lightboard',
    sublabel: 'Electrical transistor pulses',
    color: 'from-rose-500 to-red-600',
    accent: 'rose',
    glow: 'shadow-rose-500/30',
  },
]

// Build LED bits from binary string
function buildLEDs(bits) {
  return bits.split('').filter((b) => b === '0' || b === '1').map(Number)
}

export default function TranslationPipelineSimulator() {
  const [selectedProgram, setSelectedProgram] = useState(PROGRAMS[0])
  const [activeStage, setActiveStage] = useState(null)
  const [lightboardOn, setLightboardOn] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [pipelineStep, setPipelineStep] = useState(null) // null | 'high' | 'assembly' | 'machine' | 'hardware' | 'done'
  const [flickerMap, setFlickerMap] = useState({})
  const flickerRef = useRef(null)

  const leds = buildLEDs(selectedProgram.bits)

  const resetPipeline = () => {
    if (flickerRef.current) clearInterval(flickerRef.current)
    setPipelineStep(null)
    setActiveStage(null)
    setIsAnimating(false)
    setFlickerMap({})
    setLightboardOn(false)
  }

  const runPipeline = () => {
    resetPipeline()
    setIsAnimating(true)

    setTimeout(() => setPipelineStep('high'), 300)
    setTimeout(() => setPipelineStep('assembly'), 1500)
    setTimeout(() => setPipelineStep('machine'), 3000)
    setTimeout(() => {
      setPipelineStep('hardware')
      setLightboardOn(true)
      // Start LED flicker animation
      let t = 0
      flickerRef.current = setInterval(() => {
        t++
        const newMap = {}
        leds.forEach((_, i) => {
          newMap[i] = Math.random() > 0.15 ? leds[i] : 1 - leds[i]
        })
        setFlickerMap(newMap)
        if (t > 20) {
          clearInterval(flickerRef.current)
          setFlickerMap({})
          setPipelineStep('done')
          setIsAnimating(false)
        }
      }, 100)
    }, 4800)
  }

  const stageVisible = (stageId) => {
    const order = ['high', 'assembly', 'machine', 'hardware', 'done']
    const cur = order.indexOf(pipelineStep)
    const tgt = order.indexOf(stageId)
    return cur >= tgt
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-3">
            <Layers className="text-lab-cyan" size={28} />
            <span>Code Translation Pipeline</span>
          </h2>
          <p className="text-sm opacity-70 mt-1">
            Watch how a high-level instruction travels through Assembly → Machine Code → and lights up real CPU transistor LEDs!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={runPipeline}
            disabled={isAnimating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-lab-cyan to-blue-600 text-slate-950 font-extrabold text-xs shadow-lg transition-all hover:scale-105 disabled:opacity-60"
          >
            <Play size={16} className={isAnimating ? 'animate-pulse' : ''} />
            {isAnimating ? 'Translating...' : 'Run Full Pipeline'}
          </button>
          <button onClick={resetPipeline} className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Program Selector */}
          <div className="p-4 glass rounded-2xl border border-white/10 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold opacity-70 flex items-center gap-1.5">
              <Code size={14} /> Choose a program:
            </span>
            {PROGRAMS.map((prog) => (
              <button
                key={prog.id}
                onClick={() => { setSelectedProgram(prog); resetPipeline() }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedProgram.id === prog.id
                    ? 'bg-lab-cyan text-slate-950 border-transparent shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                {prog.label}
              </button>
            ))}
          </div>

          {/* Pipeline: 4 Stage Cards with flow arrows */}
          <div className="space-y-3">
            {/* Stage 1: High Level */}
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: pipelineStep ? 1 : 0.3 }}
              className={`p-5 rounded-3xl border-2 transition-all ${
                stageVisible('high') && pipelineStep
                  ? 'bg-emerald-500/15 border-emerald-500 shadow-xl shadow-emerald-500/20'
                  : 'bg-[var(--theme-bg-panel)] border-white/15'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-extrabold">
                  STAGE 1
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-300">High-Level Language</h4>
                  <p className="text-[11px] opacity-60">Human-readable programming code (Python / C / Java)</p>
                </div>
                {stageVisible('high') && pipelineStep && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                  >
                    <Sparkles size={12} className="text-white" />
                  </motion.div>
                )}
              </div>
              <div className="px-4 py-3 bg-slate-950/50 rounded-xl border border-emerald-500/20 font-mono text-sm text-emerald-200 whitespace-pre-wrap">
                {selectedProgram.highLevel}
              </div>
            </motion.div>

            {/* Arrow Down */}
            <div className="flex justify-center py-1">
              <motion.div animate={stageVisible('assembly') && pipelineStep ? { opacity: 1, y: 0 } : { opacity: 0.2, y: -4 }}>
                <ChevronRight size={28} className="text-amber-400 rotate-90" />
              </motion.div>
            </div>

            {/* Stage 2: Assembly */}
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: stageVisible('assembly') && pipelineStep ? 1 : 0.3 }}
              className={`p-5 rounded-3xl border-2 transition-all ${
                stageVisible('assembly') && pipelineStep
                  ? 'bg-amber-500/15 border-amber-500 shadow-xl shadow-amber-500/20'
                  : 'bg-[var(--theme-bg-panel)] border-white/15'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-extrabold">
                  STAGE 2
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-amber-300">Assembly Language</h4>
                  <p className="text-[11px] opacity-60">CPU mnemonics — MOV, ADD, INT register instructions</p>
                </div>
              </div>
              <div className="px-4 py-3 bg-slate-950/50 rounded-xl border border-amber-500/20 font-mono text-xs text-amber-200 space-y-1">
                {selectedProgram.assembly.map((line, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={stageVisible('assembly') && pipelineStep ? { opacity: 1, x: 0 } : { opacity: 0 }}
                    transition={{ delay: idx * 0.12 }}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Arrow Down */}
            <div className="flex justify-center py-1">
              <motion.div animate={stageVisible('machine') && pipelineStep ? { opacity: 1, y: 0 } : { opacity: 0.2, y: -4 }}>
                <ChevronRight size={28} className="text-purple-400 rotate-90" />
              </motion.div>
            </div>

            {/* Stage 3: Machine Code */}
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: stageVisible('machine') && pipelineStep ? 1 : 0.3 }}
              className={`p-5 rounded-3xl border-2 transition-all ${
                stageVisible('machine') && pipelineStep
                  ? 'bg-purple-500/15 border-purple-500 shadow-xl shadow-purple-500/20'
                  : 'bg-[var(--theme-bg-panel)] border-white/15'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white text-[10px] font-extrabold">
                  STAGE 3
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-purple-300">Machine Code (Binary)</h4>
                  <p className="text-[11px] opacity-60">Raw binary bytes — 8-bit groups the CPU understands directly</p>
                </div>
              </div>
              <div className="px-4 py-3 bg-slate-950/50 rounded-xl border border-purple-500/20 font-mono text-xs text-purple-200 grid sm:grid-cols-2 gap-1.5">
                {selectedProgram.binary.map((line, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={stageVisible('machine') && pipelineStep ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex items-center gap-2"
                  >
                    <Zap size={12} className="text-purple-400 flex-shrink-0" />
                    <span>{line}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Arrow Down */}
            <div className="flex justify-center py-1">
              <motion.div animate={stageVisible('hardware') && pipelineStep ? { opacity: 1, y: 0 } : { opacity: 0.2, y: -4 }}>
                <ChevronRight size={28} className="text-rose-400 rotate-90" />
              </motion.div>
            </div>

            {/* Stage 4: Hardware LED Lightboard */}
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: stageVisible('hardware') && pipelineStep ? 1 : 0.3 }}
              className={`p-5 rounded-3xl border-2 transition-all ${
                stageVisible('hardware') && pipelineStep
                  ? 'bg-rose-500/10 border-rose-500 shadow-2xl shadow-rose-500/20'
                  : 'bg-[var(--theme-bg-panel)] border-white/15'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-extrabold">
                    STAGE 4
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-rose-300">Hardware Electrical Lightboard</h4>
                    <p className="text-[11px] opacity-60">Transistor LED ON/OFF pulses inside the CPU chip</p>
                  </div>
                </div>

                {/* Lightboard Toggle */}
                <button
                  onClick={() => setLightboardOn((prev) => !prev)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                    lightboardOn
                      ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  {lightboardOn ? <ToggleRight size={20} className="text-rose-400" /> : <ToggleLeft size={20} />}
                  {lightboardOn ? 'Power ON' : 'Power OFF'}
                </button>
              </div>

              {/* LED Array */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-rose-500/20">
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {leds.map((bit, idx) => {
                    const displayBit = flickerMap[idx] !== undefined ? flickerMap[idx] : bit
                    const isOn = lightboardOn && displayBit === 1

                    return (
                      <motion.div
                        key={idx}
                        animate={isOn ? { scale: [1, 1.15, 1], opacity: 1 } : { scale: 1, opacity: 0.25 }}
                        transition={{ duration: 0.2 }}
                        className={`w-5 h-5 rounded-full border transition-all duration-100 flex items-center justify-center text-[8px] font-mono font-bold ${
                          isOn
                            ? 'bg-cyan-400 border-cyan-300 shadow-md shadow-cyan-400/70 text-slate-900'
                            : 'bg-slate-800 border-slate-700 text-slate-600'
                        }`}
                      >
                        {displayBit}
                      </motion.div>
                    )
                  })}
                </div>
                <p className="text-center text-[10px] text-gray-500 font-mono mt-3">
                  {lightboardOn
                    ? `⚡ ${leds.filter((b) => b === 1).length} transistors ON (5V) / ${leds.filter((b) => b === 0).length} transistors OFF (0V)`
                    : 'Toggle Power ON above to illuminate transistor LEDs'}
                </p>
              </div>

              {/* Binary stream display */}
              {lightboardOn && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10 font-mono text-[11px] text-purple-300 overflow-x-auto"
                >
                  {selectedProgram.bits}
                </motion.div>
              )}
            </motion.div>
          </div>

          {pipelineStep === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-500/15 border-2 border-emerald-500 rounded-2xl text-xs text-emerald-300 flex items-center gap-3 font-bold"
            >
              <Sparkles size={20} className="text-amber-300 animate-spin" />
              Full translation pipeline complete! From human-readable code → electrical CPU pulses in 4 steps!
            </motion.div>
          )}
        </div>

        {/* Right Info Panel */}
        <div className="space-y-6">
          <InfoPanel data={computerTypes['translation-pipeline']} />

          {/* Stage Key */}
          <div className="glass rounded-2xl p-4 border border-white/10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Translation Stages</span>
            {STAGES.map((stage) => (
              <div key={stage.id} className="flex items-center gap-3">
                <div className={`px-2 py-0.5 rounded-lg bg-gradient-to-r ${stage.color} text-white text-[9px] font-extrabold flex-shrink-0`}>
                  {stage.name}
                </div>
                <div>
                  <div className="text-xs font-bold">{stage.label}</div>
                  <div className="text-[10px] opacity-60">{stage.sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
