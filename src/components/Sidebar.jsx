import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Cpu,
  Home,
  Monitor,
  Calculator,
  GitCompare,
  Activity,
  Trophy,
  Info,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  FileText,
  HelpCircle,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { computerTypes, hardwareComputerOrder, systemLabsOrder } from '../data/computerData'
import { getFolders } from '../utils/documentStorage'

const mathSubmenu = [
  { id: 'add-sub', label: 'Addition & Subtraction' },
  { id: 'compare', label: 'Number Comparison' },
  { id: 'order', label: 'Number Ordering' },
  { id: 'multiply', label: 'Vertical Multiplication' },
  { id: 'tables', label: 'Multiplication Tables' },
  { id: 'homework', label: 'Homework Generator' },
]

export default function Sidebar({ collapsed }) {
  const location = useLocation()
  const { sound } = useApp()

  const isMathActive = location.pathname === '/math'
  const isSimActive = location.pathname.startsWith('/simulations')
  const isDocsActive = location.pathname === '/documents'

  const [mathExpanded, setMathExpanded] = useState(isMathActive)
  const [simExpanded, setSimExpanded] = useState(isSimActive)
  const [docsExpanded, setDocsExpanded] = useState(isDocsActive)
  const [docFolders, setDocFolders] = useState([])

  // Sync expanded states on navigation
  useEffect(() => {
    if (isMathActive) setMathExpanded(true)
    if (isSimActive) setSimExpanded(true)
    if (isDocsActive) setDocsExpanded(true)
  }, [location.pathname, isMathActive, isSimActive, isDocsActive])

  // Load document folders for submenu
  useEffect(() => {
    getFolders().then(setDocFolders).catch(() => {})
  }, [isDocsActive])

  // Get active params from URL search params
  const searchParams = new URLSearchParams(location.search)
  const activeMathTab = searchParams.get('tab') || 'add-sub'
  const activeDocFolder = searchParams.get('folder') || 'all'

  const handleNavClick = () => {
    sound.playClick()
  }

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-50 glass-solid border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out md:static md:z-auto ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header Logo */}
      <div className={`p-4 flex items-center border-b border-white/10 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <Link
          to="/"
          onClick={handleNavClick}
          className="flex items-center gap-3 font-bold text-lg text-white hover:text-lab-cyan transition-colors"
          title="Computer Explorer Lab"
        >
          <div className="p-2 rounded-xl bg-lab-cyan/10 border border-lab-cyan/30 text-lab-cyan shadow-lg shadow-lab-cyan/20">
            <Cpu size={22} />
          </div>
          {!collapsed && (
            <div className="flex flex-col whitespace-nowrap overflow-hidden">
              <span className="leading-tight text-base font-extrabold tracking-wide bg-gradient-to-r from-white via-cyan-100 to-lab-cyan bg-clip-text text-transparent">
                Computer Explorer
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                Interactive Lab
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1.5 custom-scrollbar">
        {/* Home */}
        <Link
          to="/"
          onClick={handleNavClick}
          title="Home"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            collapsed ? 'justify-center px-0' : ''
          } ${
            location.pathname === '/'
              ? 'bg-gradient-to-r from-lab-cyan/20 to-blue-600/20 text-white border border-lab-cyan/30 shadow-md shadow-lab-cyan/10'
              : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Home size={20} className={location.pathname === '/' ? 'text-lab-cyan' : 'text-gray-400'} />
          {!collapsed && <span>Home</span>}
        </Link>

        {/* Simulations */}
        <div>
          <div className="flex items-center justify-between">
            <Link
              to="/simulations"
              onClick={handleNavClick}
              title="Simulations"
              className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                collapsed ? 'justify-center px-0' : ''
              } ${
                isSimActive && !location.pathname.includes('/simulations/')
                  ? 'bg-gradient-to-r from-lab-cyan/20 to-blue-600/20 text-white border border-lab-cyan/30 shadow-md'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Monitor size={20} className={isSimActive ? 'text-lab-cyan' : 'text-gray-400'} />
              {!collapsed && <span>Simulations</span>}
            </Link>
            {!collapsed && (
              <button
                onClick={() => setSimExpanded((prev) => !prev)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Toggle simulations submenu"
              >
                {simExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
          </div>

          {/* Simulations Submenu */}
          {!collapsed && simExpanded && (
            <div className="ml-4 mt-1 pl-3 border-l border-white/10 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-50 pt-1">
                Hardware Types
              </div>
              {hardwareComputerOrder.map((id) => {
                const comp = computerTypes[id]
                const isActive = location.pathname === `/simulations/${id}`
                return (
                  <Link
                    key={id}
                    to={`/simulations/${id}`}
                    onClick={handleNavClick}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-lab-cyan/15 text-lab-cyan font-semibold border-l-2 border-lab-cyan'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-lab-cyan animate-pulse' : 'bg-gray-500'}`} />
                    <span>{comp.name}</span>
                  </Link>
                )
              })}

              <div className="text-[10px] font-bold uppercase tracking-wider opacity-50 pt-2 border-t border-white/5">
                Systems & Software Labs
              </div>
              {systemLabsOrder.map((id) => {
                const comp = computerTypes[id]
                const isActive = location.pathname === `/simulations/${id}`
                return (
                  <Link
                    key={id}
                    to={`/simulations/${id}`}
                    onClick={handleNavClick}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-lab-cyan/15 text-lab-cyan font-semibold border-l-2 border-lab-cyan'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-lab-cyan animate-pulse' : 'bg-gray-500'}`} />
                    <span>{comp.name}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Mathematics */}
        <div>
          <div className="flex items-center justify-between">
            <Link
              to="/math"
              onClick={handleNavClick}
              title="Mathematics"
              className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                collapsed ? 'justify-center px-0' : ''
              } ${
                isMathActive
                  ? 'bg-gradient-to-r from-lab-cyan/20 to-blue-600/20 text-white border border-lab-cyan/30 shadow-md'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Calculator size={20} className={isMathActive ? 'text-lab-cyan' : 'text-gray-400'} />
              {!collapsed && <span>Mathematics</span>}
            </Link>
            {!collapsed && (
              <button
                onClick={() => setMathExpanded((prev) => !prev)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Toggle mathematics submenu"
              >
                {mathExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
          </div>

          {/* Mathematics Submenu */}
          {!collapsed && mathExpanded && (
            <div className="ml-4 mt-1 pl-3 border-l border-white/10 space-y-1">
              {mathSubmenu.map((sub) => {
                const isActive = isMathActive && activeMathTab === sub.id
                return (
                  <Link
                    key={sub.id}
                    to={`/math?tab=${sub.id}`}
                    onClick={handleNavClick}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-lab-cyan/20 text-lab-cyan font-bold border-l-2 border-lab-cyan shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-lab-cyan shadow-sm shadow-lab-cyan' : 'bg-gray-600'}`} />
                    <span>{sub.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Documents with Folder Submenu */}
        <div>
          <div className="flex items-center justify-between">
            <Link
              to="/documents"
              onClick={handleNavClick}
              title="Documents"
              className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                collapsed ? 'justify-center px-0' : ''
              } ${
                isDocsActive
                  ? 'bg-gradient-to-r from-lab-cyan/20 to-blue-600/20 text-white border border-lab-cyan/30 shadow-md'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FolderOpen size={20} className={isDocsActive ? 'text-lab-cyan' : 'text-gray-400'} />
              {!collapsed && <span>Documents</span>}
            </Link>
            {!collapsed && (
              <button
                onClick={() => setDocsExpanded((prev) => !prev)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Toggle documents submenu"
              >
                {docsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
          </div>

          {/* Document Folders Submenu */}
          {!collapsed && docsExpanded && (
            <div className="ml-4 mt-1 pl-3 border-l border-white/10 space-y-1">
              {/* All Documents */}
              <Link
                to="/documents?folder=all"
                onClick={handleNavClick}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isDocsActive && activeDocFolder === 'all'
                    ? 'bg-lab-cyan/20 text-lab-cyan font-bold border-l-2 border-lab-cyan shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isDocsActive && activeDocFolder === 'all' ? 'bg-lab-cyan shadow-sm shadow-lab-cyan' : 'bg-gray-600'}`} />
                <span>All Documents</span>
              </Link>

              {docFolders.map((folder) => {
                const isActive = isDocsActive && activeDocFolder === folder.id
                return (
                  <Link
                    key={folder.id}
                    to={`/documents?folder=${folder.id}`}
                    onClick={handleNavClick}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-lab-cyan/20 text-lab-cyan font-bold border-l-2 border-lab-cyan shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-lab-cyan shadow-sm shadow-lab-cyan' : 'bg-gray-600'}`} />
                    <span>{folder.name}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Compare */}
        <Link
          to="/compare"
          onClick={handleNavClick}
          title="Compare"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            collapsed ? 'justify-center px-0' : ''
          } ${
            location.pathname === '/compare'
              ? 'bg-gradient-to-r from-lab-cyan/20 to-blue-600/20 text-white border border-lab-cyan/30 shadow-md shadow-lab-cyan/10'
              : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <GitCompare size={20} className={location.pathname === '/compare' ? 'text-lab-cyan' : 'text-gray-400'} />
          {!collapsed && <span>Compare</span>}
        </Link>

        {/* Activity */}
        <Link
          to="/activity"
          onClick={handleNavClick}
          title="Activity"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            collapsed ? 'justify-center px-0' : ''
          } ${
            location.pathname === '/activity'
              ? 'bg-gradient-to-r from-lab-cyan/20 to-blue-600/20 text-white border border-lab-cyan/30 shadow-md shadow-lab-cyan/10'
              : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Activity size={20} className={location.pathname === '/activity' ? 'text-lab-cyan' : 'text-gray-400'} />
          {!collapsed && <span>Activity</span>}
        </Link>

        {/* Hardware Quiz */}
        <Link
          to="/quiz"
          onClick={handleNavClick}
          title="Hardware Quiz"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            collapsed ? 'justify-center px-0' : ''
          } ${
            location.pathname === '/quiz'
              ? 'bg-gradient-to-r from-lab-cyan/20 to-blue-600/20 text-white border border-lab-cyan/30 shadow-md shadow-lab-cyan/10'
              : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <HelpCircle size={20} className={location.pathname === '/quiz' ? 'text-lab-cyan' : 'text-gray-400'} />
          {!collapsed && <span>Hardware Quiz</span>}
        </Link>

        {/* Achievements */}
        <Link
          to="/achievements"
          onClick={handleNavClick}
          title="Achievements"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            collapsed ? 'justify-center px-0' : ''
          } ${
            location.pathname === '/achievements'
              ? 'bg-gradient-to-r from-lab-cyan/20 to-blue-600/20 text-white border border-lab-cyan/30 shadow-md shadow-lab-cyan/10'
              : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Trophy size={20} className={location.pathname === '/achievements' ? 'text-lab-cyan' : 'text-gray-400'} />
          {!collapsed && <span>Achievements</span>}
        </Link>

        {/* About */}
        <Link
          to="/about"
          onClick={handleNavClick}
          title="About"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            collapsed ? 'justify-center px-0' : ''
          } ${
            location.pathname === '/about'
              ? 'bg-gradient-to-r from-lab-cyan/20 to-blue-600/20 text-white border border-lab-cyan/30 shadow-md shadow-lab-cyan/10'
              : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Info size={20} className={location.pathname === '/about' ? 'text-lab-cyan' : 'text-gray-400'} />
          {!collapsed && <span>About</span>}
        </Link>
      </nav>
    </aside>
  )
}
