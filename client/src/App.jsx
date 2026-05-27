import { useEffect, useState } from "react"

import ProtectionStatusCard from "./components/dashboard/ProtectionStatusCard"
import PrivacyRelayCard from "./components/dashboard/PrivacyRelayCard"

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

            // Dynamic favicon
            setFavicon(
              `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
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
        min-h-[620px]
        bg-[#0f1014]
        p-3
        overflow-x-hidden
      "
    >

      {/* Main Popup */}
      <div
        className="
          w-full
          bg-[#111217]
          rounded-[32px]
          border border-[#23252d]
          overflow-hidden
        "
      >

        {/* Header */}
        <div
          className="
            px-5
            py-5
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
                  "
                >
                  {website}
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
              rounded-3xl
              border border-[#23252d]
              px-5
              py-6
              text-center
            "
          >

            <div
              className="
                text-5xl
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
                mt-2
              "
            >
              trackers, ads, and more blocked
            </p>

          </div>

        </div>

        {/* Privacy Relay Hero */}
        <div className="px-4 mt-4">

          <PrivacyRelayCard

            relayEnabled={relayEnabled}

            setRelayEnabled={
              setRelayEnabled
            }

          />

        </div>

        {/* Protection Settings */}
        <div className="p-4">

          <ProtectionStatusCard />

        </div>

        {/* Footer */}
        <div
          className="
            border-t
            border-[#23252d]
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