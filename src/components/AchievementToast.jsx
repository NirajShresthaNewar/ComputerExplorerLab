import { AnimatePresence, motion } from 'framer-motion'
import { Award } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useEffect } from 'react'

export default function AchievementToast() {
  const { newlyUnlocked, dismissUnlocked } = useApp()

  useEffect(() => {
    if (!newlyUnlocked) return
    const timer = setTimeout(dismissUnlocked, 4000)
    return () => clearTimeout(timer)
  }, [newlyUnlocked, dismissUnlocked])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {newlyUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass rounded-xl p-4 flex items-center gap-3 shadow-glow border-lab-cyan/40"
            role="status"
          >
            <Award className="text-lab-cyan" size={24} aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">Achievement unlocked!</p>
              <p className="text-xs text-gray-300">{newlyUnlocked.name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
