import { useState, useRef } from 'react'
import ControlPanel from '../components/ControlPanel'
import InfoPanel from '../components/InfoPanel'
import { computerTypes } from '../data/computerData'

const KEY_ROWS = [
  'QWERTYUIOP'.split(''),
  'ASDFGHJKL'.split(''),
  'ZXCVBNM'.split(''),
]

export default function DigitalSimulator() {
  const [text, setText] = useState('HELLO')
  const [speed, setSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(true)
  const [activeKey, setActiveKey] = useState(null)
  const containerRef = useRef(null)

  const pressKey = (char) => {
    setActiveKey(char)
    setTimeout(() => setActiveKey(null), 150)
    setText((t) => (t.length < 10 ? t + char : t))
  }

  const backspace = () => setText((t) => t.slice(0, -1))

  const chars = text.split('')
  const handleFullscreen = () => containerRef.current?.requestFullscreen?.()

  return (
    <div ref={containerRef} className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        {/* Laptop chassis */}
        <div className="glass rounded-2xl p-6">
          <div className="mx-auto max-w-md">
            {/* Screen bezel */}
            <div className="bg-slate-900 rounded-t-xl border-4 border-slate-800 p-3 relative">
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-600" />
              <div className="bg-black rounded-lg p-4 font-mono text-xs min-h-[140px]">
                <p className="text-gray-500 mb-2">// keyboard input becomes an exact ASCII/binary code</p>
                <div className="flex flex-wrap gap-x-1 gap-y-2 mb-3">
                  {chars.length === 0 && <span className="text-gray-600">|</span>}
                  {chars.map((ch, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className="text-lab-cyan text-base leading-none">{ch}</span>
                      <span className="text-gray-500 text-[9px]">{ch.charCodeAt(0)}</span>
                      <span className="text-purple-400 text-[9px]">
                        {ch.charCodeAt(0).toString(2).padStart(8, '0')}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className={`w-2 h-4 bg-lab-cyan inline-block ${isPlaying ? 'animate-pulse' : ''}`}
                  aria-hidden="true"
                />
              </div>
            </div>
            {/* Hinge */}
            <div className="h-2 bg-slate-700" />
            {/* Keyboard deck */}
            <div className="bg-slate-800 rounded-b-xl border-4 border-t-0 border-slate-800 p-4">
              <div className="space-y-1.5 mb-2">
                {KEY_ROWS.map((row, ri) => (
                  <div key={ri} className="flex justify-center gap-1">
                    {row.map((k) => (
                      <button
                        key={k}
                        onClick={() => pressKey(k)}
                        className={`w-7 h-7 rounded text-[10px] font-semibold transition-all ${
                          activeKey === k
                            ? 'bg-lab-cyan text-lab-dark scale-95'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                        aria-label={`Key ${k}`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-1">
                <button
                  onClick={() => pressKey(' ')}
                  className="w-32 h-6 rounded bg-slate-700 hover:bg-slate-600 text-[9px] text-gray-400"
                >
                  space
                </button>
                <button
                  onClick={backspace}
                  className="w-16 h-6 rounded bg-slate-700 hover:bg-slate-600 text-[9px] text-gray-400"
                >
                  ⌫ back
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Each keypress becomes a real 8-bit binary number (ASCII) — try it, then compare with
            the analog gauge: no in-between values exist here, only exact discrete codes.
          </p>
        </div>

        <ControlPanel
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((p) => !p)}
          onReset={() => setText('HELLO')}
          speed={speed}
          onSpeedChange={setSpeed}
          onFullscreen={handleFullscreen}
        />
      </div>

      <InfoPanel data={computerTypes.digital} />
    </div>
  )
}
