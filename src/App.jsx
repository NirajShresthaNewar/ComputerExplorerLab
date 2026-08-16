import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Simulations from './pages/Simulations'
import Compare from './pages/Compare'
import Activity from './pages/Activity'
import Achievements from './pages/Achievements'
import About from './pages/About'
import AchievementToast from './components/AchievementToast'
import MathModule from './pages/MathModule'
import DocumentHub from './pages/DocumentHub'
import QuizPage from './pages/QuizPage'

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen flex text-[var(--theme-text-main)] transition-colors duration-300">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          collapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
        />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulations" element={<Simulations />} />
            <Route path="/simulations/:id" element={<Simulations />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/about" element={<About />} />
            <Route path="/math" element={<MathModule />} />
            <Route path="/documents" element={<DocumentHub />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <AchievementToast />
    </div>
  )
}
