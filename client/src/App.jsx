import { useEffect, useState } from "react"

import WebsiteStatusCard from "./components/dashboard/WebsiteStatusCard"
import TrackerIntelligenceCard from "./components/dashboard/TrackerIntelligenceCard"
import ProtectionStatusCard from "./components/dashboard/ProtectionStatusCard"
import DetectedTrackersCard from "./components/dashboard/DetectedTrackersCard"
import RiskScoreCard from "./components/dashboard/RiskScoreCard"

function App() {

  const [trackers, setTrackers] = useState([])

  useEffect(() => {

    // Extension safety check
    if (
      typeof chrome === "undefined" ||
      !chrome.storage
    ) {
      return
    }

    // INITIAL LOAD
    chrome.storage.local.get(
      ["detectedTrackers"],
      (result) => {

        if (result.detectedTrackers) {

          setTrackers(
            result.detectedTrackers
          )

        }

      }
    )

    // LIVE TRACKER UPDATES
    const listener = (
      changes,
      area
    ) => {

      if (
        area === "local" &&
        changes.detectedTrackers
      ) {

        setTrackers(
          changes.detectedTrackers.newValue || []
        )

      }

    }

    chrome.storage.onChanged.addListener(
      listener
    )

    // CLEANUP
    return () => {

      chrome.storage.onChanged.removeListener(
        listener
      )

    }

  }, [])

  return (

    <div
      className="
        min-h-screen
        bg-[#0f1014]
        p-3
      "
    >

      {/* Main Popup */}
      <div
        className="
          w-[380px]
          mx-auto
          bg-[#111217]
          rounded-[28px]
          border border-[#23252d]
          overflow-hidden
        "
      >

        {/* Header */}
        <div
          className="
            px-5
            py-4
            border-b
            border-[#23252d]
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <h1
                className="
                  text-[18px]
                  font-semibold
                  text-white
                  tracking-tight
                "
              >
                Ubiqui_Shield
              </h1>

              <p
                className="
                  text-sm
                  text-gray-400
                  mt-1
                "
              >
                Shields up for this site
              </p>

            </div>

            {/* Toggle */}
            <div
              className="
                w-12
                h-7
                rounded-full
                bg-[#4f46e5]
                relative
                cursor-pointer
                transition-all
              "
            >

              <div
                className="
                  absolute
                  top-1
                  right-1
                  w-5
                  h-5
                  rounded-full
                  bg-white
                "
              />

            </div>

          </div>

        </div>

        {/* Body */}
        <div className="p-4 space-y-4">

          {/* Website */}
          <WebsiteStatusCard />

          {/* Tracker Intelligence */}
          <TrackerIntelligenceCard
            trackers={trackers}
          />

          {/* Detected Trackers */}
          <DetectedTrackersCard
            trackers={trackers}
          />

          {/* Risk Intelligence */}
          <RiskScoreCard
            trackers={trackers}
          />

          {/* Protection */}
          <ProtectionStatusCard />

          {/* Footer Button */}
          <button
            className="
              w-full
              py-3
              rounded-2xl
              bg-[#1a1b22]
              border border-[#2a2c35]
              text-sm
              text-gray-200
              hover:bg-[#23242d]
              transition-all
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