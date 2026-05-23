chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  // Wait until page fully loads
  if (changeInfo.status === "complete" && tab.url) {

    console.log("Scanning Website:", tab.url)

    // Example scan result
    const scanResult = {
      url: tab.url,
      safe: true,
      timestamp: Date.now()
    }

    // Save latest scan
    chrome.storage.local.set({
      latestScan: scanResult
    })

  }

})