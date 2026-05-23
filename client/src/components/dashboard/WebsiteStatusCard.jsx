import GlassCard from "../ui/GlassCard"
import { ShieldCheck } from "lucide-react"

function WebsiteStatusCard() {
  return (
    <GlassCard>

      <div className="flex items-center justify-between">
        
        <div>
          <h2 className="text-xl font-semibold text-cyan-300">
            Current Website
          </h2>

          <p className="text-gray-400 mt-2">
            github.com
          </p>
        </div>

        <div
          className="
            w-14
            h-14
            rounded-2xl
            flex
            items-center
            justify-center
            bg-green-500/10
            border border-green-400/20
          "
        >
          <ShieldCheck
            className="text-green-400"
            size={28}
          />
        </div>

      </div>

      {/* Status */}
      <div className="mt-8">

        <div className="flex items-center gap-3">
          
          <div className="
            w-3
            h-3
            rounded-full
            bg-green-400
            animate-pulse
          " />

          <span className="text-green-400 font-medium">
            Secure Connection
          </span>

        </div>

        <p className="text-gray-400 mt-3 text-sm leading-relaxed">
          No phishing indicators, malicious scripts,
          or suspicious trackers detected.
        </p>

      </div>

    </GlassCard>
  )
}

export default WebsiteStatusCard