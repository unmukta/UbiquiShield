import { useEffect, useState } from "react"

import {
  ShieldCheck
} from "lucide-react"

function WebsiteStatusCard() {

  const [website, setWebsite] =
    useState("Unknown")

  const [secure, setSecure] =
    useState(true)

  useEffect(() => {

    // Chrome Extension Environment
    if (
      typeof chrome !== "undefined" &&
      chrome.tabs
    ) {

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

              const host =
                url.hostname.replace(
                  "www.",
                  ""
                )

              setWebsite(host)

              setSecure(
                url.protocol ===
                  "https:"
              )

            } catch {

              setWebsite(
                "Unknown"
              )

            }

          }

        }
      )

    } else {

      // Dev Mode Fallback
      setWebsite(
        window.location.hostname
      )

    }

  }, [])

  return (

    <div
      className="
        rounded-2xl
        border
        border-white/5
        bg-[#2a2a2d]
        p-5
      "
    >

      {/* Top */}
      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h2
            className="
              text-base
              font-semibold
              text-white
            "
          >
            Current Website
          </h2>

          <p
            className="
              text-gray-400
              mt-2
              text-sm
            "
          >
            {website}
          </p>

        </div>

        {/* Icon */}
        <div
          className="
            w-14
            h-14
            rounded-2xl
            flex
            items-center
            justify-center
            bg-[#3b3b40]
          "
        >

          <ShieldCheck
            className={
              secure
                ? "text-green-300"
                : "text-red-400"
            }
            size={26}
          />

        </div>

      </div>

      {/* Bottom */}
      <div className="mt-6">

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className={`
              w-2.5
              h-2.5
              rounded-full
              ${
                secure
                  ? "bg-green-300"
                  : "bg-red-400"
              }
            `}
          />

          <span
            className={`
              text-sm
              font-medium
              ${
                secure
                  ? "text-green-300"
                  : "text-red-400"
              }
            `}
          >
            {
              secure
                ? "Secure Connection"
                : "Unsecured Connection"
            }
          </span>

        </div>

        <p
          className="
            text-gray-400
            mt-3
            text-sm
          "
        >
          {
            secure
              ? "Live website monitoring is active."
              : "This website is not using HTTPS."
          }
        </p>

      </div>

    </div>

  )

}

export default WebsiteStatusCard