import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const colorMap = {
  cyan: 'shadow-glow hover:shadow-glow border-lab-cyan/30',
  blue: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.35)] border-lab-blue/30',
  purple: 'hover:shadow-glow-purple border-lab-purple/30',
}

export default function SimulationCard({ id, name, tagline, color = 'cyan' }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        to={`/simulations/${id}`}
        className={`block glass rounded-2xl p-6 border transition-shadow ${colorMap[color]}`}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold">{name}</h3>
          <ArrowUpRight size={20} className="text-gray-400" aria-hidden="true" />
        </div>
        <p className="text-sm text-gray-400 mb-4">{tagline}</p>
        <span className="text-sm font-medium text-lab-cyan">Start exploring →</span>
      </Link>
    </motion.div>
  )
}
