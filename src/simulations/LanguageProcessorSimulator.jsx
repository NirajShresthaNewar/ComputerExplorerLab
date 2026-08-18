import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Zap,
  FileCode,
  Binary,
  Clock,
  Sparkles,
} from 'lucide-react'
import InfoPanel from '../components/InfoPanel'
import { computerTypes } from '../data/computerData'

const PSEUDOCODE_LINES = [
  { id: 1, code: 'START Program', hasError: false, assembly: 'MOV AX, 0000h', machine: '10110000 00000000' },
  { id: 2, code: 'SET x = 10', hasError: false, assembly: 'MOV BX, 000Ah', machine: '10111011 00001010' },
  { id: 3, code: 'SET y = 0', hasError: false, assembly: 'MOV CX, 0000h', machine: '10110001 00000000' },
  { id: 4, code: 'SET y = x + 5', hasError: false, assembly: 'ADD BX, 0005h', machine: '10000011 11000101' },
  { id: 5, code: 'PRINT y', hasError: false, assembly: 'INT 21h / MOV DL, BL', machine: '11001101 00100001' },
  { id: 6, code: 'SET z = y / 0  ← ERROR', hasError: true, assembly: 'DIV 0000h ; DIVISION BY ZERO!', machine: '11110111 11110001' },
  { id: 7, code: 'PRINT "Done"', hasError: false, assembly: 'MOV DX, msg / INT 21h', machine: '10111010 00000000' },
  { id: 8, code: 'END Program', hasError: false, assembly: 'MOV AH, 4Ch / INT 21h', machine: '10110100 01001100' },
]

const ERROR_LINE_INDEX = 5 // 0-based index of line 6

export default function LanguageProcessorSimulator() {
  const [mode, setMode] = useState('interpreter') // 'interpreter' | 'compiler'
  const [isRunning, setIsRunning] = useState(false)
  const [currentLine, setCurrentLine] = useState(-1) // interpreter cursor
  const [executedLines, setExecutedLines] = useState([]) // lines done
  const [errorLine, setErrorLine] = useState(null)
  const [machineOutput, setMachineOutput] = useState([]) // compiler machine code output
  const [batchErrors, setBatchErrors] = useState([])
  const [phase, setPhase] = useState(null) // 'scanning' | 'error-report' | 'executing' | 'done' | null
  const [speed, setSpeed] = useState(700) // ms per line
  const executionRef = useRef(null)

  const resetAll = () => {
    if (executionRef.current) clearTimeout(executionRef.current)
    setIsRunning(false)
    setCurrentLine(-1)
    setExecutedLines([])
    setErrorLine(null)
    setMachineOutput([])
    setBatchErrors([])
    setPhase(null)
  }

  // ---- Interpreter Execution ----
  useEffect(() => {
    if (mode === 'interpreter' && isRunning && phase === 'running') {
      const nextLine = currentLine + 1

      if (nextLine >= PSEUDOCODE_LINES.length) {
        setIsRunning(false)
        setPhase('done')
        return
      }

      executionRef.current = setTimeout(() => {
        const lineObj = PSEUDOCODE_LINES[nextLine]
        setCurrentLine(nextLine)

        if (lineObj.hasError) {
          setErrorLine(nextLine)
          setIsRunning(false)
          setPhase('halted')
        } else {
          setExecutedLines((prev) => [...prev, nextLine])
          setCurrentLine(nextLine)
        }
      }, speed)
    }
    return () => clearTimeout(executionRef.current)
  }, [mode, isRunning, phase, currentLine, speed])

  const handleRunInterpreter = () => {
    resetAll()
    setTimeout(() => {
      setIsRunning(true)
      setPhase('running')
      setCurrentLine(-1)
    }, 100)
  }

  // ---- Compiler Execution ----
  const handleRunCompiler = () => {
    resetAll()
    setPhase('scanning')

    // Phase 1: Scan all lines (300ms each, overlapping fast)
    const scanDuration = PSEUDOCODE_LINES.length * 200
    setTimeout(() => {
      // Show all machine code at once
      const allMachine = PSEUDOCODE_LINES.map((l) => ({
        id: l.id,
        code: l.code,
        machine: l.machine,
        hasError: l.hasError,
      }))
      setMachineOutput(allMachine)

      // Batch errors report
      const errors = PSEUDOCODE_LINES.filter((l) => l.hasError).map((l) => ({
        line: l.id,
        code: l.code,
        msg: 'Division by zero detected at compile time. Fatal arithmetic error.',
      }))
      setBatchErrors(errors)
      setPhase('error-report')
    }, scanDuration)
  }

  const interpreterStatusColor = {
    running: 'text-lab-cyan',
    halted: 'text-red-400',
    done: 'text-emerald-400',
  }[phase] || 'text-gray-400'

  const interpreterStatusText = {
    running: '▶ INTERPRETING — Line by line execution in progress...',
    halted: '⛔ EXECUTION HALTED — Runtime error detected! Lines below error are skipped.',
    done: '✅ EXECUTION COMPLETE — All lines processed successfully!',
  }[phase] || 'Click "Run Interpreter" to begin line-by-line execution.'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-3">
            <Code className="text-lab-cyan" size={28} />
            <span>Language Processor Lab</span>
          </h2>
          <p className="text-sm opacity-70 mt-1">
            Compare how an Interpreter executes line-by-line vs how a Compiler scans everything at once!
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex p-1.5 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)]">
          <button
            onClick={() => { resetAll(); setMode('interpreter') }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'interpreter'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <ChevronRight size={16} />
            Interpreter Mode
          </button>
          <button
            onClick={() => { resetAll(); setMode('compiler') }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'compiler'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30 scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Binary size={16} />
            Compiler Mode
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* ─── INTERPRETER MODE ─── */}
          {mode === 'interpreter' && (
            <div className="glass rounded-3xl p-6 md:p-8 space-y-5 border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--theme-border)]">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <ChevronRight className="text-blue-400" size={22} />
                    Interpreter — Line-by-Line Execution
                  </h3>
                  <p className="text-xs opacity-70 mt-1">
                    Translates &amp; runs ONE line at a time. Stops immediately at the first error.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock size={14} className="opacity-60" />
                    <select
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded-lg px-2 py-1 text-xs outline-none font-mono"
                    >
                      <option value={1200}>Slow</option>
                      <option value={700}>Normal</option>
                      <option value={300}>Fast</option>
                    </select>
                  </div>
                  <button
                    onClick={handleRunInterpreter}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-extrabold text-xs shadow-lg transition-all hover:scale-105 disabled:opacity-60"
                  >
                    <Play size={16} className={isRunning ? 'animate-pulse' : ''} />
                    {isRunning ? 'Running...' : 'Run Interpreter'}
                  </button>
                  <button onClick={resetAll} className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>

              {/* Status Bar */}
              <div className={`p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-xs font-bold ${interpreterStatusColor}`}>
                {interpreterStatusText}
              </div>

              {/* Code Lines with cursor */}
              <div className="space-y-1.5">
                {PSEUDOCODE_LINES.map((line, idx) => {
                  const isCursor = currentLine === idx
                  const isDone = executedLines.includes(idx)
                  const isError = errorLine === idx
                  const isSkipped = errorLine !== null && idx > ERROR_LINE_INDEX

                  return (
                    <motion.div
                      key={line.id}
                      animate={isCursor ? { scale: 1.02 } : { scale: 1 }}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 font-mono text-xs ${
                        isError
                          ? 'bg-red-500/20 border-red-500 shadow-lg shadow-red-500/20'
                          : isCursor
                          ? 'bg-blue-500/20 border-blue-400 shadow-lg shadow-blue-400/20 animate-pulse'
                          : isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : isSkipped
                          ? 'bg-white/5 border-white/5 opacity-30'
                          : 'bg-white/5 border-white/10 opacity-70'
                      }`}
                    >
                      {/* Line Number */}
                      <span className="w-5 text-center font-bold opacity-50 text-[10px]">{line.id}</span>

                      {/* State Indicator */}
                      <span className="w-5 flex-shrink-0">
                        {isError && <AlertTriangle size={14} className="text-red-400" />}
                        {isDone && <CheckCircle2 size={14} className="text-emerald-400" />}
                        {isCursor && <Zap size={14} className="text-blue-400 animate-pulse" />}
                        {isSkipped && <span className="text-[10px] opacity-40">—</span>}
                      </span>

                      {/* Code */}
                      <span className={`flex-1 ${isError ? 'text-red-300 font-extrabold' : isDone ? 'text-emerald-200' : 'text-gray-300'}`}>
                        {line.code}
                      </span>

                      {/* Translated Assembly (shown when line is done/cursor) */}
                      {(isDone || isCursor) && !isError && (
                        <span className="hidden sm:block text-[10px] font-mono text-blue-300 opacity-70 text-right">
                          → {line.assembly}
                        </span>
                      )}

                      {/* Error message */}
                      {isError && (
                        <span className="text-[10px] text-red-300 font-bold">
                          ⛔ ERROR: Division by Zero
                        </span>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Halted Alert */}
              {phase === 'halted' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/20 border-2 border-red-500 rounded-2xl text-xs text-red-300 font-bold space-y-1"
                >
                  <div className="flex items-center gap-2 text-red-200 text-sm font-extrabold">
                    <AlertTriangle size={18} />
                    Interpreter Runtime Error — Execution Halted at Line {ERROR_LINE_INDEX + 1}
                  </div>
                  <p className="opacity-80 font-normal">
                    The interpreter found a Division by Zero error at Line 6 and immediately stopped execution. Lines 7–8 were never reached or run.
                  </p>
                </motion.div>
              )}

              {phase === 'done' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-500/20 border-2 border-emerald-500 rounded-2xl text-xs text-emerald-300 flex items-center gap-3"
                >
                  <CheckCircle2 size={20} />
                  <span className="font-bold">All {PSEUDOCODE_LINES.length} lines interpreted and executed successfully!</span>
                </motion.div>
              )}
            </div>
          )}

          {/* ─── COMPILER MODE ─── */}
          {mode === 'compiler' && (
            <div className="glass rounded-3xl p-6 md:p-8 space-y-5 border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--theme-border)]">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Binary className="text-purple-400" size={22} />
                    Compiler — Full Program Batch Scan & Build
                  </h3>
                  <p className="text-xs opacity-70 mt-1">
                    Scans ALL lines simultaneously, generates machine code, reports ALL errors in a batch, then compiles the output binary.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRunCompiler}
                    disabled={phase === 'scanning'}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 text-white font-extrabold text-xs shadow-lg transition-all hover:scale-105 disabled:opacity-60"
                  >
                    <Sparkles size={16} className={phase === 'scanning' ? 'animate-spin' : ''} />
                    {phase === 'scanning' ? 'Compiling...' : 'Run Compiler'}
                  </button>
                  <button onClick={resetAll} className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>

              {/* Scanning Phase — all lines blinking together */}
              {phase === 'scanning' && (
                <div className="p-4 bg-purple-500/20 border border-purple-400/50 rounded-2xl text-xs font-mono text-purple-300 font-bold flex items-center gap-3">
                  <Sparkles size={16} className="animate-spin" />
                  COMPILER: Scanning all {PSEUDOCODE_LINES.length} lines simultaneously for syntax errors and type checking...
                </div>
              )}

              {/* Dual output panel: High-level code vs Machine Code */}
              {machineOutput.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Source Code Column */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <FileCode size={12} /> Source Code (High-Level)
                    </span>
                    {PSEUDOCODE_LINES.map((line) => (
                      <div
                        key={line.id}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border font-mono text-xs ${
                          line.hasError
                            ? 'bg-red-500/15 border-red-500/50 text-red-300'
                            : 'bg-white/5 border-white/10 text-gray-300'
                        }`}
                      >
                        <span className="text-[9px] opacity-50 w-4">{line.id}</span>
                        {line.hasError && <AlertTriangle size={12} className="text-red-400 flex-shrink-0" />}
                        <span>{line.code}</span>
                      </div>
                    ))}
                  </div>

                  {/* Machine Code Column */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                      <Binary size={12} /> Generated Machine Code (Binary)
                    </span>
                    {machineOutput.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border font-mono text-xs ${
                          item.hasError
                            ? 'bg-red-500/15 border-red-500/50 text-red-300'
                            : 'bg-purple-500/10 border-purple-500/30 text-purple-200'
                        }`}
                      >
                        <span className="text-[9px] opacity-50 w-4">{item.id}</span>
                        <span className="truncate">{item.machine}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Batch Error Report */}
              {phase === 'error-report' && batchErrors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-amber-500/15 border-2 border-amber-500/50 rounded-2xl space-y-3"
                >
                  <h4 className="font-extrabold text-amber-300 flex items-center gap-2 text-sm">
                    <AlertTriangle size={18} />
                    Compiler Batch Error Report — {batchErrors.length} Error(s) Found Before Execution:
                  </h4>
                  {batchErrors.map((err, idx) => (
                    <div key={idx} className="p-3 bg-white/5 rounded-xl text-xs border border-amber-500/20 font-mono">
                      <span className="text-amber-400 font-bold">Line {err.line}: </span>
                      <span className="text-gray-200">{err.code}</span>
                      <br />
                      <span className="text-red-300">{err.msg}</span>
                    </div>
                  ))}
                  <p className="text-xs text-amber-200 opacity-80">
                    Unlike an Interpreter, the Compiler found this error during the scan phase without executing any code.
                    Fix all errors before the compiler will produce a runnable executable file!
                  </p>
                </motion.div>
              )}

              {/* Comparison Table */}
              <div className="p-4 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)]">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-3">Quick Comparison</span>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  {[
                    { feature: 'Translation', interp: 'Line by line', comp: 'All at once' },
                    { feature: 'Error Detection', interp: 'At first error, stops immediately', comp: 'Batch report after full scan' },
                    { feature: 'Execution Speed', interp: 'Slower (translates on-the-fly)', comp: 'Faster (pre-compiled binary)' },
                    { feature: 'Examples', interp: 'Python, JavaScript', comp: 'C++, Java, C#' },
                  ].map((row) => (
                    <div key={row.feature} className="contents">
                      <span className="font-bold text-gray-400 py-1.5">{row.feature}</span>
                      <span className="py-1.5 text-blue-300">{row.interp}</span>
                      <span className="py-1.5 text-purple-300">{row.comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Info Panel */}
        <div className="space-y-6">
          <InfoPanel data={computerTypes['lang-processor']} />
        </div>
      </div>
    </div>
  )
}
