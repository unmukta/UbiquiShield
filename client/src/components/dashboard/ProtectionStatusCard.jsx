import {
  ShieldCheck,
  Lock,
  EyeOff,
  Globe,
} from "lucide-react"

function ProtectionStatusCard() {

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
            Protection Status
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Browser defenses active
          </p>

        </div>

        <div
          className="
            w-11
            h-11
            rounded-xl
            bg-[#3b3b40]
            flex
            items-center
            justify-center
          "
        >

          <ShieldCheck
            className="text-green-300"
            size={20}
          />

        </div>

      </div>

      {/* Protection List */}
      <div className="mt-5 space-y-3">

        <ProtectionItem
          icon={<Lock size={15} />}
          label="HTTPS Protection"
          status="Enabled"
        />

        <ProtectionItem
          icon={<EyeOff size={15} />}
          label="Tracker Blocking"
          status="Active"
        />

        <ProtectionItem
          icon={<Globe size={15} />}
          label="Safe Browsing"
          status="Protected"
        />

      </div>

    </div>

  )

}

function ProtectionItem({ icon, label, status }) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        rounded-xl
        border border-white/5
        bg-[#1f1f22]
        px-4
        py-3
      "
    >

      {/* Left */}
      <div className="flex items-center gap-3">

        <div className="text-[#7c5cff]">
          {icon}
        </div>

        <span className="text-white text-sm">
          {label}
        </span>

      </div>

      {/* Right */}
      <span className="text-green-300 text-sm font-medium">
        {status}
      </span>

    </div>

  )

}

export default ProtectionStatusCard