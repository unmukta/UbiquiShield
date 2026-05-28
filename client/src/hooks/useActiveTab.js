import { useEffect, useState } from "react"

function useActiveTab() {

  const [website, setWebsite] =
    useState("Loading...")

  const [hostname, setHostname] =
    useState("")

  const [favicon, setFavicon] =
    useState("")

  useEffect(() => {

    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      (tabs) => {

        if (
          tabs &&
          tabs[0] &&
          tabs[0].url
        ) {

          try {

            const url =
              new URL(
                tabs[0].url
              )

            const cleanHostname =
              url.hostname.replace(
                "www.",
                ""
              )

            setWebsite(
              cleanHostname
            )

            setHostname(
              cleanHostname
            )

            setFavicon(
              `https://${cleanHostname}/favicon.ico`
            )

          } catch {

            setWebsite(
              "Unknown"
            )

          }

        }

      }
    )

  }, [])

  return {

    website,
    hostname,
    favicon

  }

}

export default useActiveTab