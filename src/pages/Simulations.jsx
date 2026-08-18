import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { computerTypes, hardwareComputerOrder, systemLabsOrder } from '../data/computerData'
import SimulationCard from '../components/SimulationCard'
import AnalogSimulator from '../simulations/AnalogSimulator'
import DigitalSimulator from '../simulations/DigitalSimulator'
import HybridSimulator from '../simulations/HybridSimulator'
import MicroSimulator from '../simulations/MicroSimulator'
import MiniSimulator from '../simulations/MiniSimulator'
import MainframeSimulator from '../simulations/MainframeSimulator'
import SuperSimulator from '../simulations/SuperSimulator'
import MemorySimulator from '../simulations/MemorySimulator'
import OsSimulator from '../simulations/OsSimulator'
import QuantumSimulator from '../simulations/QuantumSimulator'
import SoftwareClassificationSimulator from '../simulations/SoftwareClassificationSimulator'
import LanguageProcessorSimulator from '../simulations/LanguageProcessorSimulator'
import TranslationPipelineSimulator from '../simulations/TranslationPipelineSimulator'
import DeviceDriverSimulator from '../simulations/DeviceDriverSimulator'
import { useApp } from '../context/AppContext'
import { Cpu, Database } from 'lucide-react'

const simulatorMap = {
  analog: AnalogSimulator,
  digital: DigitalSimulator,
  hybrid: HybridSimulator,
  micro: MicroSimulator,
  mini: MiniSimulator,
  mainframe: MainframeSimulator,
  super: SuperSimulator,
  memory: MemorySimulator,
  os: OsSimulator,
  quantum: QuantumSimulator,
  'software-class': SoftwareClassificationSimulator,
  'lang-processor': LanguageProcessorSimulator,
  'translation-pipeline': TranslationPipelineSimulator,
  'device-driver': DeviceDriverSimulator,
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
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Simulations & Interactive Labs</h1>
        <p className="text-sm opacity-70">
          Select a computer hardware classification type or an architectural system concept lab to begin exploring.
        </p>
      </div>

      {/* 1. Hardware Computer Types */}
      <section>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
          <Cpu className="text-lab-cyan" size={20} />
          <span>Hardware Computer Types (Classification)</span>
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {hardwareComputerOrder.map((cid) => (
            <SimulationCard key={cid} {...computerTypes[cid]} />
          ))}
        </div>
      </section>

      {/* 2. Core Systems & Software Labs */}
      <section>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
          <Database className="text-lab-cyan" size={20} />
          <span>Core Systems & Software Concept Labs</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {systemLabsOrder.map((cid) => (
            <SimulationCard key={cid} {...computerTypes[cid]} />
          ))}
        </div>
      </section>
    </div>
  )
}
