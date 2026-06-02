# Ubiqui Shield

Modern privacy and anti-tracking browser extension.

Ubiqui Shield helps users reduce online tracking by blocking known trackers, upgrading connections to HTTPS, and limiting browser fingerprinting techniques.

## Features

- **Network-Level Tracker Blocking**: Block 23 tracking & advertising domains (such as Google Tag Manager, TikTok, LinkedIn, Mixpanel, and Session Recorders) using Manifest V3's high-performance Declarative Net Request API.
- **Smart Cosmetic Filtering**: Clean up page layouts by removing advertisement containers safely, using bounded CSS selectors to avoid breaking major websites (like YouTube, GitHub, LinkedIn, and Reddit).
- **WebGL & WebGL2 Protection**: Obscure hardware metrics and suppress extension hooks (e.g. `WEBGL_debug_renderer_info`) within both WebGL and WebGL2 rendering environments.
- **Canvas Fingerprint Obfuscation**: Neutralize attempts to build unique graphical hashes by safely spoofing Canvas drawing API data.
- **System Environment Normalization**: Return standardized baseline values for browser properties such as `navigator.hardwareConcurrency`, `navigator.deviceMemory`, and platform attributes.
- **Audio API & Screen Metric Spoofing**: Obscure device audio characteristics and screen properties to reduce overall fingerprint entropy.
- **Per-Site Protection Toggle**: Pause and resume protection on specific sites directly via the extension popup, fully integrated into local storage.
- **Production-Safe Blocked Counter**: Real-time counter of blocked trackers scoped to each tab using rule-matching telemetry safely, compatible with production installs.
- **HTTPS Connection Upgrades**: Automatically redirect insecure HTTP requests to secure HTTPS equivalents.
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

* **Declarative Net Request Engine**: Low-overhead tracker blocklist loaded completely offline.
* **Smart Cosmetic Filtering**: Safe CSS rules to hide ads without breaking site layouts on platforms like YouTube and LinkedIn.
* **Unified WebGL & WebGL2 Normalization**: Overrides canvas contexts to return standardized hardware renderer strings.
* **Canvas Hash Suppression**: Spoofs data extraction canvas calls.
* **Hardware & Environment Mocking**: Standardizes logical processor counts, RAM capacities, and platform variables.
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

Current Release: **v1.1.1**

# License

MIT License