import { motion } from 'framer-motion'
import { Cpu } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-lab-dark z-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <Cpu className="text-lab-cyan" size={48} />
      </motion.div>
    </div>
  )
}
