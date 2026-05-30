console.log(
  "Ubiqui_Shield content script active"
  if (
  location.hostname.includes(
    "linkedin.com"
  )
) {
  console.log(
    "LinkedIn bypass"
  )
  return
}
)

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

// =========================
// FINGERPRINT PROTECTION
// =========================

function enableFingerprintProtection() {

  if (
    !settings.fingerprintProtection
  ) {
    return
  }

  // Skip sensitive websites
  const hostname =
    location.hostname

  const excludedSites = [

    "linkedin.com",

    "www.linkedin.com"

  ]

  if (
    excludedSites.some(
      site =>
        hostname.includes(site)
    )
  ) {

    console.log(
      "Fingerprint protection skipped:",
      hostname
    )

    return

  }

  try {

  // CPU threads
  Object.defineProperty(
    navigator,
    "hardwareConcurrency",
    {
      get: () => 8
    }
  )

  // RAM
  Object.defineProperty(
    navigator,
    "deviceMemory",
    {
      get: () => 8
    }
  )

  // Platform
  Object.defineProperty(
    navigator,
    "platform",
    {
      get: () => "Win32"
    }
  )

  // Canvas protection
  const originalToDataURL =
    HTMLCanvasElement.prototype.toDataURL

  HTMLCanvasElement.prototype.toDataURL =
    function (...args) {

      const ctx =
        this.getContext("2d")

      if (ctx) {

        ctx.fillStyle =
          "rgba(1,1,1,0.01)"

        ctx.fillRect(
          0,
          0,
          1,
          1
        )

      }

      return originalToDataURL.apply(
        this,
        args
      )

    }

// =====================
// WEBGL PROTECTION
// =====================

const originalGetExtension =
  WebGLRenderingContext.prototype.getExtension

WebGLRenderingContext.prototype.getExtension =
  function(name) {

    if (
      name === "WEBGL_debug_renderer_info"
    ) {
      return null
    }

    return originalGetExtension.call(
      this,
      name
    )
  }

const originalGetParameter =
  WebGLRenderingContext.prototype.getParameter

WebGLRenderingContext.prototype.getParameter =
  function(param) {

    if (
      param === 37445 ||
      param === 37446
    ) {

      return "Blocked"
    }

    return originalGetParameter.call(
      this,
      param
    )
  }

      if (param === 37445)
        return "Intel Inc."

      if (param === 37446)
        return "Intel Iris Graphics"

      return originalGetParameter.call(
        this,
        param
      )

    }

  // Battery API
  if (navigator.getBattery) {

    navigator.getBattery =
      async () => ({
        charging: true,
        chargingTime: 0,
        dischargingTime: Infinity,
        level: 1
      })

  }

  console.log(
    "Advanced fingerprint protection enabled"
  )

} catch (error) {

  console.log(
    "Fingerprint spoof failed",
    error
  )

}

}

// =========================
// COOKIE PROTECTION
// =========================

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

const observer =
  new MutationObserver(() => {

    scanTrackers()
    cosmeticFiltering()

  })

observer.observe(
  document.documentElement,
  {

    childList: true,

    subtree: true

  }
)