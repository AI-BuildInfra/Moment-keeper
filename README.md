# Moment-Keeper 🎁

> **A secure, intelligent life-event reminder, milestone tracker, and private encrypted memory vault.**  
> Built with modern web and mobile technologies: React 19, TypeScript, Vite, Tailwind CSS, Capacitor, and Firebase.

[![Website](https://img.shields.io/badge/Project_Page-aibuildinfra.com-0A84FF?style=for-the-badge&logo=googlechrome&logoColor=white)](https://aibuildinfra.com/projects/moment-keeper)
[![GitHub Repository](https://img.shields.io/badge/GitHub-AI--BuildInfra%2FMoment--keeper-181717?style=for-the-badge&logo=github)](https://github.com/AI-BuildInfra/Moment-keeper)
[![Organization](https://img.shields.io/badge/Org-AI--BuildInfra-007ACC?style=for-the-badge&logo=github)](https://github.com/AI-BuildInfra)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.3-119EFF?style=for-the-badge&logo=capacitor)](https://capacitorjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.14-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

---

## 📌 Project Overview

**Moment-Keeper** is an open-source, privacy-first personal milestone management and celebration application developed under the [**AI-BuildInfra**](https://aibuildinfra.com) ecosystem.

Whether keeping track of birthdays, anniversaries, weddings, custom holidays, or documenting intimate personal thoughts, Moment-Keeper blends rich interactive UI, automated local notifications, Spotify integration, and bank-grade client-side encryption into a responsive web application and native Android mobile app.

🌐 **Project Homepage**: [https://aibuildinfra.com/projects/moment-keeper](https://aibuildinfra.com/projects/moment-keeper)  
🔗 **Official Repository**: [https://github.com/AI-BuildInfra/Moment-keeper](https://github.com/AI-BuildInfra/Moment-keeper)  
🏢 **Maintained by**: [AI-BuildInfra](https://aibuildinfra.com) ([@AI-BuildInfra](https://github.com/AI-BuildInfra))

---

## ✨ Key Features

### 📅 Intelligent Milestone & Event Tracking
- **Automatic Countdowns**: Real-time day counters and progress rings for birthdays, anniversaries, family milestones, and custom celebrations.
- **Categorized Management**: Group events by `birthday`, `anniversary`, `wedding`, `family`, `personal`, `holiday`, `business`, or `custom`.
- **Smart Recurrence**: Recurring events automatically compute upcoming dates year-over-year.

### 🔔 Proactive Multi-Stage Reminders
- **Tiered Alerts**: Scheduled alerts at **7 days**, **3 days**, **1 day**, and on the **same day** of the milestone.
- **Cross-Platform Delivery**: Works seamlessly through web push notifications and Capacitor native local notifications.

### 🔒 Zero-Knowledge Client-Side Encryption (Vault Mode)
- **AES-256-GCM Cryptography**: Private events and reflections are encrypted in the browser via the Web Crypto API *before* transmitting to Firebase.
- **OWASP-Compliant Key Derivation**: Uses **PBKDF2-SHA-256** with **600,000 iterations** and user UID salt to derive cryptographic keys from user passkeys.
- **In-Memory Lock Management**: Session locks reside strictly in application memory, relocking automatically when sessions terminate.

### 👥 Groups & Collaborative Sharing
- **Real-Time Shared Calendars**: Create groups (Family, Circle, Office) and share events in real time.
- **Granular Role Controls**: Structural changes (member management, ownership) are restricted to group owners, while members can leave safely at any time.

### 👤 Contact & Loved Ones Profiles
- **Gift Ideas & Notes**: Log favorite foods, colors, relationship tags, past gifts, and gift wishlists.
- **Camera & Gallery Photos**: Take photos or pick from gallery with client-side cropping and compression.
- **Magic Byte Signature Inspection**: Binary inspection ensures uploaded avatars are genuine JPEG, PNG, GIF, or WebP files, blocking disguised scripts.

### 📲 Smart Contact & Calendar Import
- **Device Contact Sync**: Import birthdays and contact names directly from device phonebook.
- **Google Calendar API**: Synchronize birthdays and special events from Google Calendar with duplicate detection.
- **Throttling Resilience**: Built-in batch handlers bypass client rate limits safely during large imports.

### 🎵 Spotify Alarm & Celebration Mode
- **Soundtrack Milestones**: Attach Spotify tracks, albums, or playlists to specific celebrations.
- **Celebration Particle Canvas**: Immersive particle celebration animations and direct Spotify embedded playback.

### 📴 Offline-First Architecture
- **Isolated Offline Storage**: Offline person photos are cached in **IndexedDB** with per-user key isolation (`userId:personId`), preventing cross-user account bleed.
- **Automatic Background Synchronization**: When the device reconnects to the network, cached offline mutations and media sync automatically with Firestore and Cloud Storage.

---

## 🛡️ Security Architecture

Security is built into every layer of Moment-Keeper:

| Layer | Defense Mechanism | Implementation |
|---|---|---|
| **Secret Management** | Zero hardcoded keys in bundles | All Firebase keys reside in `.env` (gitignored); no fallback tokens |
| **Data Encryption** | Client-side AES-256-GCM | Encrypted locally using PBKDF2 (600,000 rounds) before Firestore commit |
| **File Uploads** | Binary Magic Byte Header Checks | Inspects binary file headers (`FF D8 FF`, `89 50 4E 47`, etc.) to reject renamed `.js`/`.html`/`.sh` files |
| **Cloud Storage** | Server-Side Storage Rules | [`storage.rules`](./storage.rules) enforces `image/*` MIME type validation and a strict 5 MB file size limit |
| **Database Rules** | Granular Firestore Security Rules | [`firestore.rules`](./firestore.rules) isolates records so users can only read/write their own documents |
| **Clickjacking** | Response Headers | `X-Frame-Options: DENY` and `frame-ancestors 'none'` in [`firebase.json`](./firebase.json) |
| **Injection Defense** | Prototype Pollution Filter | `cleanPayload` strips `__proto__`, `constructor`, and `prototype` keys on all write operations |
| **Content Security** | Strict CSP Whitelist | Meta tag and server headers whitelist only Google Auth, Firebase, and Spotify origins |

---

## 🛠️ Technology Stack

- **Core Framework**: [React 19](https://react.dev/) + [TypeScript 6](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 8](https://vitejs.dev/) with Rollup chunking
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with glassmorphism design system
- **State Management**: [Zustand 5](https://github.com/pmndrs/zustand)
- **Backend as a Service**: [Firebase](https://firebase.google.com/) (Firestore with offline persistence, Authentication, Cloud Storage, Firebase Cloud Messaging)
- **Native Runtime**: [Capacitor 8](https://capacitorjs.com/) (Android & iOS runtime with Haptics, Local Notifications, Network status)
- **Animations**: [Framer Motion 12](https://www.framer.com/motion/) & Three.js 3D background effects
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

---

## 📂 Project Directory Structure

```
Moment-Keeper/
├── .env.example               # Template environment configuration
├── firebase.json              # Firebase Hosting, Headers, and Rules config
├── firestore.rules            # Firestore database authorization rules
├── storage.rules              # Firebase Cloud Storage upload & size rules
├── vite.config.ts             # Vite build & Content Security Policy middleware
├── capacitor.config.ts        # Capacitor native bridge configuration
├── index.html                 # HTML entry point with CSP & Referrer meta tags
├── android/                   # Native Android studio project (Capacitor)
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── auth/              # Protected routes & Google sign-in
│   │   ├── celebration/       # Particle celebrations & Spotify player
│   │   ├── contacts/          # Smart contact & Google Calendar import modals
│   │   ├── events/            # Event cards, form modals, date pickers
│   │   ├── layout/            # Navigation sidebar, header, splash screen
│   │   └── people/            # Person cards, profile forms, camera capture
│   ├── lib/                   # Infrastructure helpers
│   │   ├── firebase.ts        # Firebase app & SDK initialization
│   │   ├── firestore.ts       # Typed Firestore CRUD, magic-byte validator
│   │   ├── rateLimiter.ts     # Client rate limiter
│   │   └── utils.ts           # CSPRNG ID generator, date utilities
│   ├── pages/                 # Top-level view routes
│   │   ├── auth/              # Login, Signup, Forgot Password pages
│   │   ├── events/            # Events list & private vault view
│   │   ├── people/            # Loved ones directory
│   │   ├── CalendarPage.tsx   # Month & agenda calendar view
│   │   ├── DashboardPage.tsx  # Metrics, upcoming countdowns, recent activity
│   │   ├── FavoritesPage.tsx  # Pinned milestones
│   │   └── SettingsPage.tsx   # Profile, notification prefs, passkey setup
│   ├── services/              # Domain services
│   │   ├── audioService.ts    # Ambient chime & alert audio
│   │   ├── encryptionService.ts # AES-256-GCM & PBKDF2 Web Crypto service
│   │   ├── hapticService.ts   # Device haptic feedback
│   │   └── notificationService.ts # Local push notification scheduler
│   ├── store/                 # Zustand application stores
│   │   ├── authStore.ts       # User authentication & profile state
│   │   ├── eventStore.ts      # Events, persons, groups & IndexedDB cache
│   │   └── uiStore.ts         # Navigation & in-memory vault unlock state
│   └── types/                 # Shared TypeScript interfaces & types
└── package.json               # Dependencies & build scripts
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **[Node.js](https://nodejs.org/)** (v18.x or higher)
- **`npm`** (v9.x or higher) or **`yarn`**
- **Git**
- *(Optional for Android build)* **Android Studio** & **JDK 17+**

### 1. Clone the Repository

```bash
git clone https://github.com/AI-BuildInfra/Moment-keeper.git
cd Moment-keeper
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase Environment Variables

Create a `.env` file in the root directory by copying the provided template:

```bash
cp .env.example .env
```

Open `.env` and insert your Firebase project credentials from the [Firebase Console](https://console.firebase.google.com/):

```ini
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 📱 Mobile App (Capacitor Android Build)

To build and run Moment-Keeper as a native Android application:

```bash
# 1. Compile TypeScript and build production web assets
npm run build

# 2. Sync web bundle to Android native platform
npx cap sync android

# 3. Open in Android Studio
npx cap open android
```

Alternatively, compile the APK via command line:

```bash
cd android
./gradlew assembleDebug
```

The resulting APK will be located at:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🧪 Testing & Verification

Run static type verification across the entire TypeScript codebase:

```bash
npx tsc --noEmit
```

Test production bundling:

```bash
npm run build
```

---

## 🤝 Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository on [AI-BuildInfra/Moment-keeper](https://github.com/AI-BuildInfra/Moment-keeper).
2. Create a dedicated feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes with clear semantic messages:
   ```bash
   git commit -m "feat: add reminder tone customizer"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a **Pull Request** targeting the `main` branch.

Please review our [Contributing Guidelines](./CONTRIBUTING.md) and ensure that `npx tsc --noEmit` passes without errors.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for complete details.

---

## 🌐 Community & Links

- 🌐 **Project Homepage**: [https://aibuildinfra.com/projects/moment-keeper](https://aibuildinfra.com/projects/moment-keeper)
- 🏢 **AI-BuildInfra Platform**: [https://aibuildinfra.com](https://aibuildinfra.com)
- 🔗 **GitHub Repository**: [https://github.com/AI-BuildInfra/Moment-keeper](https://github.com/AI-BuildInfra/Moment-keeper)
- 🏢 **GitHub Organization**: [AI-BuildInfra](https://github.com/AI-BuildInfra)
- 🐛 **Issue Tracker**: [https://github.com/AI-BuildInfra/Moment-keeper/issues](https://github.com/AI-BuildInfra/Moment-keeper/issues)

Developed with ❤️ by the [**AI-BuildInfra**](https://aibuildinfra.com) team & open-source contributors.

