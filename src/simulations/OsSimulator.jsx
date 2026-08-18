import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Monitor,
  Terminal,
  Cpu,
  HardDrive,
  Play,
  RotateCcw,
  Layers,
  Sparkles,
  Folder,
  FileText,
  Activity,
  CheckCircle2,
  Settings,
  ShieldAlert,
  ArrowDown,
  Command,
  MemoryStick,
  Zap,
  AlertTriangle,
  Plus,
  Trash2,
} from 'lucide-react'
import InfoPanel from '../components/InfoPanel'
import { computerTypes } from '../data/computerData'

const RAM_TOTAL_MB = 2048 // 2 GB simulation
const APP_REQUESTS = [
  { id: 'chrome', name: 'Launch Chrome', ram: 650, cpu: 35, icon: '🌐', color: 'from-blue-500 to-indigo-600' },
  { id: 'print', name: 'Print Document', ram: 80, cpu: 8, icon: '🖨️', color: 'from-gray-500 to-slate-600' },
  { id: 'scan', name: 'Scan Disk', ram: 120, cpu: 45, icon: '💿', color: 'from-amber-500 to-orange-600' },
  { id: 'render', name: '3D Render Task', ram: 900, cpu: 90, icon: '🎮', color: 'from-purple-500 to-violet-600' },
  { id: 'spotify', name: 'Stream Spotify', ram: 280, cpu: 12, icon: '🎵', color: 'from-emerald-500 to-teal-600' },
  { id: 'antivirus', name: 'Antivirus Full Scan', ram: 450, cpu: 70, icon: '🛡️', color: 'from-rose-500 to-red-600' },
]

const OS_LAYERS = [
  {
    id: 'apps',
    name: '1. User Applications',
    icon: Monitor,
    desc: 'Top-level programs used by humans: Web Browsers, Games, Word Processors, and Media Players.',
    examples: ['Chrome', 'VS Code', 'Spotify', 'Photoshop'],
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'shell',
    name: '2. Shell & User Interface (GUI / CLI)',
    icon: Terminal,
    desc: 'Translates human inputs into system calls. Provides the Graphical Desktop (GUI) or Command Shell (CLI).',
    examples: ['Windows Explorer', 'Bash Terminal', 'macOS Finder', 'Command Prompt'],
    color: 'from-cyan-500 to-teal-600',
  },
  {
    id: 'kernel',
    name: '3. OS Kernel (The Core Brain)',
    icon: Cpu,
    desc: 'The central core of the OS. Manages CPU scheduling, RAM allocation, File Systems, and Hardware Drivers.',
    examples: ['CPU Scheduler', 'Virtual Memory Manager', 'File System (NTFS/ext4)', 'Device Drivers'],
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 'hardware',
    name: '4. Physical Hardware',
    icon: HardDrive,
    desc: 'Physical electronic chips and devices: CPU, RAM, NVMe SSD, GPU, Display, Keyboard, and Network Card.',
    examples: ['Intel/AMD CPU', '16GB RAM', '1TB NVMe SSD', 'NVIDIA GPU'],
    color: 'from-emerald-500 to-green-600',
  },
]

const INITIAL_PROCESSES = [
  { id: 'P1', name: 'Web Browser', totalTime: 4, remaining: 4, state: 'ready' },
  { id: 'P2', name: 'Music Player', totalTime: 2, remaining: 2, state: 'ready' },
  { id: 'P3', name: 'Video Render', totalTime: 5, remaining: 5, state: 'ready' },
  { id: 'P4', name: 'Text Editor', totalTime: 1, remaining: 1, state: 'ready' },
]

export default function OsSimulator() {
  const [activeTab, setActiveTab] = useState('layers') // 'layers', 'scheduler', 'resource', 'terminal'

  // Stage 4: OS Resource Manager (RAM + CPU)
  const [ramAllocations, setRamAllocations] = useState([]) // { appId, name, ram, cpu, color, icon }
  const [oomAlert, setOomAlert] = useState(false)
  const [cpuLoad, setCpuLoad] = useState(0)
  const ramUsed = ramAllocations.reduce((sum, a) => sum + a.ram, 0)
  const ramPct = Math.min((ramUsed / RAM_TOTAL_MB) * 100, 100)

  // Stage 1: System Call Simulation state
  const [selectedLayer, setSelectedLayer] = useState(OS_LAYERS[0])
  const [isSyscallRunning, setIsSyscallRunning] = useState(false)
  const [syscallStep, setSyscallStep] = useState(null) // 'apps' -> 'shell' -> 'kernel' -> 'hardware'
  const [selectedSyscall, setSelectedSyscall] = useState('write_file')

  // Stage 2: CPU Process Scheduler state
  const [processes, setProcesses] = useState(INITIAL_PROCESSES)
  const [algo, setAlgo] = useState('rr') // 'rr' (Round Robin), 'fcfs' (First-Come First-Served)
  const [isScheduling, setIsScheduling] = useState(false)
  const [currentProcess, setCurrentProcess] = useState(null)
  const [ganttHistory, setGanttHistory] = useState([])

  // Stage 3: Interactive CLI Terminal state
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', text: 'Computer Explorer Lab OS [Version 1.0.24]' },
    { type: 'system', text: 'Type "help" to see available terminal commands.' },
  ])
  const [cmdInput, setCmdInput] = useState('')
  const [vfsFiles, setVfsFiles] = useState([
    { name: 'documents', isDir: true },
    { name: 'pictures', isDir: true },
    { name: 'readme.txt', isDir: false, content: 'Welcome to Computer Explorer Lab OS!' },
    { name: 'notes.txt', isDir: false, content: 'Operating systems manage CPU and Memory.' },
  ])
  const terminalEndRef = useRef(null)

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [terminalHistory])

  // Run System Call Animation Flow
  const handleRunSyscall = () => {
    setIsSyscallRunning(true)
    setSyscallStep('apps')

    setTimeout(() => setSyscallStep('shell'), 600)
    setTimeout(() => setSyscallStep('kernel'), 1200)
    setTimeout(() => setSyscallStep('hardware'), 1800)
    setTimeout(() => setSyscallStep('return'), 2400)
    setTimeout(() => {
      setIsSyscallRunning(false)
      setSyscallStep(null)
    }, 3200)
  }

  // CPU Scheduler Simulation Engine
  const handleStartScheduler = () => {
    setIsScheduling(true)
    setProcesses(INITIAL_PROCESSES.map((p) => ({ ...p, remaining: p.totalTime, state: 'ready' })))
    setGanttHistory([])

    let pList = INITIAL_PROCESSES.map((p) => ({ ...p, remaining: p.totalTime, state: 'ready' }))
    let history = []
    let stepCount = 0

    const runStep = () => {
      const activeList = pList.filter((p) => p.remaining > 0)
      if (activeList.length === 0 || stepCount > 20) {
        setIsScheduling(false)
        setCurrentProcess(null)
        return
      }

      let procToRun = null
      if (algo === 'fcfs') {
        procToRun = activeList[0]
      } else {
        // Round Robin
        procToRun = activeList[stepCount % activeList.length]
      }

      procToRun.remaining -= 1
      if (procToRun.remaining === 0) {
        procToRun.state = 'finished'
      } else {
        procToRun.state = 'ready'
      }

      setCurrentProcess(procToRun.id)
      history.push(procToRun.id)
      setGanttHistory([...history])
      setProcesses([...pList])

      stepCount++
      setTimeout(runStep, 700)
    }

    setTimeout(runStep, 300)
  }

  // Handle Terminal Commands
  const handleTerminalSubmit = (e) => {
    e.preventDefault()
    const trimmed = cmdInput.trim()
    if (!trimmed) return

    const newHistory = [...terminalHistory, { type: 'input', text: `$ ${trimmed}` }]
    const parts = trimmed.split(' ')
    const command = parts[0].toLowerCase()
    const arg = parts[1]

    switch (command) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: 'Available Commands:\n  ls         - List files and directories\n  mkdir <dir> - Create a new directory\n  touch <file>- Create a new file\n  cat <file>  - Display file contents\n  ps         - List running kernel processes\n  free       - Display RAM usage statistics\n  clear      - Clear terminal screen',
        })
        break
      case 'ls':
      case 'dir':
        const fileList = vfsFiles.map((f) => (f.isDir ? `[DIR]  ${f.name}/` : `[FILE] ${f.name}`)).join('\n')
        newHistory.push({ type: 'output', text: fileList })
        break
      case 'mkdir':
        if (!arg) {
          newHistory.push({ type: 'error', text: 'Error: Please specify directory name. Usage: mkdir <dirname>' })
        } else {
          setVfsFiles((prev) => [...prev, { name: arg, isDir: true }])
          newHistory.push({ type: 'success', text: `Directory "${arg}" created successfully.` })
        }
        break
      case 'touch':
        if (!arg) {
          newHistory.push({ type: 'error', text: 'Error: Please specify filename. Usage: touch <filename>' })
        } else {
          setVfsFiles((prev) => [...prev, { name: arg, isDir: false, content: 'Empty file created by user.' }])
          newHistory.push({ type: 'success', text: `File "${arg}" created successfully.` })
        }
        break
      case 'cat':
        if (!arg) {
          newHistory.push({ type: 'error', text: 'Error: Please specify file to read. Usage: cat <filename>' })
        } else {
          const found = vfsFiles.find((f) => f.name.toLowerCase() === arg.toLowerCase())
          if (!found) {
            newHistory.push({ type: 'error', text: `cat: ${arg}: No such file` })
          } else if (found.isDir) {
            newHistory.push({ type: 'error', text: `cat: ${arg}: Is a directory` })
          } else {
            newHistory.push({ type: 'output', text: found.content || '(empty file)' })
          }
        }
        break
      case 'ps':
        newHistory.push({
          type: 'output',
          text: 'PID   NAME               CPU%   MEM%   STATE\n1     kernel_init        0.1%   12MB   RUNNING\n402   systemd_journal    0.0%   8MB    SLEEPING\n819   desktop_shell      2.4%   140MB  RUNNING\n1204  web_browser        8.5%   650MB  RUNNING',
        })
        break
      case 'free':
        newHistory.push({
          type: 'output',
          text: 'Memory (RAM) Diagnostic:\n  Total:     16384 MB\n  Used:      6144 MB (37.5%)\n  Free:      10240 MB\n  Cache/Buffer: 2048 MB',
        })
        break
      case 'clear':
        setTerminalHistory([])
        setCmdInput('')
        return
      default:
        newHistory.push({
          type: 'error',
          text: `Command not found: "${command}". Type "help" for a list of available commands.`,
        })
    }

    setTerminalHistory(newHistory)
    setCmdInput('')
  }

  const handleLaunchApp = (app) => {
    if (ramAllocations.find((a) => a.id === app.id)) return // already running
    const newUsed = ramUsed + app.ram
    if (newUsed > RAM_TOTAL_MB) {
      setOomAlert(true)
      setTimeout(() => setOomAlert(false), 3000)
      return
    }
    setOomAlert(false)
    const newAlloc = [...ramAllocations, { ...app }]
    setRamAllocations(newAlloc)
    const newCpu = Math.min(newAlloc.reduce((s, a) => s + a.cpu, 0), 99)
    setCpuLoad(newCpu)
  }

  const handleKillApp = (appId) => {
    const newAlloc = ramAllocations.filter((a) => a.id !== appId)
    setRamAllocations(newAlloc)
    const newCpu = newAlloc.reduce((s, a) => s + a.cpu, 0)
    setCpuLoad(Math.min(newCpu, 99))
    setOomAlert(false)
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Interactive Mode Tabs */}
      <div className="glass rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-3">
            <Cpu className="text-lab-cyan" size={28} />
            <span>Operating System & Kernel Lab</span>
          </h2>
          <p className="text-sm opacity-70 mt-1">
            Learn how the OS Kernel manages CPU multitasking, system calls, memory, and command shell terminals!
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap p-1.5 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)] gap-1">
          <button
            onClick={() => setActiveTab('layers')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'layers'
                ? 'bg-lab-cyan text-slate-950 shadow-lg font-extrabold scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Layers size={16} />
            <span>1. OS Layers</span>
          </button>

          <button
            onClick={() => setActiveTab('scheduler')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'scheduler'
                ? 'bg-lab-cyan text-slate-950 shadow-lg font-extrabold scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Activity size={16} />
            <span>2. CPU Scheduling</span>
          </button>

          <button
            onClick={() => setActiveTab('resource')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'resource'
                ? 'bg-emerald-400 text-slate-950 shadow-lg font-extrabold scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <MemoryStick size={16} />
            <span>3. RAM Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'terminal'
                ? 'bg-lab-cyan text-slate-950 shadow-lg font-extrabold scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Terminal size={16} />
            <span>4. Terminal CLI</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Interactive Stage Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* ============================================================== */}
          {/* STAGE 1: OS SYSTEM LAYERS & SYSTEM CALLS */}
          {/* ============================================================== */}
          {activeTab === 'layers' && (
            <div className="glass rounded-3xl p-6 md:p-8 space-y-6 border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--theme-border)] pb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Layers className="text-lab-cyan" size={22} />
                    4 Layers of a Computer System
                  </h3>
                  <p className="text-xs opacity-70 mt-1">
                    Click any layer to inspect how system calls (`sys_call`) travel down from user apps to the OS kernel and hardware!
                  </p>
                </div>

                <button
                  onClick={handleRunSyscall}
                  disabled={isSyscallRunning}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-lab-cyan to-blue-600 text-slate-950 font-extrabold text-xs shadow-lg transition-all hover:scale-105"
                >
                  <Sparkles size={16} className={isSyscallRunning ? 'animate-spin' : ''} />
                  <span>Execute System Call Test</span>
                </button>
              </div>

              {/* System Call Request Selection */}
              <div className="flex flex-wrap items-center gap-3 p-3 bg-[var(--theme-bg-panel)] rounded-xl border border-[var(--theme-border)]">
                <span className="text-xs font-semibold opacity-80">Select App Action:</span>
                <select
                  value={selectedSyscall}
                  onChange={(e) => setSelectedSyscall(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--theme-input-bg)] border border-[var(--theme-border)] text-xs font-bold text-lab-cyan outline-none"
                >
                  <option value="write_file">sys_write(): Save File to NVMe SSD</option>
                  <option value="alloc_mem">sys_malloc(): Request 50MB RAM</option>
                  <option value="play_sound">sys_audio(): Output Audio to Speaker</option>
                </select>
              </div>

              {/* Syscall Running Indicator */}
              {isSyscallRunning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-lab-cyan/20 border border-lab-cyan/40 text-lab-cyan rounded-xl text-xs font-mono font-bold flex items-center gap-2"
                >
                  <Sparkles size={16} className="animate-spin" />
                  <span>
                    SYSTEM CALL FLOW: [{syscallStep?.toUpperCase()}] → Translating instruction down software architecture...
                  </span>
                </motion.div>
              )}

              {/* 4 Interactive OS Stack Layers */}
              <div className="space-y-3">
                {OS_LAYERS.map((layer) => {
                  const Icon = layer.icon
                  const isSelected = selectedLayer.id === layer.id
                  const isCurrentSyscallStep = syscallStep === layer.id

                  return (
                    <motion.div
                      key={layer.id}
                      onClick={() => setSelectedLayer(layer)}
                      whileHover={{ scale: 1.01 }}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-lab-cyan/15 border-lab-cyan shadow-lg shadow-lab-cyan/20 scale-[1.01]'
                          : isCurrentSyscallStep
                          ? 'bg-lab-cyan/30 border-lab-cyan shadow-lg animate-pulse'
                          : 'bg-[var(--theme-bg-panel)] border-[var(--theme-border)] opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-r ${layer.color} flex items-center justify-center text-white font-bold shadow-md`}
                        >
                          <Icon size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{layer.name}</h4>
                          <p className="text-xs opacity-70 mt-0.5 max-w-md">{layer.desc}</p>
                        </div>
                      </div>

                      <div className="hidden sm:flex flex-wrap gap-1 max-w-[140px] justify-end">
                        {layer.examples.slice(0, 2).map((ex) => (
                          <span key={ex} className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 opacity-70">
                            {ex}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STAGE 2: CPU PROCESS SCHEDULER & MULTITASKING */}
          {/* ============================================================== */}
          {activeTab === 'scheduler' && (
            <div className="glass rounded-3xl p-6 md:p-8 space-y-6 border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--theme-border)] pb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Activity className="text-lab-cyan" size={22} />
                    CPU Process Scheduler & Multitasking
                  </h3>
                  <p className="text-xs opacity-70 mt-1">
                    Watch how the OS Kernel switches between running programs on the CPU so fast it feels simultaneous!
                  </p>
                </div>

                <button
                  onClick={handleStartScheduler}
                  disabled={isScheduling}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-lab-cyan to-blue-600 text-slate-950 font-extrabold text-xs shadow-lg transition-all hover:scale-105"
                >
                  <Play size={16} className={isScheduling ? 'animate-pulse' : ''} />
                  <span>Start CPU Scheduler</span>
                </button>
              </div>

              {/* Algorithm Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)]">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold opacity-80">Scheduling Algorithm:</span>
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="algo"
                      value="rr"
                      checked={algo === 'rr'}
                      onChange={() => setAlgo('rr')}
                      className="accent-lab-cyan"
                    />
                    Round Robin (Quantum = 1s)
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="algo"
                      value="fcfs"
                      checked={algo === 'fcfs'}
                      onChange={() => setAlgo('fcfs')}
                      className="accent-lab-cyan"
                    />
                    First-Come First-Served (FCFS)
                  </label>
                </div>
              </div>

              {/* Active Running Processes Queue */}
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {processes.map((proc) => {
                  const isRunning = currentProcess === proc.id
                  const isFinished = proc.remaining === 0
                  const progressPct = ((proc.totalTime - proc.remaining) / proc.totalTime) * 100

                  return (
                    <div
                      key={proc.id}
                      className={`p-4 rounded-2xl border-2 space-y-3 transition-all ${
                        isRunning
                          ? 'bg-lab-cyan/20 border-lab-cyan shadow-lg shadow-lab-cyan/20 scale-105'
                          : isFinished
                          ? 'bg-emerald-500/10 border-emerald-500/40 opacity-70'
                          : 'bg-[var(--theme-bg-panel)] border-[var(--theme-border)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm font-mono text-lab-cyan">{proc.id}</span>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            isRunning
                              ? 'bg-lab-cyan text-slate-950 animate-pulse'
                              : isFinished
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-white/10 opacity-70'
                          }`}
                        >
                          {isRunning ? 'RUNNING' : isFinished ? 'DONE' : 'WAITING'}
                        </span>
                      </div>

                      <div className="font-bold text-xs">{proc.name}</div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] opacity-70 font-mono">
                          <span>Progress:</span>
                          <span>
                            {proc.totalTime - proc.remaining}s / {proc.totalTime}s
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="h-full bg-lab-cyan transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Live CPU Execution Timeline (Gantt Chart) */}
              <div className="p-4 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)] space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70 block">
                  Live CPU Core Gantt Chart Timeline:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
                  {ganttHistory.length === 0 ? (
                    <span className="text-xs opacity-50 italic">Click "Start CPU Scheduler" above to watch process execution.</span>
                  ) : (
                    ganttHistory.map((pid, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-3 py-1.5 bg-lab-cyan/20 border border-lab-cyan/40 text-lab-cyan font-mono text-xs font-bold rounded-lg flex-shrink-0"
                      >
                        t={idx + 1}s [{pid}]
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STAGE 3: OS RAM & CPU RESOURCE MANAGER                         */}
          {/* ============================================================== */}
          {activeTab === 'resource' && (
            <div className="glass rounded-3xl p-6 md:p-8 space-y-6 border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--theme-border)] pb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <MemoryStick className="text-emerald-400" size={22} />
                    OS CPU & Memory Resource Manager
                  </h3>
                  <p className="text-xs opacity-70 mt-1">
                    Click app request cards to launch them. Watch the OS allocate RAM blocks and balance CPU time slices!
                  </p>
                </div>
                <button
                  onClick={() => { setRamAllocations([]); setCpuLoad(0); setOomAlert(false) }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-bold"
                >
                  <RotateCcw size={15} /> Clear All
                </button>
              </div>

              {/* CPU & RAM Status Gauges */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* CPU Load */}
                <div className="p-4 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <Cpu size={16} className="text-lab-cyan" />
                      CPU Core Load
                    </div>
                    <span className={`font-mono font-bold text-sm ${cpuLoad > 85 ? 'text-red-400' : cpuLoad > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {cpuLoad}%
                    </span>
                  </div>
                  <div className="h-5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/10 relative">
                    <motion.div
                      animate={{ width: `${cpuLoad}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full relative overflow-hidden ${
                        cpuLoad > 85 ? 'bg-gradient-to-r from-red-500 to-rose-600'
                        : cpuLoad > 60 ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`}
                    >
                      <div className="absolute inset-0 bg-white/10 animate-pulse" style={{ animationDuration: '1.5s' }} />
                    </motion.div>
                  </div>
                  <div className="flex justify-between text-[9px] opacity-60 font-mono">
                    <span>0% IDLE</span><span>50% BALANCED</span><span>100% THROTTLED</span>
                  </div>
                </div>

                {/* RAM Bar */}
                <div className="p-4 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <MemoryStick size={16} className="text-purple-400" />
                      RAM Allocation
                    </div>
                    <span className={`font-mono font-bold text-sm ${ramPct > 90 ? 'text-red-400' : ramPct > 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {ramUsed} / {RAM_TOTAL_MB} MB
                    </span>
                  </div>

                  {/* Segmented RAM Bar */}
                  <div className="h-5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/10 flex">
                    {ramAllocations.map((app, idx) => (
                      <motion.div
                        key={app.id}
                        initial={{ width: 0 }}
                        animate={{ width: `${(app.ram / RAM_TOTAL_MB) * 100}%` }}
                        transition={{ duration: 0.4 }}
                        className={`h-full bg-gradient-to-r ${app.color} border-r border-slate-900`}
                        title={`${app.name}: ${app.ram} MB`}
                      />
                    ))}
                  </div>

                  {/* RAM legend */}
                  <div className="flex flex-wrap gap-1.5">
                    {ramAllocations.map((app) => (
                      <div key={app.id} className="flex items-center gap-1 text-[10px]">
                        <div className={`w-2.5 h-2.5 rounded-sm bg-gradient-to-r ${app.color}`} />
                        <span className="opacity-70 truncate max-w-[70px]">{app.name}</span>
                      </div>
                    ))}
                    {ramAllocations.length === 0 && <span className="text-[10px] opacity-40">No apps running</span>}
                  </div>
                </div>
              </div>

              {/* OOM Alert */}
              <AnimatePresence>
                {oomAlert && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 bg-red-500/20 border-2 border-red-500 rounded-2xl text-red-300 flex items-center gap-3 text-xs font-bold"
                  >
                    <AlertTriangle size={20} className="animate-pulse" />
                    <div>
                      <div className="text-sm font-extrabold">⛔ OUT OF MEMORY (OOM) — System Protection Active!</div>
                      <div className="font-normal opacity-90 mt-0.5">
                        Not enough RAM to launch this app. The OS has blocked the request to prevent a system crash. 
                        Close other running apps first to free RAM!
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* App Request Queue */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70 block">
                  App Request Queue — Click to Launch or Kill:
                </span>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {APP_REQUESTS.map((app) => {
                    const isRunning = !!ramAllocations.find((a) => a.id === app.id)
                    return (
                      <motion.div
                        key={app.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-2xl border-2 space-y-2.5 transition-all cursor-pointer ${
                          isRunning
                            ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                            : 'bg-[var(--theme-bg-panel)] border-[var(--theme-border)] hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{app.icon}</span>
                            <span className="text-xs font-bold">{app.name}</span>
                          </div>
                          {isRunning ? (
                            <button
                              onClick={() => handleKillApp(app.id)}
                              className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition-all text-red-400"
                              title="Kill process & free RAM"
                            >
                              <Trash2 size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleLaunchApp(app)}
                              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 transition-all text-emerald-400"
                              title="Launch app"
                            >
                              <Plus size={14} />
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2 text-[10px] font-mono">
                          <span className={`px-2 py-0.5 rounded-full ${isRunning ? 'bg-purple-500/20 text-purple-300' : 'bg-white/10 text-gray-400'}`}>
                            RAM: {app.ram} MB
                          </span>
                          <span className={`px-2 py-0.5 rounded-full ${isRunning ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-gray-400'}`}>
                            CPU: {app.cpu}%
                          </span>
                        </div>
                        {isRunning && (
                          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                            <Zap size={12} className="animate-pulse" />
                            Running — OS time-slicing active
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STAGE 4: INTERACTIVE TERMINAL CLI VS GUI                        */}
          {/* ============================================================== */}
          {activeTab === 'terminal' && (

            <div className="glass rounded-3xl p-6 md:p-8 space-y-6 border border-white/10">
              <div className="border-b border-[var(--theme-border)] pb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Terminal className="text-emerald-400" size={22} />
                  Interactive Command Line Shell (CLI) & Desktop (GUI)
                </h3>
                <p className="text-xs opacity-70 mt-1">
                  Type commands (`ls`, `mkdir`, `touch`, `cat`, `ps`, `free`) in the terminal to see real-time file system updates!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Working Terminal CLI Component */}
                <div className="bg-slate-950 rounded-2xl border border-white/15 p-4 font-mono text-xs flex flex-col h-80 shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 text-[10px] text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      <span className="ml-2 font-bold text-gray-300">bash — 80×24</span>
                    </div>
                    <span>/home/student</span>
                  </div>

                  {/* Terminal Log */}
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                    {terminalHistory.map((item, idx) => (
                      <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                        {item.type === 'input' && <span className="text-lab-cyan font-bold">{item.text}</span>}
                        {item.type === 'output' && <span className="text-gray-300">{item.text}</span>}
                        {item.type === 'system' && <span className="text-gray-500 italic">{item.text}</span>}
                        {item.type === 'success' && <span className="text-emerald-400 font-bold">{item.text}</span>}
                        {item.type === 'error' && <span className="text-red-400 font-bold">{item.text}</span>}
                      </div>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>

                  {/* Command Input Prompt */}
                  <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <span className="text-lab-cyan font-bold">$</span>
                    <input
                      type="text"
                      value={cmdInput}
                      onChange={(e) => setCmdInput(e.target.value)}
                      placeholder="Type command (e.g. ls, mkdir lab, touch note.txt)..."
                      className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs"
                      autoFocus
                    />
                  </form>
                </div>

                {/* Live GUI Desktop Directory Representation */}
                <div className="p-5 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)] space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-3">
                    <div className="flex items-center gap-2">
                      <Folder className="text-amber-400" size={18} />
                      <h4 className="font-bold text-sm">GUI Directory View (/home/student)</h4>
                    </div>
                    <span className="text-[10px] font-mono opacity-70">{vfsFiles.length} items</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar">
                    {vfsFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3 hover:border-lab-cyan/40 transition-all"
                      >
                        {file.isDir ? (
                          <Folder className="text-amber-400 flex-shrink-0" size={20} />
                        ) : (
                          <FileText className="text-lab-cyan flex-shrink-0" size={20} />
                        )}
                        <div className="truncate">
                          <div className="text-xs font-bold truncate">{file.name}</div>
                          <div className="text-[9px] opacity-60 font-mono">
                            {file.isDir ? 'Folder' : 'File'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Info Panel Component */}
        <div className="space-y-6">
          <InfoPanel data={computerTypes.os} />
        </div>
      </div>
    </div>
  )
}
