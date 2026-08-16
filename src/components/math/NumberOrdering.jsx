import { useState, useEffect } from 'react'
import { Reorder, motion } from 'framer-motion'
import MathCard from './MathCard'

export default function NumberOrdering() {
  const [numbers, setNumbers] = useState([])
  const [orderType, setOrderType] = useState('ascending') // ascending, descending
  const [status, setStatus] = useState('idle') // idle, correct, error, showing_solution
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)

  const generateQuestion = () => {
    const count = Math.floor(Math.random() * 3) + 4 // 4 to 6 numbers
    const newNums = []
    while (newNums.length < count) {
      const num = Math.floor(Math.random() * 9000) + 100 // 3 to 4 digits
      if (!newNums.includes(num)) {
        newNums.push(num)
      }
    }
    setNumbers(newNums)
    setStatus('idle')
  }

  useEffect(() => {
    generateQuestion()
  }, [])

  // Create sorted array for checking
  const correctOrder = [...numbers].sort((a, b) => 
    orderType === 'ascending' ? a - b : b - a
  )

  const checkAnswer = () => {
    let isCorrect = true
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] !== correctOrder[i]) {
        isCorrect = false
        break
      }
    }

    if (isCorrect) {
      setStatus('correct')
      setScore(s => s + 1)
    } else {
      setStatus('error')
    }
    setTotal(t => t + 1)
  }

  const showSolution = () => {
    setNumbers(correctOrder)
    setStatus('showing_solution')
  }

  const reset = () => {
    // Just shuffle them back or reset status
    setStatus('idle')
  }

  return (
    <MathCard
      title="Number Ordering"
      instructions={`Arrange the numbers in ${orderType.toUpperCase()} order by dragging them.`}
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
          ? 'Excellent!'
          : status === 'error'
          ? 'Not quite right. Check the order again!'
          : null
      }
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
        
        {/* Settings Panel */}
        <div className="bg-[var(--theme-bg-card)] p-4 rounded-xl border border-[var(--theme-border)] flex flex-wrap justify-center gap-6 text-[var(--theme-text-main)] shadow-md transition-all">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-sm opacity-90">
            <input 
              type="radio" 
              name="orderType" 
              value="ascending" 
              checked={orderType === 'ascending'} 
              onChange={() => {
                setOrderType('ascending')
                setStatus('idle')
              }} 
              className="w-4 h-4 text-[var(--theme-accent)] accent-[var(--theme-accent)]"
            />
            Ascending (Smallest to Largest)
          </label>
          <label className="flex items-center gap-2 cursor-pointer font-medium text-sm opacity-90">
            <input 
              type="radio" 
              name="orderType" 
              value="descending" 
              checked={orderType === 'descending'} 
              onChange={() => {
                setOrderType('descending')
                setStatus('idle')
              }} 
              className="w-4 h-4 text-[var(--theme-accent)] accent-[var(--theme-accent)]"
            />
            Descending (Largest to Smallest)
          </label>
        </div>

        {/* Drag and Drop Area */}
        <Reorder.Group 
          axis="y" 
          values={numbers} 
          onReorder={(newOrder) => {
            if (status !== 'correct' && status !== 'showing_solution') {
              setNumbers(newOrder)
              setStatus('idle')
            }
          }}
          className="flex flex-col gap-3"
        >
          {numbers.map((num, index) => {
            let bgColor = 'bg-[var(--theme-bg-card)]'
            let borderColor = 'border-[var(--theme-border)]'
            let textColor = 'text-[var(--theme-text-main)]'
            
            if (status === 'correct' || status === 'showing_solution') {
              bgColor = 'bg-emerald-500/20'
              borderColor = 'border-emerald-500'
              textColor = 'text-emerald-400'
            } else if (status === 'error') {
              if (num === correctOrder[index]) {
                bgColor = 'bg-emerald-500/20'
                borderColor = 'border-emerald-500'
                textColor = 'text-emerald-400'
              } else {
                bgColor = 'bg-red-500/20'
                borderColor = 'border-red-500'
                textColor = 'text-red-400'
              }
            }

            return (
              <Reorder.Item 
                key={num} 
                value={num}
                className={`flex items-center justify-between p-4 rounded-xl border-2 shadow-md cursor-grab active:cursor-grabbing transition-colors ${bgColor} ${borderColor}`}
                whileDrag={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(0,0,0,0.3)", zIndex: 10 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--theme-accent)]/20 text-[var(--theme-accent)] border border-[var(--theme-accent)]/30 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className={`text-2xl font-bold ${textColor}`}>{num}</span>
                </div>
                
                {/* Drag handle icon */}
                <div className="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </div>
              </Reorder.Item>
            )
          })}
        </Reorder.Group>

      </div>
    </MathCard>
  )
}
