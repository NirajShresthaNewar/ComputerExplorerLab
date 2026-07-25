import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ControlPanel from '../components/ControlPanel'
import InfoPanel from '../components/InfoPanel'
import { computerTypes } from '../data/computerData'

const devices = ['laptop', 'desktop', 'tablet', 'smartphone']
const activities = {
  typing: 'Untitled Document.txt\n\nDear diary, today I learned...',
  gaming: '🎮 SCORE: 4,820   LEVEL 3',
  internet: 'search: how do computers work?',
  drawing: '🎨 Layer 1 — Brush: 12px',
}

// A single frame component that renders a believable device silhouette
// per type, with the "screen" content swapped based on chosen activity.
function DeviceFrame({ device, content, active }) {
  const screen = (
    <div className="bg-black rounded flex items-center justify-center p-2 overflow-hidden">
      <p className="text-lab-cyan text-[10px] font-mono whitespace-pre-wrap text-center">{content}</p>
    </div>
  )

  if (device === 'laptop') {
    return (
      <div className="w-56 mx-auto">
        <div className="bg-slate-800 rounded-t-lg border-2 border-slate-700 p-2 h-28">{screen}</div>
        <div className="h-2 bg-slate-600 rounded-b-sm" />
        <div className="h-1.5 bg-slate-700 w-3/4 mx-auto rounded-b-md" />
      </div>
    )
  }
  if (device === 'desktop') {
    return (
      <div className="w-56 mx-auto">
        <div className="bg-slate-800 rounded-lg border-2 border-slate-700 p-2 h-28">{screen}</div>
        <div className="w-2 h-6 bg-slate-600 mx-auto" />
        <div className="w-20 h-1.5 bg-slate-700 mx-auto rounded-full" />
      </div>
    )
  }
  if (device === 'tablet') {
    return (
      <div className="w-36 mx-auto bg-slate-800 rounded-xl border-2 border-slate-700 p-2">
        <div className="h-40">{screen}</div>
        <div className="w-2 h-2 rounded-full bg-slate-600 mx-auto mt-1" />
      </div>
    )
  }
  return (
    <div className="w-24 mx-auto bg-slate-800 rounded-2xl border-2 border-slate-700 p-1.5">
      <div className="h-44">{screen}</div>
      <div className="w-6 h-1 rounded-full bg-slate-600 mx-auto mt-1" />
    </div>
  )
}

export default function MicroSimulator() {
  const [device, setDevice] = useState('laptop')
  const [activity, setActivity] = useState('typing')
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const containerRef = useRef(null)
  const handleFullscreen = () => containerRef.current?.requestFullscreen?.()

  return (
    <div ref={containerRef} className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Choose a device</h3>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {devices.map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`py-2 rounded-lg text-xs capitalize transition-colors ${
                  device === d ? 'bg-lab-cyan/20 text-lab-cyan' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
                aria-pressed={device === d}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="bg-black/20 rounded-xl p-6 min-h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={device + activity}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <DeviceFrame device={device} content={activities[activity]} active={isPlaying} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {Object.keys(activities).map((a) => (
              <button
                key={a}
                onClick={() => setActivity(a)}
                className={`px-3 py-1.5 rounded-full text-xs capitalize transition-colors ${
                  activity === a ? 'bg-lab-cyan text-lab-dark font-semibold' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
                aria-pressed={activity === a}
              >
                {a}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            One person, one screen, one CPU handling everything — that's the defining trait of a
            microcomputer, no matter which shape it takes.
          </p>
        </div>

        <ControlPanel
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((p) => !p)}
          onReset={() => {
            setDevice('laptop')
            setActivity('typing')
          }}
          speed={speed}
          onSpeedChange={setSpeed}
          onFullscreen={handleFullscreen}
        />
      </div>

      <InfoPanel data={computerTypes.micro} />
    </div>
  )
}
