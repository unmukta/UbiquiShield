import { useEffect, useState } from "react"
import { ShieldCheck } from "lucide-react"

function WebsiteStatusCard() {

  const [website, setWebsite] = useState("Unknown")

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

          if (tabs && tabs[0] && tabs[0].url) {

            try {

              const url = new URL(tabs[0].url)

              setWebsite(
                url.hostname.replace("www.", "")
              )

            } catch (error) {

              setWebsite("Unknown")
            }
          }
        }
      )

    } else {

      // Fallback for localhost/dev mode
      setWebsite(window.location.hostname)

    }

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

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-base font-semibold text-white">
            Current Website
          </h2>

          <p className="text-gray-400 mt-2 text-sm">
            {website}
          </p>

        </div>

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
            className="text-green-300"
            size={26}
          />

        </div>

      </div>

      <div className="mt-6">

        <div className="flex items-center gap-3">

          <div
            className="
              w-2.5
              h-2.5
              rounded-full
              bg-green-300
            "
          />

          <span className="text-green-300 text-sm font-medium">
            Secure Connection
          </span>

        </div>

        <p className="text-gray-400 mt-3 text-sm">
          Live website monitoring is active.
        </p>

      </div>

    </div>

  )
}

export default WebsiteStatusCard