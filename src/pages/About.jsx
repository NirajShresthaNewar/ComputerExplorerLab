export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-6">
      <h1 className="text-3xl font-extrabold">About Computer Explorer Lab</h1>
      <p className="opacity-80 leading-relaxed text-sm">
        Computer Explorer Lab is an interactive educational simulation platform designed for students to explore computer classifications, hardware architectures, memory systems, operating system kernels, mathematics modules, and quantum computing concepts through engaging hands-on experiments.
      </p>

      <div className="p-6 glass rounded-2xl border border-[var(--theme-border)] space-y-2">
        <h3 className="font-bold text-base text-lab-cyan">Project Credits & Copyright</h3>
        <p className="text-sm font-semibold">Created & Designed by: <span className="text-lab-cyan">Niraj Shrestha</span></p>
        <p className="text-xs opacity-70">© 2026 Niraj Shrestha. All Rights Reserved.</p>
      </div>
    </div>
  )
}
