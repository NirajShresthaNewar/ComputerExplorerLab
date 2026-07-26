import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { CloudRain, Waves, Dna, Rocket } from 'lucide-react'
import ControlPanel from '../components/ControlPanel'
import InfoPanel from '../components/InfoPanel'
import SuperVisualizer from '../components/SuperVisualizer'
import { computerTypes } from '../data/computerData'

const simulations = [
  { id: 'weather', label: 'Weather Forecast', icon: CloudRain },
  { id: 'earthquake', label: 'Earthquake Simulation', icon: Waves },
  { id: 'dna', label: 'DNA Analysis', icon: Dna },
  { id: 'rocket', label: 'Rocket Launch', icon: Rocket },
]

const GRID_SIZE = 36

export default function SuperSimulator() {
  const [simulation, setSimulation] = useState('weather')
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [progress, setProgress] = useState(0)
  const [activeNodes, setActiveNodes] = useState([])
  const containerRef = useRef(null)

  // Simulate thousands of processors "working" via a rapidly flickering grid
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      const count = Math.floor(GRID_SIZE * 0.4)
      const nodes = Array.from({ length: count }, () => Math.floor(Math.random() * GRID_SIZE))
      setActiveNodes(nodes)
      setProgress((p) => (p >= 100 ? 0 : p + 2 * speed))
    }, 200 / speed)
    return () => clearInterval(interval)
  }, [isPlaying, speed])

  const ActiveIcon = simulations.find((s) => s.id === simulation).icon
  const handleFullscreen = () => containerRef.current?.requestFullscreen?.()

  return (
    <div ref={containerRef} className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Choose a scientific simulation</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {simulations.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSimulation(s.id)
                  setProgress(0)
                }}
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  simulation === s.id ? 'bg-lab-cyan/20 text-lab-cyan' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
                aria-pressed={simulation === s.id}
              >
                <s.icon size={18} aria-hidden="true" />
                <span className="text-xs">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Parallel processor grid */}
          <div className="bg-black/30 rounded-xl p-4 mb-4">
            <p className="text-[10px] text-gray-500 mb-2 font-mono">
              CLUSTER STATUS — 65,536 CORES ACROSS 512 NODES
            </p>
            <SuperVisualizer simulation={simulation} isPlaying={isPlaying} speed={speed} />
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
              <ActiveIcon size={18} className="text-lab-cyan" aria-hidden="true" />
              Running: {simulations.find((s) => s.id === simulation).label}
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-lab-cyan"
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</p>
          </div>
        </div>

        <ControlPanel
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((p) => !p)}
          onReset={() => {
            setProgress(0)
            setActiveNodes([])
          }}
          speed={speed}
          onSpeedChange={setSpeed}
          onFullscreen={handleFullscreen}
        />
      </div>

      <InfoPanel data={computerTypes.super} />
    </div>
  )
}
