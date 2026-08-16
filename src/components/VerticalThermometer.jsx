import React from 'react'

export default function VerticalThermometer({ value, min, max, unit }) {
  // Calculate percentage to fill (0 to 100)
  const clampedValue = Math.max(min, Math.min(max, value))
  const percentage = ((clampedValue - min) / (max - min)) * 100

  // Major ticks
  const ticks = []
  for (let i = max; i >= min; i -= 10) {
    ticks.push(i)
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative flex items-end mb-8">
        {/* Scale labels (Left side) */}
        <div className="flex flex-col justify-between items-end mr-4 h-64 py-2">
          {ticks.map((tick) => (
            <div key={tick} className="flex items-center">
              <span className="text-xs font-mono opacity-80 mr-2">{tick}</span>
              <div className="w-2 h-0.5 bg-[var(--theme-border)]"></div>
            </div>
          ))}
        </div>

        {/* Thermometer Glass Body */}
        <div className="relative w-8 h-64 bg-[var(--theme-bg-panel)] rounded-t-full border-2 border-[var(--theme-border)] shadow-inner z-10 flex flex-col justify-end p-1 pb-0">
          {/* Liquid Column */}
          <div 
            className="w-full bg-[var(--theme-accent)] rounded-t-full transition-all duration-300 ease-linear shadow-lg"
            style={{ height: `${percentage}%` }}
          >
            {/* Glossy reflection effect */}
            <div className="absolute top-0 right-1 w-2 h-full bg-white/20 rounded-t-full"></div>
          </div>
        </div>

        {/* Thermometer Bulb (at the bottom) */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-[var(--theme-bg-panel)] rounded-full border-2 border-[var(--theme-border)] z-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-[var(--theme-accent)] rounded-full shadow-inner relative overflow-hidden">
             {/* Bulb gloss */}
             <div className="absolute top-1 right-2 w-4 h-10 bg-white/30 rounded-full rotate-45"></div>
          </div>
        </div>
        
      </div>
      
      {/* Current Value Display */}
      <div className="mt-8 text-center">
        <div className="text-3xl font-bold tracking-wider">
          {value.toFixed(1)}<span className="text-xl opacity-70 ml-1">{unit}</span>
        </div>
        <div className="text-sm opacity-60 uppercase tracking-widest mt-1">Thermometer</div>
      </div>
    </div>
  )
}
