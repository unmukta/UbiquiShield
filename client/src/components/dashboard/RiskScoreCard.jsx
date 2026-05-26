function RiskScoreCard({ trackers }) {

  let riskScore = 0

  // Tracker-based scoring
  riskScore += trackers.length * 15

  // Risk level
  let riskLevel = "SAFE"

  if (riskScore >= 30) {
    riskLevel = "LOW RISK"
  }

  if (riskScore >= 60) {
    riskLevel = "SUSPICIOUS"
  }

  if (riskScore >= 90) {
    riskLevel = "DANGEROUS"
  }

  return (

    <div
      className="
        rounded-2xl
        border border-cyan-500/20
        bg-[#131a24]
        p-5
      "
    >

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-cyan-300 text-2xl font-bold">
            Risk Intelligence
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Website threat analysis
          </p>

        </div>

        <div
          className="
            w-16
            h-16
            rounded-2xl
            border border-cyan-500/20
            flex items-center justify-center
            text-cyan-300
            text-2xl
            font-bold
          "
        >
          {riskScore}
        </div>

      </div>

      <div className="mt-5">

        <div className="flex justify-between mb-2">

          <span className="text-gray-400">
            Threat Level
          </span>

          <span className="text-cyan-300 font-semibold">
            {riskLevel}
          </span>

        </div>

        <div
          className="
            h-3
            rounded-full
            bg-white/5
            overflow-hidden
          "
        >

          <div
            className="
              h-full
              bg-cyan-400
              rounded-full
            "
            style={{
              width: `${Math.min(riskScore, 100)}%`
            }}
          />

        </div>

      </div>

    </div>

  )

}

export default RiskScoreCard