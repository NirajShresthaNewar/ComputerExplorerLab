import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useSoundEffects } from '../hooks/useSoundEffects'

const AppContext = createContext(null)

const ACHIEVEMENT_DEFS = [
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Visit every computer simulation',
    check: (state) => state.visited.length >= 7,
  },
  {
    id: 'expert',
    name: 'Computer Expert',
    description: 'Complete the Sort the Computers activity',
    check: (state) => state.activityCompleted,
  },
  {
    id: 'scientist',
    name: 'Scientist',
    description: 'Run the Supercomputer simulation',
    check: (state) => state.visited.includes('super'),
  },
  {
    id: 'master',
    name: 'Simulation Master',
    description: 'Visit every simulation and complete the activity',
    check: (state) => state.visited.length >= 7 && state.activityCompleted,
  },
]

const STORAGE_KEY = 'cel_progress_v1'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore corrupt storage
  }
  return { visited: [], activityCompleted: false, unlocked: [] }
}

export function AppProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [presentationMode, setPresentationMode] = useState(false)
  const [progress, setProgress] = useState(loadState)
  const [newlyUnlocked, setNewlyUnlocked] = useState(null)
  const sound = useSoundEffects(soundEnabled)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const checkAchievements = useCallback(
    (state) => {
      const stillLocked = ACHIEVEMENT_DEFS.filter((a) => !state.unlocked.includes(a.id))
      const justUnlocked = stillLocked.filter((a) => a.check(state))
      if (justUnlocked.length > 0) {
        sound.playAchievement()
        setNewlyUnlocked(justUnlocked[0])
        return { ...state, unlocked: [...state.unlocked, ...justUnlocked.map((a) => a.id)] }
      }
      return state
    },
    [sound],
  )

  const markVisited = useCallback(
    (simId) => {
      setProgress((prev) => {
        if (prev.visited.includes(simId)) return prev
        const next = { ...prev, visited: [...prev.visited, simId] }
        return checkAchievements(next)
      })
    },
    [checkAchievements],
  )

  const markActivityCompleted = useCallback(() => {
    setProgress((prev) => {
      if (prev.activityCompleted) return prev
      const next = { ...prev, activityCompleted: true }
      return checkAchievements(next)
    })
  }, [checkAchievements])

  const value = {
    soundEnabled,
    setSoundEnabled,
    sound,
    presentationMode,
    setPresentationMode,
    progress,
    markVisited,
    markActivityCompleted,
    achievements: ACHIEVEMENT_DEFS,
    newlyUnlocked,
    dismissUnlocked: () => setNewlyUnlocked(null),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
