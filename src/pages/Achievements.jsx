import { useApp } from '../context/AppContext'
import AchievementBadge from '../components/AchievementBadge'
import ProgressBar from '../components/ProgressBar'

export default function Achievements() {
  const { achievements, progress } = useApp()

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Your Achievements</h1>
      <div className="mb-8">
        <ProgressBar />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {achievements.map((a) => (
          <AchievementBadge key={a.id} achievement={a} unlocked={progress.unlocked.includes(a.id)} />
        ))}
      </div>
    </div>
  )
}
