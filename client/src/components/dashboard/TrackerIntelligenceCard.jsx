import GlassCard from "../ui/GlassCard"

function TrackerIntelligenceCard() {
  return (
    <GlassCard>

      {/* Header */}
      <div className="flex items-center justify-between">
        
        <div>
          <h2 className="text-xl font-semibold text-cyan-300">
            Tracker Intelligence
          </h2>

          <p className="text-gray-400 mt-2 text-sm">
            Real-time privacy monitoring
          </p>
        </div>

        <div className="
          px-4
          py-2
          rounded-xl
          bg-cyan-500/10
          border border-cyan-400/20
          text-cyan-300
          font-semibold
        ">
          14 Blocked
        </div>

      </div>

      {/* Stats */}
      <div className="mt-8 space-y-5">

        <TrackerRow
          label="Advertising Trackers"
          count="8"
          color="bg-red-400"
        />

        <TrackerRow
          label="Analytics Scripts"
          count="4"
          color="bg-yellow-400"
        />

        <TrackerRow
          label="Fingerprinting Attempts"
          count="2"
          color="bg-purple-400"
        />

      </div>

    </GlassCard>
  )
}

function TrackerRow({ label, count, color }) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">
        
        <div className={`
          w-3
          h-3
          rounded-full
          ${color}
        `} />

        <span className="text-gray-300">
          {label}
        </span>

      </div>

      <span className="text-white font-semibold">
        {count}
      </span>

    </div>
  )
}

export default TrackerIntelligenceCard