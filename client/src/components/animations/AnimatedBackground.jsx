function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      
      {/* Top Left Glow */}
      <div className="
        absolute
        top-[-150px]
        left-[-150px]
        w-[400px]
        h-[400px]
        bg-cyan-500/20
        blur-3xl
        rounded-full
        animate-pulse
      " />

      {/* Bottom Right Glow */}
      <div className="
        absolute
        bottom-[-150px]
        right-[-150px]
        w-[400px]
        h-[400px]
        bg-purple-500/20
        blur-3xl
        rounded-full
        animate-pulse
      " />

      {/* Center Glow */}
      <div className="
        absolute
        top-1/2
        left-1/2
        w-[300px]
        h-[300px]
        bg-cyan-400/10
        blur-3xl
        rounded-full
        -translate-x-1/2
        -translate-y-1/2
      " />

    </div>
  )
}

export default AnimatedBackground