import { useEffect, useState } from "react"
import GlassCard from "../ui/GlassCard"

function TrackerIntelligenceCard() {

  const [trackers, setTrackers] = useState([])

  useEffect(() => {

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
          }

        }
      )

    }

  }, [])

  return (
    <GlassCard>

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-cyan-300">
            Tracker Intelligence
          </h2>

          <p className="text-gray-400 mt-2">
            Real-time tracker detection
          </p>
        </div>

        <div
          className="
            px-5
            py-3
            rounded-xl
            border
            border-cyan-500/20
            bg-cyan-500/10
          "
        >
          <span className="text-cyan-300 font-bold text-2xl">
            {trackers.length}
          </span>
        </div>

      </div>

      <div className="mt-8 space-y-4">

        {trackers.length === 0 ? (

          <p className="text-gray-400">
            No trackers detected.
          </p>

        ) : (

          trackers.map((tracker, index) => (

            <div
              key={index}
              className="
                flex
                items-center
                justify-between
                border-b
                border-white/5
                pb-3
              "
            >
              <span className="text-gray-300">
                {tracker}
              </span>

              <span className="text-red-400 text-sm">
                detected
              </span>
            </div>

          ))

        )}

      </div>

    </GlassCard>
  )
}

export default TrackerIntelligenceCard