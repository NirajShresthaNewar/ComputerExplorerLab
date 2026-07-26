import { useRef, useEffect } from 'react'

export default function DigitInput({
  value,
  onChange,
  onBackspace,
  autoFocus,
  isCorrect,
  isError,
  readOnly,
  className = '',
}) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (autoFocus && inputRef.current && !readOnly) {
      inputRef.current.focus()
    }
  }, [autoFocus, readOnly])

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && !value && onBackspace) {
      // If the input is empty and user presses backspace, tell parent to focus previous input
      e.preventDefault()
      onBackspace()
    } else if (e.key === 'ArrowLeft' && onBackspace) {
      e.preventDefault()
      onBackspace()
    }
  }

  const handleChange = (e) => {
    const val = e.target.value
    // Only allow digits
    if (/^\d*$/.test(val)) {
      // If user pasted multiple digits, we take only the last one
      const digit = val.slice(-1)
      onChange(digit)
    }
  }

  // Determine styling based on state
  let stateClasses = 'border-gray-400 shadow-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
  if (isCorrect) {
    stateClasses = 'border-green-500 bg-green-50 text-green-700 focus:ring-green-200'
  } else if (isError) {
    stateClasses = 'border-red-500 bg-red-50 text-red-700 focus:ring-red-200'
  }
  
  if (readOnly) {
    stateClasses = 'border-transparent bg-transparent text-gray-800'
  }

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={2}
      value={value || ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      readOnly={readOnly}
      className={`w-10 h-12 text-center text-xl font-bold rounded-lg border-2 outline-none transition-all ${stateClasses} ${className}`}
      onClick={(e) => {
        if (!readOnly) e.target.select()
      }}
    />
  )
}
