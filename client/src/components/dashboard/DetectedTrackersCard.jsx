import GlassCard from "../ui/GlassCard"

function DetectedTrackersCard({
  trackers = []
}) {

  return (

    <GlassCard>

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>

          <h2
            className="
              text-xl
              font-semibold
              text-white
            "
          >
            Detected Trackers
          </h2>

          <p
            className="
              text-sm
              text-gray-400
              mt-1
            "
          >
            Live website analysis
          </p>

        </div>

        {/* Count */}
        <div
          className="
            min-w-[52px]
            h-[52px]
            rounded-2xl
            bg-[#2a2b35]
            flex
            items-center
            justify-center
            text-white
            text-2xl
            font-semibold
          "
        >
          {trackers.length}
        </div>

      </div>

      {/* Tracker List */}
      <div className="mt-5 space-y-3">

        {trackers.length === 0 ? (

          <div
            className="
              bg-[#15161d]
              border border-white/5
              rounded-2xl
              px-4
              py-4
              text-gray-400
              text-sm
            "
          >
            No trackers detected
          </div>

        ) : (

          trackers.map((
            tracker,
            index
          ) => (

            <div
              key={index}
              className="
                flex
                items-center
                justify-between
                bg-[#15161d]
                border border-white/5
                rounded-2xl
                px-4
                py-3
              "
            >

              {/* Left Side */}
              <div>

                {/* Tracker Name */}
                <p
                  className="
                    text-white
                    text-sm
                    font-medium
                  "
                >
                  {tracker.name}
                </p>

                {/* Category */}
                <p
                  className="
                    text-xs
                    text-gray-500
                    mt-1
                  "
                >
                  {tracker.category}
                </p>

                {/* Company */}
                <p
                  className="
                    text-xs
                    text-gray-500
                    mt-1
                  "
                >
                  Owned by {tracker.company}
                </p>

              </div>

              {/* Status */}
              <div
                className="
                  px-3
                  py-1
                  rounded-full
                  bg-red-500/10
                  text-red-400
                  text-xs
                  border border-red-500/20
                "
              >
                blocked
              </div>

            </div>

          ))

        )}

      </div>

    </GlassCard>

  )

}

export default DetectedTrackersCard