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
const tabTimestamps = {}

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

// Real-time logging (dev only)
if (
  chrome.declarativeNetRequest
    .onRuleMatchedDebug
) {

  chrome.declarativeNetRequest
    .onRuleMatchedDebug
    .addListener((info) => {

      console.log(
        "BLOCKED:",
        info.request.url
      )

    })

}

// Production-safe counter
async function updateBlockedCount(
  tabId
) {

  try {

    const minTime =
      tabTimestamps[tabId] ||
      Date.now() - 60000

    const result =
      await chrome
        .declarativeNetRequest
        .getMatchedRules({
          tabId,
          minTimeStamp: minTime
        })

    chrome.storage.local.set({

      blockedCount:
        result
          .rulesMatchedInfo
          .length

    })

  } catch {

    // API unavailable

  }

}

// =========================
// RESET WEBSITE DATA
// =========================

function resetWebsiteStats(
  hostname,
  tabId
) {

  currentWebsite =
    hostname

  if (tabId) {

    tabTimestamps[tabId] =
      Date.now()

  }

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
              hostname,
              tabs[0].id
            )

          }

          updateBlockedCount(
            tabs[0].id
          )

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
            hostname,
            tabId
          )

        }

      } catch {

        console.log(
          "Reload parse failed"
        )

      }

    }

    if (
      changeInfo.status ===
        "complete" &&
      tab.active
    ) {

      updateBlockedCount(
        tabId
      )

    }

  })

chrome.tabs.onRemoved
  .addListener((tabId) => {

    delete tabTimestamps[tabId]

  })

  async function getSiteSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(
      ["siteSettings"],
      (result) => {
        resolve(result.siteSettings || {})
      }
    )
  })
}

async function saveSiteSettings(settings) {
  return new Promise((resolve) => {
    chrome.storage.local.set(
      {
        siteSettings: settings
      },
      resolve
    )
  })
}

async function getCurrentHostname() {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true
  })

  if (!tabs[0]) return null

  try {
    return new URL(tabs[0].url).hostname
  } catch {
    return null
  }
}

async function isProtectionEnabled(hostname) {
  const sites =
    await getSiteSettings()

  if (
    sites[hostname] === false
  ) {
    return false
  }

  return true
}

chrome.runtime.onMessage.addListener(
  (
    request,
    sender,
    sendResponse
  ) => {

    if (
      request.action ===
      "toggleSite"
    ) {

      chrome.storage.local.get(
        ["siteSettings"],
        (result) => {

          const sites =
            result.siteSettings || {}

          sites[
            request.hostname
          ] =
            request.enabled

          chrome.storage.local.set(
            {
              siteSettings:
                sites
            },
            () => {

              sendResponse({
                success: true
              })

            }
          )

        }
      )

      return true
    }

  }
)

