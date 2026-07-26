import { useState, useRef, useEffect } from 'react'
import ControlPanel from '../components/ControlPanel'
import InfoPanel from '../components/InfoPanel'
import GaugeDial from '../components/GaugeDial'
import VerticalThermometer from '../components/VerticalThermometer'
import { computerTypes } from '../data/computerData'

const DEVICES = [
  { id: 'thermometer', label: 'Thermometer', min: -10, max: 50, unit: '°C', majorStep: 10, redlineFrom: 40 },
  { id: 'speedometer', label: 'Car Speedometer', min: 0, max: 220, unit: 'km/h', majorStep: 20, redlineFrom: 180 },
]

export default function AnalogSimulator() {
  const [deviceId, setDeviceId] = useState('thermometer')
  const [value, setValue] = useState(20)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const containerRef = useRef(null)

  const device = DEVICES.find((d) => d.id === deviceId)

  // Reset to a sensible default whenever the device changes
  useEffect(() => {
    setValue(deviceId === 'thermometer' ? 20 : 60)
  }, [deviceId])

  // Physically-inspired drift: real thermometers change slowly (small deltas),
  // real speedometers respond faster to "acceleration" input
  useEffect(() => {
    if (!isPlaying) return
    const step = deviceId === 'thermometer' ? 0.6 : 8
    const interval = setInterval(() => {
      setValue((v) => {
        const delta = (Math.random() - 0.5) * step * speed
        return Math.min(device.max, Math.max(device.min, v + delta))
      })
    }, 350)
    return () => clearInterval(interval)
  }, [isPlaying, speed, deviceId, device])

  const handleFullscreen = () => containerRef.current?.requestFullscreen?.()

  return (
    <div ref={containerRef} className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex gap-2 mb-6">
            {DEVICES.map((d) => (
              <button
                key={d.id}
                onClick={() => setDeviceId(d.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  deviceId === d.id ? 'bg-lab-cyan text-lab-dark' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
                aria-pressed={deviceId === d.id}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Realistic instrument panel housing */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-inner">
            {deviceId === 'thermometer' ? (
              <VerticalThermometer
                value={value}
                min={device.min}
                max={device.max}
                unit={device.unit}
              />
            ) : (
              <GaugeDial
                value={value}
                min={device.min}
                max={device.max}
                unit={device.unit}
                label={device.label}
                majorStep={device.majorStep}
                redlineFrom={device.redlineFrom}
              />
            )}
          </div>

          <label htmlFor="analog-slider" className="text-sm text-gray-400 mt-4 mb-2 block">
            {deviceId === 'thermometer' ? 'Adjust ambient temperature' : 'Press the accelerator'}
          </label>
          <input
            id="analog-slider"
            type="range"
            min={device.min}
            max={device.max}
            step="0.5"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full accent-lab-cyan"
          />
          <p className="text-xs text-gray-500 mt-2">
            Notice the needle moves smoothly through every value in between — that's what makes
            this data <span className="text-lab-cyan">continuous</span>, unlike a digital display
            that jumps between exact numbers.
          </p>
        </div>

        <ControlPanel
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((p) => !p)}
          onReset={() => {
            setValue(deviceId === 'thermometer' ? 20 : 60)
            setIsPlaying(false)
          }}
          speed={speed}
          onSpeedChange={setSpeed}
          onFullscreen={handleFullscreen}
        />
      </div>

      <InfoPanel data={computerTypes.analog} />
    </div>
  )
}
