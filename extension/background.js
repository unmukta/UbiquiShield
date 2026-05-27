let shieldsEnabled = true

let currentWebsite = ""

console.log(
  "Ubiqui_Shield background active"
)

// ENABLE / DISABLE RULESETS
async function updateShieldRules() {

  if (shieldsEnabled) {

    // ENABLE blocking rules
    await chrome.declarativeNetRequest
      .updateEnabledRulesets({

        enableRulesetIds: ["ruleset_1"],

        disableRulesetIds: []

      })

    console.log(
      "Blocking ENABLED"
    )

  } else {

    // DISABLE blocking rules
    await chrome.declarativeNetRequest
      .updateEnabledRulesets({

        enableRulesetIds: [],

        disableRulesetIds: ["ruleset_1"]

      })

    console.log(
      "Blocking DISABLED"
    )

  }

}

// Load saved shields state
chrome.storage.local.get(
  ["shieldsEnabled"],
  (result) => {

    if (
      result.shieldsEnabled === false
    ) {

      shieldsEnabled = false

    }

    updateShieldRules()

  }
)

// Install
chrome.runtime.onInstalled.addListener(() => {

  console.log(
    "Ubiqui_Shield installed"
  )

  // Default values
  chrome.storage.local.set({

    shieldsEnabled: true,

    blockedCount: 0,

    detectedTrackers: []

  })

})

// Listen for storage changes
chrome.storage.onChanged.addListener(
  (changes, area) => {

    if (
      area === "local" &&
      changes.shieldsEnabled
    ) {

      shieldsEnabled =
        changes.shieldsEnabled.newValue

      console.log(
        "Shields:",
        shieldsEnabled
          ? "ENABLED"
          : "DISABLED"
      )

      updateShieldRules()

    }

  }
)

// Track blocked requests
chrome.declarativeNetRequest
  .onRuleMatchedDebug
  .addListener((info) => {

    // Stop logic if shields disabled
    if (!shieldsEnabled) {
      return
    }

    // Increment blocked counter
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

    // Tracker detection
    let trackerName =
      "Unknown Tracker"

    const url =
      info.request.url || ""

    if (
      url.includes("doubleclick")
    ) {

      trackerName =
        "DoubleClick"

    } else if (
      url.includes("google-analytics")
    ) {

      trackerName =
        "Google Analytics"

    } else if (
      url.includes("googletagmanager")
    ) {

      trackerName =
        "Google Tag Manager"

    } else if (
      url.includes("facebook")
    ) {

      trackerName =
        "Facebook Tracker"

    } else if (
      url.includes("hotjar")
    ) {

      trackerName =
        "Hotjar"

    }

    // Save detected trackers
    chrome.storage.local.get(
      ["detectedTrackers"],
      (result) => {

        let trackers =
          result.detectedTrackers || []

        // Avoid duplicates
        if (
          !trackers.includes(
            trackerName
          )
        ) {

          trackers.push(
            trackerName
          )

          chrome.storage.local.set({

            detectedTrackers:
              trackers

          })

        }

      }
    )

    console.log(
      "BLOCKED:",
      trackerName,
      info
    )

  })

// Detect active tab changes
chrome.tabs.onActivated.addListener(
  async () => {

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

          // Website changed
          if (
            hostname !== currentWebsite
          ) {

            currentWebsite =
              hostname

            console.log(
              "Website changed:",
              hostname
            )

            // RESET TRACKERS
            chrome.storage.local.set({

              blockedCount: 0,

              detectedTrackers: []

            })

          }

        } catch (error) {

          console.log(
            "Tab parse error"
          )

        }

      }
    )

  }
)

// Detect page updates/reloads
chrome.tabs.onUpdated.addListener(
  (
    tabId,
    changeInfo,
    tab
  ) => {

    if (
      changeInfo.status === "loading" &&
      tab.active &&
      tab.url
    ) {

      try {

        const url =
          new URL(tab.url)

        const hostname =
          url.hostname

        if (
          hostname !== currentWebsite
        ) {

          currentWebsite =
            hostname

          console.log(
            "Reload/new page:",
            hostname
          )

          chrome.storage.local.set({

            blockedCount: 0,

            detectedTrackers: []

          })

        }

      } catch (error) {

        console.log(
          "Update parse error"
        )

      }

    }

  }
)