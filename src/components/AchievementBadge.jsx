import { motion } from 'framer-motion'
import { Award, Lock } from 'lucide-react'

export default function AchievementBadge({ achievement, unlocked }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass rounded-xl p-4 flex items-center gap-3 ${
        unlocked ? 'border-lab-cyan/40' : 'opacity-50'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          unlocked ? 'bg-lab-cyan/20 text-lab-cyan' : 'bg-white/5 text-gray-500'
        }`}
      >
        {unlocked ? <Award size={20} aria-hidden="true" /> : <Lock size={16} aria-hidden="true" />}
      </div>
      <div>
        <p className="text-sm font-semibold">{achievement.name}</p>
        <p className="text-xs text-gray-400">{achievement.description}</p>
      </div>
    </motion.div>
  )
}
