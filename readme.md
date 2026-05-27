# Ubiqui_Shield

Privacy-focused browser protection extension built for Chromium-based browsers.

## Features

- Tracker & ad blocking
- Fingerprint protection
- Third-party cookie controls
- Privacy Relay system
- Clean modern popup UI
- Website-specific shield controls
- Live blocked tracker counter
- Dynamic protection states
- Lightweight and fast

---

### Main Dashboard

- Website-specific protection
- Privacy Relay toggle
- Tracker statistics
- Advanced protection controls

---

## Tech Stack

- React
- Vite
- TailwindCSS
- Chrome Extension Manifest V3

---

## Project Structure

```bash
client/
├── src/
│   ├── components/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
└── dist/

extension/
├── manifest.json
├── background.js
├── content.js
└── icons/
```

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/unmukta/UbiquiShield.git
```

### 2. Install Dependencies

```bash
cd client
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build Extension

```bash
npm run build
```

---

## Load Extension in Browser

1. Open:

```text
brave://extensions
```

or

```text
chrome://extensions
```

2. Enable:

```text
Developer Mode
```

3. Click:

```text
Load unpacked
```

4. Select:

```text
extension/
```

---

## Building Production Files

After every UI change:

```bash
npm run build
```

Copy contents from:

```text
client/dist/
```

into:

```text
extension/
```

Then reload extension.

---

## Current Status

### Implemented

- Modern popup UI
- Dynamic site favicon support
- Shield toggles
- Privacy Relay card
- Advanced protection options
- Clean responsive layout

### Planned

- Real tracker detection
- Threat intelligence API
- Smart phishing detection
- DNS protection engine
- Secure browsing reports

---

## Browser Support

- Google Chrome
- Microsoft Edge
- Chromium browsers

---

## License

MIT License

---