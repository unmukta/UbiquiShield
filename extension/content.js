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

  if (!settings.trackerBlocking || !siteProtectionEnabled) {
    const existingStyle = document.getElementById("ubiquishield-cosmetic");
    if (existingStyle) existingStyle.remove();
    return;
  }

  if (document.getElementById("ubiquishield-cosmetic")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "ubiquishield-cosmetic";
  style.textContent = `
    /* ===== Traditional Ad Containers ===== */
    .ad-wrapper, .ad-box, .ad-container, .advertisement,
    .banner-ad, .sponsored-post,
    ins.adsbygoogle, [data-ad-slot], [data-ad-client], [data-ad-format],
    iframe[src*="doubleclick"], iframe[src*="googlesyndication"],
    iframe[src*="taboola"], iframe[src*="outbrain"],
    [data-testid="placementTracking"],

    /* ===== Google Ads ===== */
    .google-ad, .google-ad-manager,
    [id^="google_ads_"], [id^="div-gpt-ad"],
    .gpt-ad, .dfp-ad,

    /* ===== Cookie Consent Banners ===== */
    #onetrust-consent-sdk, #cookie-notice, .cookie-banner,
    .cookie-consent, #cookie-law-info-bar,
    .optanon-alert-box-wrapper, .cc-window,
    .qc-cmp2-container, #cmessage_form, .cookie-popup, #cookie-bar,
    .eu-cookie-compliance-banner, #sp_message_container_1,
    .CybotCookiebotDialog, #CybotCookiebotDialog,
    [aria-label="Cookie consent"], [aria-label="Cookie banner"],
    #gdpr-consent-notice, .gdpr-banner,

    /* ===== YouTube Native Ads ===== */
    ytd-ad-slot-renderer, ytd-promoted-sparkles-web-renderer,
    ytd-promoted-video-renderer, ytd-display-ad-renderer,
    .ytd-in-feed-ad-layout-renderer, .ytd-video-masthead-ad-v3-renderer,
    .ytp-ad-module, .ytp-ad-image-overlay,
    ytd-banner-promo-renderer,

    /* ===== Facebook & Twitter Sponsored Posts ===== */
    div[data-testid="sponsored-label"],
    div[data-testid="placementTracking"],

    /* ===== Reddit Promoted ===== */
    .promotedlink, [data-is-promoted-post="true"],
    shreddit-ad-post,

    /* ===== LinkedIn Promoted ===== */
    .feed-shared-update-v2--ad,
    div[data-ad-banner],

    /* ===== Amazon Sponsored ===== */
    .s-result-item[data-component-type="sp-sponsored-result"],
    .AdHolder, .s-sponsored-label-info-icon,

    /* ===== Generic Newsletter & Signup Popups ===== */
    .newsletter-popup, .email-signup-modal,
    [class*="newsletter-overlay"]
    {
      display: none !important;
    }
  `;

  (document.head || document.documentElement).appendChild(style);

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
        } catch { console.warn("Failed to parse ancestor origin"); }
      }

      let isDisabled = false;
      const parts = currentHostname.split('.');
      for (let i = 0; i < parts.length; i++) {
        const domainToCheck = parts.slice(i).join('.');
        if (!domainToCheck.includes('.') && parts.length > 1) continue;
        if (siteSettings[domainToCheck] === true) {
          isDisabled = false;
          break;
        } else if (siteSettings[domainToCheck] === false) {
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
// OBSERVER MANAGEMENT
// =========================
function manageObserver() {
  if (siteProtectionEnabled && settings.trackerBlocking) {
    observer.observe(document.documentElement, { childList: true, subtree: true })
  } else {
    observer.disconnect()
  }
}

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
        } catch { console.warn("Failed to parse ancestor origin"); }
      }
      
      let isDisabled = false;
      const parts = currentHostname.split('.');
      for (let i = 0; i < parts.length; i++) {
        const domainToCheck = parts.slice(i).join('.');
        if (!domainToCheck.includes('.') && parts.length > 1) continue;
        if (siteSettings[domainToCheck] === true) {
          isDisabled = false;
          break;
        } else if (siteSettings[domainToCheck] === false) {
          isDisabled = true;
          break;
        }
      }
      
      siteProtectionEnabled = !isDisabled;
    }
    manageObserver();
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
          host === key || host.endsWith('.' + key)
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
      if (host === key || host.endsWith('.' + key)) {
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

  // =====================
  // AD WRAPPER COLLAPSER
  // =====================
  document.querySelectorAll('iframe, img').forEach(el => {
    let isTrackerElement = false;
    if (el.src) {
      try {
        const host = new URL(el.src).hostname;
        isTrackerElement = Object.keys(trackerDB).some(key => host === key || host.endsWith('.' + key));
        if (isTrackerElement) {
          el.style.setProperty('display', 'none', 'important');
        }
      } catch (e) {
        // invalid url, ignore
      }
    }

    // Only collapse the parent wrapper if this child is a confirmed tracker
    if (isTrackerElement) {
      const parent = el.parentElement;
      if (parent && parent.tagName === 'DIV' && parent.children.length <= 2) {
        const computed = window.getComputedStyle(parent);
        const parentHeight = parseInt(computed.height) || 0;
        // Only collapse small wrappers (ad slots), not full-page containers
        if (parentHeight < 400) {
          parent.style.setProperty('display', 'none', 'important');
        }
      }
    }
  });

  console.log(
    "TRACKERS:",
    uniqueTrackers
  )

}


function protectCookies() {

  if (
    !settings.thirdPartyCookies ||
    !siteProtectionEnabled
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
            (name) => {
              const lowerName = name.toLowerCase();
              return cookieName === lowerName || cookieName.startsWith(lowerName + '_');
            }
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

  manageObserver()
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

      isScanning = false;

    }, 1000);

  });