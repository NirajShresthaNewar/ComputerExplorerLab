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
  let stateClasses = 'border-[var(--theme-border)] bg-[var(--theme-input-bg)] text-[var(--theme-input-text)] focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/30 shadow-inner'
  if (isCorrect) {
    stateClasses = 'border-emerald-500 bg-emerald-500/20 text-emerald-500 focus:ring-emerald-500/30'
  } else if (isError) {
    stateClasses = 'border-red-500 bg-red-500/20 text-red-500 focus:ring-red-500/30'
  }

  if (readOnly) {
    stateClasses = 'border-transparent bg-transparent text-[var(--theme-text-main)] font-extrabold'
  }

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      pattern="[1-9]*"
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
