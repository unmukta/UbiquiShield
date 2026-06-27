# Ubiqui Shield

**A modern, high-performance privacy extension that stops advanced tracking, eliminates invasive ads, and protects your digital fingerprint across the web.**

Ubiqui Shield is built from the ground up for the modern browser engine. It uses high-efficiency network rules to block trackers *before* they load, resulting in significantly faster page load times and reduced memory usage. Unlike legacy ad blockers that rely on slow request interception, Ubiqui Shield leverages the browser's native Declarative Net Request engine to perform all blocking in compiled C++ — completely off the main thread.

> For a deep technical dive into the algorithms, execution environments, and security model, see the full [Architecture & Technical Documentation](ARCHITECTURE.md).

---

## Features

### Network Protection
- **Network-Level Tracker Blocking**: Block over **3,500** tracking & advertising domains using Manifest V3's high-performance Declarative Net Request API.
- **Network-Level Script Blocking**: The "Block Scripts" toggle dynamically generates DNR rules to block 30+ known tracking script domains (Google Analytics, Hotjar, Clarity, Mixpanel, etc.) at the network level before they can execute.
- **Deep Header Masking**: Forcefully rewrites `User-Agent`, `Sec-CH-UA`, `Sec-CH-UA-Platform`, and `Accept-Language` headers globally at the network level to defeat server-side fingerprinting.
- **HTTPS Connection Upgrades**: Automatically redirect insecure HTTP requests to secure HTTPS equivalents via DNR `upgradeScheme` rules.
- **Strict URL Tracking Parameter Stripping**: Automatically removes `utm_*`, `fbclid`, `gclid`, `msclkid`, and 20+ other tracking parameters from URLs before the page loads.

### Cosmetic Filtering
- **Layout-Safe Ad Hiding**: Industry-standard `display: none !important` CSS injection targets ads across YouTube, Google Ads, Amazon Sponsored, Reddit Promoted, LinkedIn, Facebook/Twitter Sponsored Posts, and cookie consent banners — without breaking page layouts.
- **Active Ad Wrapper Collapsing**: A mutation observer actively collapses empty wrapper `<div>` elements left behind by natively blocked ad iframes, while preserving legitimate page containers.
- **Cookie Consent Banner Eradication**: Targets the most notorious cookie banner frameworks (OneTrust, Quantcast, CookieBot, GDPR banners) and instantly removes them.

### Fingerprint Protection
- **Canvas & WebGL Noise Injection**: Injects undetectable, randomized noise into `toDataURL`, `toBlob`, `getImageData`, and `readPixels` across HTML5 Canvas, WebGL, and WebGL2 contexts.
- **OffscreenCanvas Protection**: Blocks off-DOM fingerprinting via `OffscreenCanvasRenderingContext2D`.
- **Context-Aware Canvas Safety**: Uses a `WeakMap` to track canvas context types (`2d` vs `webgl`), preventing accidental corruption of legitimate 3D applications and games.
- **Hardware & WebGL Spoofing**: Returns generic `ANGLE (Generic GPU)` / `Google Inc.` strings for WebGL renderer queries, and standardizes `hardwareConcurrency`, `deviceMemory`, `plugins`, and `mimeTypes`.
- **Audio API Spoofing**: Modifies frequency channel data returned by `AudioContext.getChannelData()`.
- **High-Precision Font Spoofing**: Injects microscopic pixel offsets into `offsetWidth`, `offsetHeight`, `getBoundingClientRect()`, and `getClientRects()` for `<span>` elements, defeating sub-pixel font rendering fingerprints.
- **Battery API Neutralization**: Returns a fully charged, plugged-in battery profile and stubs out all charge event listeners.
- **Client Hints Spoofing**: Overrides `navigator.userAgentData` to return a generic Chromium 120 / Windows profile.
- **Consistent Timezone Spoofing**: Both `getTimezoneOffset()` and `Intl.DateTimeFormat.resolvedOptions().timeZone` report consistent UTC/EST values.
- **WebRTC IP Leak Protection**: Sets `webRTCIPHandlingPolicy` to `default_public_interface_only` to prevent local IP exposure.
- **System Environment Normalization**: Returns standardized values for `navigator.hardwareConcurrency`, `navigator.deviceMemory`, `navigator.connection`, `navigator.language`, and platform attributes.
- **API `toString` Masking**: Automatically proxies `Function.prototype.toString` to return `function() { [native code] }` for all 20+ intercepted APIs, guaranteeing spoofing mechanisms remain undetectable.

### User Experience
- **Per-Site Protection Toggle**: Pause and resume protection on specific sites directly via the extension popup.
- **Real-Time Blocked Counter**: Production-safe counter of blocked trackers scoped to each tab using rule-matching telemetry.
- **Detected Tracker List**: See exactly which tracker domains were found on the current page.
- **Shadow DOM Evasion Prevention**: Injects interception logic via `chrome.scripting.executeScript({ world: "MAIN" })`, rendering Shadow DOM and `<iframe>` isolation tactics useless.

---

## Tech Stack

### Extension Popup (Frontend)
- React 19 (Vite-powered development and compilation)
- Vanilla CSS (Harmonious dark theme UI design)
- Lucide React (Icon library)
- Chrome Extension APIs

### Core Protection Engine
- Manifest V3 Standard Architecture
- Declarative Net Request API (zero-latency, private blocking)
- Background Service Workers (tab management & state)
- Document Content Scripts (DOM-level cosmetic cleanup)
- MAIN World Injected Scripts (synchronous Canvas/WebGL/API normalization)
- Chrome Storage API (local-only configuration)
- Chrome Privacy API (WebRTC policy control)
- Chrome Scripting API (dynamic content script registration)

---

## Project Structure

```text
ubiqui_shield/
│
├── client/                 # React source code for extension popup UI
│   ├── src/                # React components (App.jsx) and styling
│   ├── public/             # Static public assets
│   └── vite.config.js      # Vite build configuration
│
├── extension/              # Browser Extension package directory
│   ├── background.js       # Service worker (DNR rules, tab tracking, message handler)
│   ├── content.js          # Content script (cosmetic filters, tracker detection, cookie cleanup)
│   ├── injected.js         # MAIN world script (Canvas, WebGL, Audio, Font fingerprint spoofing)
│   ├── trackers.json       # Built-in local tracker signature database
│   ├── rules.json          # Declarative Net Request blocking ruleset (3,500+ domains)
│   ├── manifest.json       # Manifest V3 extension configuration
│   ├── index.html          # Extension popup HTML entrypoint
│   ├── assets/             # Compiled React popup UI (JS/CSS bundles)
│   └── icons/              # Extension logo icons (16/48/128px)
│
├── build.js                # Cross-browser build pipeline (Chrome, Firefox, Source ZIP)
├── generate_rules.js       # Script to regenerate rules.json from domain lists
├── ARCHITECTURE.md         # In-depth technical architecture documentation
├── PRIVACY.md              # Privacy policy
├── CHANGELOG.md            # Version history
└── LICENSE                 # MIT License
```

---

## Installation

### From the Stores
- **Chrome Web Store**: [Coming Soon]
- **Microsoft Edge Add-ons**: [Install for Edge](https://microsoftedge.microsoft.com/addons/detail/ubiqui_shield/obejaefmomenidhloemimedldkhedffm)
- **Firefox Add-ons**: [Install for Firefox](https://addons.mozilla.org/en-US/firefox/addon/ubiqui-shield/)

### From Source

#### 1. Clone the Repository
```bash
git clone https://github.com/unmukta/UbiquiShield.git
cd UbiquiShield
```

#### 2. Build the Popup UI
```bash
cd client
npm install
npm run build
```

#### 3. Load into Chrome / Edge
1. Open `chrome://extensions` or `edge://extensions`.
2. Enable **Developer Mode**.
3. Click **Load Unpacked** and select the `extension/` folder.

#### 4. Load into Firefox
1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on** and select any file inside the `extension/` folder.

### Building Release Packages
```bash
# From the project root
npm install
npm run build
```
This generates three ready-to-upload ZIP files in the `dist/` folder:
| File | Purpose |
|---|---|
| `UbiquiShield-Chrome-v[X.Y.Z].zip` | Chrome Web Store & Edge Add-ons |
| `UbiquiShield-Firefox-v[X.Y.Z].zip` | Firefox Add-ons (patched manifest) |
| `UbiquiShield-Source-v[X.Y.Z].zip` | Mozilla reviewer source code submission |

---

## Browser Support

| Browser | Status |
|---|---|
| Google Chrome | ✅ Full Support |
| Microsoft Edge | ✅ Full Support |
| Brave | ✅ Full Support |
| Opera | ✅ Full Support |
| Vivaldi | ✅ Full Support |
| Mozilla Firefox | ✅ Supported (auto-patched manifest) |

---

## Disclaimer

Ubiqui Shield dramatically increases user privacy and cuts down tracking vectors. However, no software client can guarantee absolute anonymity against every sophisticated telemetry system.

## Version

Current Release: **v1.2.1**

## License

MIT License