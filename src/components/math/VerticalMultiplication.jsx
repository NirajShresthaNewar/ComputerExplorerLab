import { useState, useEffect } from 'react'
import MathCard from './MathCard'
import DigitInput from './DigitInput'

export default function VerticalMultiplication() {
  const [digits1, setDigits1] = useState(2)
  const [digits2, setDigits2] = useState(1)
  const [allowCarry, setAllowCarry] = useState(true)
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)

  // userInputs can be an array of arrays. One for each row.
  // For 2x1: 1 intermediate row (which is also the final answer) -> 1 row of inputs
  // For 2x2: 2 intermediate rows + 1 final answer -> 3 rows of inputs
  const [userInputs, setUserInputs] = useState([])
  const [status, setStatus] = useState('idle')
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [focusedRow, setFocusedRow] = useState(0)
  const [focusedCol, setFocusedCol] = useState(0)

  // Calculate answers
  const calculateRows = (n1, n2) => {
    const n2Str = n2.toString().split('').reverse() // Start from units digit
    if (n2Str.length === 1) {
      // 1x1 or 2x1 or 3x1
      return [(n1 * n2).toString()]
    } else {
      // 2x2 or 3x2
      const rows = []
      let totalSum = 0
      n2Str.forEach((digit, index) => {
        const val = n1 * parseInt(digit)
        rows.push(val.toString()) // Keep the raw multiplication without trailing zeros for the intermediate row input
        totalSum += val * Math.pow(10, index)
      })
      rows.push(totalSum.toString())
      return rows
    }
  }

  const answerRows = calculateRows(num1, num2)

  const hasCarry = (n1, n2) => {
    const s1 = n1.toString().split('').map(Number).reverse()
    const s2 = n2.toString().split('').map(Number).reverse()

    const intermediateRows = []

    for (let i = 0; i < s2.length; i++) {
      const d2 = s2[i]
      let rowValues = Array(i).fill(0)
      for (let j = 0; j < s1.length; j++) {
        const d1 = s1[j]
        if (d1 * d2 > 9) return true // Carry during multiplication
        rowValues.push(d1 * d2)
      }
      intermediateRows.push(rowValues)
    }

    let maxLen = 0
    for (const row of intermediateRows) {
      if (row.length > maxLen) maxLen = row.length
    }

    for (let col = 0; col < maxLen; col++) {
      let sum = 0
      for (const row of intermediateRows) {
        if (col < row.length) sum += row[col]
      }
      if (sum > 9) return true // Carry during addition
    }

    return false
  }

  const generateQuestion = () => {
    let n1 = 0, n2 = 0
    let attempts = 0
    let valid = false

    const max1 = Math.pow(10, digits1) - 1
    const min1 = Math.pow(10, digits1 - 1)
    const max2 = Math.pow(10, digits2) - 1
    const min2 = Math.pow(10, digits2 - 1)

    while (!valid && attempts < 1000) {
      n1 = Math.floor(Math.random() * (max1 - min1 + 1)) + min1
      n2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2

      const hasZero = n1.toString().includes('0') || n2.toString().includes('0')

      if (!hasZero) {
        if (!allowCarry) {
          if (!hasCarry(n1, n2)) valid = true
        } else {
          valid = true
        }
      }
      attempts++
    }

    if (!valid) {
      // Fallback if no non-carry / no-zero combination was found easily
      n1 = parseInt('1'.repeat(digits1))
      n2 = parseInt('1'.repeat(digits2))
    }

    setNum1(n1)
    setNum2(n2)

    const rows = calculateRows(n1, n2)
    setUserInputs(rows.map(r => Array(r.length + (rows.length > 1 ? 1 : 0)).fill(''))) // Add extra space for potential carry/offset alignment, but keep simple for now

    // Better initialization
    const initialInputs = rows.map((r, i) => {
      // Final row might be longer
      let len = r.length
      if (i === rows.length - 1 && rows.length > 1) {
        len = r.length
      }
      // For intermediate rows, we'll just require them to enter the digits they got.
      // E.g. 234 * 12 -> row 1: 468, row 2: 234 (they usually add a zero or leave blank, let's just ask for the non-zero digits for simplicity or full digits with zero).
      // To mimic school, intermediate row 2 of 234*12 is 2340. 
      // Let's make the answer strings exact.
      return Array(len).fill('')
    })

    // Re-calculate accurate lengths with trailing zeros for school method
    const schoolRows = []
    const n2Str = n2.toString().split('').reverse()
    if (n2Str.length === 1) {
      schoolRows.push((n1 * n2).toString())
    } else {
      let totalSum = 0
      n2Str.forEach((digit, index) => {
        const val = n1 * parseInt(digit)
        // Add trailing zeros based on position (e.g. tens place gets one '0' or an 'x' in some schools. We'll use '0')
        const rowStr = val.toString() + '0'.repeat(index)
        schoolRows.push(rowStr)
        totalSum += val * Math.pow(10, index)
      })
      schoolRows.push(totalSum.toString())
    }

    // Initialize user inputs based on schoolRows length
    setUserInputs(schoolRows.map(r => Array(r.length).fill('')))
    setStatus('idle')
    setFocusedRow(0)
    setFocusedCol(0)
  }

  // Recalculate school rows for checking
  const getSchoolRows = (n1, n2) => {
    const schoolRows = []
    const n2Str = n2.toString().split('').reverse()
    if (n2Str.length === 1) {
      schoolRows.push((n1 * n2).toString())
    } else {
      let totalSum = 0
      n2Str.forEach((digit, index) => {
        const val = n1 * parseInt(digit)
        const rowStr = val.toString() + '0'.repeat(index)
        schoolRows.push(rowStr)
        totalSum += val * Math.pow(10, index)
      })
      schoolRows.push(totalSum.toString())
    }
    return schoolRows
  }

  const schoolAnswerRows = getSchoolRows(num1, num2)

  useEffect(() => {
    generateQuestion()
  }, [digits1, digits2, allowCarry])

  const handleInputChange = (rowIndex, colIndex, value) => {
    // Deep copy to prevent state mutation issues
    const newInputs = userInputs.map((r, i) => i === rowIndex ? [...r] : r)
    newInputs[rowIndex][colIndex] = value
    setUserInputs(newInputs)

    // Auto-advance logic (move left in the same row)
    if (value && colIndex < userInputs[rowIndex].length - 1) {
      setFocusedCol(colIndex + 1)
    } else if (value && colIndex === userInputs[rowIndex].length - 1 && rowIndex < userInputs.length - 1) {
      // Move to first column of next row
      setFocusedRow(rowIndex + 1)
      setFocusedCol(0)
    }

    setStatus('idle')
  }

  const handleBackspace = (rowIndex, colIndex) => {
    if (colIndex > 0) {
      setFocusedCol(colIndex - 1)
    } else if (colIndex === 0 && rowIndex > 0) {
      setFocusedRow(rowIndex - 1)
      setFocusedCol(userInputs[rowIndex - 1].length - 1)
    }
  }

  const checkAnswer = () => {
    let isCorrect = true
    userInputs.forEach((row, rIdx) => {
      const rowStr = [...row].reverse().join('') // reverse because we render right-to-left
      if (rowStr !== schoolAnswerRows[rIdx]) {
        isCorrect = false
      }
    })

    if (isCorrect) {
      setStatus('correct')
      setScore(s => s + 1)
    } else {
      setStatus('error')
    }
    setTotal(t => t + 1)
  }

  const showSolution = () => {
    const solutionInputs = schoolAnswerRows.map(r => r.split('').reverse())
    setUserInputs(solutionInputs)
    setStatus('showing_solution')
  }

  const reset = () => {
    setUserInputs(schoolAnswerRows.map(r => Array(r.length).fill('')))
    setStatus('idle')
    setFocusedRow(0)
    setFocusedCol(0)
  }

  return (
    <MathCard
      title="Vertical Multiplication"
      instructions="Multiply the numbers vertically. Fill in all intermediate steps!"
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
          ? 'Perfect!'
          : status === 'error'
            ? 'Check your intermediate rows and addition!'
            : null
      }
    >
      <div className="flex flex-col md:flex-row gap-12 w-full justify-around items-start">

        {/* Settings Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full md:w-1/3">
          <h3 className="font-bold text-gray-700 mb-4">Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Top Number Digits</label>
              <input
                type="range"
                min="1"
                max="4"
                value={digits1}
                onChange={(e) => setDigits1(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm font-bold text-blue-600 mb-4">{digits1} Digits</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Bottom Number Digits</label>
              <input
                type="range"
                min="1"
                max="3"
                value={digits2}
                onChange={(e) => setDigits2(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm font-bold text-blue-600 mb-4">{digits2} Digits</div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 mt-4">
              <label className="flex items-center gap-3 font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowCarry}
                  onChange={(e) => setAllowCarry(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                Allow Carry
              </label>
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
              {/* Padding to match maximum width if needed */}
              {Array(Math.max(0, (userInputs.length > 0 ? userInputs[userInputs.length - 1].length : 0) - num1.toString().length)).fill(0).map((_, i) => (
                <div key={`pad-${i}`} className="w-10"></div>
              ))}
            </div>

            {/* Number 2 with operator */}
            <div className="flex flex-row-reverse gap-2 mb-2 justify-end relative">
              <div className="absolute -left-12 bottom-0 text-gray-500 font-bold">×</div>
              {num2.toString().split('').reverse().map((digit, idx) => (
                <div key={idx} className="w-10 text-center font-bold">{digit}</div>
              ))}
              {/* Padding to match maximum width if needed */}
              {Array(Math.max(0, (userInputs.length > 0 ? userInputs[userInputs.length - 1].length : 0) - num2.toString().length)).fill(0).map((_, i) => (
                <div key={`pad2-${i}`} className="w-10"></div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-b-4 border-gray-800 mb-4 w-full h-1"></div>

            {/* Input Rows */}
            <div className="flex flex-col gap-3 items-end">
              {userInputs.map((row, rIdx) => {
                // If it's the final answer of a multi-step, add a divider before it
                const isFinalAnswer = rIdx === userInputs.length - 1 && userInputs.length > 1

                return (
                  <div key={rIdx} className="flex flex-col items-end">
                    {isFinalAnswer && (
                      <div className="border-b-4 border-gray-800 mb-3 w-full h-1 mt-1"></div>
                    )}
                    <div className="flex flex-row-reverse gap-2 justify-end">
                      {row.map((val, cIdx) => (
                        <DigitInput
                          key={cIdx}
                          value={val}
                          onChange={(v) => handleInputChange(rIdx, cIdx, v)}
                          onBackspace={() => handleBackspace(rIdx, cIdx)}
                          autoFocus={focusedRow === rIdx && focusedCol === cIdx}
                          isCorrect={status === 'correct' || status === 'showing_solution'}
                          isError={status === 'error' && val !== schoolAnswerRows[rIdx].split('').reverse()[cIdx]}
                          readOnly={status === 'showing_solution' || status === 'correct'}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      </div>
    </MathCard>
  )
}
