import { useState } from 'react'

export default function MultiplicationTables() {
  const [selectedTables, setSelectedTables] = useState([2, 3, 5])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleTable = (num) => {
    if (selectedTables.includes(num)) {
      setSelectedTables(selectedTables.filter(n => n !== num))
    } else {
      setSelectedTables([...selectedTables, num].sort((a, b) => a - b))
    }
  }

  const selectAll = () => setSelectedTables([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
  const clearAll = () => setSelectedTables([])

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 h-[700px] flex">

      {/* Sidebar */}
      <div
        className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-0 opacity-0 overflow-hidden'
          }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-blue-50">
          <h3 className="font-bold text-blue-900">Select Tables</h3>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-gray-600 lg:hidden"
          >
            ✕
          </button>
        </div>

        <div className="p-4 flex gap-2 border-b border-gray-200">
          <button onClick={selectAll} className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">All</button>
          <button onClick={clearAll} className="text-xs font-semibold px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Clear</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(num => (
            <label
              key={num}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${selectedTables.includes(num) ? 'bg-blue-100 border border-blue-200' : 'bg-white border border-gray-100 hover:bg-gray-50'
                }`}
            >
              <input
                type="checkbox"
                checked={selectedTables.includes(num)}
                onChange={() => toggleTable(num)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-bold text-gray-700">Table of {num}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
        <div className="p-4 border-b border-gray-200 flex items-center gap-4 bg-white">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="px-3 py-1.5 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors"
            >
              ☰ Tables
            </button>
          )}
          <h2 className="text-xl font-bold text-gray-800">Multiplication Tables</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {selectedTables.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <p className="text-lg font-medium">Select a table from the sidebar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedTables.map(num => (
                <div key={num} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transform transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="bg-blue-500 text-white py-3 text-center font-bold text-xl">
                    Table of {num}
                  </div>
                  <div className="p-5 space-y-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(multiplier => (
                      <div key={multiplier} className="flex justify-between items-center text-lg font-mono px-2 py-1 rounded hover:bg-gray-50">
                        <span className="text-gray-600">{num} × {multiplier}</span>
                        <span className="text-gray-400">=</span>
                        <span className="font-bold text-blue-900 w-8 text-right">{num * multiplier}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
