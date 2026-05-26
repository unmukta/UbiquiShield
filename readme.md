# Ubiqui_Shield

A modern cybersecurity-focused browser extension built using React, Vite, TailwindCSS, and Chrome Extension APIs.

Ubiqui_Shield provides:

* real-time website monitoring
* tracker detection
* browser telemetry analysis
* live risk intelligence
* cybersecurity dashboard UI

---

# 🚀 Features

## ✅ Live Website Monitoring

Detects and displays the currently active website in real time.

## ✅ Tracker Detection Engine

Scans websites for:

* Google Analytics
* DoubleClick
* Facebook trackers
* TikTok pixels
* Hotjar scripts
* advertising/tracking scripts

## ✅ Real-Time Telemetry

Uses browser storage synchronization to display live tracker updates inside the extension popup.

## ✅ Risk Intelligence System

Generates a basic website threat score based on:

* detected trackers
* telemetry indicators
* suspicious activity

## ✅ Cybersecurity Dashboard UI

Modern glassmorphism/neon UI inspired by:

* Brave Shields
* Ghostery
* Malwarebytes Browser Guard
* Cyberpunk-style dashboards

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* TailwindCSS

## Browser Extension APIs

* chrome.storage
* chrome.tabs
* content scripts
* service workers
* Manifest V3

## Cybersecurity Concepts

* browser telemetry
* tracker fingerprinting
* heuristic detection
* passive reconnaissance
* script inspection
* runtime analysis

---

# 📁 Project Structure

```txt
Ubiqui_Shield/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── animations/
│   │   │   ├── dashboard/
│   │   │   └── ui/
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── dist/
│   ├── package.json
│   └── vite.config.js
│
├── extension/
├── server/
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/unmukta/UbiquiShield.git
```

---

## 2️⃣ Open Project

```bash
cd UbiquiShield/client
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

# ▶️ Run Development Server

```bash
npm run dev
```

Vite development server will start on:

```txt
http://localhost:5173
```

---

# 🏗 Build Extension

IMPORTANT:

The extension loads from:

```txt
client/dist
```

So after every React/UI change:

```bash
npm run build
```

---

# 🧩 Load Extension in Brave/Chrome

## Open:

```txt
brave://extensions
```

OR

```txt
chrome://extensions
```

---

## Enable:

* Developer Mode

---

## Click:

* Load Unpacked

---

## Select:

```txt
client/dist
```

---

# 🔥 Current Working Features

## Browser Protection

* active website detection
* secure connection UI
* protection status cards

## Tracker Intelligence

* tracker detection
* telemetry synchronization
* detected tracker list
* tracker classification

## Risk Intelligence

* risk scoring
* threat level system
* live dashboard updates

---

# 🧠 How Tracker Detection Works

The extension injects a content script into websites and scans:

```js
document.querySelectorAll("script")
```

for:

* tracking domains
* analytics scripts
* advertising frameworks
* telemetry libraries

Detected trackers are stored using:

```js
chrome.storage.local
```

and displayed inside the popup UI in real time.

---

# 📌 Current Detected Trackers

Supported detections:

* Google Analytics
* DoubleClick
* Facebook Tracker
* TikTok Pixel
* Hotjar

---

# 🔮 Planned Features

## Next Phase — Advanced Security Intelligence

* phishing heuristics
* suspicious script analysis
* malicious domain scoring
* obfuscated JS detection

---



## Dashboard Features

* Tracker Intelligence
* Risk Intelligence
* Protection Status
* Website Monitoring
* Real-Time Telemetry

---

# 🎯 Project Goals

Ubiqui_Shield is designed as:

* a cybersecurity learning project
* a real browser telemetry system
* a portfolio-grade extension
* a browser security analysis platform

---

# 📚 Learning Outcomes

This project demonstrates:

* React engineering
* browser extension development
* Chrome Extension APIs
* cybersecurity concepts
* telemetry systems
* real-time UI synchronization
* browser monitoring architecture

---


# ⚠️ Disclaimer

Ubiqui_Shield is an educational cybersecurity project intended for:

* learning
* research
* browser security experimentation

Do not use for malicious purposes.

---

# ⭐ Future Vision

Long-term goal:

Transform Ubiqui_Shield into a full browser security platform capable of:

* threat intelligence
* phishing detection
* tracker blocking
* malicious script analysis
* privacy protection
* browser security analytics
