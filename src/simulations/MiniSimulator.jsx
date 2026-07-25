import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Server } from 'lucide-react'
import ControlPanel from '../components/ControlPanel'
import InfoPanel from '../components/InfoPanel'
import { computerTypes } from '../data/computerData'

const environments = ['School', 'Office', 'Hospital']
const userSteps = [1, 5, 10, 20]

// Places terminal nodes evenly around the central server, like a real
// star-topology network diagram rather than a loose cluster of icons.
function terminalPosition(index, total, radius, cx, cy) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }
}

export default function MiniSimulator() {
  const [environment, setEnvironment] = useState('School')
  const [userCount, setUserCount] = useState(5)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const containerRef = useRef(null)
  const handleFullscreen = () => containerRef.current?.requestFullscreen?.()

  const cx = 150
  const cy = 130
  const radius = 100
  const load = Math.min(100, Math.round((userCount / 20) * 100))

  return (
    <div ref={containerRef} className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Choose an environment</h3>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {environments.map((e) => (
              <button
                key={e}
                onClick={() => setEnvironment(e)}
                className={`py-2 rounded-lg text-xs transition-colors ${
                  environment === e ? 'bg-lab-blue/20 text-lab-blue' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
                aria-pressed={environment === e}
              >
                {e}
              </button>
            ))}
          </div>

          {/* Star-topology network diagram */}
          <svg viewBox="0 0 300 260" className="w-full max-w-xs mx-auto bg-black/20 rounded-xl">
            {Array.from({ length: userCount }).map((_, i) => {
              const pos = terminalPosition(i, userCount, radius, cx, cy)
              return (
                <line
                  key={`line-${i}`}
                  x1={cx}
                  y1={cy}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="#3b82f6"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                />
              )
            })}
            {Array.from({ length: userCount }).map((_, i) => {
              const pos = terminalPosition(i, userCount, radius, cx, cy)
              return (
                <motion.circle
                  key={`node-${i}`}
                  cx={pos.x}
                  cy={pos.y}
                  r="5"
                  fill="#60a5fa"
                  animate={{ opacity: isPlaying ? [0.5, 1, 0.5] : 1 }}
                  transition={{ duration: 1.5 / speed, repeat: Infinity, delay: i * 0.08 }}
                />
              )
            })}
            {/* Central server */}
            <rect x={cx - 16} y={cy - 16} width="32" height="32" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
            <foreignObject x={cx - 10} y={cy - 10} width="20" height="20">
              <Server size={20} color="#60a5fa" />
            </foreignObject>
          </svg>

          <p className="text-sm text-gray-400 mt-3 mb-1 text-center">
            {userCount} terminals connected to the {environment} server
          </p>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
            <motion.div className="h-full bg-lab-blue" animate={{ width: `${load}%` }} />
          </div>

          <div className="flex gap-2">
            {userSteps.map((n) => (
              <button
                key={n}
                onClick={() => setUserCount(n)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userCount === n ? 'bg-lab-blue text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
                aria-pressed={userCount === n}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <ControlPanel
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((p) => !p)}
          onReset={() => setUserCount(5)}
          speed={speed}
          onSpeedChange={setSpeed}
          onFullscreen={handleFullscreen}
        />
      </div>

      <InfoPanel data={computerTypes.mini} />
    </div>
  )
}
