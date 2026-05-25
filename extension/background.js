chrome.tabs.onActivated.addListener(async () => {
  updateCurrentTab()
})

chrome.tabs.onUpdated.addListener(() => {
  updateCurrentTab()
})

async function updateCurrentTab() {

  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  })

  const activeTab = tabs[0]

  if (!activeTab || !activeTab.url) return

  const url = new URL(activeTab.url)

  chrome.storage.local.set({
    currentWebsite: url.hostname,
  })

  console.log("Current website:", url.hostname)
}