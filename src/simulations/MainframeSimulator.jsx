import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Landmark, Train, Plane, Building } from 'lucide-react'
import ControlPanel from '../components/ControlPanel'
import InfoPanel from '../components/InfoPanel'
import { computerTypes } from '../data/computerData'

const environments = [
  { id: 'bank', label: 'Bank', icon: Landmark },
  { id: 'railway', label: 'Railway Reservation', icon: Train },
  { id: 'airline', label: 'Airline Reservation', icon: Plane },
  { id: 'gov', label: 'Government Office', icon: Building },
]

export default function MainframeSimulator() {
  const [environment, setEnvironment] = useState('bank')
  const [queue, setQueue] = useState([])
  const [processed, setProcessed] = useState(0)
  const [cpu, setCpu] = useState(35)
  const [memory, setMemory] = useState(40)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const containerRef = useRef(null)
  const idRef = useRef(0)

  // Continuously generate and process transaction requests
  useEffect(() => {
    if (!isPlaying) return
    const spawnInterval = setInterval(() => {
      idRef.current += 1
      setQueue((q) => [...q.slice(-11), idRef.current])
      setCpu((c) => Math.min(98, c + Math.random() * 15))
      setMemory((m) => Math.min(95, m + Math.random() * 8))
    }, 500 / speed)

    const processInterval = setInterval(() => {
      setQueue((q) => {
        if (q.length === 0) return q
        setProcessed((p) => p + 1)
        return q.slice(1)
      })
      setCpu((c) => Math.max(20, c - Math.random() * 12))
      setMemory((m) => Math.max(25, m - Math.random() * 6))
    }, 700 / speed)

    return () => {
      clearInterval(spawnInterval)
      clearInterval(processInterval)
    }
  }, [isPlaying, speed])

  const handleFullscreen = () => containerRef.current?.requestFullscreen?.()

  return (
    <div ref={containerRef} className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Choose an environment</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {environments.map((e) => (
              <button
                key={e.id}
                onClick={() => setEnvironment(e.id)}
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  environment === e.id ? 'bg-lab-purple/20 text-lab-purple' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
                aria-pressed={environment === e.id}
              >
                <e.icon size={18} aria-hidden="true" />
                <span className="text-xs">{e.label}</span>
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-400 mb-2">Server rack (each unit lights up while processing)</p>
          <div className="bg-slate-900 rounded-lg p-2 mb-4 border border-slate-700 space-y-1">
            {Array.from({ length: 6 }).map((_, row) => (
              <div key={row} className="flex gap-1">
                {Array.from({ length: 10 }).map((_, col) => {
                  const litProbability = cpu / 100
                  const lit = Math.random() < litProbability * 0.5
                  return (
                    <div
                      key={col}
                      className={`h-2 flex-1 rounded-sm transition-colors duration-300 ${
                        lit ? 'bg-lab-cyan' : 'bg-slate-700'
                      }`}
                    />
                  )
                })}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mb-2">Incoming transaction queue</p>
          <div className="bg-black/30 rounded-lg p-3 min-h-[56px] flex items-center gap-2 flex-wrap mb-4">
            <AnimatePresence>
              {queue.map((reqId) => (
                <motion.span
                  key={reqId}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="w-2.5 h-2.5 rounded-full bg-lab-purple"
                  aria-hidden="true"
                />
              ))}
              {queue.length === 0 && <span className="text-xs text-gray-500">Queue empty</span>}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">CPU Usage</p>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full bg-lab-cyan" animate={{ width: `${cpu}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{Math.round(cpu)}%</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Memory Usage</p>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full bg-lab-purple" animate={{ width: `${memory}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{Math.round(memory)}%</p>
            </div>
          </div>

          <p className="text-sm text-gray-300">
            <span className="font-bold text-lab-cyan">{processed}</span> transactions processed
          </p>
        </div>

        <ControlPanel
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((p) => !p)}
          onReset={() => {
            setQueue([])
            setProcessed(0)
            setCpu(35)
            setMemory(40)
          }}
          speed={speed}
          onSpeedChange={setSpeed}
          onFullscreen={handleFullscreen}
        />
      </div>

      <InfoPanel data={computerTypes.mainframe} />
    </div>
  )
}
