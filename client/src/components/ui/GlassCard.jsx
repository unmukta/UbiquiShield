function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`
        bg-white/5
        backdrop-blur-xl
        border border-cyan-500/20
        rounded-2xl
        shadow-[0_0_25px_rgba(0,191,255,0.15)]
        p-6
        transition-all
        duration-300
        hover:border-cyan-400/40
        hover:shadow-[0_0_35px_rgba(0,191,255,0.25)]
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default GlassCard