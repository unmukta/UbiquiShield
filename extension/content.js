console.log(
  "Ubiqui_Shield content script active"
)

// Removed unconditional script injection

// =========================
// TRACKER DATABASE
// =========================

let trackerDB = {}

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

let siteProtectionEnabled = false


  function cosmeticFiltering() {

  if (
    !settings.trackerBlocking || !siteProtectionEnabled
  ) {
    return
  }

  const selectors = [

    '[id^="ad-"]',
    '[id$="-ad"]',
    '[class*="-ad-"]',
    '[class^="ad-"]',
    '[class$="-ad"]',

    'ins.adsbygoogle',
    '[data-ad-slot]',
    '[data-ad-client]',
    '[data-ad-format]',

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

        element.style.setProperty("display", "none", "important")

      })

  })

}

// =========================
// LOAD SETTINGS
// =========================

async function loadTrackerDB() {

  try {

    const url =
      chrome.runtime.getURL(
        "trackers.json"
      )

    const response =
      await fetch(url)

    trackerDB =
      await response.json()

  } catch {

    console.log(
      "Tracker database load failed"
    )

  }

}

loadTrackerDB().then(() => {

  chrome.storage.local.get(
    ["settings", "siteSettings"],
    (result) => {

      settings = {

        ...defaultSettings,

        ...(result.settings || {})

      }

      const siteSettings = result.siteSettings || {}
      
      let currentHostname = window.location.hostname;
      if (window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0) {
        try {
          const topOrigin = window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1];
          if (topOrigin && topOrigin !== "null") {
            currentHostname = new URL(topOrigin).hostname;
          }
        } catch(e) {}
      }

      let isDisabled = false;
      const parts = currentHostname.split('.');
      for (let i = 0; i < parts.length - 1; i++) {
        const domainToCheck = parts.slice(i).join('.');
        if (siteSettings[domainToCheck] === false) {
          isDisabled = true;
          break;
        }
      }

      if (isDisabled) {
        console.log("Protection disabled for", currentHostname)
        return
      }

      siteProtectionEnabled = true
      initializeProtection()

    }
  )

})

// =========================
// LIVE SETTINGS UPDATE
// =========================

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.settings) {
      settings = {
        ...defaultSettings,
        ...changes.settings.newValue
      }
      console.log("Updated Settings:", settings)
    }

    if (changes.siteSettings) {
      const siteSettings = changes.siteSettings.newValue || {}
      
      let currentHostname = window.location.hostname;
      if (window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0) {
        try {
          const topOrigin = window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1];
          if (topOrigin && topOrigin !== "null") {
            currentHostname = new URL(topOrigin).hostname;
          }
        } catch(e) {}
      }
      
      let isDisabled = false;
      const parts = currentHostname.split('.');
      for (let i = 0; i < parts.length - 1; i++) {
        const domainToCheck = parts.slice(i).join('.');
        if (siteSettings[domainToCheck] === false) {
          isDisabled = true;
          break;
        }
      }
      
      siteProtectionEnabled = !isDisabled;
    }
  })

// =========================
// TRACKER SCANNER
// =========================

function scanTrackers() {

  if (
    !settings.trackerBlocking
  ) {

    try {
      chrome.runtime.sendMessage({
        action: "reportTrackers",
        trackers: []
      })
    } catch {
      // Context invalidated
    }

    return

  }

  const detectedTrackers = []

  const elements =
    document.querySelectorAll(
      "script, iframe, img"
    )

  elements.forEach((element) => {

    const src = (
      element.src || ""
    ).toLowerCase()

    if (!src) return;

    let host = "";
    try {
      const url = new URL(src)
      host = url.hostname
    } catch {
      return;
    }

    Object.keys(trackerDB)
      .forEach((key) => {

        if (
          host.includes(key)
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
          "Blocked Element:",
          src
        )

        element.remove()

      }

    }

  })

  // =====================
  // SHADOW DOM SCANNER
  // =====================
  
  const resources = window.performance.getEntriesByType("resource")
  resources.forEach((entry) => {
    let host = ""
    try {
      const url = new URL(entry.name)
      host = url.hostname
    } catch {
      return
    }

    Object.keys(trackerDB).forEach((key) => {
      if (host.includes(key)) {
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

  try {
    chrome.runtime.sendMessage({
      action: "reportTrackers",
      trackers: uniqueTrackers
    })
  } catch {
    // Context invalidated
  }

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
  protectCookies()

  scanTrackers()

  cosmeticFiltering()

}

// =========================
// LIVE DOM MONITOR
// =========================

let isScanning = false;

const observer =
  new MutationObserver(() => {

    if (!siteProtectionEnabled || isScanning) {
      return
    }

    isScanning = true;

    setTimeout(() => {

      protectCookies();
      scanTrackers();
      cosmeticFiltering();

      isScanning = false;

    }, 1000);

  });

observer.observe(
  document.documentElement,
  {

    childList: true,

    subtree: true

  }
)