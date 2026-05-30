# Ubiqui Shield

Ubiqui Shield is a modern privacy-focused browser extension designed to improve user security and reduce online tracking.

## Features

### Tracker & Ad Blocking

* Blocks known advertising networks
* Blocks common tracking domains
* Real-time request filtering using Declarative Net Request rules
* Website-specific protection controls

### HTTPS Protection

* Detects secure and insecure connections
* Encourages encrypted browsing
* HTTPS upgrade support

### Script Control

* Optional script blocking for enhanced privacy
* Helps reduce malicious or unwanted third-party scripts

### Fingerprint Protection

* Hardware fingerprint reduction
* Device memory spoofing
* CPU core count normalization
* Timezone normalization
* WebGL renderer masking
* Platform information normalization

### Privacy Dashboard

* Modern user interface
* Per-site protection controls
* Protection statistics
* Current website information display

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

## License

MIT License
