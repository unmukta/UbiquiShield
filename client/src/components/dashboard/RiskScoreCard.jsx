function RiskScoreCard({ trackers }) {

  let riskScore = 0

  // Tracker-based scoring
  riskScore += trackers.length * 15

  // Maximum limit
  if (riskScore > 100) {
    riskScore = 100
  }

  // Risk level
  let riskLevel = "Safe"

  if (riskScore >= 30) {
    riskLevel = "Low Risk"
  }

  if (riskScore >= 60) {
    riskLevel = "Suspicious"
  }

  if (riskScore >= 90) {
    riskLevel = "Dangerous"
  }

  return (

    <div
      className="
        rounded-2xl
        border border-white/5
        bg-[#2a2a2d]
        p-5
      "
    >

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-base font-semibold text-white">
            Risk Intelligence
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Website threat analysis
          </p>

        </div>

        {/* Score Box */}
        <div
          className="
            w-14
            h-14
            rounded-2xl
            bg-[#3b3b40]
            flex
            items-center
            justify-center
          "
        >

          <span className="text-white text-lg font-semibold">
            {riskScore}
          </span>

        </div>

      </div>

      {/* Threat Level */}
      <div className="mt-5">

        <div className="flex items-center justify-between mb-2">

          <span className="text-gray-400 text-sm">
            Threat Level
          </span>

          <span
            className="
              text-[#7c5cff]
              text-sm
              font-medium
            "
          >
            {riskLevel}
          </span>

        </div>

        {/* Progress Bar */}
        <div
          className="
            h-2.5
            rounded-full
            bg-[#1f1f22]
            overflow-hidden
          "
        >

          <div
            className="
              h-full
              bg-[#7c5cff]
              rounded-full
              transition-all
            "
            style={{
              width: `${riskScore}%`
            }}
          />

        </div>

      </div>

      {/* Footer */}
      <div
        className="
          mt-5
          rounded-xl
          border border-white/5
          bg-[#1f1f22]
          px-4
          py-3
        "
      >

        <p className="text-gray-400 text-sm leading-relaxed">
          Risk score is calculated using detected trackers
          and website telemetry indicators.
        </p>

      </div>

    </div>

  )

}

export default RiskScoreCard