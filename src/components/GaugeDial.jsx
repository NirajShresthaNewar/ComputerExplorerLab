// Realistic analog gauge: tick marks, numbered scale, colored danger zone,
// glass bezel reflection, and a needle driven by real angle math (not a toy sweep).
// startAngle/endAngle are in degrees, measured clockwise from the 12 o'clock (top) position,
// mirroring how real speedometers and thermometers are laid out.
export default function GaugeDial({
  value,
  min,
  max,
  unit,
  label,
  majorStep,
  redlineFrom,
  startAngle = -120,
  endAngle = 120,
  size = 220,
}) {
  const clamped = Math.min(max, Math.max(min, value))
  const pct = (clamped - min) / (max - min)
  const angle = startAngle + pct * (endAngle - startAngle)

  const center = size / 2
  const radius = size * 0.38
  const rad = (deg) => (deg - 90) * (Math.PI / 180)

  const toXY = (deg, r) => ({
    x: center + r * Math.cos(rad(deg)),
    y: center + r * Math.sin(rad(deg)),
  })

  const ticks = []
  for (let v = min; v <= max; v += majorStep) {
    const tAngle = startAngle + ((v - min) / (max - min)) * (endAngle - startAngle)
    const outer = toXY(tAngle, radius)
    const inner = toXY(tAngle, radius * 0.85)
    const textPos = toXY(tAngle, radius * 0.68)
    ticks.push(
      <g key={v}>
        <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#cbd5e1" strokeWidth="2" />
        <text x={textPos.x} y={textPos.y} fontSize="10" fill="#94a3b8" textAnchor="middle" dominantBaseline="middle">
          {v}
        </text>
      </g>,
    )
  }

  // Minor ticks between major ones for a denser, more realistic look
  const minorTicks = []
  const minorStep = majorStep / 5
  for (let v = min; v <= max; v += minorStep) {
    if (v % majorStep === 0) continue
    const tAngle = startAngle + ((v - min) / (max - min)) * (endAngle - startAngle)
    const outer = toXY(tAngle, radius)
    const inner = toXY(tAngle, radius * 0.92)
    minorTicks.push(
      <line key={v} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#475569" strokeWidth="1" />,
    )
  }

  const needleTip = toXY(angle, radius * 0.78)
  const needleTailL = toXY(angle + 150, radius * 0.12)
  const needleTailR = toXY(angle - 150, radius * 0.12)

  // Redline arc path
  const arcPath = (fromV, toV, r) => {
    const a1 = startAngle + ((fromV - min) / (max - min)) * (endAngle - startAngle)
    const a2 = startAngle + ((toV - min) / (max - min)) * (endAngle - startAngle)
    const p1 = toXY(a1, r)
    const p2 = toXY(a2, r)
    const largeArc = a2 - a1 > 180 ? 1 : 0
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y}`
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px] mx-auto">
      <defs>
        <radialGradient id="bezel" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
        <linearGradient id="glassShine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* Outer bezel */}
      <circle cx={center} cy={center} r={radius * 1.18} fill="url(#bezel)" stroke="#1e293b" strokeWidth="3" />
      <circle cx={center} cy={center} r={radius * 1.05} fill="#0b1120" />

      {/* Redline danger zone */}
      {redlineFrom !== undefined && (
        <path
          d={arcPath(redlineFrom, max, radius)}
          fill="none"
          stroke="#ef4444"
          strokeWidth="4"
          strokeLinecap="round"
        />
      )}

      {minorTicks}
      {ticks}

      {/* Needle */}
      <polygon
        points={`${needleTip.x},${needleTip.y} ${needleTailL.x},${needleTailL.y} ${needleTailR.x},${needleTailR.y}`}
        fill="#22d3ee"
        style={{ transition: 'all 0.3s ease-out' }}
      />
      <circle cx={center} cy={center} r={radius * 0.1} fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />

      {/* Glass reflection overlay */}
      <circle cx={center} cy={center} r={radius * 1.05} fill="url(#glassShine)" />

      {/* Digital readout under needle hub */}
      <text x={center} y={center + radius * 0.42} fontSize="16" fontWeight="bold" fill="#e2e8f0" textAnchor="middle">
        {value.toFixed(1)}{unit}
      </text>
      <text x={center} y={center + radius * 0.6} fontSize="9" fill="#64748b" textAnchor="middle">
        {label}
      </text>
    </svg>
  )
}
