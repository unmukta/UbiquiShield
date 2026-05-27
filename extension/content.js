console.log(
  "Ubiqui_Shield content script active"
)

const detectedTrackers = []

// ALL scripts
document
  .querySelectorAll("script")
  .forEach((script) => {

    const src = (
      script.src || ""
    ).toLowerCase()

    // Google Analytics
    if (
      src.includes("google-analytics") ||
      src.includes("googletagmanager") ||
      src.includes("gtag")
    ) {

      detectedTrackers.push(
        "Google Analytics"
      )

    }

    // DoubleClick
    if (
      src.includes("doubleclick")
    ) {

      detectedTrackers.push(
        "DoubleClick"
      )

    }

    // Facebook
    if (
      src.includes("facebook") ||
      src.includes("connect.facebook.net")
    ) {

      detectedTrackers.push(
        "Facebook Tracker"
      )

    }

    // Hotjar
    if (
      src.includes("hotjar")
    ) {

      detectedTrackers.push(
        "Hotjar"
      )

    }

  })

// Remove duplicates
const uniqueTrackers = [
  ...new Set(detectedTrackers)
]

// Save
chrome.storage.local.set({

  detectedTrackers:
    uniqueTrackers

})

console.log(
  "TRACKERS:",
  uniqueTrackers
)