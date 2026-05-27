console.log("Ubiqui_Shield content script active")

function scanTrackers() {

  const detectedTrackers = []

  document.querySelectorAll("script").forEach((script) => {

    const src = (script.src || "").toLowerCase()

    console.log("SCRIPT:", src)

    // Google Analytics
    if (
      src.includes("google-analytics") ||
      src.includes("googletagmanager") ||
      src.includes("gtag")
    ) {
      detectedTrackers.push("Google Analytics")
    }

    // DoubleClick
    if (
      src.includes("doubleclick")
    ) {
      detectedTrackers.push("DoubleClick")
    }

    // Facebook
    if (
      src.includes("facebook") ||
      src.includes("connect.facebook.net")
    ) {
      detectedTrackers.push("Facebook Tracker")
    }

    // Hotjar
    if (
      src.includes("hotjar")
    ) {
      detectedTrackers.push("Hotjar")
    }

    // TikTok
    if (
      src.includes("tiktok")
    ) {
      detectedTrackers.push("TikTok Pixel")
    }

  })

  // Remove duplicates
  const uniqueTrackers = [...new Set(detectedTrackers)]

  console.log("TRACKERS FOUND:", uniqueTrackers)

  // Save locally
  chrome.storage.local.set({
    detectedTrackers: uniqueTrackers
  })

  // Send live update
  chrome.runtime.sendMessage({
    type: "TRACKERS_UPDATED",
    trackers: uniqueTrackers
  })

}

// Wait for page load
window.addEventListener("load", () => {

  console.log("PAGE LOADED — scanning")

  setTimeout(() => {

    scanTrackers()

  }, 3000)

})