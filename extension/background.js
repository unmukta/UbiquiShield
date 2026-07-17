const knownTrackers = [
  "google-analytics",
  "doubleclick",
  "facebook",
  "connect.facebook",
  "hotjar",
  "tiktok",
  "analytics",
  "tracking",
  "ads"
]

chrome.webRequest.onBeforeRequest.addListener(

  (details) => {

    const url = details.url.toLowerCase()

    const detected = knownTrackers.find(
      tracker => url.includes(tracker)
    )

    if (detected) {

      chrome.storage.local.get(
        ["trackers"],
        (result) => {

          let trackers = result.trackers || []

          if (!trackers.includes(detected)) {

            trackers.push(detected)

            chrome.storage.local.set({
              trackers
            })

          }

        }
      )

    }

  },

  {
    urls: ["<all_urls>"]
  }

)