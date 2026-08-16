import { useSearchParams } from 'react-router-dom'
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
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab') || 'add-sub'

  const activeTabObj = tabs.find((t) => t.id === tabParam) || tabs[0]
  const ActiveComponent = activeTabObj.component

  return (
    <MathProvider>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-md">
              Class 3 Mathematics
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Active Module: <span className="text-lab-cyan font-semibold">{activeTabObj.label}</span>
            </p>
          </div>
        </div>

        {/* Active Module Content - Submenu tabs removed from middle */}
        <div className="glass rounded-3xl p-6 min-h-[500px]">
          <ActiveComponent />
        </div>
      </div>
    </MathProvider>
  )
}
