import {
  Shield,
  Fingerprint,
  Cookie,
  Code
} from "lucide-react"

import ToggleSwitch from "../ui/ToggleSwitch"
import GlassCard from "../ui/GlassCard"

function ProtectionStatusCard() {

  return (

    <GlassCard>

      <div className="space-y-5">

        {/* Title */}
        <div>

          <h2 className="text-xl font-semibold text-white">
            Protection Settings
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Active website protections
          </p>

        </div>

        {/* Option 1 */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Shield
              size={20}
              className="text-gray-300"
            />

            <span className="text-gray-200">
              Block Ads & Trackers
            </span>

          </div>

          <ToggleSwitch enabled={true} />

        </div>

        {/* Option 2 */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Fingerprint
              size={20}
              className="text-gray-300"
            />

            <span className="text-gray-200">
              Fingerprint Protection
            </span>

          </div>

          <ToggleSwitch enabled={true} />

        </div>

        {/* Option 3 */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Cookie
              size={20}
              className="text-gray-300"
            />

            <span className="text-gray-200">
              Block Third-Party Cookies
            </span>

          </div>

          <ToggleSwitch enabled={false} />

        </div>

        {/* Option 4 */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Code
              size={20}
              className="text-gray-300"
            />

            <span className="text-gray-200">
              Script Protection
            </span>

          </div>

          <ToggleSwitch enabled={true} />

        </div>

      </div>

    </GlassCard>
  )
}

export default ProtectionStatusCard