console.log(
  "Ubiqui_Shield background active"
)

// Install
chrome.runtime.onInstalled.addListener(() => {

  console.log(
    "Ubiqui_Shield installed"
  )

})

// Track blocked requests
chrome.declarativeNetRequest.onRuleMatchedDebug
  .addListener((info) => {

    chrome.storage.local.get(
      ["blockedCount"],
      (result) => {

        const current =
          result.blockedCount || 0

        chrome.storage.local.set({

          blockedCount:
            current + 1

        })

      }
    )

    console.log(
      "BLOCKED:",
      info
    )

  })