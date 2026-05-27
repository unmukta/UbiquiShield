console.log(
  "Ubiqui_Shield content script active"
)

// TRACKER DATABASE
const trackerDB = {

  "doubleclick": {
    name: "DoubleClick",
    company: "Google",
    category: "Advertising",
    risk: "Medium"
  },

  "google-analytics": {
    name: "Google Analytics",
    company: "Google",
    category: "Analytics",
    risk: "Low"
  },

  "googletagmanager": {
    name: "Google Tag Manager",
    company: "Google",
    category: "Analytics",
    risk: "Medium"
  },

  "facebook": {
    name: "Facebook Tracker",
    company: "Meta",
    category: "Social Tracking",
    risk: "High"
  },

  "hotjar": {
    name: "Hotjar",
    company: "Hotjar Ltd",
    category: "Behavior Analytics",
    risk: "Medium"
  }

}

function scanTrackers() {

  const detectedTrackers = []

  // SCAN SCRIPTS
  document
    .querySelectorAll("script")
    .forEach((script) => {

      const src = (
        script.src || ""
      ).toLowerCase()

      Object.keys(trackerDB)
        .forEach((key) => {

          if (
            src.includes(key)
          ) {

            detectedTrackers.push({

              id: key,

              ...trackerDB[key],

              blocked: true

            })

          }

        })

    })

  // REMOVE DUPLICATES
  const uniqueTrackers =
    detectedTrackers.filter(
      (
        tracker,
        index,
        self
      ) =>
        index ===
        self.findIndex(
          (t) =>
            t.id === tracker.id
        )
    )

  // SAVE
  chrome.storage.local.set({

    detectedTrackers:
      uniqueTrackers

  })

  console.log(
    "TRACKERS:",
    uniqueTrackers
  )

}

// INITIAL SCAN
scanTrackers()

// LIVE MONITORING
const observer =
  new MutationObserver(() => {

    scanTrackers()

  })

observer.observe(
  document.documentElement,
  {

    childList: true,

    subtree: true

  }
)