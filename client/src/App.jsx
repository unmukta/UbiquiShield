import GlassCard from "./components/ui/GlassCard"
import NeonButton from "./components/ui/NeonButton"
import AnimatedBackground from "./components/animations/AnimatedBackground"
import Sidebar from "./components/layout/Sidebar"
import WebsiteStatusCard from "./components/dashboard/WebsiteStatusCard"
import TrackerIntelligenceCard from "./components/dashboard/TrackerIntelligenceCard"

function App() {
  return (
    <>
      <AnimatedBackground />
      <Sidebar />

      <main className="ml-72 min-h-screen p-10">
        
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold text-cyan-400">
              Security Overview
            </h1>

            <p className="text-gray-400 mt-3">
              Monitor threats, privacy exposure, and browser security.
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            <GlassCard>
              <h2 className="text-xl font-semibold text-cyan-300">
                Privacy Score
              </h2>

              <p className="text-5xl font-bold mt-6 text-white">
                92%
              </p>
            </GlassCard>

            <GlassCard>
              <h2 className="text-xl font-semibold text-cyan-300">
                Threat Alerts
              </h2>

              <p className="text-5xl font-bold mt-6 text-red-400">
                0
              </p>
            </GlassCard>

            <WebsiteStatusCard />

            <TrackerIntelligenceCard />

          </div>

          {/* Action Panel */}
          <div className="mt-10">
            <GlassCard className="flex items-center justify-between flex-wrap gap-4">
              
              <div>
                <h2 className="text-2xl font-bold text-cyan-300">
                  Real-Time Analysis
                </h2>

                <p className="text-gray-400 mt-2">
                  Analyze websites, detect phishing, and improve privacy.
                </p>
              </div>

              <NeonButton>
                Launch Scan
              </NeonButton>

            </GlassCard>
          </div>

        </div>

      </main>
    </>
  )
}

export default App