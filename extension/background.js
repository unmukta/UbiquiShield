let shieldsEnabled = true

console.log(
  "Ubiqui_Shield background active"
)

// Load saved shields state
chrome.storage.local.get(
  ["shieldsEnabled"],
  (result) => {

    if (
      result.shieldsEnabled === false
    ) {

      shieldsEnabled = false

    }

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