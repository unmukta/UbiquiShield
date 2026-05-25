const knownTrackers = [
  "google-analytics",
  "doubleclick",
  "facebook",
  "hotjar",
  "segment",
  "mixpanel",
  "adsystem",
  "tracker"
]

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {

    const url = details.url.toLowerCase()

    let detected = null

    for (const tracker of knownTrackers) {

      if (url.includes(tracker)) {
        detected = tracker
        break
      }

    }

    if (detected) {

      chrome.storage.local.get(
        ["trackers"],
        (result) => {

          let trackers = result.trackers || []

          // Prevent duplicates
          if (!trackers.includes(detected)) {
            trackers.push(detected)
          }

          chrome.storage.local.set({
            trackers: trackers
          })

          console.log("Tracker detected:", detected)

        }
      )

    }

  },
  {
    urls: ["<all_urls>"]
  }
)