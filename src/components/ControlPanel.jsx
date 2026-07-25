import { Play, Pause, RotateCcw, Maximize } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ControlPanel({
  isPlaying,
  onTogglePlay,
  onReset,
  speed,
  onSpeedChange,
  onFullscreen,
}) {
  const { sound } = useApp()

  return (
    <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-4">
      <button
        onClick={() => {
          sound.playClick()
          onTogglePlay()
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-lab-cyan text-lab-dark font-semibold hover:scale-105 transition-transform"
        aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <button
        onClick={() => {
          sound.playClick()
          onReset()
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors"
        aria-label="Reset simulation"
      >
        <RotateCcw size={18} />
        Reset
      </button>

      <div className="flex items-center gap-2 text-sm text-gray-300">
        <label htmlFor="speed-control">Speed</label>
        <input
          id="speed-control"
          type="range"
          min="0.5"
          max="2"
          step="0.5"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="accent-lab-cyan"
        />
        <span>{speed}x</span>
      </div>

      <button
        onClick={onFullscreen}
        className="ml-auto flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-white/10 transition-colors"
        aria-label="Toggle fullscreen"
      >
        <Maximize size={18} />
      </button>
    </div>
  )
}
