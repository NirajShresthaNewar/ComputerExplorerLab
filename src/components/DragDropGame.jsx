import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Lightbulb, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

const items = [
  { id: 'laptop', label: 'Laptop', category: 'micro' },
  { id: 'smartphone', label: 'Smartphone', category: 'micro' },
  { id: 'desktop', label: 'Desktop', category: 'micro' },
  { id: 'ecg', label: 'ECG Machine', category: 'hybrid' },
  { id: 'petrolpump', label: 'Petrol Pump', category: 'hybrid' },
  { id: 'weatherstation', label: 'Weather Station', category: 'hybrid' },
  { id: 'thermometer', label: 'Thermometer', category: 'analog' },
  { id: 'speedometer', label: 'Speedometer', category: 'analog' },
  { id: 'atm', label: 'ATM', category: 'mainframe' },
  { id: 'railway', label: 'Railway Reservation', category: 'mainframe' },
  { id: 'bank', label: 'Bank System', category: 'mainframe' },
  { id: 'supercomputer', label: 'Weather Supercomputer', category: 'super' },
]

const categories = [
  { id: 'analog', label: 'Analog' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'micro', label: 'Microcomputer' },
  { id: 'mainframe', label: 'Mainframe' },
  { id: 'super', label: 'Supercomputer' },
]

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function DragDropGame() {
  const [pool, setPool] = useState(() => shuffle(items))
  const [placements, setPlacements] = useState({}) // itemId -> { category, correct }
  const [draggedId, setDraggedId] = useState(null)
  const [shakingId, setShakingId] = useState(null)
  const [showHint, setShowHint] = useState(null)
  const { sound, markActivityCompleted } = useApp()

  const remaining = pool.filter((item) => !placements[item.id])
  const correctCount = Object.values(placements).filter((p) => p.correct).length

  const handleDrop = (categoryId) => {
    if (!draggedId) return
    const item = items.find((i) => i.id === draggedId)
    const correct = item.category === categoryId

    if (correct) {
      sound.playCorrect()
      setPlacements((prev) => {
        const next = { ...prev, [draggedId]: { category: categoryId, correct: true } }
        if (Object.keys(next).length === items.length) markActivityCompleted()
        return next
      })
    } else {
      sound.playWrong()
      setShakingId(draggedId)
      setTimeout(() => setShakingId(null), 500)
    }
    setDraggedId(null)
  }

  const handleReset = () => {
    setPool(shuffle(items))
    setPlacements({})
    setShowHint(null)
  }

  const allDone = remaining.length === 0

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold">Drag each item into its correct computer category</h3>
          <p className="text-sm text-gray-400">
            {correctCount} / {items.length} placed correctly
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-white/10 transition-colors text-sm"
        >
          <RotateCcw size={16} aria-hidden="true" />
          Retry
        </button>
      </div>

      {allDone && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-green-500/10 text-green-400 text-sm"
        >
          <CheckCircle2 size={18} aria-hidden="true" />
          All items placed correctly. Great work exploring computer types!
        </motion.div>
      )}

      {/* Draggable item pool */}
      <div className="flex flex-wrap gap-2 mb-6 min-h-[48px]">
        <AnimatePresence>
          {remaining.map((item) => (
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
              tabIndex={0}
              role="button"
              aria-label={`${item.label}, drag to a category or press a hint`}
              onClick={() => setShowHint(showHint === item.id ? null : item.id)}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 cursor-grab active:cursor-grabbing text-sm relative"
            >
              {item.label}
              {showHint === item.id && (
                <span className="absolute -top-8 left-0 text-xs bg-black/80 text-lab-cyan px-2 py-1 rounded whitespace-nowrap flex items-center gap-1">
                  <Lightbulb size={12} aria-hidden="true" />
                  Try: {categories.find((c) => c.id === item.category).label}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Drop zones */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const placed = Object.entries(placements)
            .filter(([, v]) => v.category === cat.id)
            .map(([id]) => items.find((i) => i.id === id))

          return (
            <div
              key={cat.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(cat.id)}
              className="min-h-[120px] rounded-xl border-2 border-dashed border-white/15 p-3 hover:border-lab-cyan/50 transition-colors"
            >
              <p className="text-xs font-semibold text-lab-cyan mb-2">{cat.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {placed.map((item) => (
                  <motion.span
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-2 py-1 rounded bg-green-500/20 text-green-300 text-xs"
                  >
                    {item.label}
                  </motion.span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Tip: on touch devices, tap an item for a hint. Drag-and-drop works with mouse or
        touchscreen dragging.
      </p>
    </div>
  )
}
