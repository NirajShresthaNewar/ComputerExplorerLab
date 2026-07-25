import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-circuit px-6 py-24 text-center">
      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-lab-cyan/60"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4 + (i % 5), repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-lab-cyan mb-6">
          <Sparkles size={14} aria-hidden="true" />
          Learn by exploring, not memorizing
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold glow-text mb-4">
          Computer Explorer Lab
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Learn Computer Types Through Interactive Simulations
        </p>
        <Link
          to="/simulations"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lab-cyan text-lab-dark font-semibold shadow-glow hover:scale-105 transition-transform"
        >
          Start Learning <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </motion.div>
    </section>
  )
}
