function GlassCard({ children, className = "" }) {

  return (

    <div
      className={`
        bg-[#1b1b23]
        border border-white/5
        rounded-[28px]
        p-6
        shadow-lg
        transition-all
        duration-300
        hover:border-white/10
        hover:bg-[#20202a]
        ${className}
      `}
    >

      {children}

    </div>
  )
}

export default GlassCard