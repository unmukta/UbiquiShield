import {
  Shield,
  LayoutDashboard,
  ScanSearch,
  Bot,
  Lock,
  Settings,
} from "lucide-react"

function Sidebar() {
  return (
    <aside
      className="
        fixed
        top-0
        left-0
        h-screen
        w-72
        bg-black/40
        backdrop-blur-xl
        border-r border-cyan-500/20
        p-6
        z-40
      "
    >

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div
          className="
            w-3
            h-3
            rounded-full
            bg-cyan-400
            shadow-[0_0_15px_rgba(34,211,238,1)]
          "
        />

        <h1 className="text-2xl font-bold text-cyan-400">
          Ubiqui_Shield
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">

        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Overview"
          active
        />

        <SidebarItem
          icon={<Shield size={20} />}
          text="Threat Analysis"
        />

        <SidebarItem
          icon={<ScanSearch size={20} />}
          text="Tracker Scanner"
        />

        <SidebarItem
          icon={<Bot size={20} />}
          text="Real-Time Analysis"
        />

        <SidebarItem
          icon={<Lock size={20} />}
          text="Privacy Center"
        />

        <SidebarItem
          icon={<Settings size={20} />}
          text="Settings"
        />

      </nav>
    </aside>
  )
}

function SidebarItem({ icon, text, active = false }) {
  return (
    <button
      className={`
        flex
        items-center
        gap-3
        px-4
        py-3
        rounded-xl
        transition-all
        duration-300
        text-left
        ${
          active
            ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
            : "text-gray-400 hover:bg-white/5 hover:text-cyan-300"
        }
      `}
    >
      {icon}
      <span>{text}</span>
    </button>
  )
}

export default Sidebar