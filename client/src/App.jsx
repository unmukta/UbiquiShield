import { useEffect, useState } from "react"

import AdvancedOptions from "./components/dashboard/AdvancedOptions"

function App() {

  const [blockedCount, setBlockedCount] =
    useState(0)

  const [website, setWebsite] =
    useState("Loading...")

  const [hostname, setHostname] =
    useState("")

  const [favicon, setFavicon] =
    useState("")

  const [shieldsEnabled, setShieldsEnabled] =
    useState(true)

  const [relayEnabled, setRelayEnabled] =
    useState(true)

  useEffect(() => {

    if (
      typeof chrome === "undefined" ||
      !chrome.storage
    ) {
      return
    }

    // Active Website
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

            const cleanHostname =
              url.hostname.replace(
                "www.",
                ""
              )

            setWebsite(
              cleanHostname
            )

            setHostname(
              cleanHostname
            )

            setFavicon(
              `https://${cleanHostname}/favicon.ico`
            )

            chrome.storage.local.get(
              [
                "siteSettings",
                "relayEnabled"
              ],
              (result) => {

                const settings =
                  result.siteSettings || {}

                if (
                  settings[
                    cleanHostname
                  ]
                ) {

                  setShieldsEnabled(
                    settings[
                      cleanHostname
                    ].shieldsEnabled
                  )

                }

                if (
                  result.relayEnabled !==
                  undefined
                ) {

                  setRelayEnabled(
                    result.relayEnabled
                  )

                }

              }
            )

          } catch {

            setWebsite(
              "Unknown"
            )

          }

        }

      }
    )

    // Counter
    chrome.storage.local.get(
      ["blockedCount"],
      (result) => {

        setBlockedCount(
          result.blockedCount || 0
        )

      }
    )

    // Live Updates
    const listener = (
      changes,
      area
    ) => {

      if (
        area === "local" &&
        changes.blockedCount
      ) {

        setBlockedCount(
          changes.blockedCount.newValue || 0
        )

      }

    }

    chrome.storage.onChanged.addListener(
      listener
    )

    return () => {

      chrome.storage.onChanged.removeListener(
        listener
      )

    }

  }, [])

  // Shields Toggle
  function toggleShields() {

    const newValue =
      !shieldsEnabled

    setShieldsEnabled(
      newValue
    )

    chrome.storage.local.get(
      ["siteSettings"],
      (result) => {

        const settings =
          result.siteSettings || {}

        settings[hostname] = {

          shieldsEnabled:
            newValue

        }

        chrome.storage.local.set({

          siteSettings:
            settings

        })

      }
    )

    // Enable / Disable Rules
    if (
      chrome.declarativeNetRequest
    ) {

      chrome.declarativeNetRequest
        .updateEnabledRulesets({

          disableRulesetIds:
            newValue
              ? []
              : ["ruleset_1"],

          enableRulesetIds:
            newValue
              ? ["ruleset_1"]
              : []

        })

    }

  }

  // Relay Toggle
  function toggleRelay() {

    const newValue =
      !relayEnabled

    setRelayEnabled(
      newValue
    )

    chrome.storage.local.set({

      relayEnabled:
        newValue

    })

  }

  return (

    <div
      className="
        w-[420px]
        bg-[#0f1014]
        p-2
      "
    >

      {/* Main Container */}
      <div
        className="
          w-full
          rounded-[28px]
          border
          border-[#1f212b]
          bg-[#0f1014]
          overflow-hidden
        "
      >

        {/* Header */}
        <div className="px-5 pt-5 pb-4">

          <div className="flex items-start justify-between">

            {/* Left */}
            <div className="flex items-start gap-4">

              {/* Website Icon */}
              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-[#181a22]
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
                    w-7
                    h-7
                    rounded-lg
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
                  "
                >
                  {website}
                </h1>

                <p
                  className={`
                    text-sm
                    mt-1
                    transition-all
                    ${
                      shieldsEnabled
                        ? "text-gray-400"
                        : "text-red-400"
                    }
                  `}
                >

                  {
                    shieldsEnabled
                      ? "Shields up for this site"
                      : "Shields are disabled"
                  }

                </p>

              </div>

            </div>

            {/* Shields Toggle */}
            <div
              onClick={toggleShields}
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
                    : "bg-[#2b2d37]"
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

        {/* Counter */}
        <div className="px-5">

          <div
            className="
              rounded-[28px]
              border
              border-[#20222c]
              bg-[#151720]
              py-8
              text-center
            "
          >

            <div
              className="
                text-[64px]
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
        <div className="px-5 mt-4">

          <div
            className="
              rounded-[28px]
              border
              border-[#20222c]
              bg-[#151720]
              px-6
              py-6
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <h2
                  className="
                    text-[18px]
                    font-semibold
                    text-white
                  "
                >
                  Privacy Relay
                </h2>

                <p
                  className={`
                    text-sm
                    mt-2
                    transition-all
                    ${
                      relayEnabled
                        ? "text-gray-400"
                        : "text-red-400"
                    }
                  `}
                >

                  {
                    relayEnabled
                      ? "Protected browsing active"
                      : "Protected browsing disabled"
                  }

                </p>

              </div>

              {/* Relay Toggle */}
              <div
                onClick={toggleRelay}
                className={`
                  w-14
                  h-8
                  rounded-full
                  relative
                  cursor-pointer
                  transition-all
                  ${
                    relayEnabled
                      ? "bg-[#5b4dff]"
                      : "bg-[#2b2d37]"
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
                      relayEnabled
                        ? "right-1"
                        : "left-1"
                    }
                  `}
                />

              </div>

            </div>

          </div>

        </div>

        {/* ONLY ONE ADVANCED OPTIONS */}
        <div className="px-5 mt-4">

          <AdvancedOptions
            shieldsEnabled={
              shieldsEnabled
            }
          />

        </div>

        {/* Footer */}
        <div
          className="
            border-t
            border-[#1f212b]
            mt-4
            px-5
            py-5
            text-center
          "
        >

          <p
            className="
              text-xs
              text-gray-500
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