# Privacy Policy

Last Updated: June 2026

Ubiqui Shield is designed with privacy as a core principle.

## Data Collection

Ubiqui Shield does not collect, store, transmit, or sell any personal data.

The extension does not:

- Track browsing activity
- Collect personal information
- Store browsing history
- Sell user data
- Share user data with third parties

## Local Storage

The extension stores user preferences locally using the browser's `chrome.storage.local` API.

This includes:
- Global protection toggles (Fingerprinting, Tracker Blocking, Ad Blocking, HTTPS Upgrades)
- Site-specific toggle preferences (e.g., if protection is disabled for a specific hostname)
- Internal counter configurations

All preferences and settings are stored locally on the user's device. They are never synced, transmitted, or shared.

## Permissions

Ubiqui Shield uses the following browser permissions solely to deliver privacy protections:

- `storage`: To store user preferences and configurations locally on the device.
- `tabs` & `activeTab`: To query the active tab's hostname and status in order to display the correct protection state and update the blocked counter in the popup.
- `declarativeNetRequest` & `declarativeNetRequestFeedback`: To perform network-level tracker blocking. By using the Declarative Net Request API, the browser blocks requests directly. The extension does not need to inspect or read the content of web traffic, which ensures maximum user privacy and performance.
- `<all_urls>` (Host Permissions): Required to apply content scripts and inject fingerprint normalization protections uniformly across websites.

## Local-First Architecture

Unlike many extensions that download external rule lists or report telemetry, Ubiqui Shield operates entirely offline:
- **No Remote Databases**: The tracker classification list (`trackers.json`) and declarative net rules (`rules.json`) are bundled inside the extension package itself. No network lookups or updates are performed.
- **In-Memory Normalization**: Fingerprint protections (Canvas, WebGL/WebGL2, Audio, Hardware details) are applied dynamically in memory within the webpage context. These protections do not collect or log hardware statistics.
- **Zero Telemetry**: No tracking, usage analytics, error logging, or event tracking is integrated into the extension.

## Third Parties

Ubiqui Shield does not use external web services, analytics, telemetry, advertising, or third-party tracking services of any kind.

## Contact

For questions or suggestions regarding this Privacy Policy, please contact the project maintainers through GitHub.