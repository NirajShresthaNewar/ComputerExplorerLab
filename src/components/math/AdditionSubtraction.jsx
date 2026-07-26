import { useState, useEffect } from 'react'
import MathCard from './MathCard'
import DigitInput from './DigitInput'
import { useMathContext } from '../../context/MathContext'

export default function AdditionSubtraction() {
  const { settings } = useMathContext()
  const [mode, setMode] = useState('addition') // addition, subtraction
  const [maxDigits, setMaxDigits] = useState(3)
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [userInputs, setUserInputs] = useState([])
  const [status, setStatus] = useState('idle') // idle, correct, error, showing_solution
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)

  // Calculate correct answer
  const correctAnswer = mode === 'addition' ? num1 + num2 : num1 - num2
  const answerStr = correctAnswer.toString()
  const maxLength = Math.max(num1.toString().length, num2.toString().length, answerStr.length)

  const generateQuestion = () => {
    const max = Math.pow(10, maxDigits) - 1
    const min = Math.pow(10, maxDigits - 1)
    
    let n1 = Math.floor(Math.random() * (max - min + 1)) + min
    let n2 = Math.floor(Math.random() * (max - min + 1)) + min

    if (mode === 'subtraction') {
      // Ensure no negative answers, but keep them same digit length
      if (n1 < n2) {
        const temp = n1;
        n1 = n2;
        n2 = temp;
      }
    }

    setNum1(n1)
    setNum2(n2)
    setUserInputs(Array(Math.max(n1.toString().length, n2.toString().length, (n1 + (mode === 'addition' ? n2 : -n2)).toString().length)).fill(''))
    setStatus('idle')
    setFocusedIndex(0)
  }

  useEffect(() => {
    generateQuestion()
  }, [mode, maxDigits])

  const handleInputChange = (index, value) => {
    const newInputs = [...userInputs]
    newInputs[index] = value
    setUserInputs(newInputs)
    
    // Auto-advance (move to the next significant digit, i.e., index + 1)
    if (value && index < userInputs.length - 1) {
      setFocusedIndex(index + 1)
    }
    setStatus('idle')
  }

  const handleBackspace = (index) => {
    if (index > 0) {
      setFocusedIndex(index - 1)
    }
  }

  const checkAnswer = () => {
    const userAnswerStr = [...userInputs].reverse().join('')
    if (userAnswerStr === answerStr) {
      setStatus('correct')
      setScore(s => s + 1)
    } else {
      setStatus('error')
    }
    setTotal(t => t + 1)
  }

  const showSolution = () => {
    setStatus('showing_solution')
    setUserInputs(answerStr.split('').reverse())
  }

  const reset = () => {
    setUserInputs(Array(answerStr.length).fill(''))
    setStatus('idle')
    setFocusedIndex(0)
  }

  return (
    <MathCard
      title="Addition & Subtraction"
      instructions="Solve the problem vertically. Start from the right side!"
      onGenerate={generateQuestion}
      onCheck={checkAnswer}
      onShowSolution={showSolution}
      onReset={reset}
      onNext={generateQuestion}
      score={score}
      total={total}
      isCorrect={status === 'correct'}
      feedbackMessage={
        status === 'correct' ? 'Excellent!' : status === 'error' ? 'Try Again!' : null
      }
    >
      <div className="flex flex-col md:flex-row gap-12 w-full justify-around items-start">
        {/* Settings Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full md:w-1/3 text-gray-800">
          <h3 className="font-bold text-gray-700 mb-4">Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Operation</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="addition">Addition (+)</option>
                <option value="subtraction">Subtraction (-)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Maximum Digits</label>
              <input
                type="range"
                min="1"
                max="4"
                value={maxDigits}
                onChange={(e) => setMaxDigits(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm font-bold text-blue-600">{maxDigits} Digits</div>
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex justify-center items-center text-gray-800">
          <div className="font-mono text-4xl inline-block">
            {/* Number 1 */}
            <div className="flex flex-row-reverse gap-2 mb-2 justify-end">
              {num1.toString().split('').reverse().map((digit, idx) => (
                <div key={idx} className="w-10 text-center font-bold">{digit}</div>
              ))}
              {/* Padding to push to right if needed */}
              {Array(Math.max(0, userInputs.length - num1.toString().length)).fill(0).map((_, i) => (
                <div key={`pad-${i}`} className="w-10"></div>
              ))}
            </div>
            
            {/* Number 2 with operator */}
            <div className="flex flex-row-reverse gap-2 mb-2 justify-end relative">
              <div className="absolute -left-12 bottom-0 text-gray-500 font-bold">
                {mode === 'addition' ? '+' : '-'}
              </div>
              {num2.toString().split('').reverse().map((digit, idx) => (
                <div key={idx} className="w-10 text-center font-bold">{digit}</div>
              ))}
              {/* Padding to push to right if needed */}
              {Array(Math.max(0, userInputs.length - num2.toString().length)).fill(0).map((_, i) => (
                <div key={`pad2-${i}`} className="w-10"></div>
              ))}
            </div>
            
            {/* Divider */}
            <div className="border-b-4 border-gray-800 mb-4 w-full h-1"></div>
            
            {/* Answer Inputs (rendered from right to left) */}
            <div className="flex flex-row-reverse gap-2 justify-end">
              {userInputs.map((val, idx) => (
                <DigitInput
                  key={idx}
                  value={val}
                  onChange={(v) => handleInputChange(idx, v)}
                  onBackspace={() => handleBackspace(idx)}
                  autoFocus={focusedIndex === idx}
                  isCorrect={status === 'correct' || status === 'showing_solution'}
                  isError={status === 'error' && val !== answerStr.split('').reverse()[idx]}
                  readOnly={status === 'showing_solution' || status === 'correct'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MathCard>
  )
}
