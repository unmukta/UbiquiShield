import {
  Cloud,
  ShieldCheck
} from "lucide-react"

function PrivacyRelayCard({

  relayEnabled,
  setRelayEnabled

}) {

  return (

    <div
      className="
        rounded-[30px]
        border border-[#23252d]
        bg-[#15161d]
        p-6
      "
    >

      {/* Circle */}
      <div className="flex justify-center">

        <div
          className={`
            w-[170px]
            h-[170px]
            rounded-full
            border-[6px]
            flex
            items-center
            justify-center
            transition-all
            ${
              relayEnabled
                ? "border-[#ff7a1a]"
                : "border-[#2a2b35]"
            }
          `}
        >

          <div
            className={`
              w-[120px]
              h-[120px]
              rounded-full
              flex
              items-center
              justify-center
              ${
                relayEnabled
                  ? "bg-[#ff7a1a]"
                  : "bg-[#2a2b35]"
              }
            `}
          >

            <div className="relative">

              <Cloud
                size={52}
                className="
                  text-white
                "
              />

              <ShieldCheck
                size={22}
                className="
                  text-white
                  absolute
                  -bottom-1
                  -right-2
                "
              />

            </div>

          </div>

        </div>

      </div>

      {/* Status */}
      <div className="mt-6 text-center">

        <h2
          className="
            text-white
            text-5xl
            font-semibold
            tracking-tight
          "
        >
          {
            relayEnabled
              ? "Connected"
              : "Disconnected"
          }
        </h2>

        <p
          className="
            text-gray-400
            text-lg
            mt-3
          "
        >
          {
            relayEnabled
              ? "Your Internet is private."
              : "Protection is disabled."
          }
        </p>

      </div>

      {/* Button */}
      <div className="mt-8 flex justify-center">

        <button
          onClick={() =>
            setRelayEnabled(
              !relayEnabled
            )
          }
          className={`
            px-8
            py-3
            rounded-2xl
            text-lg
            font-medium
            transition-all
            ${
              relayEnabled
                ? `
                  bg-[#1f2028]
                  text-[#ff5f6d]
                  border border-[#2a2b35]
                `
                : `
                  bg-[#5b4dff]
                  text-white
                `
            }
          `}
        >

          {
            relayEnabled
              ? "Disconnect"
              : "Connect"
          }

        </button>

      </div>

    </div>

  )

}

export default PrivacyRelayCard