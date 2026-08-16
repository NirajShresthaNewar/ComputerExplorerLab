import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Volume2, VolumeX, Presentation, ChevronDown, Menu, Palette, Sun, Moon, Zap, Flame, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { computerTypes, computerOrder } from '../data/computerData'
import ProgressBar from './ProgressBar'

const THEME_OPTIONS = [
  { id: 'dark', label: 'Dark Lab', icon: Moon, color: 'text-cyan-400' },
  { id: 'light', label: 'White Mode', icon: Sun, color: 'text-blue-600' },
  { id: 'sunset', label: 'Sunset Flame', icon: Flame, color: 'text-orange-500' },
  { id: 'neon-blue', label: 'Neon Blue', icon: Zap, color: 'text-blue-400' },
  { id: 'emerald', label: 'Emerald Cyber', icon: Sparkles, color: 'text-emerald-400' },
]

export default function Navbar({ onToggleSidebar, collapsed }) {
  const navigate = useNavigate()
  const { soundEnabled, setSoundEnabled, presentationMode, setPresentationMode, theme, setTheme } = useApp()
  const [quickNavOpen, setQuickNavOpen] = useState(false)
  const [themeNavOpen, setThemeNavOpen] = useState(false)

  const activeThemeObj = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0]
  const ActiveThemeIcon = activeThemeObj.icon

  return (
    <header className="sticky top-0 z-40 glass-solid border-b border-white/10 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Sidebar Toggle Button (Hamburger icon) */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl glass hover:bg-white/10 text-gray-300 flex items-center justify-center transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar navigation' : 'Collapse sidebar navigation'}
        >
          <Menu size={20} />
        </button>

        {/* Status / Quick Title or Spacer */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Interactive Learning Mode</span>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-3 ml-auto">
          <ProgressBar />

          {/* Theme Selector Toggle */}
          <div className="relative">
            <button
              onClick={() => setThemeNavOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass hover:bg-white/10 text-xs font-medium text-gray-200 transition-colors"
              title="Switch color theme"
            >
              <Palette size={15} className="text-lab-cyan" />
              <span className="hidden sm:inline">{activeThemeObj.label}</span>
              <ChevronDown size={14} />
            </button>
            {themeNavOpen && (
              <ul className="absolute right-0 mt-2 w-44 glass rounded-xl p-2 space-y-1 z-50 border border-white/10 shadow-xl">
                {THEME_OPTIONS.map((t) => {
                  const Icon = t.icon
                  const isSelected = theme === t.id
                  return (
                    <li key={t.id}>
                      <button
                        onClick={() => {
                          setTheme(t.id)
                          setThemeNavOpen(false)
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-lab-cyan/20 text-white font-bold'
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon size={14} className={t.color} />
                        <span>{t.label}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Quick nav for teachers to jump straight to any simulator */}
          <div className="relative">
            <button
              onClick={() => setQuickNavOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass hover:bg-white/10 text-xs font-medium text-gray-200 transition-colors"
              aria-haspopup="listbox"
              aria-expanded={quickNavOpen}
            >
              Quick Nav <ChevronDown size={14} aria-hidden="true" />
            </button>
            {quickNavOpen && (
              <ul
                role="listbox"
                className="absolute right-0 mt-2 w-48 glass rounded-xl p-2 space-y-1 max-h-72 overflow-y-auto z-50 border border-white/10 shadow-xl"
              >
                {computerOrder.map((id) => (
                  <li key={id}>
                    <button
                      onClick={() => {
                        navigate(`/simulations/${id}`)
                        setQuickNavOpen(false)
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-xs font-medium text-gray-300 hover:text-white transition-colors"
                    >
                      {computerTypes[id].name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Presentation mode toggle */}
          <button
            onClick={() => setPresentationMode((p) => !p)}
            className={`p-2 rounded-xl transition-all ${
              presentationMode
                ? 'bg-lab-purple/30 text-lab-purple border border-lab-purple/50 shadow-md shadow-lab-purple/20'
                : 'glass hover:bg-white/10 text-gray-300'
            }`}
            aria-pressed={presentationMode}
            aria-label="Toggle teacher presentation mode"
            title="Teacher presentation mode: hides advantages/disadvantages for classroom Q&A"
          >
            <Presentation size={16} aria-hidden="true" />
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled((s) => !s)}
            className="p-2 rounded-xl glass hover:bg-white/10 text-gray-300 transition-colors"
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  )
}
