import { motion } from 'framer-motion'
import { computerOrder } from '../data/computerData'
import { useApp } from '../context/AppContext'

export default function ProgressBar() {
  const { progress } = useApp()
  const pct = Math.round((progress.visited.length / computerOrder.length) * 100)

  return (
    <div className="flex items-center gap-3 text-xs text-gray-400">
      <span className="whitespace-nowrap">
        {progress.visited.length}/{computerOrder.length} explored
      </span>
      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-lab-cyan"
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 80 }}
        />
      </div>
    </div>
  )
}
