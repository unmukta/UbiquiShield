import { useEffect, useState } from "react"

function TrackerIntelligenceCard() {

  const [trackers, setTrackers] = useState([])

  useEffect(() => {

    function loadTrackers() {

      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.local
      ) {

        chrome.storage.local.get(
          ["detectedTrackers"],
          (result) => {

            if (result.detectedTrackers) {
              setTrackers(result.detectedTrackers)
            } else {
              setTrackers([])
            }

          }
        )

      }

    }

    // Initial load
    loadTrackers()

    // Live updates
    const interval = setInterval(() => {
      loadTrackers()
    }, 1000)

    return () => clearInterval(interval)

  }, [])

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
            Tracker Intelligence
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Real-time tracker analysis
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

              <span className="text-white text-sm">
                {tracker}
              </span>

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

export default TrackerIntelligenceCard