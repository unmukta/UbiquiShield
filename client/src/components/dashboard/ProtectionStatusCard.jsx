import GlassCard from "../ui/GlassCard"
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Globe,
} from "lucide-react"

function ProtectionStatusCard() {
  return (
    <GlassCard>

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-semibold text-white">
            Protection Status
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Browser defenses active
          </p>
        </div>

        <ShieldCheck
          className="text-green-400"
          size={24}
        />

      </div>

      <div className="mt-5 space-y-4">

        <ProtectionItem
          icon={<Lock size={16} />}
          label="HTTPS Protection"
          status="Enabled"
        />

        <ProtectionItem
          icon={<EyeOff size={16} />}
          label="Tracker Blocking"
          status="Active"
        />

        <ProtectionItem
          icon={<Globe size={16} />}
          label="Safe Browsing"
          status="Protected"
        />

      </div>

    </GlassCard>
  )
}

function ProtectionItem({ icon, label, status }) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-2 text-gray-300 text-sm">
        {icon}
        <span>{label}</span>
      </div>

      <span className="text-green-400 text-sm">
        {status}
      </span>

    </div>
  )
}

export default ProtectionStatusCard