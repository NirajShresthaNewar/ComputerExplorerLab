import { useState } from 'react'
import { MathProvider } from '../context/MathContext'
import AdditionSubtraction from '../components/math/AdditionSubtraction'
import NumberComparison from '../components/math/NumberComparison'
import NumberOrdering from '../components/math/NumberOrdering'
import VerticalMultiplication from '../components/math/VerticalMultiplication'
import MultiplicationTables from '../components/math/MultiplicationTables'
import HomeworkGenerator from '../components/math/HomeworkGenerator'

const tabs = [
  { id: 'add-sub', label: 'Addition & Subtraction', component: AdditionSubtraction },
  { id: 'compare', label: 'Number Comparison', component: NumberComparison },
  { id: 'order', label: 'Number Ordering', component: NumberOrdering },
  { id: 'multiply', label: 'Vertical Multiplication', component: VerticalMultiplication },
  { id: 'tables', label: 'Multiplication Tables', component: MultiplicationTables },
  { id: 'homework', label: 'Homework Generator', component: HomeworkGenerator },
]

export default function MathModule() {
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component || AdditionSubtraction

  return (
    <MathProvider>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-md">
          Class 3 Mathematics
        </h1>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Module Content */}
        <div className="glass rounded-3xl p-6 min-h-[500px]">
          <ActiveComponent />
        </div>
      </div>
    </MathProvider>
  )
}
