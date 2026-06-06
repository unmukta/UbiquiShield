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

const tabHostnames = {}
const tabTimestamps = {}
const tabTrackers = {}

// =========================
// INSTALL
// =========================

chrome.runtime.onInstalled
  .addListener((details) => {

    console.log(
      "Ubiqui_Shield installed, reason:", details.reason
    )

    if (details.reason === "install") {
      chrome.storage.local.set({
        blockedCount: 0,
        detectedTrackers: [],
        settings: defaultSettings,
        siteSettings: {}
      })
      applyProtectionRules()
    } else if (details.reason === "update") {
      chrome.storage.local.get(["settings"], (res) => {
        if (!res.settings) {
          chrome.storage.local.set({ settings: defaultSettings })
        }
        chrome.storage.local.set({
          blockedCount: 0,
          detectedTrackers: []
        })
        applyProtectionRules()
      })
    }

  })

// =========================
// RULESET CONTROL
// =========================

async function applyProtectionRules() {

  chrome.storage.local.get(
    ["settings", "siteSettings"],
    async (result) => {

      const settings = {

        ...defaultSettings,

        ...(result.settings || {})

      }
      
      const siteSettings = result.siteSettings || {}

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

      // Add dynamic rules to whitelist disabled sites
      const disabledDomains = Object.keys(siteSettings).filter(
        domain => siteSettings[domain] === false
      )

      const dynamicRules = disabledDomains.map((domain, index) => ({
        id: index + 100000,
        priority: 100,
        action: { type: "allowAllRequests" },
        condition: { initiatorDomains: [domain] }
      }))

      // Clear previous dynamic rules and add new ones
      const oldRules = await chrome.declarativeNetRequest.getDynamicRules()
      const oldRuleIds = oldRules.map(rule => rule.id)

      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: oldRuleIds,
        addRules: dynamicRules
      })

    }
  )

  // Configure WebRTC IP Leak Protection
  if (chrome.privacy && chrome.privacy.network) {
    chrome.storage.local.get(["settings"], (result) => {
      const isProtected = result.settings?.fingerprintProtection !== false;
      const policy = isProtected ? "default_public_interface_only" : "default";
      chrome.privacy.network.webRTCIPHandlingPolicy.set({
        value: policy
      });
      console.log("WebRTC Policy:", policy);
    });
  }

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
      (changes.settings || changes.siteSettings)
    ) {

      console.log(
        "Settings or siteSettings updated"
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

  tabHostnames[tabId] =
    hostname

  tabTimestamps[tabId] =
    Date.now()

  tabTrackers[tabId] = []

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0] && tabs[0].id === tabId) {
      chrome.storage.local.set({
        blockedCount: 0,
        detectedTrackers: []
      })
    }
  })

  console.log(
    "Website reset for tab:",
    tabId,
    hostname
  )

}

// =========================
// TAB SWITCH
// =========================

chrome.tabs.onActivated
  .addListener(({ tabId }) => {

    chrome.tabs.get(
      tabId,
      (tab) => {

        if (
          !tab ||
          !tab.url
        ) {
          return
        }

        try {

          const url =
            new URL(tab.url)

          const hostname =
            url.hostname

          // If we somehow missed the initial load, set it
          if (!tabHostnames[tabId]) {
            tabHostnames[tabId] = hostname
            tabTimestamps[tabId] = Date.now()
          }

          updateBlockedCount(
            tabId
          )

          chrome.storage.local.set({
            detectedTrackers: tabTrackers[tabId] || []
          })

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
      tab.url
    ) {

      try {

        const url =
          new URL(tab.url)

        const hostname =
          url.hostname

        resetWebsiteStats(
          hostname,
          tabId
        )

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
    delete tabHostnames[tabId]
    delete tabTrackers[tabId]

  })

chrome.runtime.onMessage.addListener(
  (
    request,
    sender,
    sendResponse
  ) => {

    if (
      request.action ===
      "reportTrackers"
    ) {
      if (sender.tab && sender.tab.id) {
        tabTrackers[sender.tab.id] = request.trackers
      }
      sendResponse({ success: true })
      return true
    }

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

    if (
      request.action ===
      "updateCounter"
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
            tabs[0].id
          ) {

            updateBlockedCount(
              tabs[0].id
            )

            chrome.storage.local.set({
              detectedTrackers: tabTrackers[tabs[0].id] || []
            })

          }

          sendResponse({
            success: true
          })

        }
      )

      return true

    }

  }
)

