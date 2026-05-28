import { useEffect, useState } from "react"

import GlassCard from "../ui/GlassCard"

function RiskScoreCard() {

  const [risk, setRisk] =
    useState("Low")

  const [score, setScore] =
    useState(10)

  useEffect(() => {

    if (
      typeof chrome !== "undefined" &&
      chrome.tabs
    ) {

      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        (tabs) => {

          if (tabs[0]?.url) {

            analyzeRisk(
              tabs[0].url
            )

          }

        }
      )

    }

  }, [])

  function analyzeRisk(url) {

    let calculatedScore = 10

    const suspiciousWords = [

      "login",
      "verify",
      "secure",
      "bank",
      "crypto",
      "bonus",
      "gift",
      "free",
      "airdrop",
      "wallet"

    ]

    suspiciousWords.forEach(
      (word) => {

        if (
          url
            .toLowerCase()
            .includes(word)
        ) {

          calculatedScore += 10

        }

      }
    )

    if (
      url.includes(".xyz")
    ) {

      calculatedScore += 20

    }

    if (
      url.length > 60
    ) {

      calculatedScore += 15

    }

    if (
      url.includes("@")
    ) {

      calculatedScore += 25

    }

    if (
      calculatedScore >= 60
    ) {

      setRisk("High")

    } else if (
      calculatedScore >= 30
    ) {

      setRisk("Medium")

    } else {

      setRisk("Low")

    }

    setScore(
      calculatedScore
    )

  }

  return (

    <GlassCard>

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h2
            className="
              text-xl
              font-semibold
              text-white
            "
          >
            Website Risk Score
          </h2>

          <p
            className="
              text-sm
              text-gray-400
              mt-1
            "
          >
            Suspicious domain analysis
          </p>

        </div>

        {/* Score */}
        <div
          className="
            w-16
            h-16
            rounded-2xl
            flex
            items-center
            justify-center
            bg-[#2a2b35]
            text-white
            text-xl
            font-bold
          "
        >

          {score}

        </div>

      </div>

      {/* Threat Level */}
      <div className="mt-5">

        <div
          className={`
            rounded-2xl
            px-4
            py-4
            border
            ${
              risk === "Low"

                ? "bg-green-500/10 border-green-500/20 text-green-400"

                : risk === "Medium"

                ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"

                : "bg-red-500/10 border-red-500/20 text-red-400"
            }
          `}
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <span className="font-medium">
              Threat Level
            </span>

            <span className="font-bold">
              {risk}
            </span>

          </div>

        </div>

      </div>

    </GlassCard>

  )

}

export default RiskScoreCard