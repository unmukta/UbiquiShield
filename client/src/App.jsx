import { useEffect, useState } from "react"

import WebsiteStatusCard from "./components/dashboard/WebsiteStatusCard"
import TrackerIntelligenceCard from "./components/dashboard/TrackerIntelligenceCard"
import ProtectionStatusCard from "./components/dashboard/ProtectionStatusCard"
import DetectedTrackersCard from "./components/dashboard/DetectedTrackersCard"
import RiskScoreCard from "./components/dashboard/RiskScoreCard"

function App() {

  const [trackers, setTrackers] = useState([])

  useEffect(() => {

    // Initial tracker load
    chrome.storage.local.get(["trackers"], (result) => {

      if (result.trackers) {
        setTrackers(result.trackers)
      }

    })

    // Live tracker updates
    chrome.storage.onChanged.addListener((changes, area) => {

      if (
        area === "local" &&
        changes.trackers
      ) {

        setTrackers(changes.trackers.newValue || [])

      }

    })

  }, [])

  return (

    <div
      className="
        min-h-screen
        bg-[#0f1014]
        rounded-[36px]
        overflow-hidden
        p-3
      "
    >

      {/* Main Popup */}
      <div
        className="
          w-[380px]
          bg-[#111217]
          rounded-[36px]
          border border-white/5
          shadow-2xl
          overflow-hidden
          mx-auto
        "
      >

        {/* Content */}
        <div className="p-5 space-y-4">

          {/* Header */}
          <div className="flex items-start justify-between">

            <div>

              <h1 className="text-[20px] font-semibold text-white tracking-tight">
                Ubiqui_Shield
              </h1>

              <p className="text-sm text-gray-400 mt-1">
                Browser Protection Active
              </p>

            </div>

            <div
              className="
                w-3
                h-3
                rounded-full
                bg-green-400
                mt-2
                shadow-[0_0_10px_rgba(74,222,128,0.8)]
              "
            />

          </div>

          {/* Dashboard Cards */}
          <WebsiteStatusCard />

          <TrackerIntelligenceCard trackers={trackers} />

          <DetectedTrackersCard trackers={trackers} />

          <RiskScoreCard trackers={trackers} />

          <ProtectionStatusCard />

          {/* Brave Style Settings Button */}
          <button
            className="
              w-full
              rounded-2xl
              bg-[#1a1b22]
              border border-white/5
              text-gray-200
              text-sm
              py-3
              hover:bg-[#23242d]
              transition-all
              duration-300
            "
          >
            Open Protection Settings
          </button>

        </div>

      </div>

    </div>
  )
}

export default App