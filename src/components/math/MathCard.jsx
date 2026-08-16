import { motion } from 'framer-motion'
import { RefreshCw, CheckCircle, HelpCircle, Eye, ChevronRight } from 'lucide-react'

export default function MathCard({
  title,
  instructions,
  children,
  onGenerate,
  onCheck,
  onHint,
  onShowSolution,
  onReset,
  onNext,
  score,
  total,
  isCorrect,
  feedbackMessage,
}) {
  return (
    <div className="glass rounded-3xl p-6 md:p-8 shadow-2xl max-w-4xl mx-auto transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 drop-shadow-sm opacity-95">
            {title}
          </h2>
          <p className="opacity-70 text-sm mt-1">{instructions}</p>
        </div>
        {(score !== undefined && total !== undefined) && (
          <div className="bg-lab-cyan/20 border border-lab-cyan/30 text-lab-cyan px-4 py-2 rounded-full font-bold flex items-center gap-2">
            <span>Score:</span>
            <span>{score} / {total}</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="bg-[var(--theme-bg-panel)] border border-[var(--theme-border)] rounded-2xl p-6 md:p-10 mb-6 shadow-inner min-h-[250px] flex items-center justify-center relative overflow-hidden transition-all duration-300">
        {children}
        
        {/* Feedback Overlay */}
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold text-white shadow-lg ${
              isCorrect ? 'bg-emerald-600' : 'bg-red-600'
            }`}
          >
            {feedbackMessage}
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onGenerate && (
          <button
            onClick={onGenerate}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-md"
          >
            <RefreshCw size={18} />
            Generate
          </button>
        )}
        
        {onCheck && (
          <button
            onClick={onCheck}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
          >
            <CheckCircle size={20} />
            Check Answer
          </button>
        )}

        {onHint && (
          <button
            onClick={onHint}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold transition-all shadow-md"
          >
            <HelpCircle size={18} />
            Hint
          </button>
        )}

        {onShowSolution && (
          <button
            onClick={onShowSolution}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-all shadow-md"
          >
            <Eye size={18} />
            Solution
          </button>
        )}

        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-gray-200 rounded-xl font-semibold border border-white/10 transition-all"
          >
            Reset
          </button>
        )}

        {onNext && (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-lab-cyan/20 hover:bg-lab-cyan/30 text-lab-cyan border border-lab-cyan/40 rounded-xl font-bold transition-all ml-auto"
          >
            Next
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
