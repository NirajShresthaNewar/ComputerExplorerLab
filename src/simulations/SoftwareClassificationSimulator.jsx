import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Info,
  ShieldAlert,
  Cpu,
  Monitor,
  Code,
  Wrench,
  Package,
  Building,
  FileCheck,
  X,
} from 'lucide-react'
import InfoPanel from '../components/InfoPanel'
import { computerTypes } from '../data/computerData'
import { useApp } from '../context/AppContext'

const SOFTWARE_ITEMS = [
  {
    id: 'win11',
    name: 'Windows 11',
    category: 'system',
    subCategory: 'os',
    subCategoryName: 'Operating System',
    icon: Monitor,
    color: 'from-blue-500 to-indigo-600',
    quickFact:
      'Windows 11 is System Software (Operating System). It manages CPU scheduling, memory, files, and hardware drivers so all other programs can run!',
  },
  {
    id: 'antivirus',
    name: 'Windows Defender Antivirus',
    category: 'system',
    subCategory: 'utility',
    subCategoryName: 'Utility Software',
    icon: ShieldAlert,
    color: 'from-cyan-500 to-teal-600',
    quickFact:
      'Antivirus is System Software (Utility). Utility programs help maintain, optimize, scan, and protect your computer from security threats!',
  },
  {
    id: 'excel',
    name: 'Microsoft Excel',
    category: 'app',
    subCategory: 'packaged',
    subCategoryName: 'Packaged Software',
    icon: Package,
    color: 'from-emerald-500 to-green-600',
    quickFact:
      'MS Excel is Application Software (Packaged). It is sold off-the-shelf to millions of users for spreadsheet calculations and data charts.',
  },
  {
    id: 'driver',
    name: 'HP Printer Device Driver',
    category: 'system',
    subCategory: 'driver',
    subCategoryName: 'Device Driver',
    icon: Wrench,
    color: 'from-amber-500 to-orange-600',
    quickFact:
      'Device Drivers are System Software! They act as a specialized bridge translating generic OS print requests into commands your physical printer hardware understands.',
  },
  {
    id: 'photoshop',
    name: 'Adobe Photoshop',
    category: 'app',
    subCategory: 'packaged',
    subCategoryName: 'Packaged Software',
    icon: Package,
    color: 'from-purple-500 to-violet-600',
    quickFact:
      'Photoshop is Application Software (Packaged). It is a standard off-the-shelf graphic design application created for general creative professionals.',
  },
  {
    id: 'linux',
    name: 'Linux Ubuntu OS',
    category: 'system',
    subCategory: 'os',
    subCategoryName: 'Operating System',
    icon: Monitor,
    color: 'from-orange-500 to-red-600',
    quickFact:
      'Linux is open-source System Software (Operating System). It directly controls computer hardware and powers millions of web servers worldwide.',
  },
  {
    id: 'python_interp',
    name: 'Python 3 Interpreter',
    category: 'system',
    subCategory: 'lang',
    subCategoryName: 'Language Processor',
    icon: Code,
    color: 'from-blue-600 to-cyan-500',
    quickFact:
      'Language Processors are System Software! The Python Interpreter translates human-readable Python code line-by-line into binary machine code (0s and 1s).',
  },
  {
    id: 'defrag',
    name: 'Disk Defragmenter',
    category: 'system',
    subCategory: 'utility',
    subCategoryName: 'Utility Software',
    icon: Wrench,
    color: 'from-teal-500 to-emerald-600',
    quickFact:
      'Disk Defragmenter is System Software (Utility). It reorganizes fragmented hard disk files so the CPU can read files faster.',
  },
  {
    id: 'word',
    name: 'Microsoft Word',
    category: 'app',
    subCategory: 'packaged',
    subCategoryName: 'Packaged Software',
    icon: Package,
    color: 'from-blue-500 to-sky-600',
    quickFact:
      'MS Word is Application Software (Packaged). It is designed to perform end-user tasks like document editing and word processing.',
  },
  {
    id: 'custom_billing',
    name: 'City Hospital Custom Billing System',
    category: 'app',
    subCategory: 'tailored',
    subCategoryName: 'Tailored / Custom Software',
    icon: Building,
    color: 'from-pink-500 to-rose-600',
    quickFact:
      'Tailored Software is custom-built for a specific client or business! This billing system was specially programmed to match City Hospital’s exact workflows.',
  },
  {
    id: 'custom_grading',
    name: 'St. Jude School Grading System',
    category: 'app',
    subCategory: 'tailored',
    subCategoryName: 'Tailored / Custom Software',
    icon: Building,
    color: 'from-violet-500 to-fuchsia-600',
    quickFact:
      'This grading software is Application Software (Tailored). It was custom designed specifically for St. Jude School’s unique report card format.',
  },
  {
    id: 'vlc',
    name: 'VLC Media Player',
    category: 'app',
    subCategory: 'packaged',
    subCategoryName: 'Packaged Software',
    icon: Package,
    color: 'from-yellow-500 to-amber-600',
    quickFact:
      'VLC Media Player is Application Software (Packaged). It is a general-purpose software package used to play audio and video files.',
  },
]

const SUB_CATEGORIES = {
  system: [
    { id: 'os', name: 'Operating System', desc: 'Manages computer hardware, memory & file system', icon: Monitor },
    { id: 'utility', name: 'Utility Software', desc: 'Maintains, cleans & secures system performance', icon: ShieldAlert },
    { id: 'lang', name: 'Language Processor', desc: 'Translates high-level code to binary machine code', icon: Code },
    { id: 'driver', name: 'Device Driver', desc: 'Bridge translator between OS and physical hardware', icon: Wrench },
  ],
  app: [
    { id: 'packaged', name: 'Packaged Software', desc: 'Off-the-shelf general software for public users', icon: Package },
    { id: 'tailored', name: 'Tailored / Custom', desc: 'Custom-built software for specific client needs', icon: Building },
  ],
}

export default function SoftwareClassificationSimulator() {
  const [placements, setPlacements] = useState({}) // itemId -> { category, subCategory, correct }
  const [draggedId, setDraggedId] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [shakingId, setShakingId] = useState(null)
  const [activeFact, setActiveFact] = useState(null) // item object for popup modal
  const [hoveredZone, setHoveredZone] = useState(null) // 'system' or 'app'
  const { sound, markActivityCompleted } = useApp()

  const remaining = SOFTWARE_ITEMS.filter((item) => !placements[item.id])
  const correctCount = Object.values(placements).filter((p) => p.correct).length
  const totalCount = SOFTWARE_ITEMS.length

  const handleDrop = (targetCat, targetSub = null) => {
    const itemId = draggedId || selectedItem
    if (!itemId) return

    const item = SOFTWARE_ITEMS.find((i) => i.id === itemId)
    let correct = false

    if (targetSub) {
      correct = item.category === targetCat && item.subCategory === targetSub
    } else {
      correct = item.category === targetCat
    }

    if (correct) {
      sound.playCorrect()
      setPlacements((prev) => {
        const next = {
          ...prev,
          [itemId]: { category: item.category, subCategory: item.subCategory, correct: true },
        }
        if (Object.keys(next).length === totalCount) markActivityCompleted()
        return next
      })
      setActiveFact(item)
    } else {
      sound.playWrong()
      setShakingId(itemId)
      setTimeout(() => setShakingId(null), 500)
    }

    setDraggedId(null)
    setSelectedItem(null)
  }

  const handleReset = () => {
    setPlacements({})
    setDraggedId(null)
    setSelectedItem(null)
    setActiveFact(null)
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="glass rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-3">
            <Layers className="text-lab-cyan" size={28} />
            <span>Software Classification Hub</span>
          </h2>
          <p className="text-sm opacity-70 mt-1">
            Drag or click software cards into **System Software** or **Application Software** and explore sub-zone quick facts!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-lab-cyan/15 rounded-xl border border-lab-cyan/30 text-xs font-mono font-bold text-lab-cyan">
            Score: {correctCount} / {totalCount} Placed
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-bold"
          >
            <RotateCcw size={16} />
            <span>Reset Hub</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Sorting Playground */}
        <div className="lg:col-span-2 space-y-6">
          {/* Completion Celebration Alert */}
          {correctCount === totalCount && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400 rounded-3xl text-emerald-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Sparkles size={28} className="animate-spin text-amber-300" />
                <div>
                  <h4 className="font-extrabold text-lg text-white">Software Expert Badge Earned!</h4>
                  <p className="text-xs text-emerald-200">
                    Fantastic job! You correctly classified all 12 System & Application Software programs!
                  </p>
                </div>
              </div>
              <CheckCircle2 size={32} className="text-emerald-400" />
            </motion.div>
          )}

          {/* Draggable Unsorted Software Items Pool */}
          <div className="p-6 bg-[var(--theme-bg-panel)] rounded-3xl border border-[var(--theme-border)] space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-2">
              <span className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-2">
                <Package size={16} className="text-lab-cyan" />
                Unsorted Software Items Pool ({remaining.length} Left):
              </span>
              <span className="text-[10px] opacity-60">Click an item to select, or drag into a zone below</span>
            </div>

            <div className="flex flex-wrap gap-2.5 min-h-[90px] items-center">
              <AnimatePresence>
                {remaining.length === 0 ? (
                  <div className="text-xs opacity-50 italic py-4">All software items have been correctly sorted! 🎉</div>
                ) : (
                  remaining.map((item) => {
                    const Icon = item.icon
                    const isSelected = selectedItem === item.id

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          x: shakingId === item.id ? [0, -8, 8, -8, 8, 0] : 0,
                        }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ x: { duration: 0.4 } }}
                        draggable
                        onDragStart={() => setDraggedId(item.id)}
                        onClick={() => setSelectedItem(isSelected ? null : item.id)}
                        className={`cursor-grab active:cursor-grabbing px-4 py-2.5 rounded-2xl border-2 flex items-center gap-2.5 text-xs font-bold shadow-md transition-all ${
                          isSelected
                            ? 'bg-lab-cyan text-slate-950 border-white scale-105 shadow-lab-cyan/30'
                            : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg bg-gradient-to-r ${item.color} text-white`}>
                          <Icon size={14} />
                        </div>
                        <span>{item.name}</span>
                      </motion.div>
                    )
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 2 Main Drop Zones: System Software vs Application Software */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Zone 1: System Software */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setHoveredZone('system')
              }}
              onDragLeave={() => setHoveredZone(null)}
              onDrop={() => {
                handleDrop('system')
                setHoveredZone(null)
              }}
              onClick={() => selectedItem && handleDrop('system')}
              className={`p-6 rounded-3xl border-2 transition-all space-y-4 ${
                hoveredZone === 'system'
                  ? 'bg-blue-500/20 border-blue-400 shadow-xl shadow-blue-500/20 scale-[1.01]'
                  : 'bg-[var(--theme-bg-panel)] border-blue-500/30 hover:border-blue-400/60'
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-blue-400">1. System Software</h3>
                    <p className="text-[11px] opacity-70">Operates hardware, memory, drivers & system utilities</p>
                  </div>
                </div>
              </div>

              {/* Sub-Zones under System Software */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  Sub-Categories (Drop into specific sub-zone):
                </span>
                <div className="grid gap-2">
                  {SUB_CATEGORIES.system.map((sub) => {
                    const SubIcon = sub.icon
                    const placedInSub = Object.entries(placements)
                      .filter(([, v]) => v.category === 'system' && v.subCategory === sub.id)
                      .map(([id]) => SOFTWARE_ITEMS.find((i) => i.id === id))

                    return (
                      <div
                        key={sub.id}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.stopPropagation()
                          handleDrop('system', sub.id)
                        }}
                        onClick={(e) => {
                          if (selectedItem) {
                            e.stopPropagation()
                            handleDrop('system', sub.id)
                          }
                        }}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-blue-500/10 hover:border-blue-400/40 transition-all"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <SubIcon size={14} className="text-blue-400" />
                            <span className="text-xs font-bold text-gray-200">{sub.name}</span>
                          </div>
                          <span className="text-[9px] font-mono opacity-60">{placedInSub.length} items</span>
                        </div>
                        <p className="text-[10px] opacity-60 mb-2">{sub.desc}</p>

                        <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                          {placedInSub.map((item) => (
                            <motion.button
                              key={item.id}
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveFact(item)
                              }}
                              className="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold flex items-center gap-1.5 hover:scale-105 transition-all"
                            >
                              <FileCheck size={12} />
                              <span>{item.name}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Zone 2: Application Software */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setHoveredZone('app')
              }}
              onDragLeave={() => setHoveredZone(null)}
              onDrop={() => {
                handleDrop('app')
                setHoveredZone(null)
              }}
              onClick={() => selectedItem && handleDrop('app')}
              className={`p-6 rounded-3xl border-2 transition-all space-y-4 ${
                hoveredZone === 'app'
                  ? 'bg-purple-500/20 border-purple-400 shadow-xl shadow-purple-500/20 scale-[1.01]'
                  : 'bg-[var(--theme-bg-panel)] border-purple-500/30 hover:border-purple-400/60'
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-md">
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-purple-400">2. Application Software</h3>
                    <p className="text-[11px] opacity-70">Programs designed for end-users to perform specific tasks</p>
                  </div>
                </div>
              </div>

              {/* Sub-Zones under Application Software */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  Sub-Categories (Drop into specific sub-zone):
                </span>
                <div className="grid gap-2">
                  {SUB_CATEGORIES.app.map((sub) => {
                    const SubIcon = sub.icon
                    const placedInSub = Object.entries(placements)
                      .filter(([, v]) => v.category === 'app' && v.subCategory === sub.id)
                      .map(([id]) => SOFTWARE_ITEMS.find((i) => i.id === id))

                    return (
                      <div
                        key={sub.id}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.stopPropagation()
                          handleDrop('app', sub.id)
                        }}
                        onClick={(e) => {
                          if (selectedItem) {
                            e.stopPropagation()
                            handleDrop('app', sub.id)
                          }
                        }}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-400/40 transition-all"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <SubIcon size={14} className="text-purple-400" />
                            <span className="text-xs font-bold text-gray-200">{sub.name}</span>
                          </div>
                          <span className="text-[9px] font-mono opacity-60">{placedInSub.length} items</span>
                        </div>
                        <p className="text-[10px] opacity-60 mb-2">{sub.desc}</p>

                        <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                          {placedInSub.map((item) => (
                            <motion.button
                              key={item.id}
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveFact(item)
                              }}
                              className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[11px] font-bold flex items-center gap-1.5 hover:scale-105 transition-all"
                            >
                              <FileCheck size={12} />
                              <span>{item.name}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Info Panel & Quick Fact Popup Modal */}
        <div className="space-y-6">
          <InfoPanel data={computerTypes['software-class']} />
        </div>
      </div>

      {/* Quick Fact Popup Modal */}
      <AnimatePresence>
        {activeFact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass border-2 border-lab-cyan rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative"
            >
              <button
                onClick={() => setActiveFact(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-gray-300"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className={`p-2.5 rounded-2xl bg-gradient-to-r ${activeFact.color} text-white font-bold shadow-md`}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">{activeFact.name}</h3>
                  <span className="text-xs font-bold text-lab-cyan">
                    {activeFact.category === 'system' ? 'System Software' : 'Application Software'} → {activeFact.subCategoryName}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-gray-200 leading-relaxed">
                <span className="font-bold text-amber-300 block mb-1">💡 Grade 7 Quick Fact:</span>
                {activeFact.quickFact}
              </div>

              <button
                onClick={() => setActiveFact(null)}
                className="w-full py-2.5 rounded-xl bg-lab-cyan text-slate-950 font-extrabold text-xs shadow-lg hover:scale-105 transition-all"
              >
                Got It, Continue Exploring!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
