import { useState, useRef, useEffect } from 'react'
import NepaliDate from 'nepali-date'

export default function HomeworkGenerator() {
  const [config, setConfig] = useState({
    addition: { enabled: true, count: 5, digits1: 2, digits2: 2, carryMode: 'mix' },
    subtraction: { enabled: true, count: 5, digits1: 2, digits2: 2, carryMode: 'mix' },
    multiplication: { enabled: true, count: 4, digits1: 2, digits2: 1, carryMode: 'mix' },
    comparison: { enabled: false, count: 0 },
    ordering: { enabled: false, count: 2, digits: 4, numbersPerQuestion: 5, mode: 'mix' }
  })
  
  const [worksheet, setWorksheet] = useState(null)
  const [showAnswers, setShowAnswers] = useState(false)
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [worksheetType, setWorksheetType] = useState('HOMEWORK')
  const [classSection, setClassSection] = useState('Annapurna')
  const [currentDateBS, setCurrentDateBS] = useState('')

  useEffect(() => {
    try {
      const d = new NepaliDate()
      setCurrentDateBS(d.format('YYYY-MM-DD'))
    } catch (e) {
      console.error('Error generating Nepali date:', e)
    }
  }, [])

  const generateWorksheet = () => {
    const newWorksheet = []
    
    // Helper functions
    const hasCarryAdd = (n1, n2) => {
      const s1 = n1.toString().split('').reverse().map(Number)
      const s2 = n2.toString().split('').reverse().map(Number)
      const max = Math.max(s1.length, s2.length)
      for (let i = 0; i < max; i++) {
        if ((s1[i] || 0) + (s2[i] || 0) > 9) return true
      }
      return false
    }

    const hasBorrowSub = (n1, n2) => {
      let v1 = n1, v2 = n2
      if (v1 < v2) { v1 = n2; v2 = n1; }
      const s1 = v1.toString().split('').reverse().map(Number)
      const s2 = v2.toString().split('').reverse().map(Number)
      let borrowed = 0
      for (let i = 0; i < s1.length; i++) {
        const d1 = s1[i] - borrowed
        const d2 = s2[i] || 0
        if (d1 < d2) {
          return true
        } else {
          borrowed = 0
        }
      }
      return false
    }

    // Generate Addition
    if (config.addition.enabled && config.addition.count > 0) {
      const qs = []
      for (let i=0; i<config.addition.count; i++) {
        let n1 = 0, n2 = 0
        let valid = false
        let attempts = 0
        const max1 = Math.pow(10, config.addition.digits1) - 1
        const min1 = Math.pow(10, config.addition.digits1 - 1)
        const max2 = Math.pow(10, config.addition.digits2) - 1
        const min2 = Math.pow(10, config.addition.digits2 - 1)

        while (!valid && attempts < 1000) {
          n1 = Math.floor(Math.random() * (max1 - min1 + 1)) + min1
          n2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2
          
          if (config.addition.carryMode === 'no-carry') {
            if (!hasCarryAdd(n1, n2)) valid = true
          } else if (config.addition.carryMode === 'carry') {
            if (hasCarryAdd(n1, n2)) valid = true
          } else {
            valid = true
          }
          attempts++
        }
        
        if (!valid) {
          n1 = parseInt('1'.repeat(config.addition.digits1))
          n2 = parseInt('1'.repeat(config.addition.digits2))
        }
        qs.push({ n1, n2, operator: '+', answer: n1 + n2 })
      }
      newWorksheet.push({ section: 'A', title: 'Addition', questions: qs, type: 'vertical' })
    }

    // Generate Subtraction
    if (config.subtraction.enabled && config.subtraction.count > 0) {
      const qs = []
      for (let i=0; i<config.subtraction.count; i++) {
        let n1 = 0, n2 = 0
        let valid = false
        let attempts = 0
        const max1 = Math.pow(10, config.subtraction.digits1) - 1
        const min1 = Math.pow(10, config.subtraction.digits1 - 1)
        const max2 = Math.pow(10, config.subtraction.digits2) - 1
        const min2 = Math.pow(10, config.subtraction.digits2 - 1)

        while (!valid && attempts < 1000) {
          n1 = Math.floor(Math.random() * (max1 - min1 + 1)) + min1
          n2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2
          
          if (n1 < n2) {
            const temp = n1; n1 = n2; n2 = temp;
          }
          
          if (config.subtraction.carryMode === 'no-carry') {
            if (!hasBorrowSub(n1, n2)) valid = true
          } else if (config.subtraction.carryMode === 'carry') {
            if (hasBorrowSub(n1, n2)) valid = true
          } else {
            valid = true
          }
          attempts++
        }
        
        if (!valid) {
          n1 = Math.max(parseInt('2'.repeat(config.subtraction.digits1)), parseInt('1'.repeat(config.subtraction.digits2)))
          n2 = Math.min(parseInt('2'.repeat(config.subtraction.digits1)), parseInt('1'.repeat(config.subtraction.digits2)))
        }
        qs.push({ n1, n2, operator: '-', answer: n1 - n2 })
      }
      newWorksheet.push({ section: 'B', title: 'Subtraction', questions: qs, type: 'vertical' })
    }

    // Generate Multiplication
    if (config.multiplication.enabled && config.multiplication.count > 0) {
      const hasCarry = (n1, n2) => {
        const s1 = n1.toString().split('').map(Number).reverse()
        const s2 = n2.toString().split('').map(Number).reverse()
        const intermediateRows = []
        for (let i = 0; i < s2.length; i++) {
          const d2 = s2[i]
          let rowValues = Array(i).fill(0)
          for (let j = 0; j < s1.length; j++) {
            const d1 = s1[j]
            if (d1 * d2 > 9) return true // Carry during multiplication
            rowValues.push(d1 * d2)
          }
          intermediateRows.push(rowValues)
        }
        let maxLen = 0
        for (const row of intermediateRows) {
          if (row.length > maxLen) maxLen = row.length
        }
        for (let col = 0; col < maxLen; col++) {
          let sum = 0
          for (const row of intermediateRows) {
            if (col < row.length) sum += row[col]
          }
          if (sum > 9) return true // Carry during addition
        }
        return false
      }

      const qs = []
      for (let i=0; i<config.multiplication.count; i++) {
        let n1 = 0, n2 = 0
        let valid = false
        let attempts = 0
        const max1 = Math.pow(10, config.multiplication.digits1) - 1
        const min1 = Math.pow(10, config.multiplication.digits1 - 1)
        const max2 = Math.pow(10, config.multiplication.digits2) - 1
        const min2 = Math.pow(10, config.multiplication.digits2 - 1)

        while (!valid && attempts < 1000) {
          n1 = Math.floor(Math.random() * (max1 - min1 + 1)) + min1
          n2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2
          
          // Reject numbers containing any 0 digit (e.g. 10, 20, 30, 101, 50)
          const hasZeroDigit = n1.toString().includes('0') || n2.toString().includes('0')
          if (hasZeroDigit) { attempts++; continue }

          if (config.multiplication.carryMode === 'no-carry') {
            if (!hasCarry(n1, n2)) valid = true
          } else if (config.multiplication.carryMode === 'carry') {
            if (hasCarry(n1, n2)) valid = true
          } else {
            valid = true
          }
          attempts++
        }
        
        if (!valid) {
          n1 = parseInt('1'.repeat(config.multiplication.digits1))
          n2 = parseInt('1'.repeat(config.multiplication.digits2))
        }
        
        qs.push({ n1, n2, operator: '×', answer: n1 * n2 })
      }
      newWorksheet.push({ section: 'C', title: 'Multiplication', questions: qs, type: 'vertical' })
    }

    // Generate Ordering (Ascending / Descending)
    if (config.ordering.enabled && config.ordering.count > 0) {
      const qs = []
      const digits = config.ordering.digits || 4
      const perQ = config.ordering.numbersPerQuestion || 5
      const maxNum = Math.pow(10, digits) - 1
      const minNum = Math.pow(10, digits - 1)

      for (let i = 0; i < config.ordering.count; i++) {
        // Decide direction for this question
        let direction
        if (config.ordering.mode === 'ascending') {
          direction = 'ascending'
        } else if (config.ordering.mode === 'descending') {
          direction = 'descending'
        } else {
          direction = i % 2 === 0 ? 'ascending' : 'descending'
        }

        // Generate unique random numbers
        const nums = new Set()
        let attempts = 0
        while (nums.size < perQ && attempts < 2000) {
          const n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum
          nums.add(n)
          attempts++
        }
        const numberList = Array.from(nums)
        const sorted = [...numberList].sort((a, b) => direction === 'ascending' ? a - b : b - a)

        qs.push({ numbers: numberList, direction, answer: sorted })
      }

      const sectionLetter = String.fromCharCode(65 + newWorksheet.length) // next letter
      newWorksheet.push({ section: sectionLetter, title: 'Arrange in Order', questions: qs, type: 'ordering' })
    }

    setWorksheet(newWorksheet)
    setShowAnswers(false)
    setIsSidebarVisible(false) // Auto-hide sidebar for smartboard space
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full px-4 md:px-8 mx-auto printable-container text-gray-800 transition-all duration-300">
      
      {/* Teacher Dashboard / Controls (Hidden on Print) */}
      {isSidebarVisible && (
        <div className="lg:w-1/3 xl:w-1/4 bg-white p-6 rounded-3xl shadow-md border border-gray-100 no-print flex-shrink-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Settings
            </h2>
            <button 
              onClick={() => setIsSidebarVisible(false)}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
              title="Hide Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            </button>
          </div>

          <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-purple-800 mb-2">Worksheet Type</label>
              <select 
                value={worksheetType} 
                onChange={e => setWorksheetType(e.target.value)} 
                className="w-full rounded-lg border-purple-200 text-purple-900 bg-white px-3 py-2 focus:ring-purple-500 focus:border-purple-500 font-semibold shadow-sm"
              >
                <option value="HOMEWORK">Homework</option>
                <option value="CLASSWORK">Classwork</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-purple-800 mb-2">Section</label>
              <select 
                value={classSection} 
                onChange={e => setClassSection(e.target.value)} 
                className="w-full rounded-lg border-purple-200 text-purple-900 bg-white px-3 py-2 focus:ring-purple-500 focus:border-purple-500 font-semibold shadow-sm"
              >
                <option value="Annapurna">Annapurna</option>
                <option value="Himalchuli">Himalchuli</option>
              </select>
            </div>
          </div>

        <div className="space-y-6">
          {/* Addition Settings */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label className="flex items-center gap-3 font-bold text-gray-700 mb-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={config.addition.enabled} 
                onChange={e => setConfig({...config, addition: {...config.addition, enabled: e.target.checked}})}
                className="w-5 h-5 text-purple-600 rounded"
              />
              Addition
            </label>
            {config.addition.enabled && (
              <div className="grid grid-cols-2 gap-4 pl-8">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Questions</label>
                  <input type="number" min="1" max="20" value={config.addition.count || 5} onChange={e => setConfig({...config, addition: {...config.addition, count: parseInt(e.target.value)}})} className="w-full rounded border-gray-300 px-2 py-1" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Top Digits</label>
                  <select value={config.addition.digits1 || 2} onChange={e => setConfig({...config, addition: {...config.addition, digits1: parseInt(e.target.value)}})} className="w-full rounded border-gray-300 px-2 py-1">
                    <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Bottom Digits</label>
                  <select value={config.addition.digits2 || 2} onChange={e => setConfig({...config, addition: {...config.addition, digits2: parseInt(e.target.value)}})} className="w-full rounded border-gray-300 px-2 py-1">
                    <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Carry Type</label>
                  <select value={config.addition.carryMode || 'mix'} onChange={e => setConfig({...config, addition: {...config.addition, carryMode: e.target.value}})} className="w-full rounded border-gray-300 px-2 py-1">
                    <option value="mix">Mixed</option>
                    <option value="carry">Always Carry</option>
                    <option value="no-carry">No Carry</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Subtraction Settings */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label className="flex items-center gap-3 font-bold text-gray-700 mb-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={config.subtraction.enabled} 
                onChange={e => setConfig({...config, subtraction: {...config.subtraction, enabled: e.target.checked}})}
                className="w-5 h-5 text-purple-600 rounded"
              />
              Subtraction
            </label>
            {config.subtraction.enabled && (
              <div className="grid grid-cols-2 gap-4 pl-8">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Questions</label>
                  <input type="number" min="1" max="20" value={config.subtraction.count || 5} onChange={e => setConfig({...config, subtraction: {...config.subtraction, count: parseInt(e.target.value)}})} className="w-full rounded border-gray-300 px-2 py-1" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Top Digits</label>
                  <select value={config.subtraction.digits1 || 2} onChange={e => setConfig({...config, subtraction: {...config.subtraction, digits1: parseInt(e.target.value)}})} className="w-full rounded border-gray-300 px-2 py-1">
                    <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Bottom Digits</label>
                  <select value={config.subtraction.digits2 || 2} onChange={e => setConfig({...config, subtraction: {...config.subtraction, digits2: parseInt(e.target.value)}})} className="w-full rounded border-gray-300 px-2 py-1">
                    <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Borrow Type</label>
                  <select value={config.subtraction.carryMode || 'mix'} onChange={e => setConfig({...config, subtraction: {...config.subtraction, carryMode: e.target.value}})} className="w-full rounded border-gray-300 px-2 py-1">
                    <option value="mix">Mixed</option>
                    <option value="carry">Always Borrow</option>
                    <option value="no-carry">No Borrow</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Multiplication Settings */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label className="flex items-center gap-3 font-bold text-gray-700 mb-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={config.multiplication.enabled} 
                onChange={e => setConfig({...config, multiplication: {...config.multiplication, enabled: e.target.checked}})}
                className="w-5 h-5 text-purple-600 rounded"
              />
              Multiplication
            </label>
            {config.multiplication.enabled && (
              <div className="grid grid-cols-2 gap-4 pl-8">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Questions</label>
                  <input type="number" min="1" max="20" value={config.multiplication.count || 4} onChange={e => setConfig({...config, multiplication: {...config.multiplication, count: parseInt(e.target.value)}})} className="w-full rounded border-gray-300 px-2 py-1" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Top Digits</label>
                  <select value={config.multiplication.digits1 || 2} onChange={e => setConfig({...config, multiplication: {...config.multiplication, digits1: parseInt(e.target.value)}})} className="w-full rounded border-gray-300 px-2 py-1">
                    <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Bottom Digits</label>
                  <select value={config.multiplication.digits2 || 1} onChange={e => setConfig({...config, multiplication: {...config.multiplication, digits2: parseInt(e.target.value)}})} className="w-full rounded border-gray-300 px-2 py-1">
                    <option value="1">1</option><option value="2">2</option><option value="3">3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Carry Type</label>
                  <select value={config.multiplication.carryMode || 'mix'} onChange={e => setConfig({...config, multiplication: {...config.multiplication, carryMode: e.target.value}})} className="w-full rounded border-gray-300 px-2 py-1">
                    <option value="mix">Mixed (Any)</option>
                    <option value="carry">Always Carry</option>
                    <option value="no-carry">No Carry</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Ordering Settings */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label className="flex items-center gap-3 font-bold text-gray-700 mb-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={config.ordering.enabled} 
                onChange={e => setConfig({...config, ordering: {...config.ordering, enabled: e.target.checked}})}
                className="w-5 h-5 text-purple-600 rounded"
              />
              Ordering (Asc / Desc)
            </label>
            {config.ordering.enabled && (
              <div className="grid grid-cols-2 gap-4 pl-8">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Questions</label>
                  <input type="number" min="1" max="10" value={config.ordering.count || 2} onChange={e => setConfig({...config, ordering: {...config.ordering, count: parseInt(e.target.value)}})} className="w-full rounded border-gray-300 px-2 py-1" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Digits</label>
                  <select value={config.ordering.digits || 4} onChange={e => setConfig({...config, ordering: {...config.ordering, digits: parseInt(e.target.value)}})} className="w-full rounded border-gray-300 px-2 py-1">
                    <option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Numbers per Q</label>
                  <select value={config.ordering.numbersPerQuestion || 5} onChange={e => setConfig({...config, ordering: {...config.ordering, numbersPerQuestion: parseInt(e.target.value)}})} className="w-full rounded border-gray-300 px-2 py-1">
                    <option value="4">4</option><option value="5">5</option><option value="6">6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Direction</label>
                  <select value={config.ordering.mode || 'mix'} onChange={e => setConfig({...config, ordering: {...config.ordering, mode: e.target.value}})} className="w-full rounded border-gray-300 px-2 py-1">
                    <option value="mix">Mixed</option>
                    <option value="ascending">Ascending Only</option>
                    <option value="descending">Descending Only</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={generateWorksheet}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md transition-colors"
          >
            Generate Worksheet
          </button>

          {worksheet && (
            <div className="flex gap-2">
              <button 
                onClick={() => { setShowAnswers(false); setTimeout(handlePrint, 100); }}
                className="flex-1 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl font-semibold transition-colors flex justify-center items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Print Student
              </button>
              <button 
                onClick={() => { setShowAnswers(true); setTimeout(handlePrint, 100); }}
                className="flex-1 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-xl font-semibold transition-colors flex justify-center items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Print Key
              </button>
            </div>
          )}
        </div>
        </div>
      )}

      {/* Preview / Print Area */}
      <div className={`${isSidebarVisible ? 'lg:w-2/3 xl:w-3/4' : 'w-full'} bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 min-h-[800px] print-area transition-all duration-300`}>
        {!worksheet ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 no-print">
            <p className="text-xl">Configure settings and click Generate</p>
          </div>
        ) : (
          <div className="print-content">
            {/* Top Bar for Toggling Settings */}
            {!isSidebarVisible && (
              <div className="mb-4 flex justify-start no-print">
                <button 
                  onClick={() => setIsSidebarVisible(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-bold transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                  Show Settings
                </button>
              </div>
            )}

            {/* Worksheet Header */}
            <div className="border-b-2 border-gray-800 pb-4 mb-6">
              <h1 className="text-3xl font-bold text-center mb-6">CLASS 3 MATHEMATICS {showAnswers ? '- ANSWER KEY' : `- ${worksheetType}`}</h1>
              <div className="flex justify-between text-lg">
                <div className="flex gap-2 w-1/2">
                  <span className="font-semibold">Name:</span>
                  <div className="border-b border-gray-500 flex-1"></div>
                </div>
                <div className="flex gap-2 w-1/4 items-end">
                  <span className="font-semibold">Class: 3 - {classSection}</span>
                </div>
                <div className="flex gap-2 w-1/4 items-end">
                  <span className="font-semibold">Date: {currentDateBS}</span>
                  <div className="border-b border-gray-500 flex-1"></div>
                </div>
              </div>
            </div>

            {/* Worksheet Body */}
            <div className="space-y-8">
              {worksheet.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-xl font-bold mb-4 underline">SECTION {section.section}: {section.title}</h3>
                  
                  {section.type === 'ordering' ? (
                    /* Ordering Section Rendering */
                    <div className="space-y-6">
                      {section.questions.map((q, qIdx) => (
                        <div key={qIdx} className="pl-4">
                          <p className="text-lg font-semibold mb-2">
                            {qIdx + 1}) Arrange in <span className="underline font-bold">{q.direction}</span> order:
                          </p>
                          <div className="flex flex-wrap gap-4 mb-3 text-xl font-mono">
                            {q.numbers.map((n, nIdx) => (
                              <span key={nIdx} className="px-3 py-1 border border-gray-400 rounded-lg bg-gray-50">{n}</span>
                            ))}
                          </div>
                          {showAnswers ? (
                            <div className="text-lg font-mono text-red-600 font-bold">
                              Ans: {q.answer.join(' , ')}
                            </div>
                          ) : (
                            <div className="border-b border-gray-400 w-3/4 h-8"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Vertical Math Section Rendering */
                    <div className={`grid grid-cols-3 ${isSidebarVisible ? 'lg:grid-cols-4' : 'lg:grid-cols-5 xl:grid-cols-6'} gap-y-8 gap-x-6`}>
                      {section.questions.map((q, qIdx) => (
                        <div key={qIdx} className="flex justify-center">
                          <div className="font-mono text-2xl text-right">
                            <div className="tracking-[0.5em]">{q.n1}</div>
                            <div className="flex justify-end tracking-[0.5em]">
                              <span className="mr-2">{q.operator}</span>
                              <span>{q.n2}</span>
                            </div>
                            <div className="border-b-4 border-gray-800 w-full h-1 mt-1 mb-2"></div>
                            {showAnswers ? (
                              <div className="tracking-[0.5em] text-red-600 font-bold">{q.answer}</div>
                            ) : (
                              <div className="h-10"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
      
    </div>
  )
}
