# Privacy Policy

**Last Updated:** June 2026
**Extension Version:** 1.2.1

Ubiqui Shield is designed with privacy as its core principle. This policy explains exactly what the extension does and does not do with your data.

---

## Data Collection

**Ubiqui Shield does not collect, store, transmit, or sell any personal data. Period.**

The extension does not:

- Track your browsing activity
- Collect personal information
- Store your browsing history
- Record which websites you visit
- Transmit any data to external servers
- Report errors, crashes, or usage statistics
- Sell or share user data with any third party
- Use analytics, telemetry, or tracking services of any kind

---

## Local Storage

The extension stores your preferences locally on your device using the browser's `chrome.storage.local` API (or `browser.storage.local` on Firefox). This data never leaves your device.

**Stored data includes:**

| Data | Purpose |
|---|---|
| Protection toggle states | Remember whether Tracker Blocking, Fingerprint Protection, HTTPS Upgrade, Script Blocking, and Cookie Cleanup are on or off |
| Per-site protection overrides | Remember if you've disabled protection for specific websites (e.g., "Shields Down" on `example.com`) |
| Active tab blocked count | Display the number of blocked trackers on your current tab in the popup |
| Detected tracker list | Display the names of tracker domains found on your current tab |

All of this data is:
- Stored locally on your device only
- Never synced to any cloud service
- Never transmitted over the network
- Automatically cleared if you uninstall the extension

---

## Network Activity

**Ubiqui Shield makes zero network requests of its own.**

- The tracker blocklist (`rules.json`) and tracker database (`trackers.json`) are bundled directly inside the extension package. They are never downloaded from a remote server.
- Fingerprint protections (Canvas, WebGL, Audio, Font, Battery, Timezone) are applied dynamically in memory within the webpage context. They do not collect, log, or transmit any hardware statistics.
- The extension does not phone home, check for updates independently, or communicate with any external API.

---

## Permissions Explained

Ubiqui Shield requests the minimum set of browser permissions required to deliver its privacy protections. Here is a plain-language explanation of each:

| Permission | Why It's Needed |
|---|---|
| **`storage`** | To save your preferences (toggle states, per-site settings) locally on your device. |
| **`tabs`** | To read the active tab's URL so the popup can display the correct hostname, blocked count, and per-site toggle state. The extension does not read page content through this permission. |
| **`declarativeNetRequest`** | To block tracking domains at the network level using the browser's built-in rule engine. This approach is more private than legacy methods because the extension never sees or intercepts your actual web traffic — the browser blocks the requests natively. |
| **`declarativeNetRequestFeedback`** | To count how many tracking requests were blocked on the current tab, so the popup can display an accurate blocked counter. |
| **`privacy`** | To configure the WebRTC IP handling policy, preventing websites from discovering your local IP address through WebRTC peer connections. |
| **`scripting`** | To dynamically register the fingerprint protection script into web pages. This allows the extension to respect per-site settings (unregistering the script on whitelisted sites). |
| **`<all_urls>` (Host Permissions)** | Required so that the content script (cosmetic ad filtering) and the fingerprint protection script can run on any website you visit. Without this, protection would only work on a manually maintained list of domains. |

---

## Third-Party Services

Ubiqui Shield does not integrate, communicate with, or depend on any external web services, APIs, analytics platforms, advertising networks, or third-party tracking services.

The extension is entirely self-contained.

---

## Cookie Handling

When the "Third-Party Cookies" protection is enabled, the extension periodically removes a specific, hardcoded list of known tracking cookies from your browser. These include:

- `_ga`, `_gid`, `_gat` (Google Analytics)
- `_fbp`, `_fbc` (Facebook Pixel)
- `_hjSession`, `_hjSessionUser` (Hotjar)
- `_uetmsclkid` (Microsoft/Bing Ads)
- `__gads`, `__gpi` (Google Ad Services)
- `_pin_unauth` (Pinterest)
- `_tt_enable_cookie` (TikTok)

The extension **does not** delete session cookies, authentication cookies, shopping cart cookies, or any cookie not on this explicit list. Your logins and website functionality are preserved.

---

## Open Source

Ubiqui Shield is open source. You can inspect every line of code at any time to verify these claims:

**GitHub:** [https://github.com/unmukta/UbiquiShield](https://github.com/unmukta/UbiquiShield)

---

## Changes to This Policy

If this privacy policy is updated, the changes will be reflected in this document with an updated "Last Updated" date. No changes will ever introduce data collection.

---

## Contact

For questions, concerns, or suggestions regarding this Privacy Policy, please open an issue on the [GitHub repository](https://github.com/unmukta/UbiquiShield/issues) or contact the project maintainer through GitHub.