function PrivacyRelayCard({

  relayEnabled,
  setRelayEnabled

}) {

  return (

    <div
      className="
        bg-[#16171f]
        border border-[#23252d]
        rounded-[28px]
        p-5
      "
    >

      <div className="flex items-start justify-between">

        {/* Left */}
        <div>

          <h2
            className="
              text-white
              text-[18px]
              font-semibold
            "
          >
            Privacy Relay
          </h2>

          <p
            className="
              text-sm
              text-gray-400
              mt-1
            "
          >
            Protected browsing active
          </p>

        </div>

        {/* Toggle */}
        <div
          onClick={() =>
            setRelayEnabled(
              !relayEnabled
            )
          }
          className={`
            w-12
            h-7
            rounded-full
            relative
            cursor-pointer
            transition-all
            ${
              relayEnabled
                ? "bg-[#5b4dff]"
                : "bg-[#2a2b35]"
            }
          `}
        >

          <div
            className={`
              absolute
              top-1
              w-5
              h-5
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

  )

}

export default PrivacyRelayCard