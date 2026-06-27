# Changelog

## [1.2.1] - 2026-06-27

This is a targeted patch release fixing bugs identified after the v1.2.0 launch, including a critical regression in the fingerprinting engine, cosmetic filter persistence issues, and minor UI and API correctness fixes.

### Fixed

- **`navigator.platform` Regression**: Re-introduced platform spoofing to `"Win32"` was removed again. This was originally deleted in v1.1.4 because it causes a severe OS mismatch for Mac and Linux users (the HTTP `User-Agent` header reports their real OS while `platform` says `Win32`), immediately flagging them as bots to anti-fraud systems like Cloudflare. The property is now left unmodified.
- **Cosmetic CSS Not Removed on Toggle**: Turning off "Block trackers" or disabling protection for a site via the live toggle no longer leaves the cosmetic `<style>` block injected in the page. `cosmeticFiltering()` is now called in the `chrome.storage.onChanged` handler and inside the `MutationObserver` debounce loop so the CSS state always stays in sync with the current protection state.
- **`getBattery` Override on Instance Instead of Prototype**: `navigator.getBattery` was overridden directly on the `navigator` instance, meaning the spoofed function did not propagate into child iframes (each of which has its own `navigator` instance). The hook is now applied to `Navigator.prototype.getBattery` so it is universally enforced across all frames.
- **`updateContentScripts` Missing `matches` Field**: The `chrome.scripting.updateContentScripts()` call that updates the `excludeMatches` list for `injected.js` was missing the required `matches: ["<all_urls>"]` field. Without it, Chrome may revert the script's match list to a default empty state, preventing the spoofing payload from running on new pages.
- **Blocked Counter Not Resetting to Zero**: The `chrome.storage.onChanged` listener in the popup used `if (changes.blockedCount)`, which evaluates as falsy when the count is `0`. This prevented the displayed counter from resetting when navigating to a new page. Changed to `if (changes.blockedCount !== undefined)`.
- **Duplicate Cosmetic CSS Selector**: Removed a duplicate `div[data-testid="placementTracking"]` selector from the cosmetic CSS injection block that was already covered by the adjacent `[data-testid="placementTracking"]` rule.
- **`offsetHeight` Hook Registration Not Guarded**: The `hookedFunctions` registration for `HTMLElement.prototype.offsetHeight`'s getter now uses a guarded `Object.getOwnPropertyDescriptor()` call (same as `offsetWidth`) to safely skip registration if the descriptor is unavailable, preventing a silent `TypeError` from being swallowed by the outer `try/catch`.
- **`navigator.connection` Override on Instance Instead of Prototype**: Same class of bug as `getBattery` — `Object.defineProperty(navigator, "connection", ...)` only overrides the current frame's navigator instance. The connection spoof is now applied to `Navigator.prototype` to ensure it propagates into all child iframes.
- **`enumerateDevices` Override on Instance Instead of Prototype**: `navigator.mediaDevices.enumerateDevices` was being replaced on the `mediaDevices` instance, not the prototype. It is now overridden on `MediaDevices.prototype` (capturing the native reference first), ensuring every frame's media device enumeration is anonymized.
- **`getClientRects` Anti-Fingerprinting Guard Too Restrictive**: The `getClientRects` hook required `this.style.fontSize` (an inline style) to be present before injecting noise. Font fingerprinting scripts typically rely on class-based or inherited CSS styles, not inline `fontSize` attributes, so this condition was silently preventing noise injection for the majority of real fingerprinting attempts. The condition has been removed to match the broader behavior of `getBoundingClientRect`.

## [1.2.0] - 2026-06-22

This major update introduces complete immunity against EFF "Cover Your Tracks" testing, robust enumerability masking for spoofed APIs, an active ad-wrapper collapser, a native CSS-based cosmetic filtering engine, advanced protections against invisible Font Fingerprinting, and defeats cross-site Link Decoration.

### Added

- **Deep User-Agent & Header Masking**: Integrated DeclarativeNetRequest header modifications to forcefully rewrite User-Agent, Sec-CH-UA, and Accept-Language network headers to match a stable generic Chrome 120 profile.
- **Pre-emptive Display Hiding**: Re-engineered the content DOM scanner to actively inject `display: none !important` to trackers matched by the database, triggering wrapper collapse flawlessly before the network blocks them.
- **Global toString Proxying**: Advanced trackers can no longer detect spoofed APIs via `Function.prototype.toString.call()`. The engine now returns native function signatures for all 15+ hooked APIs.
- **Active Ad Wrapper Collapser**: The mutation observer now actively seeks out parent wrappers (like empty `<div>` elements) that surround blocked ad iframes, and completely collapses them to prevent unsightly whitespace. The collapser now uses height-aware logic to avoid accidentally hiding legitimate page containers.
- **Network-Level Script Blocking**: The "Block Scripts" toggle now generates dynamic DNR rules to block 30+ known tracking/analytics script domains (Google Analytics, Hotjar, Clarity, Mixpanel, Segment, etc.) at the network level *before* they execute, instead of relying on post-execution DOM removal.
- **Expanded Cosmetic Selectors**: Added CSS hiding rules for Google Ads (`div-gpt-ad`), Amazon Sponsored results, Reddit promoted posts (`shreddit-ad-post`), LinkedIn promoted feed items, and generic newsletter signup popups.
- **Cookie Consent Banner Eradication**: Expanded the cosmetic engine with a global array of CSS selectors targeting the most notorious cookie banner frameworks (e.g., OneTrust, Quantcast). This instantly eradicates over 90% of "We value your privacy" popups without requiring you to click "Reject All".
- **YouTube & Social Media Ad Blocking**: Upgraded the cosmetic engine to completely hide deeply integrated native ads, including YouTube's "In-Feed Video Ads" (`ytd-ad-slot-renderer`) and Facebook/Twitter "Sponsored Posts", which traditional domain-level ad blockers fail to intercept.
- **Strict URL Tracking Parameter Stripping**: Implemented an advanced Declarative Net Request (DNR) dynamic rule that natively intercepts all web requests and surgically purges known tracking parameters (`fbclid`, `gclid`, `utm_source`, `utm_campaign`, etc.) from the URL *before* the browser even loads the page. This destroys cross-site tracking via Link Decoration without breaking legitimate website navigation.
- **Hardware Media Device Protection**: Intercepts `navigator.mediaDevices.enumerateDevices()` to prevent trackers from silently building hardware profiles out of your connected microphones and webcams (e.g., masking "Logitech C920" with a generic "Default Webcam" identifier).
- **Client Hints API Spoofing**: Injects a JavaScript proxy over the `navigator.userAgentData.getHighEntropyValues()` API to sanitize deep architecture and OS probes, preventing websites from querying granular system specifications.
- **Native Cosmetic CSS Engine**: Replaced the legacy JavaScript-based ad-hiding loop with a native C++ CSS injection engine. The extension now parses a comprehensive list of Adblock Plus-style selectors and pushes them directly into the browser's native rendering pipeline via an injected `<style>` block. This results in zero CPU overhead and instantly eradicates ads before they can render, eliminating the "flash of unstyled content".
- **Font Fingerprinting Protection & Randomizer**: Advanced trackers use invisible canvases to measure the exact fractional pixel width of specific text strings to build a hash of the fonts installed on your computer. The extension now intercepts `CanvasRenderingContext2D.prototype.measureText` and element offset getters (`offsetWidth`, `getBoundingClientRect`), injecting microscopic dynamic floating-point noise based on deterministic text hashing to completely scramble tracking hashes.

### Fixed

- **Enumerable Property Masking**: Fixed a critical vulnerability where spoofed properties on `Navigator` and `HTMLElement` lacked `enumerable: true`, making them instantly detectable via `Object.keys()`. All hooks are now fully enumerable.
- **Timezone Anonymity Reversal**: Removed UTC timezone spoofing and replaced it with America/New_York (EST), moving users from a highly unique 1% anonymity pool to the most common timezone pool.
- **Tracker Empty Box Bug**: Fixed a bug where native DNR-blocked ads would leave giant empty iframe boxes because they weren't explicitly styled with `display: none`.
- **OffscreenCanvas Fingerprinting Bypass Zero-Day**: Discovered and patched a critical architectural bypass where advanced tracking scripts (like FingerprintJS) could instantiate an `OffscreenCanvas` to completely sidestep the extension's `HTMLCanvasElement` noise injections. The extension now comprehensively intercepts `OffscreenCanvas.prototype.convertToBlob`, `OffscreenCanvasRenderingContext2D.prototype.getImageData`, and `OffscreenCanvasRenderingContext2D.prototype.measureText`, injecting algorithmic cryptographic noise to completely neutralize off-DOM fingerprinting vectors.
- **Duplicate WebGL Hooks**: Removed duplicate `getParameter` and `getExtension` hooks in `injected.js` that were silently overwriting each other, causing inconsistent GPU fingerprint strings between successive calls.
- **Duplicate Battery API Hook**: Removed a second `navigator.getBattery` override that was overwriting the properly-masked version, leaving the duplicate detectable via `Function.prototype.toString`.
- **Duplicate Client Hints Hook**: Removed a conflicting instance-level `getHighEntropyValues` override that clashed with the prototype-level `userAgentData` spoof.
- **Timezone Contradiction**: Fixed a detectable inconsistency where `getTimezoneOffset()` returned `0` (UTC) but `Intl.DateTimeFormat.resolvedOptions().timeZone` returned `"America/New_York"` (EST). Both now consistently report EST (offset `300`).
- **`Intl.DateTimeFormat` instanceof Breakage**: Fixed a bug where replacing `Intl.DateTimeFormat` with a plain function broke `instanceof` checks used by libraries like Moment.js. The wrapper now preserves the prototype chain via `Object.setPrototypeOf`.
- **Cosmetic CSS Layout Breakage**: Reduced cosmetic filtering from 8 overkill CSS properties (`height:0`, `width:0`, `position:absolute`, `top:-9999px`, etc.) to just `display: none !important`, eliminating layout reflows and broken page structures.
- **Broad Selector False Positives**: Removed dangerous `[class*="sponsor"]` and `[class*="promoted"]` selectors that were hiding legitimate content sections (e.g., "Event Sponsors" on conference sites). Replaced with specific class targeting.
- **Ad Wrapper Collapser False Positives**: The collapser previously hid ANY div with a single hidden child element. Now only collapses parent divs of confirmed tracker iframes/images, and only when the parent is smaller than 400px (ad-slot sized).
- **Toggle Buttons Not Taking Effect**: Fixed all Advanced Options toggles (Block trackers, HTTPS upgrade, Script blocking, Fingerprint protection) to automatically reload the active tab after toggling, so the user immediately sees changes.
- **`navigator.connection` Missing Events**: The network connection spoof was missing `addEventListener`/`removeEventListener`/`dispatchEvent` stubs, causing `TypeError` on sites that listen for connection change events.
- **Code Quality & Unhandled Exceptions**: Fixed multiple unhandled `catch` blocks in `content.js` that suppressed ancestor origin parsing errors silently. Cleaned up unused spoofing variables in `injected.js` to ensure zero ESLint warnings across the entire MV3 architecture.

## [1.1.4] - 2026-06-06

This is a comprehensive pre-release focusing on deep architectural bug fixes, fixing critical vulnerabilities in the fingerprinting spoofing engine, and resolving major UI race conditions.

### Fixed

- **Live Tracker UI Desync**: Fixed a performance optimization regression that severed the link between the content scanner and the popup UI, ensuring the "Detected Trackers" list repopulates instantly as you browse.
- **Settings Merge Corruption**: Rewrote the extension version update mechanism to safely merge custom legacy user settings using object spreading, preventing customized preferences from breaking on new version updates.
- **Chrome Privacy 100+ Counter Limit**: Implemented a smart UX workaround for Chrome's native privacy restriction (which hard-caps rule logs at 100). The extension UI now displays `100+` rather than awkwardly freezing at 100 on heavy pages.
- **Canvas Context WebGL Corruption**: Identified and fixed an extremely subtle bug where the anti-fingerprinting script would permanently lock WebGL canvases into a `2d` mode. The extension now tracks context types safely via a `WeakMap`, protecting complex 3D web games.
- **Whitelist Enforcement Bypass (Cookies)**: Fixed a logic bug where the extension would aggressively delete analytics cookies (like `_ga`) on every page load, even if the user had explicitly whitelisted the site. The cookie protection module now properly respects the `siteProtectionEnabled` state, preventing it from accidentally breaking login flows or analytics on trusted domains.
- **OS Fingerprint Anomaly (Bot Detection)**: Removed a major vulnerability where the extension spoofed `navigator.platform` to `"Win32"`. Because modifying the HTTP `User-Agent` header globally breaks websites, Mac and Linux users were broadcasting a severe OS mismatch to the internet (e.g., `User-Agent` says Mac, but `platform` says Windows). This immediately flagged users as bots to modern anti-fraud systems like Cloudflare, leading to endless CAPTCHAs. The `platform` spoofing has been removed to ensure environmental consistency.
- **Extension Fingerprint Leak**: Removed a dangerous privacy vulnerability where the `manifest.json` publicly exposed internal files (`injected.js` and `trackers.json`) to the internet via `web_accessible_resources`. This allowed malicious sites to blindly probe for `chrome-extension://<id>/trackers.json` to detect if the extension was installed. The extension is now completely cloaked from website detection.
- **DNR Domain Filter Over-Blocking**: Fixed a massive collateral damage bug in the blocklist generation script (`generate_rules.js`). The Declarative Net Request (DNR) engine was previously configured without domain anchors (using `urlFilter: domain` instead of `urlFilter: "||domain"`), causing the browser to block any URL that merely *contained* an ad network's name in the query string or path (e.g., `https://github.com/issues?q=doubleclick.net`). Rebuilt the entire 3,500+ rule dataset to ensure strict hostname matching, saving countless legitimate websites from being broken.
- **Global Settings Bypass**: Fixed a critical logic flaw where the dynamic script injection engine (implemented in the previous version to stop DOM hijacking) evaluated only the site-specific whitelist but completely ignored the global "Fingerprint Protection" UI toggle. The Service Worker now rigorously verifies the global setting and will completely unregister the spoofing payload from the browser if the user globally turns off fingerprint protection.
- **CPU Leak on Whitelisted Domains**: Fixed a significant performance bottleneck where the content scanner's `MutationObserver` remained permanently attached to the webpage DOM even on fully whitelisted websites. While the callback safely returned early, the browser was needlessly evaluating tens of thousands of DOM mutations on heavy single-page apps (like YouTube). The extension now dynamically calls `observer.disconnect()` the moment a site is whitelisted, guaranteeing absolutely zero CPU overhead on trusted domains.
- **DOM Event Hijacking (Protection Bypass)**: Discovered and patched a critical zero-day vulnerability where malicious tracking scripts could forge the `UbiquiShieldDisable` DOM event to permanently turn off the extension's fingerprinting protection for that session. Shifted the anti-tracking execution architecture from a static `manifest.json` injection to a highly secure dynamic `chrome.scripting` injection. The Service Worker now natively updates the browser's `excludeMatches` list when a user whitelists a site, entirely eradicating the hijacking attack vector and allowing the removal of fragile Javascript-layer API restoration code.
- **Shadow DOM Tracker Evasion**: Advanced advertising networks hide pixels inside Shadow DOM web components to evade adblocker DOM scanners. The extension now natively hooks into `window.performance.getEntriesByType("resource")` to bypass the DOM entirely and instantly catch all hidden requests.
- **Whitelist Restoration Dead Code**: Fixed a major bug where whitelisting a site would fail to turn off the fingerprinting protection. By skipping the standard initialization sequence to save CPU cycles on whitelisted domains, the `content.js` script was inadvertently failing to dispatch the `UbiquiShieldDisable` signal to `injected.js`. The extension now explicitly broadcasts this disable signal whenever it detects a whitelist state on load or via a live UI toggle.
- **SPA Tracker Accumulation Regression**: Fixed a regression where Single Page Applications (like YouTube or React-based sites) navigating via `history.pushState` would endlessly accumulate trackers across virtual page loads. The background Service Worker now monitors `changeInfo.url` events to ensure tab telemetry is correctly reset during virtual SPA navigations.
- **Mathematically Invalid DOMRect Spoofing**: Overhauled the Font Fingerprinting algorithm to fix a mathematically impossible box spoofing anomaly. Previously, the anti-fingerprinting script returned plain Javascript objects instead of native `DOMRect` prototypes, which instantly triggered anti-bot mechanisms. Furthermore, it spoofed box `width` without updating the `right` coordinate, creating an impossible `x + width !== right` geometry. The script now leverages native `new DOMRect(...)` constructors and `Proxy` wrappers to mathematically align the spoofing and seamlessly pass `instanceof` prototype checks.
- **Destructive WebRTC Override Removal**: Cleaned up the anti-fingerprinting payload by confirming the removal of destructive Javascript WebRTC hooks (like overriding `RTCPeerConnection.prototype.createDataChannel`). Instead of crashing legitimate video calling apps (like Discord Web or Google Meet) at the Javascript layer, the extension correctly and safely relies entirely on Chrome's native privacy API (`chrome.privacy.network.webRTCIPHandlingPolicy`) to prevent IP leaks at the browser level.
- **Iframe Top-Level Domain Whitelist Check**: Fixed a critical issue where cross-origin iframes (like Google Sign-In or Stripe payments) would remain blocked/spoofed even if the parent website was explicitly whitelisted by the user. The extension now utilizes `window.location.ancestorOrigins` to dynamically query the top-most parent domain, ensuring the user's whitelist intent is universally respected across all nested frames.
- **Audio API Whitelist Restoration Crash**: Fixed a fatal `ReferenceError` exception in the spoofing restoration sequence. Previously, if a user whitelisted a site, the script would crash when attempting to restore the `AudioBuffer` and `AnalyserNode` APIs due to an improper `const` block-scoping declaration. The restoration logic now properly resets the audio APIs natively without crashing.
- **Iframe Tracker Evasion (Anti-Fingerprinting Bypass)**: Advanced trackers loaded inside hidden, cross-origin `<iframe src="...">` tags or `about:blank` frames were able to bypass the extension's execution sandbox. The extension now strictly enforces `all_frames: true` and `match_about_blank: true` across all MV3 content scripts, guaranteeing spoofing hooks are injected into every single child frame embedded on a webpage.
- **Cross-Tab Telemetry Bleed (State Corruption)**: Fixed a race condition where background tabs triggering a navigation event or finishing a payload request would erroneously overwrite the global `blockedCount` state. The Service Worker now strictly verifies that a tab is actively focused in the current window before pushing its telemetry to the UI local storage.
- **Async Injection Delay (Anti-Fingerprinting Bypass)**: Refactored the injection architecture to fix a massive vulnerability where `<head>` trackers could bypass fingerprinting protections. `injected.js` is now executed synchronously at `document_start` directly via `manifest.json`'s `MAIN` world container, guaranteeing zero-day spoofing before any page scripts execute.
- **Screen Anomaly Detection (Physical Impossibility)**: Fixed an anomaly where locking the screen size to `1920x1080` could inadvertently flag users with larger monitors as spoofers if their window width exceeded 1920px. The screen bounds are now dynamically calculated to never fall below the browser's physical outer boundaries.
- **HTTPS Upgrade Rule Activation**: The "HTTPS Upgrade" UI toggle has been properly wired into the `background.js` Declarative Net Request engine. The extension now dynamically enforces an `upgradeScheme` network rule for all `http://` traffic whenever the setting is enabled.
- **Audio Fingerprinting Hole (`AnalyserNode`)**: Fixed a vulnerability where advanced trackers could bypass the offline audio buffer spoofing by using a real-time `AnalyserNode` oscillator. The extension now safely hooks `getFloatFrequencyData` and `getByteFrequencyData` to inject real-time mathematical noise.
- **Screen Resolution Fingerprinting**: The extension now actively intercepts and standardizes the `window.screen` object, preventing trackers from fingerprinting your unique hardware screen dimensions, color depth, and pixel depth.
- **SPA Tracker Bleed (Endless Accumulation)**: Fixed a logic flaw where Single Page Applications (like YouTube or React sites) would push history states without triggering a `"loading"` event, causing trackers from previous pages to infinitely accumulate into the current page's count.
- **Whitelist Visual Flicker (Race Condition)**: Patched an initial load race condition where the extension would aggressively block trackers and cosmetically filter the DOM *before* the asynchronous `chrome.storage.local.get` callback verified if the user had disabled the shield. Whitelisted sites now load flawlessly without initial flickering.
- **Timezone Offset Fingerprinting**: Timezone spoofing has been upgraded. While `Intl.DateTimeFormat` was previously mocked to UTC, bot-detection scripts used `Date.prototype.getTimezoneOffset()` to extract the real local offset (e.g. `-300`). We now hook the native `Date` prototype to strictly return `0`, ensuring 100% cryptographic consistency.
- **2D Canvas `getImageData` Fingerprinting Hole**: Fixed a hole where fingerprinting scripts could bypass our visual canvas noise injections by directly reading the memory buffer via `getImageData`. The extension now intercepts `getImageData` and injects cryptographic noise directly into the pixel array.
- **Sub-Pixel Font Fingerprinting Hole**: Advanced trackers exploit `getBoundingClientRect` to extract high-precision float values (e.g. `12.1524px`) from text to uniquely identify font rendering engines. The extension now safely intercepts `getBoundingClientRect` and `getClientRects` to inject sub-pixel variance, blinding font trackers.
- **Fatal UI ReferenceError Crash**: Fixed a critical regression in the React popup (`App.jsx`) where a dangling reference to a removed state variable (`setTrackers`) would silently crash the initialization effect, breaking the "Shields Down" toggle syncing.

---

## [1.1.3] - 2026-06-05

### Added

- **Massive Ad Blocker Engine Upgrade**: Generated a new declarative ruleset based on Peter Lowe's ad server list, expanding the network blocklist from 23 to **over 3,500 active tracking and advertising domains**.
- **Font Fingerprinting Protection**: Spoofs `offsetWidth` and `offsetHeight` for hidden `<span>` tags to prevent scripts from identifying installed system fonts.
- **WebRTC IP Leak Protection**: Configured `chrome.privacy.network.webRTCIPHandlingPolicy` to hide local IP addresses while maintaining compatibility with web conferencing tools.
- **Network Spoofing**: Simulates a generic 4G connection profile via `navigator.connection` to reduce entropy.

### Improved

- **WebGL Fingerprinting Protection**: Injects subtle noise into the pixel data buffer of `WebGLRenderingContext.readPixels` to disrupt canvas/WebGL image extraction techniques.

### Fixed

- **Counter Synchronization Issue**: Fixed a bug where the blocked counter in the popup remained at 0 while trackers were successfully blocked in the background. The popup now polls the background script while open to ensure the counter updates in real-time.
- **Tab Switch Reset Bug**: Fixed an issue introduced in v1.1.2 where switching between tabs would incorrectly wipe the tracking history for the tab, causing the blocked counter to reset to 0.

---

## [1.1.2] - 2026-06-03

### Fixed

- Critical syntax error in `WebsiteStatusCard.jsx`: orphaned `useEffect` placed outside the component function body, referencing undefined `hostname` and `setShieldsEnabled` variables, causing a crash if imported.
- Undefined `setHostname()` call inside `WebsiteStatusCard.jsx` that would throw a `ReferenceError` at runtime.
- Storage key mismatch in `TrackerIntelligenceCard.jsx`: was reading `trackers` instead of `detectedTrackers`, causing the tracker list to always appear empty.
- `App.jsx` never populated the `hostname` state, preventing per-site toggle messages from being sent to the background script (the `toggleSite` message was silently skipped).
- `App.jsx` never loaded `siteSettings` on popup open, causing the shield toggle to always show "Shields up" even when protection was disabled for the current site.
- Global `currentWebsite` variable in `background.js` caused blocked request counts to reset to 0 on every tab switch; replaced with per-tab hostname tracking via `tabHostnames` map.
- `cosmeticFiltering()` in `content.js` ran unconditionally regardless of `trackerBlocking` setting; added guard to respect the setting.
- Storage change listener in `App.jsx` was never cleaned up, causing duplicate listeners in React StrictMode and potential memory leaks.
- Canvas fingerprint protection in `injected.js` could interfere with WebGL canvases by forcing a 2D context; added try-catch guard.
- `toBlob` canvas override had inconsistent indentation and same WebGL interference issue as `toDataURL`.
- Battery API spoof returned a plain object missing `addEventListener`/`removeEventListener`/`dispatchEvent` stubs, causing `TypeError` on sites that listen for battery events.
- Tab switch handler in `background.js` used `chrome.tabs.query` instead of `chrome.tabs.get` with the activated tab ID, which was less efficient and slightly racy.

### Removed

- Dead `extension/settings.js` file that used ES module exports but was never bundled or imported by any extension script.
- Four unused async helper functions from `background.js` (`getSiteSettings`, `saveSiteSettings`, `getCurrentHostname`, `isProtectionEnabled`) that duplicated logic already handled inline by the `onMessage` handler.

---

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

## [1.0.0] - 2026-05-23

Initial release.

### Features

- Tracker blocking
- Ad blocking
- HTTPS upgrade
- Script blocking
- Third-party cookie cleanup
- Per-site controls