import { motion } from 'framer-motion'
import { BookOpen, CheckCircle2, XCircle, Briefcase, Lightbulb, EyeOff } from 'lucide-react'
import { useApp } from '../context/AppContext'

function Section({ icon: Icon, title, children }) {
  return (
    <div className="mb-5">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-lab-cyan mb-2">
        <Icon size={16} aria-hidden="true" />
        {title}
      </h4>
      {children}
    </div>
  )
}

export default function InfoPanel({ data }) {
  const { presentationMode } = useApp()

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-2xl font-bold mb-1">{data.name}</h3>
      <p className="text-sm text-gray-400 mb-5">{data.tagline}</p>

      <Section icon={BookOpen} title="Definition">
        <p className="text-sm text-gray-300">{data.definition}</p>
      </Section>

      <Section icon={BookOpen} title="Working Principle">
        <p className="text-sm text-gray-300">{data.workingPrinciple}</p>
      </Section>

      <Section icon={CheckCircle2} title="Examples">
        <div className="flex flex-wrap gap-2">
          {data.examples.map((ex) => (
            <span key={ex} className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-300">
              {ex}
            </span>
          ))}
        </div>
      </Section>

      {presentationMode ? (
        <div className="mb-5 flex items-center gap-2 text-xs text-gray-500 italic p-3 rounded-lg bg-white/5">
          <EyeOff size={14} aria-hidden="true" />
          Advantages, disadvantages, and applications are hidden in presentation mode — ask the
          class before revealing (toggle presentation mode off to show).
        </div>
      ) : (
        <>
          <Section icon={CheckCircle2} title="Advantages">
            <ul className="text-sm text-gray-300 space-y-1">
              {data.advantages.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="text-green-400">+</span> {a}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={XCircle} title="Disadvantages">
            <ul className="text-sm text-gray-300 space-y-1">
              {data.disadvantages.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="text-red-400">−</span> {d}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={Briefcase} title="Applications">
            <ul className="text-sm text-gray-300 space-y-1">
              {data.applications.map((a) => (
                <li key={a}>• {a}</li>
              ))}
            </ul>
          </Section>
        </>
      )}

      <Section icon={Lightbulb} title="Fun Fact">
        <p className="text-sm text-gray-300 italic">{data.funFact}</p>
      </Section>
    </motion.div>
  )
}
