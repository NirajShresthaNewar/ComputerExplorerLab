import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Cpu, Volume2, VolumeX, Presentation, ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { computerTypes, computerOrder } from '../data/computerData'
import ProgressBar from './ProgressBar'

const links = [
  { to: '/', label: 'Home' },
  { to: '/simulations', label: 'Simulations' },
  { to: '/compare', label: 'Compare' },
  { to: '/math', label: 'Mathematics' },
  { to: '/activity', label: 'Activity' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { soundEnabled, setSoundEnabled, presentationMode, setPresentationMode, sound } = useApp()
  const [quickNavOpen, setQuickNavOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4 gap-4 flex-wrap">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Cpu className="text-lab-cyan" size={24} aria-hidden="true" />
          <span>Computer Explorer Lab</span>
        </Link>

        <ul className="flex gap-5 flex-wrap">
          {links.map((link) => {
            const active = location.pathname === link.to
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={sound.playClick}
                  className={`text-sm font-medium transition-colors ${
                    active ? 'text-lab-cyan' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-3">
          <ProgressBar />

          {/* Quick nav for teachers to jump straight to any simulator */}
          <div className="relative">
            <button
              onClick={() => setQuickNavOpen((o) => !o)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg glass hover:bg-white/10 text-xs"
              aria-haspopup="listbox"
              aria-expanded={quickNavOpen}
            >
              Quick Nav <ChevronDown size={14} aria-hidden="true" />
            </button>
            {quickNavOpen && (
              <ul
                role="listbox"
                className="absolute right-0 mt-2 w-48 glass rounded-lg p-2 space-y-1 max-h-72 overflow-y-auto"
              >
                {computerOrder.map((id) => (
                  <li key={id}>
                    <button
                      onClick={() => {
                        navigate(`/simulations/${id}`)
                        setQuickNavOpen(false)
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-white/10 text-xs"
                    >
                      {computerTypes[id].name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={() => setPresentationMode((p) => !p)}
            className={`p-2 rounded-lg transition-colors ${
              presentationMode ? 'bg-lab-purple/30 text-lab-purple' : 'glass hover:bg-white/10 text-gray-300'
            }`}
            aria-pressed={presentationMode}
            aria-label="Toggle teacher presentation mode"
            title="Teacher presentation mode: hides advantages/disadvantages for classroom Q&A"
          >
            <Presentation size={16} aria-hidden="true" />
          </button>

          <button
            onClick={() => setSoundEnabled((s) => !s)}
            className="p-2 rounded-lg glass hover:bg-white/10 text-gray-300"
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
          </button>
        </div>
      </nav>
    </header>
  )
}
