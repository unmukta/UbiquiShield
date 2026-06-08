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
      chrome.declarativeNetRequest.setExtensionActionOptions({ displayActionCountAsBadgeText: true })
      chrome.storage.local.set({
        blockedCount: 0,
        detectedTrackers: [],
        settings: defaultSettings,
        siteSettings: {}
      }, () => {
        applyProtectionRules()
      })
    } else if (details.reason === "update") {
      chrome.declarativeNetRequest.setExtensionActionOptions({ displayActionCountAsBadgeText: true })
      chrome.storage.local.get(["settings"], (res) => {
        const mergedSettings = { ...defaultSettings, ...(res.settings || {}) }
        chrome.storage.local.set({
          settings: mergedSettings,
          blockedCount: 0,
          detectedTrackers: []
        }, () => {
          applyProtectionRules()
        })
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

      if (settings.trackerBlocking) {
        await chrome.declarativeNetRequest.updateEnabledRulesets({
          enableRulesetIds: ["ruleset_1"],
          disableRulesetIds: []
        })
        console.log("Tracker blocking ENABLED")
      } else {
        await chrome.declarativeNetRequest.updateEnabledRulesets({
          disableRulesetIds: ["ruleset_1"],
          enableRulesetIds: []
        })
        console.log("Tracker blocking DISABLED")
      }

      // Add dynamic rules to whitelist disabled sites
      const explicitlyEnabled = Object.keys(siteSettings)
        .filter(domain => siteSettings[domain] === true)

      const disabledDomains = Object.keys(siteSettings)
        .filter(domain => siteSettings[domain] === false)
        .slice(0, chrome.declarativeNetRequest.MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES - 1)

      let dynamicRules = disabledDomains.map((domain, index) => {
        const excluded = explicitlyEnabled.filter(e => e.endsWith('.' + domain))
        return {
          id: index + 100000,
          priority: 100,
          action: { type: "allowAllRequests" },
          condition: { 
            initiatorDomains: [domain],
            ...(excluded.length > 0 ? { excludedInitiatorDomains: excluded } : {})
          }
        }
      })

      // Fingerprinting Header Spoofing (Chrome 120 / Windows)
      if (settings.fingerprintProtection !== false) {
        dynamicRules.push({
          id: 99990,
          priority: 150,
          action: {
            type: "modifyHeaders",
            requestHeaders: [
              { header: "User-Agent", operation: "set", value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
              { header: "Sec-CH-UA", operation: "set", value: '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"' },
              { header: "Sec-CH-UA-Platform", operation: "set", value: '"Windows"' },
              { header: "Accept-Language", operation: "set", value: "en-US,en;q=0.9" }
            ]
          },
          condition: { resourceTypes: ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "other"] }
        });

        // EFF Tracker Blocking
        dynamicRules.push({
          id: 99991,
          priority: 200,
          action: { type: "block" },
          condition: { urlFilter: "trackertest.org", resourceTypes: ["script", "xmlhttprequest", "image", "sub_frame"] }
        });
        dynamicRules.push({
          id: 99992,
          priority: 200,
          action: { type: "block" },
          condition: { urlFilter: "alooodo.com", resourceTypes: ["script", "xmlhttprequest", "image", "sub_frame"] }
        });
      }

      // Configure HTTPS Upgrade
      if (settings.httpsUpgrade) {
        dynamicRules.push({
          id: 99999,
          priority: 50,
          action: { type: "upgradeScheme" },
          condition: { 
            urlFilter: "|http://*", 
            resourceTypes: ["main_frame", "sub_frame"] 
          }
        });
      }

      // Configure Strict URL Tracking Parameter Stripping
      if (settings.trackerBlocking) {
        dynamicRules.push({
          id: 99998,
          priority: 40,
          action: {
            type: "redirect",
            redirect: {
              transform: {
                queryTransform: {
                  removeParams: [
                    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_name",
                    "fbclid", "gclid", "msclkid", "mc_eid", "igshid", "yclid", "_openstat", "wickedid",
                    "otc", "oly_enc_id", "oly_anon_id", "rb_clickid", "wbraid", "gbraid", "twclid",
                    "s_cid", "mkt_tok", "zanpid", "cx_cmp"
                  ]
                }
              }
            }
          },
          condition: {
            resourceTypes: ["main_frame", "sub_frame"]
          }
        });
      }

      // Clear previous dynamic rules and add new ones
      const oldRules = await chrome.declarativeNetRequest.getDynamicRules()
      const oldRuleIds = oldRules.map(rule => rule.id)

      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: oldRuleIds,
        addRules: dynamicRules
      })

      // Configure WebRTC IP Leak Protection
      if (chrome.privacy && chrome.privacy.network) {
        const isProtected = settings.fingerprintProtection !== false;
        const policy = isProtected ? "default_public_interface_only" : "default";
        chrome.privacy.network.webRTCIPHandlingPolicy.set({
          value: policy
        });
        console.log("WebRTC Policy:", policy);
      }

      // Manage injected.js dynamically to prevent DOM Event Hijacking
      const excludeMatches = [];
      const isIP = (str) => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(str);
      disabledDomains.forEach(d => {
        excludeMatches.push(`*://${d}/*`);
        if (!isIP(d) && d !== "localhost") {
          excludeMatches.push(`*://*.${d}/*`);
        }
      });
      
      const isProtected = settings.fingerprintProtection !== false;

      chrome.scripting.getRegisteredContentScripts({ ids: ["injected_spoofing"] }, (scripts) => {
        if (!isProtected) {
          if (scripts && scripts.length > 0) {
            chrome.scripting.unregisterContentScripts({ ids: ["injected_spoofing"] });
          }
          return;
        }

        if (scripts && scripts.length > 0) {
          chrome.scripting.updateContentScripts([{
            id: "injected_spoofing",
            excludeMatches: excludeMatches.length > 0 ? excludeMatches : []
          }]);
        } else {
          chrome.scripting.registerContentScripts([{
            id: "injected_spoofing",
            matches: ["<all_urls>"],
            excludeMatches: excludeMatches.length > 0 ? excludeMatches : [],
            js: ["injected.js"],
            runAt: "document_start",
            world: "MAIN",
            allFrames: true,
            matchOriginAsFallback: true
          }]);
        }
      });

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

    const count = result.rulesMatchedInfo.length

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].id === tabId) {
        chrome.storage.local.set({
          blockedCount: count >= 100 ? "100+" : count
        })
      }
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
      (changeInfo.status === "loading" || changeInfo.url) &&
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
  (request, sender, sendResponse) => {

    if (request.action === "reportTrackers") {
      if (sender.tab && sender.tab.id) {
        const tabId = sender.tab.id
        tabTrackers[tabId] = request.trackers
        
        // Sync active tab trackers to global storage instantly
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs && tabs[0] && tabs[0].id === tabId) {
            chrome.storage.local.set({
              detectedTrackers: request.trackers
            })
          }
        })
      }
      sendResponse({ success: true })
      return true
    }

    if (request.action === "updateCounter") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0] && tabs[0].id) {
          updateBlockedCount(tabs[0].id)
        }
        sendResponse({ success: true })
      })
      return true
    }

    if (request.action === "toggleSite") {
      chrome.storage.local.get(["siteSettings"], (result) => {
        const sites = result.siteSettings || {}
        sites[request.hostname] = request.enabled
        chrome.storage.local.set({ siteSettings: sites }, () => {
          sendResponse({ success: true })
        })
      })
      return true
    }

  }
)
