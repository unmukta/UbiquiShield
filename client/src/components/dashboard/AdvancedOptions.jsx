import {
  useEffect,
  useState
} from "react"

import {

  ChevronDown,

  Settings2,

  Fingerprint,

  Cookie,

  Code,

  Lock,

  Shield

} from "lucide-react"

function AdvancedOptions() {

  const [expanded, setExpanded] =
    useState(false)

  const [settings, setSettings] =
    useState({

      trackerBlocking: true,

      httpsUpgrade: true,

      scriptBlocking: false,

      fingerprintProtection: true,

      thirdPartyCookies: true

    })

  // LOAD SETTINGS
  useEffect(() => {

    if (
      typeof chrome === "undefined" ||
      !chrome.storage
    ) {
      return
    }

    chrome.storage.local.get(
      ["settings"],
      (result) => {

        if (
          result.settings
        ) {

          setSettings(
            result.settings
          )

        }

      }
    )

  }, [])

  // SAVE SETTINGS
  function updateSetting(
    key,
    value
  ) {

    const updated = {

      ...settings,

      [key]: value

    }

    setSettings(updated)

    chrome.storage.local.set({

      settings: updated

    })

  }

  return (

    <div
      className="
        rounded-[28px]
        border
        border-[#20222c]
        bg-[#11131a]
        overflow-hidden
      "
    >

      {/* Header */}
      <button
        onClick={() =>
          setExpanded(
            !expanded
          )
        }
        className="
          w-full
          flex
          items-center
          justify-between
          px-6
          py-5
        "
      >

        <div className="flex items-center gap-4">

          <div
            className="
              w-11
              h-11
              rounded-2xl
              bg-[#1b1d27]
              flex
              items-center
              justify-center
            "
          >

            <Settings2
              size={20}
              className="
                text-gray-300
              "
            />

          </div>

          <div className="text-left">

            <h2
              className="
                text-[18px]
                font-semibold
                text-white
              "
            >
              Advanced Options
            </h2>

            <p
              className="
                text-sm
                text-gray-400
                mt-1
              "
            >
              Privacy and protection controls
            </p>

          </div>

        </div>

        <ChevronDown
          size={18}
          className={`
            text-gray-400
            transition-transform
            duration-300
            ${
              expanded
                ? "rotate-180"
                : ""
            }
          `}
        />

      </button>

      {/* Expand */}
      <div
        className={`
          overflow-hidden
          transition-all
          duration-300
          ${
            expanded
              ? "max-h-[600px]"
              : "max-h-0"
          }
        `}
      >

        <div
          className="
            border-t
            border-[#20222c]
            px-5
            py-4
            space-y-2
          "
        >

          {/* TRACKERS */}

          <ToggleRow

            icon={
              <Shield
                size={18}
                className="
                  text-gray-400
                "
              />
            }

            label="
              Block trackers & ads
            "

            enabled={
              settings.trackerBlocking
            }

            onToggle={() =>
              updateSetting(

                "trackerBlocking",

                !settings
                  .trackerBlocking

              )
            }

          />

          {/* HTTPS */}

          <ToggleRow

            icon={
              <Lock
                size={18}
                className="
                  text-gray-400
                "
              />
            }

            label="
              Upgrade connections to HTTPS
            "

            enabled={
              settings.httpsUpgrade
            }

            onToggle={() =>
              updateSetting(

                "httpsUpgrade",

                !settings
                  .httpsUpgrade

              )
            }

          />

          {/* SCRIPT BLOCKING */}

          <ToggleRow

            icon={
              <Code
                size={18}
                className="
                  text-gray-400
                "
              />
            }

            label="
              Block scripts
            "

            enabled={
              settings.scriptBlocking
            }

            onToggle={() =>
              updateSetting(

                "scriptBlocking",

                !settings
                  .scriptBlocking

              )
            }

          />

          {/* FINGERPRINT */}

          <ToggleRow

            icon={
              <Fingerprint
                size={18}
                className="
                  text-gray-400
                "
              />
            }

            label="
              Block fingerprinting
            "

            enabled={
              settings
                .fingerprintProtection
            }

            onToggle={() =>
              updateSetting(

                "fingerprintProtection",

                !settings
                  .fingerprintProtection

              )
            }

          />

          {/* COOKIES */}

          <ToggleRow

            icon={
              <Cookie
                size={18}
                className="
                  text-gray-400
                "
              />
            }

            label="
              Block third-party cookies
            "

            enabled={
              settings
                .thirdPartyCookies
            }

            onToggle={() =>
              updateSetting(

                "thirdPartyCookies",

                !settings
                  .thirdPartyCookies

              )
            }

          />

        </div>

      </div>

    </div>

  )

}

/* TOGGLE ROW */

function ToggleRow({

  icon,

  label,

  enabled,

  onToggle

}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        py-3
        px-2
        rounded-2xl
        transition-colors
        duration-200
        hover:bg-[#181b24]
      "
    >

      <div className="flex items-center gap-4">

        {icon}

        <span
          className="
            text-white
            text-[15px]
          "
        >
          {label}
        </span>

      </div>

      {/* Toggle */}
      <div
        onClick={onToggle}
        className={`
          w-12
          h-7
          rounded-full
          relative
          cursor-pointer
          transition-all
          duration-200
          ${
            enabled
              ? "bg-[#5b4dff]"
              : "bg-[#343641]"
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
            duration-200
            ${
              enabled
                ? "right-1"
                : "left-1"
            }
          `}
        />

      </div>

    </div>

  )

}

export default AdvancedOptions