# Changelog

## [1.1.1] - 2026-06-02

### Added

- WebGL2 fingerprint protection via overriding `WebGL2RenderingContext.prototype` methods (`getExtension`, `getParameter`).
- 15 new high-impact Declarative Net Request rules in `rules.json` (such as Google Tag Manager, TikTok, LinkedIn, Reddit, Twitter, Bing, Mixpanel, Segment, HubSpot, Quantcast, Comscore, AppNexus, AdRoll, FullStory, and Mouseflow), expanding network-level blocking to match the tracker database.
- Dynamic loading of tracker database from `trackers.json` in `content.js` via `chrome.runtime.getURL()`.
- Per-site protection toggle support in `content.js`, reading `siteSettings` and skipping tracker/cosmetic protections if disabled.
- Production-safe per-tab blocked tracking in `background.js` using `declarativeNetRequest.getMatchedRules` polling to resolve the issue where the debug counter stayed at 0 in production.

### Improved

- Cosmetic filtering safety: replaced overly broad `[id*="ad"]` and `[class*="ad"]` attribute selectors with safe hyphen-bounded patterns (`[id^="ad-"]`, `[id$="-ad"]`, `[class*="-ad-"]`, etc.) and specific selector lists for major ad providers. Removed generic `[class*="banner"]` to fix layout breaks on major sites.
- Content script injection model: registered `content.js` via manifest declarations to run at `document_idle` for compatibility first, avoiding runtime script loading issues.
- Code hygiene: completely removed Vite default scaffold styling boilerplate in `client/src/App.css` and fixed the extension popup's document title.

### Fixed

- Pre-existing malformed JSON syntax bug in `trackers.json` (orphaned trailing records merged, duplicates cleaned up).
- Missing content script declarations causing content script not to load on any page.
- Uncaught ReferenceError on page load from an undefined `enableFingerprintProtection()` function call in `content.js`.
- Dead MV2-only permissions (`webRequest` and `webRequestBlocking`) in `manifest.json` preventing successful modern MV3 security audit.
- Intermittent rule ID gaps in `rules.json` causing declarative net request rules to fail to register.

---

## [1.1.0] - 2026-06-01


### Added

- Advanced fingerprint protection
- Canvas fingerprint protection
- WebGL fingerprint protection
- Hardware concurrency spoofing
- Device memory spoofing
- Platform spoofing
- Improved tracker detection

### Improved

- Website compatibility
- Protection engine stability
- Extension performance
- Privacy controls

### Fixed

- LinkedIn compatibility issues
- YouTube loading issues
- Fingerprint protection conflicts
- Extension stability issues

---

## [1.0.0]

Initial release.

### Features

- Tracker blocking
- Ad blocking
- HTTPS upgrade
- Script blocking
- Third-party cookie cleanup
- Per-site controls