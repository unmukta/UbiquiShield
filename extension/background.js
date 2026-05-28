console.log(
  "Ubiqui_Shield background active"
)

// =========================
// DEFAULT SETTINGS
// =========================

const defaultSettings = {

  trackerBlocking: true,

  httpsUpgrade: true,

  scriptBlocking: false,

  fingerprintProtection: true,

  thirdPartyCookies: true

}

let currentWebsite = ""

// =========================
// INSTALL
// =========================

chrome.runtime.onInstalled
  .addListener(() => {

    console.log(
      "Ubiqui_Shield installed"
    )

    chrome.storage.local.set({

      blockedCount: 0,

      detectedTrackers: [],

      settings:
        defaultSettings

    })

    applyProtectionRules()

  })

// =========================
// RULESET CONTROL
// =========================

async function applyProtectionRules() {

  chrome.storage.local.get(
    ["settings"],
    async (result) => {

      const settings = {

        ...defaultSettings,

        ...(result.settings || {})

      }

      if (
        settings.trackerBlocking
      ) {

        await chrome
          .declarativeNetRequest
          .updateEnabledRulesets({

            enableRulesetIds: [
              "ruleset_1"
            ],

            disableRulesetIds: []

          })

        console.log(
          "Tracker blocking ENABLED"
        )

      } else {

        await chrome
          .declarativeNetRequest
          .updateEnabledRulesets({

            disableRulesetIds: [
              "ruleset_1"
            ],

            enableRulesetIds: []

          })

        console.log(
          "Tracker blocking DISABLED"
        )

      }

    }
  )

}

// =========================
// SETTINGS UPDATES
// =========================

chrome.storage.onChanged
  .addListener((
    changes,
    area
  ) => {

    if (
      area === "local" &&
      changes.settings
    ) {

      console.log(
        "Settings updated"
      )

      applyProtectionRules()

    }

  })

// =========================
// TRACK BLOCKED REQUESTS
// =========================

chrome.declarativeNetRequest
  .onRuleMatchedDebug
  .addListener((info) => {

    chrome.storage.local.get(
      ["blockedCount"],
      (result) => {

        const current =
          result.blockedCount || 0

        chrome.storage.local.set({

          blockedCount:
            current + 1

        })

      }
    )

    console.log(
      "BLOCKED:",
      info.request.url
    )

  })

// =========================
// RESET WEBSITE DATA
// =========================

function resetWebsiteStats(
  hostname
) {

  currentWebsite =
    hostname

  chrome.storage.local.set({

    blockedCount: 0,

    detectedTrackers: []

  })

  console.log(
    "Website changed:",
    hostname
  )

}

// =========================
// TAB SWITCH
// =========================

chrome.tabs.onActivated
  .addListener(() => {

    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      (tabs) => {

        if (
          !tabs ||
          !tabs[0] ||
          !tabs[0].url
        ) {
          return
        }

        try {

          const url =
            new URL(
              tabs[0].url
            )

          const hostname =
            url.hostname

          if (
            hostname !==
            currentWebsite
          ) {

            resetWebsiteStats(
              hostname
            )

          }

        } catch {

          console.log(
            "Tab parse failed"
          )

        }

      }
    )

  })

// =========================
// PAGE RELOAD
// =========================

chrome.tabs.onUpdated
  .addListener((
    tabId,
    changeInfo,
    tab
  ) => {

    if (
      changeInfo.status ===
        "loading" &&
      tab.active &&
      tab.url
    ) {

      try {

        const url =
          new URL(tab.url)

        const hostname =
          url.hostname

        if (
          hostname !==
            currentWebsite
        ) {

          resetWebsiteStats(
            hostname
          )

        }

      } catch {

        console.log(
          "Reload parse failed"
        )

      }

    }

  })