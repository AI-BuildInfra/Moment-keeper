# Privacy Policy for Moment-Keeper

**Last Updated:** September 29, 2026  
**Effective Date:** September 29, 2026  
**Application:** Moment-Keeper (Android & Web)  
**Developer / Data Controller:** AI-BuildInfra ([https://aibuildinfra.com](https://aibuildinfra.com))  
**Project Page:** [https://aibuildinfra.com/projects/moment-keeper](https://aibuildinfra.com/projects/moment-keeper)  
**Contact / Privacy Inquiries:** `privacy@aibuildinfra.com`

---

## 1. Introduction & Overview

Moment-Keeper ("we", "our", or "the App") is developed and maintained by **AI-BuildInfra**. This Privacy Policy explains transparently how personal data is collected, processed, stored, and protected when you use the Moment-Keeper mobile application on Google Play and its associated web services.

We operate under a strict **data minimization and privacy-first philosophy**:
- We collect **only** what is necessary to operate the application.
- We **never sell, rent, monetize, or trade** your personal information.
- We **do not use advertising SDKs, analytics tracking networks, or third-party data brokers**.
- We employ **zero-knowledge client-side encryption (AES-256-GCM with 600,000 PBKDF2 rounds)** for your private memories.

---

## 2. Information We Collect and How We Obtain It

We collect and process only the information that you voluntarily provide to the App.

### A. Account Identification Data
* **Data Collected:** Email address, display name, user ID (UID), and profile picture URL (if signed in via Google OAuth).
* **Source:** Provided during registration via Firebase Email/Password Authentication or Google Sign-In.
* **Purpose:** To authenticate your identity, prevent unauthorized access, and sync your milestones across your authorized devices.

### B. Life Events & Milestones Data
* **Data Collected:** Event title, date, time, category (e.g., birthday, anniversary, wedding, family, personal, holiday, business, or custom), priority level, custom tags, personal notes, linked person name/ID, group associations, and optional Spotify track/playlist URLs.
* **Purpose:** To calculate event countdowns, schedule milestone alerts, and manage your milestone calendar.

### C. Loved Ones & Person Profiles
* **Data Collected:** Full name, nickname, relationship type, favorite color, favorite food, gift ideas, past gift history, custom tags, notes, and profile photos.
* **Purpose:** To help you maintain thoughtful personal notes, record gift ideas, and associate loved ones with upcoming milestone events.

### D. Media & Profile Photos
* **Data Collected:** Image files uploaded as avatar photos for loved ones.
* **Processing:** Images are inspected using **binary magic-byte validation** on the device to verify genuine image formats (JPEG, PNG, WebP, GIF) and capped at 5 MB before being stored in your private Google Cloud Storage bucket path (`users/{userId}/...`).

### E. Device & Diagnostic Data
* **Data Collected:** Operating system version (Android), device connectivity state (online/offline status), and crash reports generated during fatal exceptions.
* **Purpose:** To support offline synchronization and resolve technical defects.

---

## 3. Device Permissions & Purpose

The App requests the following Android permissions strictly when needed to deliver specific features:

| Android Permission | Why It Is Requested | How It Is Used |
|---|---|---|
| `android.permission.CAMERA` | To capture profile photos for loved ones. | Used solely inside the in-app camera modal. Images are cropped and compressed client-side. We **do not** access your camera in the background and **do not** perform facial recognition. |
| `android.permission.READ_CONTACTS` *(Optional)* | To import birthdays and contact names from your address book. | Executed **only upon your explicit click** in the Contact Import wizard. Contact details are read locally to present an import selection screen. We **never** upload your entire address book to servers. Only contacts you explicitly select are imported. |
| `android.permission.POST_NOTIFICATIONS` | To deliver upcoming milestone alerts. | Used to trigger scheduled notifications on your device at 7 days, 3 days, 1 day, and same-day milestones. |
| `android.permission.INTERNET` & `ACCESS_NETWORK_STATE` | To sync data with Firebase and detect network connectivity. | Facilitates cloud synchronization and triggers background sync of cached offline data when connectivity resumes. |

---

## 4. How We Process & Protect Your Data

### A. Zero-Knowledge Client-Side Encryption (Private Vault)
When you mark an event or reflection as **Private**:
1. Its sensitive text fields (title, description, personal notes, and associated names) are encrypted client-side directly on your device using native **AES-256-GCM** via the Web Cryptography API.
2. The encryption key is derived using **PBKDF2-SHA-256 with 600,000 iterations** (OWASP 2023 standard) combined with your unique UID salt and your secret 4-digit passkey.
3. Only the encrypted ciphertext and initialization vector (IV) are transmitted to the cloud database.
4. **Zero-Knowledge Guarantee:** We do not possess, store, or have access to your private passkey. Even server administrators or database operators cannot decrypt or read your private vault memories.

### B. Encryption in Transit & at Rest
- **In Transit:** 100% of network communications between the App and backend servers are encrypted using **TLS 1.2 and TLS 1.3 (HTTPS)**.
- **At Rest:** Database records and cloud storage objects are encrypted at rest using server-side **AES-256** on Google Cloud Platform infrastructure.

### C. Multi-User Offline Cache Isolation
Offline photos and records stored on your device are managed through **IndexedDB** using partitioned, composite keys (`${userId}:${personId}`). This guarantees that on shared devices, one user cannot access or sync cached data belonging to another account.

### D. Content Security Policy & Anti-Tampering
We enforce strict HTTP and meta-tag **Content Security Policies (CSP)**, `X-Frame-Options: DENY` (clickjacking defense), and prototype pollution filtering on all database write payloads.

---

## 5. Third-Party Infrastructure & Subprocessors

Moment-Keeper does not share your data with advertisers or data brokers. We utilize only trusted, enterprise infrastructure providers strictly necessary to deliver app functionality:

| Subprocessor | Purpose | Privacy Policy |
|---|---|---|
| **Google Firebase / Google Cloud Platform** (Alphabet Inc.) | User authentication, cloud Firestore database, Cloud Storage for media, and Cloud Messaging (FCM). | [Google Privacy Policy](https://policies.google.com/privacy) |
| **Spotify AB** *(Optional)* | Embedded music player for synced celebration alarms. Only invoked if you provide a Spotify link. | [Spotify Privacy Policy](https://www.spotify.com/legal/privacy-policy/) |

---

## 6. Data Retention and Account Deletion

You maintain complete ownership and control over your data:

### Immediate In-App Deletion
- **Individual Items:** You can edit or permanently delete any event, person profile, photo, or group at any time. When deleted, the record is immediately and irreversibly purged from our live Firestore database and Cloud Storage.
- **Account Closure:** You can initiate full account deletion from the **Settings** menu. Deleting your account immediately erases your user profile, all associated milestone events, loved ones profiles, and uploaded images.

### Deletion Requests
If you are unable to access the App, you may submit an account deletion request by emailing `privacy@aibuildinfra.com`. We process and confirm all deletion requests within **30 days**.

---

## 7. Children's Privacy (COPPA & GDPR-K Compliance)

Moment-Keeper is not directed to individuals under the age of 13 (or under 16 in the European Union). We do not knowingly collect or solicit personal information from children. If we become aware that a child under 13 has provided personal data without parental consent, we take immediate steps to delete such data and terminate the account.

---

## 8. Google Play Store Data Safety Summary

For the Google Play Console Data Safety questionnaire, the following parameters apply:

| Data Type | Collected | Shared | Ephemeral / Stored | Purpose | Security Practice |
|---|---|---|---|---|---|
| **Name** | Yes (Voluntary) | No | Stored | App functionality | Encrypted in transit & at rest |
| **Email Address** | Yes (Account login) | No | Stored | Account management | Encrypted in transit & at rest |
| **User Content (Events, Notes, Person details)** | Yes | No | Stored | App functionality | Client-side AES-256-GCM option |
| **Photos** | Yes (Avatars) | No | Stored | App functionality | Encrypted in transit & at rest |
| **Contacts** | On-demand read | No | Not uploaded (only imported items stored) | Contact import feature | Local on device |
| **Device or other IDs** | Yes (Firebase installation ID) | No | Stored | Push notification routing | Encrypted in transit |

* **Data is transferred over a secure connection (TLS/HTTPS):** Yes
* **Users can request data deletion:** Yes
* **Data sold to third parties:** No
* **Data used for third-party advertising:** No

---

## 9. Changes to This Privacy Policy

We may update this Privacy Policy from time to time to reflect operational or regulatory changes. Any updates will be published with a revised "Last Updated" date at [https://aibuildinfra.com/projects/moment-keeper/privacy](https://aibuildinfra.com/projects/moment-keeper/privacy) and within the App's Settings/About section.

---

## 10. Contact Us

If you have any questions, concerns, or requests regarding this Privacy Policy or how your data is handled, please contact us:

- **Data Controller:** AI-BuildInfra Engineering & Privacy Team
- **Website:** [https://aibuildinfra.com/projects/moment-keeper](https://aibuildinfra.com/projects/moment-keeper)
- **Organization:** [https://github.com/AI-BuildInfra](https://github.com/AI-BuildInfra)
- **Email:** `privacy@aibuildinfra.com` or `support@aibuildinfra.com`
