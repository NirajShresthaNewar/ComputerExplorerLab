import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { computerTypes, computerOrder } from '../data/computerData'
import SimulationCard from '../components/SimulationCard'
import AnalogSimulator from '../simulations/AnalogSimulator'
import DigitalSimulator from '../simulations/DigitalSimulator'
import HybridSimulator from '../simulations/HybridSimulator'
import MicroSimulator from '../simulations/MicroSimulator'
import MiniSimulator from '../simulations/MiniSimulator'
import MainframeSimulator from '../simulations/MainframeSimulator'
import SuperSimulator from '../simulations/SuperSimulator'
import { useApp } from '../context/AppContext'

const simulatorMap = {
  analog: AnalogSimulator,
  digital: DigitalSimulator,
  hybrid: HybridSimulator,
  micro: MicroSimulator,
  mini: MiniSimulator,
  mainframe: MainframeSimulator,
  super: SuperSimulator,
}

export default function Simulations() {
  const { id } = useParams()
  const { markVisited } = useApp()

  useEffect(() => {
    if (id && simulatorMap[id]) markVisited(id)
  }, [id, markVisited])

  if (id) {
    const SimulatorComponent = simulatorMap[id]
    if (!SimulatorComponent) {
      return (
        <div className="max-w-4xl mx-auto px-6 py-16 text-center text-gray-400">
          <p>This simulation is planned for Phase 2 and isn't built yet.</p>
        </div>
      )
    }
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <SimulatorComponent />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">Simulations</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {computerOrder.map((cid) => (
          <SimulationCard key={cid} {...computerTypes[cid]} />
        ))}
      </div>
    </div>
  )
}
