# Ubiqui_Shield

Cybersecurity-focused browser protection extension built using React + Vite.

---

# Current Project Status

## Project Type

Browser Extension (Chrome Extension)

## Frontend Stack

* React
* Vite
* Tailwind CSS
* Lucide React Icons

## Current Features Implemented

### 1. Modern Cybersecurity Dashboard UI

Implemented a glassmorphism-style security dashboard.

### 2. Current Website Detection

The extension now detects the currently active website using:

```js
chrome.tabs.query()
```

It displays domains such as:

* chatgpt.com
* youtube.com
* github.com
* google.com

### 3. Secure Connection Status

Displays a live secure connection indicator.

### 4. Tracker Intelligence Card

Basic tracker monitoring card added.

### 5. Chrome Extension Support

Configured Chrome Extension Manifest V3.

Implemented:

* manifest.json
* extension permissions
* popup support
* active tab detection

### 6. Storage Integration

Using:

```js
chrome.storage.local
```

for extension data handling.

---

# Current Folder Structure

```txt
ubiqui_shield/
│
├── client/
│   ├── public/
│   │   └── manifest.json
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── WebsiteStatusCard.jsx
│   │   │   │   ├── TrackerIntelligenceCard.jsx
│   │   │   │   └── ProtectionStatusCard.jsx
│   │   │   │
│   │   │   └── ui/
│   │   │       └── GlassCard.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── package.json
```

---

# Chrome Extension Permissions

```json
"permissions": [
  "tabs",
  "activeTab",
  "storage"
]
```

---

# Current UI Sections

## Current Website

Shows active website domain.

## Secure Connection

Shows live secure monitoring state.

## Tracker Intelligence

Displays tracker monitoring status.

## Protection Status

Security monitoring dashboard section.

---

# Issues Solved During Development

## Fixed localhost Website Detection

Problem:

```txt
Extension showed localhost instead of current tab
```

Solution:

Replaced:

```js
window.location.hostname
```

With:

```js
chrome.tabs.query()
```

---

## Fixed Broken package.json

Solved JSON parsing issues causing:

```txt
Unexpected end of JSON input
```

---

## Fixed Missing manifest.json

Solved:

```txt
Manifest file is missing or unreadable
```

by adding:

```txt
client/public/manifest.json
```

---

# Current Build Process

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Build Extension

```bash
npm run build
```

---

# Loading Extension in Chrome

1. Open:

```txt
chrome://extensions
```

2. Enable Developer Mode

3. Click:

```txt
Load unpacked
```

4. Select:

```txt
client/dist
```

---

# Planned Features

## Cybersecurity Features

* Real tracker detection
* Phishing detection
* Malicious URL scanning
* HTTPS verification
* Suspicious script detection
* Scam page detection
* Site reputation engine
* AI-based warning system

## UI Improvements

* Live activity graphs
* Animated security alerts
* Website favicon display
* Threat severity indicators
* Dark neon cybersecurity theme

## Browser Features

* Ad blocker
* Privacy protection
* Cookie tracker analysis
* Fingerprinting detection
* Safe browsing warnings

---

# Future Goals

Ubiqui_Shield aims to become a lightweight AI-powered cybersecurity browser assistant capable of:

* Protecting users from phishing and scams
* Detecting trackers and malicious scripts
* Providing privacy insights
* Giving real-time website risk analysis
* Acting as an AI browser security companion

---

# Current Development Status

Status: Active Development

Core dashboard and Chrome extension integration completed.

Next Phase:

* Real cybersecurity engine
* AI analysis system
* Threat intelligence integration
* Live monitoring
