# Ubiqui Shield

Modern privacy and anti-tracking browser extension.

Ubiqui Shield helps users reduce online tracking by blocking known trackers, upgrading connections to HTTPS, and limiting browser fingerprinting techniques.

## Features

- **Network-Level Tracker Blocking**: Block over **3,500** tracking & advertising domains using Manifest V3's high-performance Declarative Net Request API.
- **Shadow DOM Evasion Prevention**: Bypasses traditional Light DOM limitations by directly integrating the browser's `window.performance` API to catch trackers hiding in Shadow DOM or background fetch routines.
- **Smart Cosmetic Filtering**: Clean up page layouts by removing advertisement containers safely, using bounded CSS selectors to avoid breaking major websites (like YouTube, GitHub, LinkedIn, and Reddit).
- **Advanced Context-Aware Fingerprint Protection**: Mocks hardware metrics while specifically protecting the WebGL contexts of legitimate 3D games and web applications from accidental Canvas corruption.
- **Font & WebRTC Leak Protection**: Spoof system font detection measurements and hide local IP addresses during web conferencing.
- **System Environment Normalization**: Return standardized baseline values for browser properties such as `navigator.hardwareConcurrency`, `navigator.deviceMemory`, `navigator.connection`, and platform attributes.
- **Per-Site Protection Toggle**: Pause and resume protection on specific sites directly via the extension popup, fully integrated into local storage.
- **Production-Safe Blocked Counter**: Real-time counter of blocked trackers scoped to each tab using rule-matching telemetry safely, compatible with production installs. Includes Chrome's MV3 100+ telemetry fallback support.
- **HTTPS Connection Upgrades**: Automatically redirect insecure HTTP requests to secure HTTPS equivalents.

> For an in-depth look at how the algorithms and APIs work, check out the full [Architecture & Technical Documentation](ARCHITECTURE.md).

- **Lightweight & Privacy First**: Zero third-party runtime dependencies, zero telemetry, and 100% local processing.

## Tech Stack

### Extension Popup (Frontend)

* React (Vite-powered development and compilation)
* Vanilla CSS (Harmonious dark theme UI design)
* Chrome Extension APIs

### Core Protection Engine

* Manifest V3 Standard Architecture
* Declarative Net Request API (For zero-latency, private blocking)
* Background Service Workers (For tab management and state updates)
* Document Content Scripts (For DOM-level cosmetic cleanup)
* Injected Script Contexts (For synchronous, synchronous-safe canvas/WebGL normalization)
* Chrome Storage API (For local-only configuration)

## Project Structure

```text
ubiqui_shield/
│
├── client/                 # React source code for extension popup UI
│   ├── src/                # React components and styling
│   ├── public/             # Static public assets
│   └── dist/               # Compiled UI output (copied to extension/)
│
└── extension/              # Chrome Extension package directory
    ├── background.js       # Service worker (tab tracking & blocked counter)
    ├── content.js          # Content script (cosmetic filters & toggle reader)
    ├── injected.js         # Page-context script (Canvas, WebGL2 fingerprinting)
    ├── trackers.json       # Built-in local tracker signature database
    ├── rules.json          # Declarative Net Request blocking ruleset
    ├── index.html          # Extension popup HTML entrypoint
    └── icons/              # Extension logo icons
```

## Installation

### 1. Build the Extension Popup

If you want to compile the React popup interface from source:

```bash
# Clone the repository
git clone https://github.com/unmukta/UbiquiShield.git

# Navigate to the client directory
cd UbiquiShield/client

# Install dependencies
npm install

# Build the project (compiles into extension/dist/)
npm run build
```

*Note: The built assets are placed directly in the `extension/` directory, making the `extension` folder fully self-contained and ready to load.*

### 2. Load the Extension into your Browser

1. Open a Chromium-based browser (Chrome, Edge, Brave, Opera, Vivaldi).
2. Navigate to `chrome://extensions` or `edge://extensions/`.
3. Enable **Developer Mode** using the toggle switch in the top right corner.
4. Click the **Load Unpacked** button in the top left corner.
5. Select the `extension` folder inside this repository.

---

## Current Capabilities

* **Declarative Net Request Engine**: High-performance tracker blocklist spanning over 3,500 domains loaded completely offline.
* **Smart Cosmetic Filtering**: Safe CSS rules to hide ads without breaking site layouts on platforms like YouTube and LinkedIn.
* **Advanced Fingerprint Normalization**: WebGL/Canvas noise injection, Font spoofing, Audio metric obscuration, and WebRTC IP leak protection.
* **Hardware & Environment Mocking**: Standardizes logical processor counts, RAM capacities, network connection type, and platform variables.
* **Per-Site Whitelists**: Save domain-specific protection choices directly to extension storage.
* **Production-Grade Block Counts**: Real-time counter metrics calculated using tab telemetry.

## Roadmap

### Upcoming (v1.2.0)

* **Cookie Management Dashboard**: Ability to inspect, isolate, and auto-delete tracking cookies per-domain.
* **Custom Blocklists**: User interface to import and edit custom domains or hosts files.
* **Granular Element Toggles**: Toggle fingerprinting, cosmetic filtering, or ad blocking individually on a per-site basis.

## Disclaimer

Ubiqui Shield dramatically increases user privacy and cuts down tracking vectors. However, no software client can guarantee absolute anonymity against every sophisticated telemetry system.

## Version

Current Release: **v1.1.4**

# License

MIT License