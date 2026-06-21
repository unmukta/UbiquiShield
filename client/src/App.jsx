import {

  useEffect,
  useState

} from "react"

import {

  Shield,
  ChevronDown,
  ChevronUp,
  Settings2,
  Lock,
  Cookie,
  Fingerprint,
  Code2

} from "lucide-react"

function App() {

  const [

    website,
    setWebsite

  ] = useState("Loading...")

  const [

    favicon,
    setFavicon

  ] = useState("icons/icon128.png")

const [
  shieldsEnabled,
  setShieldsEnabled
] = useState(true)

const [
  hostname,
  setHostname
] = useState("")

  const [

    blockedCount,
    setBlockedCount

  ] = useState(0)

  const [

    advancedOpen,
    setAdvancedOpen

  ] = useState(false)

  const [

    settings,
    setSettings

  ] = useState({

    trackerBlocking: true,

    httpsUpgrade: true,

    scriptBlocking: false,

    fingerprintProtection: true,

    thirdPartyCookies: true

  })

  // =========================
  // WEBSITE INFO
  // =========================

  useEffect(() => {

    if (

      typeof chrome !== "undefined" &&
      chrome.tabs

    ) {

    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs) => {
        let currentHost = ""
        if (tabs && tabs[0]) {
          if (tabs[0].url) {
            try {
              const url = new URL(tabs[0].url)
              if (url.protocol !== "http:" && url.protocol !== "https:") {
                setWebsite("Unsupported Page")
                setHostname("")
              } else {
                currentHost = url.hostname
                setWebsite(currentHost.replace("www.", ""))
                setHostname(currentHost)
              }
            } catch {
              setWebsite("Unknown")
              setHostname("")
            }
          }
          if (tabs[0].favIconUrl) {
            setFavicon(tabs[0].favIconUrl)
          }
        }

        chrome.storage.local.get(
          ["settings", "siteSettings", "blockedCount"],
          (result) => {
            if (result.settings) {
              setSettings(result.settings)
            }
            if (result.blockedCount !== undefined) {
              setBlockedCount(result.blockedCount)
            }
            // Sync per-site shield state
            if (currentHost && result.siteSettings) {
              let siteEnabled = true;
              const parts = currentHost.split('.');
              for (let i = 0; i < parts.length; i++) {
                const domainToCheck = parts.slice(i).join('.');
                if (!domainToCheck.includes('.') && parts.length > 1) continue;
                if (result.siteSettings[domainToCheck] === true) {
                  siteEnabled = true;
                  break;
                } else if (result.siteSettings[domainToCheck] === false) {
                  siteEnabled = false;
                  break;
                }
              }
              setShieldsEnabled(siteEnabled)
            }
          }
        )
      }
    )

    }

  }, [])

  // =========================
  // LIVE UPDATE
  // =========================

  useEffect(() => {

    const listener = (changes) => {
      if (changes.blockedCount) {
        setBlockedCount(changes.blockedCount.newValue)
      }
    }

    chrome.storage.onChanged.addListener(listener)

    // Poll background script
    // to get fresh matched rules
    // while popup is open
    const interval =
      setInterval(() => {

        if (chrome.runtime) {

          chrome.runtime
            .sendMessage({
              action:
                "updateCounter"
            })

        }

      }, 1000)

    // Initial poll
    if (chrome.runtime) {
      chrome.runtime.sendMessage({
        action: "updateCounter"
      })
    }

    return () => {

      chrome.storage.onChanged
        .removeListener(
          listener
        )

      clearInterval(interval)

    }

  }, [])

// =========================
// MASTER TOGGLE
// =========================

  function toggleShield() {

    const updated =
      !shieldsEnabled

    setShieldsEnabled(
      updated
    )

    if (
      hostname &&
      chrome.runtime
    ) {

      chrome.runtime.sendMessage(
        {
          action: "toggleSite",
          hostname,
          enabled: updated
        },
        () => {
          chrome.tabs.reload()
        }
      )

    }

  }

  // =========================
  // OPTION TOGGLE
  // =========================

  function toggleSetting(key) {

    const updated = {

      ...settings,

      [key]:
        !settings[key]

    }

    setSettings(updated)

    chrome.storage.local.set({

      settings:
        updated

    }, () => {
      // Critical settings need a page reload to take effect
      const criticalSettings = [
        "trackerBlocking",
        "fingerprintProtection",
        "scriptBlocking",
        "httpsUpgrade"
      ];
      if (criticalSettings.includes(key)) {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          (tabs) => {
            if (tabs && tabs[0]) {
              chrome.tabs.reload(tabs[0].id);
            }
          }
        );
      }
    })

  }

  return (

    <div
      className="
        w-[320px]
        bg-[#0d0e16]
        text-white
        overflow-hidden
        border
        border-white/5
        rounded-[28px]
      "
    >

      {/* HEADER */}

      <div
        className="
          px-5
          pt-5
          pb-4
          flex
          items-center
          justify-between
        "
      >

        <div className="flex items-center gap-4 min-w-0">

          {/* WEBSITE ICON */}

          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-[#171924]
              flex
              items-center
              justify-center
              shrink-0
              overflow-hidden
            "
          >

            <img

              src={favicon}

              alt="favicon"

              className="
                w-7
                h-7
                object-contain
              "

              onError={(e) => {

                e.target.src =
                  "icons/icon128.png"

              }}

            />

          </div>

          {/* WEBSITE INFO */}

          <div className="min-w-0">

            <h1
              className="
                text-[16px]
                font-semibold
                truncate
              "
            >

              {website}

            </h1>

            <p
              className={`
                text-sm
                mt-1
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
                  : "Shields down for this site"

              }

            </p>

          </div>

        </div>

        {/* TOGGLE */}

        <button

          onClick={
            toggleShield
          }

          className={`
            w-16
            h-9
            rounded-full
            transition-all
            relative
            shrink-0
            ${
              shieldsEnabled
                ? "bg-[#6d5cff]"
                : "bg-[#3b3d49]"
            }
          `}
        >

          <div
            className={`
              w-7
              h-7
              rounded-full
              bg-white
              absolute
              top-1
              transition-all
              ${
                shieldsEnabled
                  ? "right-1"
                  : "left-1"
              }
            `}
          />

        </button>

      </div>

      {/* BLOCK CARD */}

      <div className="px-5 pb-5">

        <div
          className="
            bg-[#131520]
            rounded-[30px]
            py-12
            border border-white/[0.04]
            text-center
          "
        >

          <h2
            className="
              text-7xl
              font-bold
              tracking-tight
            "
          >

            {blockedCount}

          </h2>

          <p
            className="
              text-gray-300
              mt-4
              text-sm
            "
          >

            trackers, ads,
            and more blocked

          </p>

        </div>

      </div>

      {/* ADVANCED OPTIONS */}

      <div
        className="
          border-t
          border-white/[0.04]
        "
      >

        <button

          onClick={() =>
            setAdvancedOpen(
              !advancedOpen
            )
          }

          className="
            w-full
            px-5
            py-5
            flex
            items-center
            justify-between
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-[#171924]
                flex
                items-center
                justify-center
                shrink-0
              "
            >

              <Settings2
                size={22}
                className="
                  text-gray-300
                "
              />

            </div>

            <div className="text-left">

              <h2
                className="
                  text-[15px]
                  font-semibold
                "
              >

                Advanced Options

              </h2>

              <p
                className="
                  text-xs
                  text-gray-400
                  mt-1
                "
              >

                Privacy and protection controls

              </p>

            </div>

          </div>

          {

            advancedOpen

              ? <ChevronUp size={22} />

              : <ChevronDown size={22} />

          }

        </button>

        {

          advancedOpen && (

            <div
              className="
                border-t
                border-white/[0.04]
                px-5
                py-5
                space-y-5
              "
            >

              <OptionRow
                icon={<Shield size={18} />}
                label="Block trackers & ads"
                enabled={settings.trackerBlocking}
                onClick={() =>
                  toggleSetting(
                    "trackerBlocking"
                  )
                }
              />

              <OptionRow
                icon={<Lock size={18} />}
                label="Upgrade HTTPS"
                enabled={settings.httpsUpgrade}
                onClick={() =>
                  toggleSetting(
                    "httpsUpgrade"
                  )
                }
              />

              <OptionRow
                icon={<Code2 size={18} />}
                label="Block scripts"
                enabled={settings.scriptBlocking}
                onClick={() =>
                  toggleSetting(
                    "scriptBlocking"
                  )
                }
              />

              <OptionRow
                icon={<Fingerprint size={18} />}
                label="Block fingerprinting"
                enabled={settings.fingerprintProtection}
                onClick={() =>
                  toggleSetting(
                    "fingerprintProtection"
                  )
                }
              />

              <OptionRow
                icon={<Cookie size={18} />}
                label="Block third-party cookies"
                enabled={settings.thirdPartyCookies}
                onClick={() =>
                  toggleSetting(
                    "thirdPartyCookies"
                  )
                }
              />

            </div>

          )

        }

      </div>

      {/* FOOTER */}

      <div
        className="
          border-t
          border-white/[0.04]
          px-5
          py-5
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

          If this site seems broken,
          try turning protection off.

        </p>

      </div>

    </div>

  )

}

// =========================
// OPTION ROW
// =========================

function OptionRow({

  icon,
  label,
  enabled,
  onClick

}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        gap-4
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
          min-w-0
        "
      >

        <div
          className="
            text-gray-300
            shrink-0
          "
        >

          {icon}

        </div>

        <span
          className="
            text-[15px]
            text-white
          "
        >

          {label}

        </span>

      </div>

      <button

        onClick={onClick}

        className={`
          w-14
          h-8
          rounded-full
          transition-all
          relative
          shrink-0
          ${
            enabled
              ? "bg-[#6d5cff]"
              : "bg-[#3b3d49]"
          }
        `}

      >

        <div
          className={`
            w-6
            h-6
            rounded-full
            bg-white
            absolute
            top-1
            transition-all
            ${
              enabled
                ? "right-1"
                : "left-1"
            }
          `}
        />

      </button>

    </div>

  )

}

export default App