import { useState } from "react"

import {
  ChevronDown,
  ChevronRight,
  Shield,
  Fingerprint,
  Cookie,
  Code,
  Lock
} from "lucide-react"

function AdvancedOptions() {

  const [expanded, setExpanded] =
    useState(false)

  const [
    blockScripts,
    setBlockScripts
  ] = useState(false)

  const [
    fingerprint,
    setFingerprint
  ] = useState(true)

  return (

    <div
      className="
        border-t
        border-[#23252d]
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
          px-5
          py-4
          transition-colors
          duration-200
          hover:bg-[#141620]
        "
      >

        <div className="flex items-center gap-3">

          <Shield
            size={18}
            className="
              text-gray-300
            "
          />

          <span
            className="
              text-white
              text-[16px]
              font-medium
            "
          >
            Advanced options
          </span>

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

      {/* Animated Expand */}
      <div
        className={`
          overflow-hidden
          transition-all
          duration-300
          ease-in-out
          ${
            expanded
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0"
          }
        `}
      >

        <div
          className="
            border-t
            border-[#23252d]
            px-5
            py-3
          "
        >

          <div className="space-y-1">

            {/* Row */}
            <SettingRow

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

              right="
                Aggressive
              "

              dropdown

            />

            {/* Row */}
            <SettingRow

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

              right="
                Standard
              "

              dropdown

            />

            {/* Toggle Row */}
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
                blockScripts
              }

              setEnabled={
                setBlockScripts
              }

            />

            {/* Toggle Row */}
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
                fingerprint
              }

              setEnabled={
                setFingerprint
              }

              arrow

            />

            {/* Row */}
            <SettingRow

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

              right="
                Cross-site
              "

              dropdown

            />

          </div>

        </div>

      </div>

    </div>

  )

}

function toggleTrackerBlocking(
  enabled
) {

  chrome.declarativeNetRequest
    .updateEnabledRulesets({

      disableRulesetIds:
        enabled
          ? []
          : ["ruleset_1"],

      enableRulesetIds:
        enabled
          ? ["ruleset_1"]
          : []

    })

}

/* SETTINGS ROW */

function SettingRow({

  icon,
  label,
  right,
  dropdown

}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        py-3
        px-2
        rounded-xl
        transition-colors
        duration-200
        hover:bg-[#171922]
      "
    >

      <div className="flex items-center gap-3">

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

      <div className="flex items-center gap-2">

        <span
          className="
            text-gray-400
            text-sm
          "
        >
          {right}
        </span>

        {dropdown && (

          <ChevronDown
            size={16}
            className="
              text-gray-500
            "
          />

        )}

      </div>

    </div>

  )

}

/* TOGGLE ROW */

function ToggleRow({

  icon,
  label,
  enabled,
  setEnabled,
  arrow

}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        py-3
        px-2
        rounded-xl
        transition-colors
        duration-200
        hover:bg-[#171922]
      "
    >

      <div className="flex items-center gap-3">

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

      <div className="flex items-center gap-3">

        {arrow && (

          <ChevronRight
            size={16}
            className="
              text-gray-500
            "
          />

        )}

        <div
          onClick={() =>
            setEnabled(
              !enabled
            )
          }
          className={`
            w-11
            h-6
            rounded-full
            relative
            cursor-pointer
            transition-all
            duration-200
            ${
              enabled
                ? "bg-[#5b4dff]"
                : "bg-[#3a3b45]"
            }
          `}
        >

          <div
            className={`
              absolute
              top-[2px]
              w-5
              h-5
              rounded-full
              bg-white
              transition-all
              duration-200
              ${
                enabled
                  ? "right-[2px]"
                  : "left-[2px]"
              }
            `}
          />

        </div>

      </div>

    </div>

  )

}

export default AdvancedOptions