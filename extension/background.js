console.log("Ubiqui_Shield background active")

chrome.runtime.onInstalled.addListener(() => {

  console.log("Ubiqui_Shield installed")

})

chrome.runtime.onMessage.addListener(

  (message, sender, sendResponse) => {

    // Live tracker updates
    if (message.type === "TRACKERS_UPDATED") {

      console.log(
        "LIVE TRACKERS:",
        message.trackers
      )

      chrome.storage.local.set({
        detectedTrackers: message.trackers
      })

    }

  }

)