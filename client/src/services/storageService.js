export const getStorage = (keys) => {

  return new Promise((resolve) => {

    chrome.storage.local.get(
      keys,
      (result) => {

        resolve(result)

      }
    )

  })

}

export const setStorage = (data) => {

  return new Promise((resolve) => {

    chrome.storage.local.set(
      data,
      () => {

        resolve()

      }
    )

  })

}