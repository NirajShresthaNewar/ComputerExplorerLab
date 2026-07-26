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
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.25)] max-w-4xl mx-auto border border-gray-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {title}
          </h2>
          <p className="text-gray-600 text-sm mt-1">{instructions}</p>
        </div>
        {(score !== undefined && total !== undefined) && (
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
            <span>Score:</span>
            <span>{score} / {total}</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 md:p-10 mb-6 shadow-inner min-h-[250px] flex items-center justify-center relative overflow-hidden">
        {children}
        
        {/* Feedback Overlay */}
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold text-white shadow-lg ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
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
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            <RefreshCw size={18} />
            Generate
          </button>
        )}
        
        {onCheck && (
          <button
            onClick={onCheck}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <CheckCircle size={20} />
            Check Answer
          </button>
        )}

        {onHint && (
          <button
            onClick={onHint}
            className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-xl font-medium transition-colors"
          >
            <HelpCircle size={18} />
            Hint
          </button>
        )}

        {onShowSolution && (
          <button
            onClick={onShowSolution}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors"
          >
            <Eye size={18} />
            Solution
          </button>
        )}

        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Reset
          </button>
        )}

        {onNext && (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl font-bold transition-colors ml-auto"
          >
            Next
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
