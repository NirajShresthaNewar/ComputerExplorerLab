import { createContext, useContext, useState, useEffect } from 'react'

const MathContext = createContext()

export function MathProvider({ children }) {
  // Try to load settings from localStorage, or use defaults
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('mathSettings')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse math settings', e)
      }
    }
    return {
      showAnswersImmediately: false,
      enableHints: true,
      autoCheckAnswers: false,
      soundEffects: true,
      theme: 'light',
    }
  })

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('mathSettings', JSON.stringify(settings))
  }, [settings])

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <MathContext.Provider value={{ settings, updateSetting }}>
      {children}
    </MathContext.Provider>
  )
}

export function useMathContext() {
  const context = useContext(MathContext)
  if (context === undefined) {
    throw new Error('useMathContext must be used within a MathProvider')
  }
  return context
}
