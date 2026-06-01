console.log(
  "Ubiqui_Shield content script active"
)

const script =
  document.createElement("script");

script.src =
  chrome.runtime.getURL(
    "injected.js"
  );

script.onload = () =>
  script.remove();

(
  document.head ||
  document.documentElement
).appendChild(script);

// =========================
// TRACKER DATABASE
// =========================

const trackerDB = {

  "doubleclick": {

    name:
      "DoubleClick",

    company:
      "Google",

    category:
      "Advertising",

    risk:
      "Medium"

  },

  "google-analytics": {

    name:
      "Google Analytics",

    company:
      "Google",

    category:
      "Analytics",

    risk:
      "Low"

  },

  "googletagmanager": {

    name:
      "Google Tag Manager",

    company:
      "Google",

    category:
      "Analytics",

    risk:
      "Medium"

  },

  "facebook": {

    name:
      "Facebook Tracker",

    company:
      "Meta",

    category:
      "Social Tracking",

    risk:
      "High"

  },

  "hotjar": {

    name:
      "Hotjar",

    company:
      "Hotjar Ltd",

    category:
      "Behavior Analytics",

    risk:
      "Medium"

  },

  "tiktok": {

    name:
      "TikTok Analytics",

    company:
      "TikTok",

    category:
      "Tracking",

    risk:
      "High"

  }

}

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

let settings =
  defaultSettings


  function cosmeticFiltering() {

  const selectors = [

    '[id*="ad"]',
    '[class*="ad"]',
    '[class*="banner"]',
    '[class*="sponsor"]',
    '[id*="sponsor"]',
    '[class*="promoted"]',

    'iframe[src*="doubleclick"]',
    'iframe[src*="googlesyndication"]',
    'iframe[src*="taboola"]',
    'iframe[src*="outbrain"]',

    '[data-testid="placementTracking"]'

  ]

  selectors.forEach((selector) => {

    document
      .querySelectorAll(selector)
      .forEach((element) => {

        element.style.display = "none"

      })

  })

}

// =========================
// LOAD SETTINGS
// =========================

chrome.storage.local.get(
  ["settings"],
  (result) => {

    settings = {

      ...defaultSettings,

      ...(result.settings || {})

    }

    initializeProtection()

  }
)

// =========================
// LIVE SETTINGS UPDATE
// =========================

chrome.storage.onChanged
  .addListener((changes) => {

    if (
      changes.settings
    ) {

      settings = {

        ...defaultSettings,

        ...changes
          .settings
          .newValue

      }

      console.log(
        "Updated Settings:",
        settings
      )

    }

  })

// =========================
// TRACKER SCANNER
// =========================

function scanTrackers() {

  if (
    !settings.trackerBlocking
  ) {

    chrome.storage.local.set({

      detectedTrackers: []

    })

    return

  }

  const detectedTrackers = []

  const scripts =
    document.querySelectorAll(
      "script"
    )

  scripts.forEach((script) => {

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

    // =====================
    // SCRIPT BLOCKING
    // =====================

    if (
      settings.scriptBlocking
    ) {

      const suspicious = [
  "analytics",
  "tracker",
  "tagmanager",
  "doubleclick",
  "facebook",
  "hotjar",
  "tiktok",
  "clarity",
  "linkedin",
  "reddit",
  "twitter",
  "mixpanel",
  "segment",
  "hubspot",
  "outbrain",
  "taboola",
  "criteo",
  "advert",
  "pixel"
]

      const shouldBlock =
        suspicious.some(
          (word) =>
            src.includes(word)
        )

      if (
        shouldBlock
      ) {

        console.log(
          "Blocked Script:",
          src
        )

        script.remove()

      }

    }

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

  chrome.storage.local.set({

    detectedTrackers:
      uniqueTrackers

  })

  console.log(
    "TRACKERS:",
    uniqueTrackers
  )

}


function protectCookies() {

  if (
    !settings
      .thirdPartyCookies
  ) {
    return
  }

  try {

    document.cookie
      .split(";")
      .forEach((cookie) => {

        const cookieName =
          cookie
            .split("=")[0]
            ?.trim()
            ?.toLowerCase()

        if (
          !cookieName
        ) {
          return
        }

        const trackingCookies =
          [

            "_ga",

            "_gid",

            "_fbp",

            "_gcl_au",

            "_hjSession",

            "_tt_enable_cookie"

          ]

        const shouldRemove =
          trackingCookies.some(
            (name) =>
              cookieName.includes(
                name.toLowerCase()
              )
          )

        if (
          shouldRemove
        ) {

          document.cookie =
            `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`

          console.log(
            "Removed Cookie:",
            cookieName
          )

        }

      })

  } catch {

    console.log(
      "Cookie cleanup failed"
    )

  }

}

// =========================
// INITIALIZE
// =========================

function initializeProtection() {

  enableFingerprintProtection()

  protectCookies()

  scanTrackers()

  cosmeticFiltering()

}

// =========================
// LIVE DOM MONITOR
// =========================

let scanTimeout;

const observer =
  new MutationObserver(() => {

    clearTimeout(scanTimeout);

    scanTimeout =
      setTimeout(() => {

        scanTrackers();
        cosmeticFiltering();

      }, 1000);

  });

observer.observe(
  document.documentElement,
  {

    childList: true,

    subtree: true

  }
)