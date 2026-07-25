import ComparisonTable from '../components/ComparisonTable'

export default function Compare() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Compare Computer Types</h1>
      <p className="text-gray-400 mb-8">Click any cell to learn more.</p>
      <ComparisonTable />
    </div>
  )
}
