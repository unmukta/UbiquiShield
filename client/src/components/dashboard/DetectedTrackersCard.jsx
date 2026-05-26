function DetectedTrackersCard({ trackers }) {

  return (

    <div
      className="
        rounded-2xl
        border border-white/5
        bg-[#2a2a2d]
        p-5
      "
    >

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-base font-semibold text-white">
            Detected Trackers
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Live website analysis
          </p>

        </div>

        {/* Counter */}
        <div
          className="
            bg-[#3b3b40]
            rounded-xl
            px-4
            py-2
          "
        >

          <span className="text-white font-semibold text-lg">
            {trackers.length}
          </span>

        </div>

      </div>

      {/* Tracker List */}
      <div className="mt-5 space-y-3">

        {trackers.length === 0 ? (

          <div
            className="
              rounded-xl
              border border-white/5
              bg-[#1f1f22]
              px-4
              py-3
            "
          >

            <p className="text-gray-400 text-sm">
              No trackers detected
            </p>

          </div>

        ) : (

          trackers.map((tracker, index) => (

            <div
              key={index}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                border border-white/5
                bg-[#1f1f22]
                px-4
                py-3
              "
            >

              {/* Tracker Name */}
              <span className="text-white text-sm">
                {tracker}
              </span>

              {/* Status */}
              <span
                className="
                  text-xs
                  text-[#7c5cff]
                  font-medium
                "
              >
                Active
              </span>

            </div>

          ))

        )}

      </div>

    </div>

  )

}

export default DetectedTrackersCard