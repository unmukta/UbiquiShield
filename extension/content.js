const trackers = []

const scripts = document.querySelectorAll("script")

scripts.forEach((script) => {

  const src = script.src.toLowerCase()

  if (src.includes("google-analytics")) {
    trackers.push("Google Analytics")
  }

  if (src.includes("googletagmanager")) {
    trackers.push("Google Tag Manager")
  }

  if (src.includes("facebook")) {
    trackers.push("Facebook Tracker")
  }

  if (src.includes("doubleclick")) {
    trackers.push("DoubleClick Ads")
  }

})

chrome.storage.local.set({
  detectedTrackers: trackers,
})

console.log("Detected trackers:", trackers)