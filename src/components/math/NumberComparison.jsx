import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MathCard from './MathCard'

export default function NumberComparison() {
  const [numbers, setNumbers] = useState([])
  const [largestSelected, setLargestSelected] = useState(null)
  const [smallestSelected, setSmallestSelected] = useState(null)
  const [status, setStatus] = useState('idle') // idle, correct, error, showing_solution
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)

  const generateQuestion = () => {
    const count = Math.random() > 0.5 ? 4 : 3 // 3 or 4 numbers
    const newNums = []
    while (newNums.length < count) {
      const num = Math.floor(Math.random() * 9000) + 10 // random 2 to 4 digit number
      if (!newNums.includes(num)) {
        newNums.push(num)
      }
    }
    setNumbers(newNums)
    setLargestSelected(null)
    setSmallestSelected(null)
    setStatus('idle')
  }

  useEffect(() => {
    generateQuestion()
  }, [])

  const actualLargest = Math.max(...numbers)
  const actualSmallest = Math.min(...numbers)

  const handleNumberClick = (num) => {
    if (status === 'correct' || status === 'showing_solution') return

    // Logic: First click selects largest (circle), second selects smallest (cross)
    // If clicking already selected, toggle it off
    if (largestSelected === num) {
      setLargestSelected(null)
    } else if (smallestSelected === num) {
      setSmallestSelected(null)
    } else if (!largestSelected) {
      setLargestSelected(num)
    } else if (!smallestSelected) {
      setSmallestSelected(num)
    } else {
      // If both are selected, replace the one that isn't num
      // For simplicity, just replace largest if they click a new one
      setLargestSelected(num)
    }
    setStatus('idle')
  }

  const checkAnswer = () => {
    if (!largestSelected || !smallestSelected) {
      setStatus('error')
      return
    }

    if (largestSelected === actualLargest && smallestSelected === actualSmallest) {
      setStatus('correct')
      setScore((s) => s + 1)
    } else {
      setStatus('error')
    }
    setTotal((t) => t + 1)
  }

  const showSolution = () => {
    setLargestSelected(actualLargest)
    setSmallestSelected(actualSmallest)
    setStatus('showing_solution')
  }

  const reset = () => {
    setLargestSelected(null)
    setSmallestSelected(null)
    setStatus('idle')
  }

  return (
    <MathCard
      title="Number Comparison"
      instructions="Click the largest number to CIRCLE it, then click the smallest number to CROSS it."
      onGenerate={generateQuestion}
      onCheck={checkAnswer}
      onShowSolution={showSolution}
      onReset={reset}
      onNext={generateQuestion}
      score={score}
      total={total}
      isCorrect={status === 'correct'}
      feedbackMessage={
        status === 'correct'
          ? 'Great Job!'
          : status === 'error'
          ? 'Try Again! Did you circle the largest and cross the smallest?'
          : null
      }
    >
      <div className="flex flex-wrap justify-center items-center gap-8 w-full py-12">
        {numbers.map((num) => {
          const isLargest = largestSelected === num
          const isSmallest = smallestSelected === num
          
          let borderColor = 'border-gray-200'
          if (status === 'correct' || status === 'showing_solution') {
            if (num === actualLargest || num === actualSmallest) {
              borderColor = 'border-green-500'
            }
          } else if (status === 'error') {
             if ((isLargest && num !== actualLargest) || (isSmallest && num !== actualSmallest)) {
               borderColor = 'border-red-500'
             }
          }

          return (
            <motion.button
              key={num}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumberClick(num)}
              className={`relative w-32 h-32 flex justify-center items-center bg-[var(--theme-bg-card)] rounded-2xl shadow-xl border-4 text-3xl font-extrabold text-[var(--theme-text-main)] transition-colors ${borderColor}`}
            >
              {num}
              
              {/* Circle Animation for Largest */}
              <AnimatePresence>
                {isLargest && (
                  <motion.svg
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full pointer-events-none stroke-blue-500"
                    viewBox="0 0 100 100"
                    fill="none"
                    strokeWidth="4"
                  >
                    <motion.ellipse cx="50" cy="50" rx="45" ry="30" />
                  </motion.svg>
                )}
              </AnimatePresence>

              {/* Cross Animation for Smallest */}
              <AnimatePresence>
                {isSmallest && (
                  <motion.svg
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full pointer-events-none stroke-red-500"
                    viewBox="0 0 100 100"
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                  >
                    <motion.path d="M 20 20 L 80 80" />
                    <motion.path d="M 80 20 L 20 80" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
    </MathCard>
  )
}
