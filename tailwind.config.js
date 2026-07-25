/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        lab: {
          cyan: '#22d3ee',
          blue: '#3b82f6',
          purple: '#a855f7',
          dark: '#0b0f1a',
          panel: '#111827',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(34, 211, 238, 0.35)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.35)',
      },
      backgroundImage: {
        circuit:
          "radial-gradient(circle at 20% 20%, rgba(34,211,238,0.08) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(168,85,247,0.08) 0, transparent 40%)",
      },
    },
  },
  plugins: [],
}
