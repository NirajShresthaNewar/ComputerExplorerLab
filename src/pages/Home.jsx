import Hero from '../components/Hero'
import SimulationCard from '../components/SimulationCard'
import { computerTypes, hardwareComputerOrder, systemLabsOrder } from '../data/computerData'
import { Cpu, Database } from 'lucide-react'

export default function Home() {
  return (
    <div>
      <Hero />
      
      {/* 1. Hardware Computer Types (7 Core Classification Types) */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Cpu className="text-lab-cyan" size={24} />
              <span>Explore Computer Types</span>
            </h2>
            <p className="text-xs opacity-70 mt-1">
              Classified by data handling method (Analog, Digital, Hybrid) and physical size/power (Micro, Mini, Mainframe, Super).
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {hardwareComputerOrder.map((id) => (
            <SimulationCard key={id} {...computerTypes[id]} />
          ))}
        </div>
      </section>

      {/* 2. Core Systems & Software Labs (Memory, Operating System) */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Database className="text-lab-cyan" size={24} />
              <span>Core Systems & Software Labs</span>
            </h2>
            <p className="text-xs opacity-70 mt-1">
              Interactive conceptual labs to explore memory architectures, bits & bytes, and OS kernel multitasking.
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {systemLabsOrder.map((id) => (
            <SimulationCard key={id} {...computerTypes[id]} />
          ))}
        </div>
      </section>
    </div>
  )
}
