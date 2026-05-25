import { useEffect, useState } from "react"

import AnimatedBackground from "./components/animations/AnimatedBackground"

import WebsiteStatusCard from "./components/dashboard/WebsiteStatusCard"
import TrackerIntelligenceCard from "./components/dashboard/TrackerIntelligenceCard"
import ProtectionStatusCard from "./components/dashboard/ProtectionStatusCard"
import DetectedTrackersCard from "./components/dashboard/DetectedTrackersCard"

import NeonButton from "./components/ui/NeonButton"

function App() {

  // Live trackers state
  const [trackers, setTrackers] = useState([])

  useEffect(() => {

    // Initial load
    chrome.storage.local.get(["trackers"], (result) => {

      if (result.trackers) {
        setTrackers(result.trackers)
      }

    })

    // LIVE updates listener
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
    <>
      <AnimatedBackground />

      <div className="min-h-screen flex items-center justify-center p-6">

        <div
          className="
            w-[380px]
            rounded-3xl
            border border-white/10
            bg-[#0d1117]/95
            backdrop-blur-xl
            shadow-2xl
            overflow-hidden
          "
        >

          {/* Header */}
          <div className="px-5 py-4 border-b border-white/5">

            <div className="flex items-center justify-between">

              <div>
                <h1 className="text-lg font-semibold text-white">
                  Ubiqui_Shield
                </h1>

                <p className="text-xs text-gray-400 mt-1">
                  Browser Protection Active
                </p>
              </div>

              <div
                className="
                  w-3
                  h-3
                  rounded-full
                  bg-green-400
                "
              />

            </div>

          </div>

          {/* Content */}
          <div className="p-4 space-y-4">

            <WebsiteStatusCard />

            <TrackerIntelligenceCard trackers={trackers} />

            <DetectedTrackersCard trackers={trackers} />

            <ProtectionStatusCard />

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">

              <NeonButton className="text-sm py-2">
                Scan Site
              </NeonButton>

              <button
                className="
                  rounded-xl
                  border border-white/10
                  bg-white/5
                  text-gray-300
                  text-sm
                  hover:bg-white/10
                  transition
                "
              >
                Settings
              </button>

            </div>

          </div>

        </div>

      </div>
    </>
  )
}

export default App