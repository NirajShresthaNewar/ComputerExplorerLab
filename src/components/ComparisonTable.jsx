import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { computerTypes, computerOrder } from '../data/computerData'

const rows = [
  { key: 'workingPrinciple', label: 'Working Principle' },
  { key: 'tagline', label: 'Data Type' },
  { key: 'examples', label: 'Examples' },
]

export default function ComparisonTable() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="glass rounded-2xl p-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left p-3 text-gray-400 font-medium">Attribute</th>
            {computerOrder.map((id) => (
              <th key={id} className="text-left p-3 text-lab-cyan font-semibold">
                {computerTypes[id].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-t border-white/10">
              <td className="p-3 text-gray-400">{row.label}</td>
              {computerOrder.map((id) => {
                const value = computerTypes[id][row.key]
                const display = Array.isArray(value) ? value.join(', ') : value
                const cellId = `${row.key}-${id}`
                return (
                  <td
                    key={cellId}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${row.label} of ${computerTypes[id].name}`}
                    onClick={() => setSelected(cellId === selected ? null : cellId)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelected(cellId === selected ? null : cellId)
                      }
                    }}
                    className="p-3 cursor-pointer hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {display}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 rounded-lg bg-white/5 text-sm text-gray-300"
          >
            Click any cell again to collapse. Full explanations live in each simulator's Info
            Panel — visit a simulation to dive deeper into this concept.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
