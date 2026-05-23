function NeonButton({
  children,
  className = "",
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6
        py-3
        rounded-xl
        font-semibold
        text-black
        bg-cyan-400
        transition-all
        duration-300
        shadow-[0_0_20px_rgba(34,211,238,0.5)]
        hover:scale-105
        hover:shadow-[0_0_35px_rgba(34,211,238,0.9)]
        hover:bg-cyan-300
        active:scale-95
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export default NeonButton