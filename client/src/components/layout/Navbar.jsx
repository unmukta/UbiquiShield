function Navbar() {
  return (
    <nav
      className="
        fixed
        top-0
        left-0
        w-full
        z-50
        backdrop-blur-xl
        bg-black/30
        border-b border-cyan-500/20
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-4
          flex
          items-center
          justify-between
        "
      >

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="
              w-3
              h-3
              rounded-full
              bg-cyan-400
              shadow-[0_0_15px_rgba(34,211,238,1)]
            "
          />

          <h1 className="text-2xl font-bold text-cyan-400">
            Ubiqui_Shield
          </h1>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button className="text-gray-300 hover:text-cyan-400 transition">
            Features
          </button>

          <button className="text-gray-300 hover:text-cyan-400 transition">
            Dashboard
          </button>

          <button className="text-gray-300 hover:text-cyan-400 transition">
            Security
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar