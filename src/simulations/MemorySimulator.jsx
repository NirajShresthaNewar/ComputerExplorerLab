import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cpu,
  Database,
  Zap,
  HardDrive,
  Power,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Layers,
  Binary,
  CheckCircle2,
  Lock,
  Radio,
  FileCode,
} from 'lucide-react'
import InfoPanel from '../components/InfoPanel'
import { computerTypes } from '../data/computerData'

const DEFAULT_BITS = [0, 1, 0, 0, 0, 0, 0, 1] // ASCII for 'A' (65)

const HIERARCHY_TIERS = [
  {
    id: 'registers',
    name: 'CPU Registers',
    category: 'CPU Internal',
    speed: '0.5 nanoseconds',
    capacity: '64 Bytes to 2 KB',
    volatility: 'Volatile (Lost on power off)',
    desc: 'Tiny, lightning-fast memory cells built directly inside the CPU core for instant math calculations.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'cache',
    name: 'L1 / L2 / L3 Cache',
    category: 'CPU On-Chip',
    speed: '1 – 5 nanoseconds',
    capacity: '2 MB – 64 MB',
    volatility: 'Volatile',
    desc: 'High-speed SRAM that predicts and holds data the CPU will need next, avoiding slow RAM fetches.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'ram',
    name: 'Primary Memory (RAM)',
    category: 'System Main Memory',
    speed: '50 – 100 nanoseconds',
    capacity: '8 GB – 64 GB',
    volatility: 'Volatile (Clears when turned off)',
    desc: 'Random Access Memory holding active operating system code, open web tabs, and running games.',
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 'ssd',
    name: 'Secondary Storage (NVMe SSD)',
    category: 'Solid State Storage',
    speed: '50 microseconds (0.05 ms)',
    capacity: '512 GB – 4 TB',
    volatility: 'Non-Volatile (Permanent)',
    desc: 'High-speed flash memory chips that keep all your installed apps, OS files, and games saved permanently.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'hdd',
    name: 'Secondary Storage (Magnetic HDD)',
    category: 'Magnetic Storage',
    speed: '10 milliseconds (10,000,000 ns)',
    capacity: '2 TB – 20 TB',
    volatility: 'Non-Volatile (Permanent)',
    desc: 'Spinning magnetic platters used for mass data archiving. Much cheaper per gigabyte, but much slower.',
    color: 'from-emerald-500 to-teal-600',
  },
]

export default function MemorySimulator() {
  const [activeTab, setActiveTab] = useState('shells') // 'shells', 'primary', 'hierarchy'

  // Stage 1: Bit & Byte Shells state
  const [bits, setBits] = useState(DEFAULT_BITS)
  const [charInput, setCharInput] = useState('A')
  const [selectedAddress, setSelectedAddress] = useState(0)
  const [targetBitVal, setTargetBitVal] = useState(1)
  const [busActive, setBusActive] = useState(false)
  const [selectedWordSize, setSelectedWordSize] = useState('word')

  // Stage 2: RAM vs ROM Power state
  const [isPowerOn, setIsPowerOn] = useState(true)
  const [ramApps, setRamApps] = useState([
    { id: 1, name: 'Web Browser', data: '0x4A81: YouTube Stream' },
    { id: 2, name: 'Calculator App', data: '0x102B: 485 × 25' },
    { id: 3, name: '3D Game Engine', data: '0x99F0: Player Position' },
  ])

  // Stage 3: Hierarchy state
  const [selectedTier, setSelectedTier] = useState(HIERARCHY_TIERS[0])
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [fetchStep, setFetchStep] = useState(null) // 'hdd' -> 'ssd' -> 'ram' -> 'cache' -> 'cpu'

  // Toggle individual bit
  const toggleBit = (index) => {
    const updated = [...bits]
    updated[index] = updated[index] === 1 ? 0 : 1
    setBits(updated)

    // Recalculate input char if valid printable ASCII
    const dec = parseInt(updated.join(''), 2)
    if (dec >= 32 && dec <= 126) {
      setCharInput(String.fromCharCode(dec))
    } else {
      setCharInput('')
    }
  }

  // Handle character typing -> converts to 8 bits
  const handleCharInput = (e) => {
    const val = e.target.value.slice(-1)
    setCharInput(val)
    if (val) {
      const code = val.charCodeAt(0)
      const binaryStr = code.toString(2).padStart(8, '0')
      setBits(binaryStr.split('').map(Number))
    }
  }

  // Handle Write to Bus Simulation
  const handleWriteToAddress = () => {
    setBusActive(true)
    setTimeout(() => {
      const updated = [...bits]
      updated[selectedAddress] = targetBitVal
      setBits(updated)
      setBusActive(false)
    }, 600)
  }

  // Calculations for Stage 1
  const binaryString = bits.join('')
  const decimalValue = parseInt(binaryString, 2)
  const hexValue = '0x' + decimalValue.toString(16).toUpperCase().padStart(2, '0')

  // Run Data Fetch Simulation through Memory Hierarchy
  const handleRunFetchSimulation = () => {
    setIsFetchingData(true)
    setFetchStep('hdd')

    setTimeout(() => setFetchStep('ssd'), 700)
    setTimeout(() => setFetchStep('ram'), 1400)
    setTimeout(() => setFetchStep('cache'), 2100)
    setTimeout(() => setFetchStep('cpu'), 2800)
    setTimeout(() => {
      setIsFetchingData(false)
      setFetchStep(null)
    }, 3600)
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Interactive Mode Tabs */}
      <div className="glass rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-3">
            <Database className="text-lab-cyan" size={28} />
            <span>Memory & Storage Explorer</span>
          </h2>
          <p className="text-sm opacity-70 mt-1">
            Explore how computers use memory shells, addresses, RAM, ROM, and storage.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1.5 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)]">
          <button
            onClick={() => setActiveTab('shells')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'shells'
                ? 'bg-lab-cyan text-slate-950 shadow-lg font-extrabold scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Binary size={16} />
            <span>1. Bits & Address Shells</span>
          </button>

          <button
            onClick={() => setActiveTab('primary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'primary'
                ? 'bg-lab-cyan text-slate-950 shadow-lg font-extrabold scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Zap size={16} />
            <span>2. RAM vs ROM (Volatility)</span>
          </button>

          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'hierarchy'
                ? 'bg-lab-cyan text-slate-950 shadow-lg font-extrabold scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Layers size={16} />
            <span>3. Memory Hierarchy</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Interactive Stage Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* ============================================================== */}
          {/* STAGE 1: BITS & ADDRESS SHELLS */}
          {/* ============================================================== */}
          {activeTab === 'shells' && (
            <div className="glass rounded-3xl p-6 md:p-8 space-y-6 border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--theme-border)] pb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Binary className="text-lab-cyan" size={22} />
                    1 Byte Memory Bank (8 Bit Shells)
                  </h3>
                  <p className="text-xs opacity-70 mt-1">
                    Each shell has a unique memory address (`0x00` to `0x07`) and stores 1 bit (0 or 1). Click any shell to flip its state!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-70 font-medium">Type a Letter:</span>
                  <input
                    type="text"
                    maxLength={1}
                    value={charInput}
                    onChange={handleCharInput}
                    placeholder="A"
                    className="w-10 h-10 text-center font-bold text-lg rounded-xl bg-[var(--theme-input-bg)] border border-[var(--theme-border)] text-lab-cyan focus:outline-none focus:ring-2 focus:ring-lab-cyan"
                  />
                </div>
              </div>

              {/* Memory Address Bus Indicator */}
              {busActive && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-lab-cyan/20 border border-lab-cyan/40 text-lab-cyan rounded-xl text-xs font-mono font-bold flex items-center gap-2"
                >
                  <Sparkles size={16} className="animate-spin" />
                  <span>ADDRESS BUS SIGNAL: Writing bit [{targetBitVal}] into Memory Address [0x0{selectedAddress}]...</span>
                </motion.div>
              )}

              {/* 8 Bit Memory Shell Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {bits.map((bitVal, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleBit(idx)}
                    className={`cursor-pointer rounded-2xl p-3 border-2 flex flex-col items-center justify-between h-36 transition-all duration-300 ${
                      bitVal === 1
                        ? 'bg-lab-cyan/15 border-lab-cyan text-white shadow-lg shadow-lab-cyan/20'
                        : 'bg-[var(--theme-bg-panel)] border-[var(--theme-border)] opacity-80 hover:opacity-100'
                    }`}
                  >
                    {/* Hex Address Header */}
                    <div className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 opacity-75">
                      0x0{idx}
                    </div>

                    {/* Transistor Charge Visual */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        bitVal === 1
                          ? 'bg-lab-cyan text-slate-950 shadow-md shadow-lab-cyan'
                          : 'bg-slate-800 text-gray-500'
                      }`}
                    >
                      {bitVal === 1 ? <Zap size={18} /> : <div className="w-2 h-2 rounded-full bg-gray-600" />}
                    </div>

                    {/* Bit Value */}
                    <div className="text-2xl font-extrabold font-mono">{bitVal}</div>

                    <div className="text-[9px] uppercase tracking-wider opacity-60 font-semibold">
                      {bitVal === 1 ? 'Charged' : 'Empty'}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Real-time Decoded Output Box */}
              <div className="grid sm:grid-cols-4 gap-4 p-5 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)]">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Binary Byte</span>
                  <div className="text-xl font-extrabold font-mono text-lab-cyan">{binaryString}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Decimal Value</span>
                  <div className="text-xl font-extrabold font-mono">{decimalValue}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Hex Address Data</span>
                  <div className="text-xl font-extrabold font-mono">{hexValue}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Decoded Character</span>
                  <div className="text-xl font-extrabold font-mono text-emerald-400">
                    {charInput ? `'${charInput}'` : decimalValue >= 32 && decimalValue <= 126 ? `'${String.fromCharCode(decimalValue)}'` : 'Non-printable'}
                  </div>
                </div>
              </div>

              {/* Memory Address Bus Controller */}
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Radio size={16} className="text-lab-cyan" />
                  <span>Memory Bus Controller (Address Read / Write)</span>
                </h4>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold opacity-80">Target Address Shell:</label>
                    <select
                      value={selectedAddress}
                      onChange={(e) => setSelectedAddress(Number(e.target.value))}
                      className="px-3 py-1.5 rounded-xl bg-[var(--theme-input-bg)] border border-[var(--theme-border)] text-xs font-bold text-lab-cyan outline-none"
                    >
                      {bits.map((_, i) => (
                        <option key={i} value={i}>
                          Shell 0x0{i}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold opacity-80">Bit Value:</label>
                    <button
                      onClick={() => setTargetBitVal((v) => (v === 1 ? 0 : 1))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold font-mono transition-all ${
                        targetBitVal === 1 ? 'bg-lab-cyan text-slate-950' : 'bg-slate-700 text-white'
                      }`}
                    >
                      Bit = {targetBitVal}
                    </button>
                  </div>

                  <button
                    onClick={handleWriteToAddress}
                    disabled={busActive}
                    className="ml-auto px-5 py-2 rounded-xl bg-gradient-to-r from-lab-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg transition-all"
                  >
                    Send Signal: Write to Bus
                  </button>
                </div>
              </div>

              {/* Memory Data Units & Word Sizes Visualizer */}
              <div className="p-6 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)] space-y-5">
                <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-3">
                  <div>
                    <h4 className="text-base font-bold flex items-center gap-2 text-lab-cyan">
                      <FileCode size={18} />
                      <span>What is a Memory "WORD"? (Data Units & Sizes)</span>
                    </h4>
                    <p className="text-xs opacity-75 mt-0.5">
                      Computers group bits together into Data Units called **Bit, Nibble, Byte, WORD, DWORD, and QWORD**.
                    </p>
                  </div>
                </div>

                {/* Word Size Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    { id: 'bit', name: '1 Bit', bits: '1 bit' },
                    { id: 'nibble', name: '1 Nibble', bits: '4 bits' },
                    { id: 'byte', name: '1 Byte', bits: '8 bits (1 B)' },
                    { id: 'word', name: '1 WORD', bits: '16 bits (2 B)' },
                    { id: 'dword', name: 'DWORD', bits: '32 bits (4 B)' },
                    { id: 'qword', name: 'QWORD', bits: '64 bits (8 B)' },
                  ].map((unit) => {
                    const isSelected = selectedWordSize === unit.id
                    return (
                      <button
                        key={unit.id}
                        onClick={() => setSelectedWordSize(unit.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-lab-cyan text-slate-950 font-extrabold border-lab-cyan shadow-md scale-105'
                            : 'bg-white/5 border-white/10 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="text-xs font-bold">{unit.name}</div>
                        <div className="text-[10px] font-mono opacity-80 mt-0.5">{unit.bits}</div>
                      </button>
                    )
                  })}
                </div>

                {/* Active Word Unit Inspector */}
                {(() => {
                  const info = {
                    bit: {
                      title: '1 Bit (Binary Digit)',
                      bitsCount: 1,
                      bytes: '1/8 Byte',
                      desc: 'The single smallest unit of computer memory. Holds either a 0 (Discharged / OFF) or a 1 (Charged / ON).',
                      cpuArch: 'All Microprocessors',
                      example: '0 or 1',
                    },
                    nibble: {
                      title: '1 Nibble (4 Bits)',
                      bitsCount: 4,
                      bytes: '1/2 Byte',
                      desc: 'A 4-bit block of memory. Exactly enough to represent one Hexadecimal digit (0, 1 ... F).',
                      cpuArch: '4-bit microcontrollers (e.g. Intel 4004)',
                      example: '1010 = Hex 0xA (Decimal 10)',
                    },
                    byte: {
                      title: '1 Byte (8 Bits)',
                      bitsCount: 8,
                      bytes: '1 Byte',
                      desc: 'An 8-bit block of memory. The universal standard size to store 1 text character (ASCII Code).',
                      cpuArch: '8-bit CPUs (e.g. Z80, MOS 6502)',
                      example: '01000001 = Hex 0x41 = Character "A"',
                    },
                    word: {
                      title: '1 WORD (16 Bits / 2 Bytes)',
                      bitsCount: 16,
                      bytes: '2 Bytes',
                      desc: 'A 16-bit memory word. In 16-bit CPU architecture, the processor fetches and calculates 16 bits in a single clock tick.',
                      cpuArch: '16-bit CPUs (e.g. Intel 8086 / 80286)',
                      example: '0x415A (Holds numbers up to 65,535)',
                    },
                    dword: {
                      title: '1 DWORD / Double Word (32 Bits / 4 Bytes)',
                      bitsCount: 32,
                      bytes: '4 Bytes',
                      desc: 'A 32-bit memory word. Standard for 32-bit operating systems (x86). Can address up to 4 Gigabytes of RAM directly!',
                      cpuArch: '32-bit CPUs (e.g. Intel Pentium / x86)',
                      example: '0x415A99B2 (Holds numbers up to 4.29 Billion)',
                    },
                    qword: {
                      title: '1 QWORD / Quad Word (64 Bits / 8 Bytes)',
                      bitsCount: 64,
                      bytes: '8 Bytes',
                      desc: 'A 64-bit memory word. Used by all modern 64-bit processors (x86-64 / ARM64). Fetches 8 Bytes per instruction cycle!',
                      cpuArch: 'Modern 64-bit CPUs (Intel Core, AMD Ryzen, Apple M1/M2/M3)',
                      example: '0x7FFF88A900112233 (Can address 16 Exabytes of RAM!)',
                    },
                  }[selectedWordSize]

                  return (
                    <motion.div
                      key={selectedWordSize}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-lab-cyan">{info.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-lab-cyan/20 text-lab-cyan rounded-full font-bold">
                          {info.bytes} ({info.bitsCount} bits)
                        </span>
                      </div>
                      <p className="text-xs opacity-85 leading-relaxed">{info.desc}</p>
                      <div className="grid sm:grid-cols-2 gap-3 pt-1 text-xs font-mono">
                        <div className="p-2.5 bg-[var(--theme-bg-panel)] rounded-lg border border-[var(--theme-border)]">
                          <span className="opacity-60 block text-[10px] uppercase">Example Value:</span>
                          <span className="font-bold text-emerald-400">{info.example}</span>
                        </div>
                        <div className="p-2.5 bg-[var(--theme-bg-panel)] rounded-lg border border-[var(--theme-border)]">
                          <span className="opacity-60 block text-[10px] uppercase">Target Architecture:</span>
                          <span className="font-bold text-lab-cyan">{info.cpuArch}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })()}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STAGE 2: PRIMARY MEMORY (RAM VS ROM & VOLATILITY) */}
          {/* ============================================================== */}
          {activeTab === 'primary' && (
            <div className="glass rounded-3xl p-6 md:p-8 space-y-6 border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--theme-border)] pb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Zap className="text-amber-400" size={22} />
                    Primary Memory Volatility Test (RAM vs ROM)
                  </h3>
                  <p className="text-xs opacity-70 mt-1">
                    Toggle the computer power switch to see how Volatile RAM wipes clean while Non-Volatile ROM keeps BIOS intact!
                  </p>
                </div>

                {/* Main Power Switch */}
                <button
                  onClick={() => setIsPowerOn((p) => !p)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all shadow-xl ${
                    isPowerOn
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 scale-105'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                  }`}
                >
                  <Power size={18} />
                  <span>{isPowerOn ? 'POWER IS ON (12V)' : 'POWER IS OFF (0V)'}</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* RAM (Volatile Memory) */}
                <div className="p-5 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)] space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="text-lab-cyan" size={18} />
                      <h4 className="font-bold text-sm">RAM (Random Access Memory)</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                      Volatile
                    </span>
                  </div>

                  <p className="text-xs opacity-75">
                    Temporary workspace used for active applications. Requires continuous electric charge.
                  </p>

                  <div className="space-y-2.5">
                    {isPowerOn ? (
                      ramApps.map((app) => (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-3 bg-lab-cyan/10 border border-lab-cyan/30 rounded-xl flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-lab-cyan">{app.name}</div>
                            <div className="text-[10px] font-mono opacity-70">{app.data}</div>
                          </div>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            ACTIVE
                          </span>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-8 text-center bg-black/40 rounded-xl border border-red-500/20 space-y-2">
                        <div className="text-red-400 font-extrabold text-sm">MEM_CLEARED_EMPTY (0x0000)</div>
                        <p className="text-xs opacity-60">
                          Power lost! Electrical capacitors discharged. All RAM data evaporated.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ROM (Non-Volatile Memory) */}
                <div className="p-5 bg-[var(--theme-bg-panel)] rounded-2xl border border-[var(--theme-border)] space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-3">
                    <div className="flex items-center gap-2">
                      <Lock className="text-purple-400" size={18} />
                      <h4 className="font-bold text-sm">ROM (Read Only Memory)</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Non-Volatile
                    </span>
                  </div>

                  <p className="text-xs opacity-75">
                    Permanent chip wired during manufacturing. Contains computer startup BIOS firmware instructions.
                  </p>

                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl space-y-2 font-mono text-xs">
                    <div className="flex justify-between text-purple-300 font-bold text-[11px]">
                      <span>0xFC00: BIOS POST CODE</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-purple-500/20 rounded">READ-ONLY</span>
                    </div>
                    <div className="text-[10px] opacity-80">1. Initialize Hardware Components</div>
                    <div className="text-[10px] opacity-80">2. Verify Memory Integrity Test</div>
                    <div className="text-[10px] opacity-80">3. Boot Operating System from SSD</div>
                  </div>

                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 font-medium flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>ROM status: Data intact ({isPowerOn ? '12V Active' : '0V Saved On Silicon'})</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STAGE 3: MEMORY HIERARCHY PYRAMID */}
          {/* ============================================================== */}
          {activeTab === 'hierarchy' && (
            <div className="glass rounded-3xl p-6 md:p-8 space-y-6 border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--theme-border)] pb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Layers className="text-indigo-400" size={22} />
                    Computer Memory & Storage Hierarchy
                  </h3>
                  <p className="text-xs opacity-70 mt-1">
                    Click any level of the pyramid to compare access speed, capacity, and cost per gigabyte!
                  </p>
                </div>

                <button
                  onClick={handleRunFetchSimulation}
                  disabled={isFetchingData}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-lab-cyan to-blue-600 text-slate-950 font-extrabold text-xs shadow-lg transition-all hover:scale-105"
                >
                  <RefreshCw size={16} className={isFetchingData ? 'animate-spin' : ''} />
                  <span>Run CPU Data Fetch Test</span>
                </button>
              </div>

              {/* Fetch Simulation Status Bar */}
              {isFetchingData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 rounded-xl text-xs font-mono font-bold flex items-center gap-3"
                >
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <span>
                    FETCH PATH: [{fetchStep?.toUpperCase()}] → Traveling up hierarchy to CPU Registers...
                  </span>
                </motion.div>
              )}

              {/* Memory Pyramid Tiers */}
              <div className="space-y-3">
                {HIERARCHY_TIERS.map((tier, idx) => {
                  const isSelected = selectedTier.id === tier.id
                  const isCurrentFetch = fetchStep === tier.id
                  return (
                    <motion.div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      whileHover={{ scale: 1.01 }}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-lab-cyan/15 border-lab-cyan shadow-lg shadow-lab-cyan/20 scale-[1.01]'
                          : isCurrentFetch
                          ? 'bg-indigo-500/30 border-indigo-400 shadow-lg animate-pulse'
                          : 'bg-[var(--theme-bg-panel)] border-[var(--theme-border)] opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl bg-gradient-to-r ${tier.color} flex items-center justify-center text-white font-bold text-xs shadow-md`}
                        >
                          #{idx + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm flex items-center gap-2">
                            <span>{tier.name}</span>
                            <span className="text-[10px] opacity-60 font-mono">({tier.category})</span>
                          </h4>
                          <div className="text-xs opacity-70 font-mono mt-0.5">
                            Speed: <span className="text-lab-cyan font-bold">{tier.speed}</span> | Cap: {tier.capacity}
                          </div>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
                          {tier.volatility.split(' ')[0]}
                        </span>
                        <ArrowRight size={16} className="opacity-40" />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Info Panel & Detailed Diagnostics */}
        <div className="space-y-6">
          {/* Selected Tier Inspector */}
          {activeTab === 'hierarchy' && selectedTier && (
            <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center gap-3 border-b border-[var(--theme-border)] pb-3">
                <div
                  className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${selectedTier.color} flex items-center justify-center text-white font-bold shadow-lg`}
                >
                  <Cpu size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-base">{selectedTier.name}</h4>
                  <p className="text-xs opacity-70 font-mono">{selectedTier.category}</p>
                </div>
              </div>

              <p className="text-xs opacity-85 leading-relaxed">{selectedTier.desc}</p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between p-2.5 bg-[var(--theme-bg-panel)] rounded-xl border border-[var(--theme-border)]">
                  <span className="opacity-70 font-medium">Access Latency (Speed):</span>
                  <span className="font-mono font-bold text-lab-cyan">{selectedTier.speed}</span>
                </div>

                <div className="flex justify-between p-2.5 bg-[var(--theme-bg-panel)] rounded-xl border border-[var(--theme-border)]">
                  <span className="opacity-70 font-medium">Typical Capacity:</span>
                  <span className="font-mono font-bold">{selectedTier.capacity}</span>
                </div>

                <div className="flex justify-between p-2.5 bg-[var(--theme-bg-panel)] rounded-xl border border-[var(--theme-border)]">
                  <span className="opacity-70 font-medium">Volatility:</span>
                  <span className="font-mono font-bold text-amber-400">{selectedTier.volatility}</span>
                </div>
              </div>
            </div>
          )}

          {/* Core Info Panel Component */}
          <InfoPanel data={computerTypes.memory} />
        </div>
      </div>
    </div>
  )
}
