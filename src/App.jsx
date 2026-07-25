import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Simulations from './pages/Simulations'
import Compare from './pages/Compare'
import Activity from './pages/Activity'
import Achievements from './pages/Achievements'
import About from './pages/About'
import AchievementToast from './components/AchievementToast'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulations" element={<Simulations />} />
          <Route path="/simulations/:id" element={<Simulations />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
      <AchievementToast />
    </div>
  )
}
