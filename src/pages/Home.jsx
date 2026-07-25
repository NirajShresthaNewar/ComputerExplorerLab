import Hero from '../components/Hero'
import SimulationCard from '../components/SimulationCard'
import { computerTypes, computerOrder } from '../data/computerData'

export default function Home() {
  return (
    <div>
      <Hero />
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Explore Computer Types</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {computerOrder.map((id) => (
            <SimulationCard key={id} {...computerTypes[id]} />
          ))}
        </div>
      </section>
    </div>
  )
}
