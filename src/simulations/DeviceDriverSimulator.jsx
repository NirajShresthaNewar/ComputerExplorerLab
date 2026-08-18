import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench,
  Monitor,
  Cpu,
  HardDrive,
  Printer,
  Volume2,
  ScanSearch,
  Wifi,
  ToggleLeft,
  ToggleRight,
  Play,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Package,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ShieldAlert,
} from 'lucide-react'
import InfoPanel from '../components/InfoPanel'
import { computerTypes } from '../data/computerData'

const HARDWARE_DEVICES = [
  {
    id: 'printer',
    name: 'HP LaserJet Printer',
    icon: Printer,
    color: 'from-blue-500 to-indigo-600',
    accent: 'blue',
    action: 'Print Document',
    driverName: 'HP Print Driver v6.2',
    successMsg: 'Document sent to printer! Pages printing... ✅',
    failMsg: 'Printer not recognized. HP LaserJet driver is missing — please install the driver first.',
    techDetail: 'PCL/PostScript language packets transmitted via USB to printer controller board.',
  },
  {
    id: 'gpu',
    name: 'NVIDIA RTX GPU',
    icon: Monitor,
    color: 'from-emerald-500 to-teal-600',
    accent: 'emerald',
    action: 'Render 3D Graphics',
    driverName: 'NVIDIA GeForce Driver 555.8',
    successMsg: '3D scene rendered at 144 FPS! GPU VRAM utilized at 4.2 GB ✅',
    failMsg: 'Display running in basic VGA mode (640×480). NVIDIA driver not found — GPU accelerated rendering disabled.',
    techDetail: 'OpenGL/DirectX draw calls dispatched through NVIDIA CUDA shader cores at 2.4 GHz.',
  },
  {
    id: 'audio',
    name: 'Realtek Audio Card',
    icon: Volume2,
    color: 'from-purple-500 to-violet-600',
    accent: 'purple',
    action: 'Play 3D Sound',
    driverName: 'Realtek HD Audio Driver',
    successMsg: 'Audio stream decoded & sent to speakers at 48kHz 24-bit! ✅',
    failMsg: 'No audio output device found. Realtek driver missing — audio hardware disabled.',
    techDetail: 'PCM digital audio converted to analog signal via DAC chip at sampling rate 48,000 Hz.',
  },
  {
    id: 'scanner',
    name: 'Epson A4 Scanner',
    icon: ScanSearch,
    color: 'from-amber-500 to-orange-600',
    accent: 'amber',
    action: 'Scan A4 Document',
    driverName: 'Epson Scan 2 Driver v6.8',
    successMsg: 'Document scanned at 600 DPI! Image data transferred to RAM ✅',
    failMsg: 'Scanner device not found on USB bus. Epson driver not installed — cannot initialize scan head.',
    techDetail: 'CCD optical sensor data sent as 24-bit RGB bitmap via USB 3.0 at 600 DPI resolution.',
  },
]

const BRIDGE_NODES = [
  { id: 'user', label: 'User', sublabel: 'Requests action', icon: Monitor, color: 'from-blue-500 to-indigo-600' },
  { id: 'app', label: 'Application', sublabel: 'App sends job request', icon: Package, color: 'from-cyan-500 to-blue-600' },
  { id: 'os', label: 'OS Kernel', sublabel: 'Issues system call', icon: Cpu, color: 'from-purple-500 to-violet-600' },
  { id: 'driver', label: 'Device Driver', sublabel: 'Translator Bridge', icon: Wrench, color: 'from-amber-500 to-orange-500', isBridge: true },
  { id: 'hardware', label: 'Hardware', sublabel: 'Physical device', icon: HardDrive, color: 'from-emerald-500 to-teal-600' },
]

export default function DeviceDriverSimulator() {
  const [selectedDevice, setSelectedDevice] = useState(HARDWARE_DEVICES[0])
  const [driverInstalled, setDriverInstalled] = useState(false)
  const [isTransmitting, setIsTransmitting] = useState(false)
  const [transmitStep, setTransmitStep] = useState(null) // node id where packet is
  const [result, setResult] = useState(null) // 'success' | 'fail'
  const [stuckAt, setStuckAt] = useState(null) // node where stuck

  const resetSim = () => {
    setIsTransmitting(false)
    setTransmitStep(null)
    setResult(null)
    setStuckAt(null)
  }

  const handleSendRequest = () => {
    resetSim()
    setIsTransmitting(true)

    const nodes = BRIDGE_NODES.map((n) => n.id)
    const driverIndex = nodes.indexOf('driver')

    // Animate through nodes
    nodes.forEach((nodeId, idx) => {
      setTimeout(() => {
        setTransmitStep(nodeId)

        // If driver is missing, get stuck at OS → driver boundary
        if (!driverInstalled && nodeId === 'os') {
          setStuckAt('os')
          setResult('fail')
          setIsTransmitting(false)
        }
      }, idx * 900)
    })

    // If driver installed: complete after all nodes
    if (driverInstalled) {
      setTimeout(() => {
        setResult('success')
        setIsTransmitting(false)
      }, nodes.length * 900 + 400)
    }
  }

  const getNodeState = (nodeId) => {
    const nodeOrder = BRIDGE_NODES.map((n) => n.id)
    const curIdx = nodeOrder.indexOf(transmitStep)
    const nodeIdx = nodeOrder.indexOf(nodeId)

    if (result === 'fail' && nodeId === 'driver') return 'broken'
    if (result === 'fail' && nodeIdx > nodeOrder.indexOf('os')) return 'disabled'
    if (nodeIdx < curIdx) return 'done'
    if (nodeIdx === curIdx) return 'active'
    return 'waiting'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-3">
            <Wrench className="text-lab-cyan" size={28} />
            <span>Device Driver Bridge Visualizer</span>
          </h2>
          <p className="text-sm opacity-70 mt-1">
            Toggle the driver ON or OFF and watch how data packets flow — or get stuck — between your app and physical hardware!
          </p>
        </div>

        {/* Driver Toggle */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold opacity-70">Driver Status:</span>
          <button
            onClick={() => { setDriverInstalled((v) => !v); resetSim() }}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 font-bold text-sm transition-all ${
              driverInstalled
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/20'
                : 'bg-red-500/15 border-red-500/50 text-red-300'
            }`}
          >
            {driverInstalled
              ? <ToggleRight size={24} className="text-emerald-400" />
              : <ToggleLeft size={24} className="text-red-400" />}
            {driverInstalled ? 'Driver INSTALLED ✓' : 'Driver MISSING ✗'}
          </button>
          {driverInstalled && (
            <span className="text-[10px] text-emerald-400 font-mono">{selectedDevice.driverName}</span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Device Selector */}
          <div className="p-4 glass rounded-2xl border border-white/10 space-y-3">
            <span className="text-xs font-bold opacity-70 flex items-center gap-2">
              <HardDrive size={14} /> Select Hardware Device:
            </span>
            <div className="grid sm:grid-cols-2 gap-2">
              {HARDWARE_DEVICES.map((device) => {
                const Icon = device.icon
                return (
                  <button
                    key={device.id}
                    onClick={() => { setSelectedDevice(device); resetSim() }}
                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-xs font-bold text-left transition-all ${
                      selectedDevice.id === device.id
                        ? 'bg-lab-cyan/15 border-lab-cyan text-white shadow-lg'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-r ${device.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div>{device.name}</div>
                      <div className="opacity-60 font-normal text-[10px]">Action: {device.action}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Send Request Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSendRequest}
              disabled={isTransmitting}
              className="flex-1 flex items-center justify-center gap-3 py-3 rounded-2xl bg-gradient-to-r from-lab-cyan to-blue-600 text-slate-950 font-extrabold text-sm shadow-lg transition-all hover:scale-[1.02] disabled:opacity-60"
            >
              <Play size={18} className={isTransmitting ? 'animate-pulse' : ''} />
              {isTransmitting ? 'Transmitting request...' : `Send: "${selectedDevice.action}" Request`}
            </button>
            <button onClick={resetSim} className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
              <RotateCcw size={18} />
            </button>
          </div>

          {/* Bridge Architecture Pipeline */}
          <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
            <h3 className="text-base font-extrabold flex items-center gap-2 border-b border-[var(--theme-border)] pb-3">
              <Zap className="text-amber-400" size={20} />
              Hardware Communication Bridge Architecture
            </h3>

            {/* Node Flow */}
            <div className="space-y-3">
              {BRIDGE_NODES.map((node, idx) => {
                const Icon = node.icon
                const nodeState = transmitStep ? getNodeState(node.id) : 'idle'
                const isStuck = stuckAt && node.id === 'driver' && result === 'fail'
                const isDisabled = result === 'fail' && ['driver', 'hardware'].includes(node.id)

                return (
                  <div key={node.id}>
                    {/* Connector Line */}
                    {idx > 0 && (
                      <div className={`flex items-center gap-2 ml-6 py-1 ${isDisabled ? 'opacity-20' : ''}`}>
                        <div className={`h-6 w-0.5 mx-auto ${
                          nodeState === 'done' && !isStuck ? 'bg-emerald-500' :
                          isStuck && idx >= BRIDGE_NODES.findIndex(n => n.id === 'driver') ? 'bg-red-500' :
                          'bg-white/15'
                        }`} />
                        {/* Animated packet on connector */}
                        {transmitStep && getNodeState(BRIDGE_NODES[idx - 1]?.id) === 'done' && nodeState === 'active' && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.5, 1], opacity: 1 }}
                            className="absolute ml-3 w-3 h-3 rounded-full bg-lab-cyan shadow-lg shadow-lab-cyan/50"
                          />
                        )}
                      </div>
                    )}

                    {/* Node Card */}
                    <motion.div
                      animate={nodeState === 'active' ? { scale: 1.02 } : { scale: 1 }}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
                        node.isBridge && !driverInstalled && result === 'fail'
                          ? 'bg-red-500/20 border-red-500 shadow-xl shadow-red-500/20'
                          : node.isBridge && driverInstalled && nodeState === 'active'
                          ? 'bg-amber-500/20 border-amber-400 shadow-xl shadow-amber-500/20 animate-pulse'
                          : nodeState === 'active'
                          ? 'bg-lab-cyan/20 border-lab-cyan shadow-xl shadow-lab-cyan/20 animate-pulse'
                          : nodeState === 'done'
                          ? 'bg-emerald-500/10 border-emerald-500/50'
                          : isDisabled
                          ? 'bg-white/5 border-white/5 opacity-30'
                          : 'bg-[var(--theme-bg-panel)] border-white/15'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${node.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                        <Icon size={22} />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-extrabold text-sm">{node.label}</h4>
                        <p className="text-[11px] opacity-70">{node.sublabel}</p>
                        {node.isBridge && (
                          <p className={`text-[10px] font-bold mt-0.5 ${driverInstalled ? 'text-emerald-400' : 'text-red-400'}`}>
                            {driverInstalled ? `✓ ${selectedDevice.driverName} loaded` : '✗ No driver installed for this device'}
                          </p>
                        )}
                        {node.id === 'hardware' && (
                          <p className="text-[10px] opacity-60 mt-0.5">{selectedDevice.name}</p>
                        )}
                      </div>

                      {/* State indicator */}
                      <div className="text-right">
                        {nodeState === 'done' && !isStuck && <CheckCircle2 size={22} className="text-emerald-400" />}
                        {nodeState === 'active' && <Zap size={22} className="text-lab-cyan animate-pulse" />}
                        {isStuck && <AlertTriangle size={22} className="text-red-400 animate-pulse" />}
                        {node.isBridge && !driverInstalled && result !== 'fail' && (
                          <ShieldAlert size={22} className="text-red-400 opacity-60" />
                        )}
                      </div>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Result Alert */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
                className={`p-5 rounded-3xl border-2 space-y-3 ${
                  result === 'success'
                    ? 'bg-emerald-500/15 border-emerald-500'
                    : 'bg-red-500/15 border-red-500'
                }`}
              >
                <div className={`flex items-center gap-3 font-extrabold text-sm ${result === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
                  {result === 'success' ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
                  {result === 'success' ? 'Hardware Request Completed Successfully!' : '⛔ Device Driver Bridge Broken — Request Failed!'}
                </div>
                <p className={`text-xs ${result === 'success' ? 'text-emerald-200' : 'text-red-200'} opacity-90 leading-relaxed`}>
                  {result === 'success' ? selectedDevice.successMsg : selectedDevice.failMsg}
                </p>
                {result === 'success' && (
                  <p className="text-[11px] text-gray-400 font-mono">{selectedDevice.techDetail}</p>
                )}
                {result === 'fail' && (
                  <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-xs text-amber-200">
                    <span className="font-bold">💡 Fix:</span> Toggle the Driver switch above to "Driver INSTALLED" and send the request again to see the data flow across the bridge!
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Info Panel */}
        <div className="space-y-6">
          <InfoPanel data={computerTypes['device-driver']} />

          {/* Quick Concept Card */}
          <div className="glass rounded-2xl p-4 border border-white/10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Key Concept</span>
            <div className="space-y-2">
              {[
                { label: 'Without Driver', desc: 'OS cannot speak hardware language. Request stuck!', color: 'text-red-400' },
                { label: 'With Driver', desc: 'OS calls driver → driver sends hardware commands.', color: 'text-emerald-400' },
                { label: 'Driver Missing?', desc: '"Device Not Recognized" error in Device Manager.', color: 'text-amber-400' },
              ].map((item) => (
                <div key={item.label} className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className={`text-xs font-bold ${item.color}`}>{item.label}</div>
                  <div className="text-[11px] opacity-70 mt-0.5">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
