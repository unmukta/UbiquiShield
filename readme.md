# Ubiqui_Shield

A modern browser security and privacy extension focused on:

* real-time tracker intelligence
* browser telemetry analysis
* website risk scoring
* privacy monitoring
* cybersecurity-focused browser protection

Built using React, Vite, TailwindCSS, and Chrome Extension APIs.

---

# 🚀 Current Status

## Project Stage

```txt id="qf4f8j"
Early MVP / Functional Prototype
```

Ubiqui_Shield has evolved from:

```txt id="j9sh6s"
frontend dashboard concept
```

into:

```txt id="j3kr6v"
real browser extension security architecture
```

---

# 🔥 Features

## ✅ Browser Security Dashboard

Modern Brave-inspired extension popup UI.

### Includes:

* Website monitoring
* Tracker intelligence
* Risk intelligence
* Protection status
* Real-time telemetry cards

---

# ✅ Live Website Monitoring

Detects:

* current active website
* active browser tab
* website hostname

Using:

```js id="4g65fp"
chrome.tabs
```

---

# ✅ Tracker Detection Engine

Scans websites for:

* Google Analytics
* DoubleClick
* Facebook Pixel
* TikTok Tracker
* Hotjar
* telemetry scripts
* analytics scripts

### Detection Methods

* script inspection
* DOM scanning
* telemetry heuristics

---

# ✅ Real-Time Telemetry System

Extension currently supports:

* content script injection
* browser telemetry collection
* storage synchronization
* live popup rendering

Using:

```js id="q2pnm5"
chrome.storage.local
```

---

# ✅ Risk Intelligence System

Calculates website risk scores based on:

* detected trackers
* telemetry indicators
* suspicious website activity

### Threat Levels

* Safe
* Low Risk
* Suspicious
* Dangerous

---

# ✅ Brave-Style Modern UI

UI redesigned to feel similar to:

* Brave Software Shields
* Malwarebytes Browser Guard
* Ghostery
* DuckDuckGo Privacy Essentials

### Design Philosophy

* clean
* minimal
* trustworthy
* browser-native
* modern dark UI

---

# 🛠 Technology Stack

## Frontend

* React
* Vite
* TailwindCSS

---

## Browser Extension APIs

* chrome.tabs
* chrome.storage
* content scripts
* service workers
* Manifest V3

---

## Cybersecurity Concepts

* browser telemetry
* heuristic detection
* tracker intelligence
* passive reconnaissance
* script inspection
* risk scoring

---

# 📁 Project Structure

```txt id="f9q4cf"
Ubiqui_Shield/
│
├── client/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── ui/
│   │   │   └── animations/
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── dist/
│   │   ├── manifest.json
│   │   ├── background.js
│   │   ├── content.js
│   │   └── assets/
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash id="xhzs7d"
git clone https://github.com/unmukta/UbiquiShield.git
```

---

## 2️⃣ Open Client Folder

```bash id="8zqv24"
cd UbiquiShield/client
```

---

## 3️⃣ Install Dependencies

```bash id="c5pd7k"
npm install
```

---

# ▶️ Run Development Server

```bash id="2ax4k9"
npm run dev
```

Local development server:

```txt id="kg7j99"
http://localhost:5173
```

---

# 🏗 Build Extension

IMPORTANT:

Extension loads from:

```txt id="vtl9l4"
client/dist
```

After changing React code:

```bash id="8rwxhl"
npm run build
```

---

# 🧩 Load Extension in Brave/Chrome

## Open:

```txt id="8dklqp"
brave://extensions
```

OR

```txt id="zhb5vy"
chrome://extensions
```

---

## Enable:

```txt id="eh9n4z"
Developer Mode
```

---

## Click:

```txt id="x0n2wb"
Load unpacked
```

---

## Select:

```txt id="vq0sh6"
client/dist
```

---

# 🔍 Current Working Systems

## Extension Systems

✅ popup UI
✅ Manifest V3
✅ content scripts
✅ background service worker
✅ extension storage
✅ browser API integration

---

## Telemetry Systems

✅ tracker scanning
✅ script inspection
✅ telemetry rendering
✅ risk scoring
✅ live synchronization

---

## UI Systems

✅ Brave-style redesign
✅ soft dark UI
✅ responsive cards
✅ modern typography
✅ consistent spacing

---

# ⚠️ Current Limitations

## Tracker Detection

⚠️ detection still inconsistent on some modern websites

Reason:

* trackers load dynamically
* Brave blocks some telemetry
* many trackers use fetch/XHR instead of scripts

---

## Live Synchronization

⚠️ popup timing and storage refresh still being improved

---

## Request Monitoring

❌ not implemented yet

---

## Active Blocking

❌ not implemented yet

---

# 🚀 Planned Features

Planned:

* request inspection
* network telemetry
* third-party request analysis
* tracker origin detection
* phishing detection
* suspicious domain heuristics
* malicious script analysis
* obfuscated JS detection
* tracker blocking
* malicious request blocking
* anti-fingerprinting basics
* privacy protection controls

---

# 🧠 Learning Outcomes

This project demonstrates:

* React engineering
* browser extension development
* Chrome Extension APIs
* cybersecurity fundamentals
* browser telemetry systems
* real-time UI synchronization
* browser monitoring architecture


---

# 🎯 Project Goal

Ubiqui_Shield aims to become:

```txt id="y00rkf"
a browser security intelligence platform
```

focused on:

* privacy
* telemetry analysis
* browser security
* tracker intelligence
* website risk analysis

---

# ⚠️ Disclaimer

Ubiqui_Shield is an educational cybersecurity project intended for:

* learning
* research
* browser security experimentation

Do not use for malicious purposes.

---

# ⭐ Future Vision

Long-term vision includes:

* advanced telemetry systems
* browser threat intelligence
* phishing detection
* request monitoring
* privacy scoring
* active browser protection
* anti-tracking systems
