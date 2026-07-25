import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ControlPanel from '../components/ControlPanel'
import InfoPanel from '../components/InfoPanel'
import { computerTypes } from '../data/computerData'

// A single PQRST heartbeat waveform, drawn to approximate a real ECG trace
// (small P wave, sharp QRS spike, rounded T wave) rather than a generic zigzag.
const PQRST = 'M0,50 L15,50 L20,44 L25,50 L38,50 L42,10 L46,85 L50,50 L65,50 L72,40 L82,40 L90,50 L100,50'

export default function HybridSimulator() {
  const [bpm, setBpm] = useState(72)
  const [spo2, setSpo2] = useState(98)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setBpm((b) => Math.min(160, Math.max(45, Math.round(b + (Math.random() - 0.5) * 5))))
      setSpo2((s) => Math.min(100, Math.max(92, Math.round(s + (Math.random() - 0.5) * 1.5))))
    }, 1500 / speed)
    return () => clearInterval(interval)
  }, [isPlaying, speed])

  const status = bpm < 60 ? 'Bradycardia' : bpm > 100 ? 'Tachycardia' : 'Normal Sinus Rhythm'
  const statusColor = status === 'Normal Sinus Rhythm' ? 'text-green-400' : 'text-yellow-400'
  const beatsPerLoop = 4
  const loopDuration = (60 / bpm) * beatsPerLoop

  const handleFullscreen = () => containerRef.current?.requestFullscreen?.()

  return (
    <div ref={containerRef} className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        {/* Hospital monitor housing */}
        <div className="bg-slate-900 rounded-2xl p-4 border-4 border-slate-800 shadow-xl">
          {/* Screen with graph paper grid, like a real bedside monitor */}
          <div
            className="rounded-lg p-3 overflow-hidden relative h-40"
            style={{
              background:
                'linear-gradient(#001a0d,#000c06) , repeating-linear-gradient(0deg, rgba(34,197,94,0.08) 0 1px, transparent 1px 20px), repeating-linear-gradient(90deg, rgba(34,197,94,0.08) 0 1px, transparent 1px 20px)',
            }}
          >
            <motion.svg
              viewBox="0 0 400 100"
              preserveAspectRatio="none"
              className="w-[300%] h-full"
              animate={{ x: isPlaying ? [0, -100] : 0 }}
              transition={{ duration: loopDuration, repeat: Infinity, ease: 'linear' }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <path
                  key={i}
                  d={PQRST}
                  transform={`translate(${i * 100},0)`}
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </motion.svg>
          </div>

          {/* Vital signs readout panel, styled like a real patient monitor */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-black/50 rounded-lg p-3 border-l-4 border-green-500">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Heart Rate</p>
              <p className="text-2xl font-bold text-green-400 font-mono">{bpm}</p>
              <p className="text-[10px] text-gray-500">bpm</p>
            </div>
            <div className="bg-black/50 rounded-lg p-3 border-l-4 border-cyan-500">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">SpO₂</p>
              <p className="text-2xl font-bold text-lab-cyan font-mono">{spo2}</p>
              <p className="text-[10px] text-gray-500">%</p>
            </div>
          </div>

          <p className={`text-xs font-semibold mt-3 ${statusColor}`}>{status}</p>
        </div>

        <label htmlFor="bpm-slider" className="text-sm text-gray-400 block">
          Adjust simulated heart rate
        </label>
        <input
          id="bpm-slider"
          type="range"
          min="45"
          max="160"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-full accent-lab-purple"
        />
        <p className="text-xs text-gray-500">
          The analog electrical signal from your heart is sensed continuously, then a digital
          processor calculates an exact BPM number from it — that combination is what makes an
          ECG machine a <span className="text-lab-purple">hybrid</span> computer.
        </p>

        <ControlPanel
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((p) => !p)}
          onReset={() => {
            setBpm(72)
            setSpo2(98)
            setIsPlaying(true)
          }}
          speed={speed}
          onSpeedChange={setSpeed}
          onFullscreen={handleFullscreen}
        />
      </div>

      <InfoPanel data={computerTypes.hybrid} />
    </div>
  )
}
