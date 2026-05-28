export const defaultSettings = {

  trackerBlocking: true,

  httpsUpgrade: true,

  scriptBlocking: false,

  fingerprintProtection: true,

  thirdPartyCookies: true

}

export async function getSettings() {

  return new Promise((resolve) => {

    chrome.storage.local.get(
      ["settings"],
      (result) => {

        resolve({

          ...defaultSettings,

          ...(result.settings || {})

        })

      }
    )

  })

}

export async function saveSettings(
  settings
) {

  return new Promise((resolve) => {

    chrome.storage.local.set(
      {
        settings
      },
      resolve
    )

  })

}