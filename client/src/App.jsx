import { useEffect, useState } from "react"

import PrivacyRelayCard from "./components/dashboard/PrivacyRelayCard"
import AdvancedOptions from "./components/dashboard/AdvancedOptions"

function App() {

  const [blockedCount, setBlockedCount] =
    useState(0)

  const [website, setWebsite] =
    useState("Loading...")

  const [favicon, setFavicon] =
    useState("")

  const [shieldsEnabled, setShieldsEnabled] =
    useState(true)

  const [relayEnabled, setRelayEnabled] =
    useState(true)

  useEffect(() => {

    // Extension safety check
    if (
      typeof chrome === "undefined" ||
      !chrome.storage
    ) {
      return
    }

    // Load active website
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      (tabs) => {

        if (
          tabs &&
          tabs[0] &&
          tabs[0].url
        ) {

          try {

            const url =
              new URL(
                tabs[0].url
              )

            const hostname =
              url.hostname.replace(
                "www.",
                ""
              )

            setWebsite(hostname)

            // Better favicon system
            setFavicon(
              `https://${hostname}/favicon.ico`
            )

          } catch {

            setWebsite(
              "Unknown"
            )

          }

        }

      }
    )

    // Load blocked count
    chrome.storage.local.get(
      ["blockedCount"],
      (result) => {

        setBlockedCount(
          result.blockedCount || 0
        )

      }
    )

    // Load shields state
    chrome.storage.local.get(
      ["shieldsEnabled"],
      (result) => {

        if (
          result.shieldsEnabled === false
        ) {

          setShieldsEnabled(false)

        }

      }
    )

    // Live updates
    const listener = (
      changes,
      area
    ) => {

      // Blocked count
      if (
        area === "local" &&
        changes.blockedCount
      ) {

        setBlockedCount(
          changes.blockedCount.newValue || 0
        )

      }

      // Shields toggle
      if (
        area === "local" &&
        changes.shieldsEnabled
      ) {

        setShieldsEnabled(
          changes.shieldsEnabled.newValue
        )

      }

    }

    chrome.storage.onChanged.addListener(
      listener
    )

    // Cleanup
    return () => {

      chrome.storage.onChanged.removeListener(
        listener
      )

    }

  }, [])

  return (

    <div
      className="
        w-[400px]
        bg-transparent
      "
    >

      {/* Main Popup */}
      <div
        className="
          w-full
          bg-[#0f1014]
          rounded-[22px]
          border border-[#1c1d25]
          overflow-hidden
        "
      >

        {/* Header */}
        <div
          className="
            px-5
            pt-5
            pb-4
          "
        >

          <div className="flex items-start justify-between">

            {/* Left */}
            <div className="flex items-start gap-3">

              {/* Dynamic Website Icon */}
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-[#1b1c25]
                  flex
                  items-center
                  justify-center
                  overflow-hidden
                  flex-shrink-0
                "
              >

                <img
                  src={
                    favicon ||
                    "/icons/icon48.png"
                  }
                  alt="favicon"
                  className="
                    w-6
                    h-6
                    rounded-md
                  "
                  onError={(e) => {

                    e.currentTarget.src =
                      "/icons/icon48.png"

                  }}
                />

              </div>

              {/* Website */}
              <div>

                <h1
                  className="
                    text-[18px]
                    font-semibold
                    text-white
                    tracking-tight
                    leading-none
                  "
                >
                  {website}
                </h1>

                <p
                  className="
                    text-sm
                    text-gray-400
                    mt-2
                  "
                >
                  Shields up for this site
                </p>

              </div>

            </div>

            {/* Shields Toggle */}
            <div
              onClick={() => {

                const newValue =
                  !shieldsEnabled

                setShieldsEnabled(
                  newValue
                )

                chrome.storage.local.set({
                  shieldsEnabled: newValue
                })

              }}
              className={`
                w-14
                h-8
                rounded-full
                relative
                cursor-pointer
                transition-all
                flex-shrink-0
                ${
                  shieldsEnabled
                    ? "bg-[#5b4dff]"
                    : "bg-[#2a2b35]"
                }
              `}
            >

              <div
                className={`
                  absolute
                  top-1
                  w-6
                  h-6
                  rounded-full
                  bg-white
                  transition-all
                  ${
                    shieldsEnabled
                      ? "right-1"
                      : "left-1"
                  }
                `}
              />

            </div>

          </div>

        </div>

        {/* Block Counter */}
        <div className="px-4">

          <div
            className="
              bg-[#16171f]
              rounded-[26px]
              border border-[#23252d]
              px-5
              py-6
              text-center
            "
          >

            <div
              className="
                text-[56px]
                leading-none
                font-semibold
                text-white
              "
            >
              {blockedCount}
            </div>

            <p
              className="
                text-gray-300
                text-sm
                mt-3
              "
            >
              trackers, ads, and more blocked
            </p>

          </div>

        </div>

        {/* Privacy Relay */}
        <div className="px-4 mt-4">

          <PrivacyRelayCard

            relayEnabled={relayEnabled}

            setRelayEnabled={
              setRelayEnabled
            }

          />

        </div>

        {/* Advanced Options */}
        <div className="px-4 mt-4">

          <AdvancedOptions />

        </div>

        {/* Footer */}
        <div
          className="
            border-t
            border-[#1c1d25]
            mt-4
            px-5
            py-4
            text-center
          "
        >

          <p
            className="
              text-xs
              text-gray-500
              leading-relaxed
            "
          >
            Your privacy is protected by
            Ubiqui_Shield Relay.
          </p>

        </div>

      </div>

    </div>

  )

}

export default App