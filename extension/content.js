const knownTrackers = [
  "google-analytics",
  "googletagmanager",
  "doubleclick",
  "facebook",
  "hotjar",
  "mixpanel",
  "segment",
  "analytics",
  "tracker",
  "ads"
]

const detectedTrackers = []

// Scan all scripts
const scripts = document.querySelectorAll("script")

scripts.forEach((script) => {

  const src = (script.src || "").toLowerCase()

  for (const tracker of knownTrackers) {

    if (src.includes(tracker)) {

      if (!detectedTrackers.includes(tracker)) {
        detectedTrackers.push(tracker)
      }

    }

  }

})

// Save trackers
chrome.storage.local.set({
  trackers: detectedTrackers
})

console.log("Detected trackers:", detectedTrackers)