# Ubiqui Shield

Modern privacy and anti-tracking browser extension.

Ubiqui Shield helps users reduce online tracking by blocking known trackers, upgrading connections to HTTPS, and limiting browser fingerprinting techniques.

## Features

## Features

- Tracker Blocking
- Ad Blocking
- HTTPS Upgrade
- Fingerprint Protection
- Canvas Protection
- WebGL Protection
- Third-Party Cookie Cleanup
- Script Blocking
- Per-Site Controls
- Lightweight & Privacy Focused

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Browser Extension

* Chrome Extension Manifest V3
* Background Service Workers
* Content Scripts
* Declarative Net Request API
* Chrome Storage API

## Project Structure

```text
ubiqui_shield/
│
├── client/
│   ├── src/
│   ├── public/
│   └── dist/
│
└── extension/
    ├── background.js
    ├── content.js
    ├── injected.js
    ├── manifest.json
    ├── rules.json
    └── icons/
```

## Installation

### Development

```bash
git clone https://github.com/yourusername/UbiquiShield.git

cd UbiquiShield/client

npm install

npm run build
```

### Load Extension

1. Open Chrome or Edge
2. Navigate to `chrome://extensions` or `edge://extensions/`
3. Enable **Developer Mode**
4. Click **Load Unpacked**
5. Select the `extension` folder

## Current Capabilities

* Ad blocking
* Tracker blocking
* HTTPS protection
* Script blocking
* Basic fingerprint protection
* Per-site controls
* Privacy-focused browsing enhancements

## Roadmap

### Planned Improvements

* Enhanced canvas fingerprint protection
* Advanced WebGL fingerprint protection
* Audio fingerprint protection
* Cookie management controls
* Privacy score system

## Disclaimer

Ubiqui Shield improves privacy and reduces common tracking techniques. No browser extension can guarantee complete anonymity or protection against every tracking method.

## Version

Current Release: **v1.1.0**

# License

MIT License