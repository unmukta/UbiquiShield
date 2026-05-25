import GlassCard from "../ui/GlassCard"

function DetectedTrackersCard({ trackers }) {
  return (
    <GlassCard>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-300">
            Detected Trackers
          </h2>

          <p className="text-gray-400 mt-1">
            Live website analysis
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
          {trackers.length}
        </div>
      </div>

      <div className="mt-6 space-y-3">

        {trackers.length === 0 ? (
          <div className="text-gray-400">
            No trackers detected.
          </div>
        ) : (
          trackers.map((tracker, index) => (
            <div
              key={index}
              className="
                flex
                items-center
                justify-between
                bg-white/5
                border border-white/5
                rounded-xl
                px-4
                py-3
              "
            >
              <span className="text-white">
                {tracker}
              </span>

              <span className="
                text-xs
                px-2
                py-1
                rounded-lg
                bg-red-500/10
                text-red-400
              ">
                detected
              </span>
            </div>
          ))
        )}

      </div>

    </GlassCard>
  )
}

export default DetectedTrackersCard