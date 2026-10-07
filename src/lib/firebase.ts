// ─── Firebase Configuration ─────────────────────────────────
// All credentials come exclusively from environment variables.
// Never add || "fallback-value" hardcoded strings — they would be
// embedded in the production bundle and visible to anyone.
// ────────────────────────────────────────────────────────────

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  indexedDBLocalPersistence,
} from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getMessaging, isSupported as isFCMSupported } from 'firebase/messaging';

// ── FIREBASE CONFIG (env-only, no hardcoded fallbacks) ────────
export const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
// ──────────────────────────────────────────────────────────────

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Auth
export const auth = getAuth(app);
auth.useDeviceLanguage();

// Set auth persistence
setPersistence(auth, indexedDBLocalPersistence).catch(() => {
  setPersistence(auth, browserLocalPersistence);
});

// Firestore with offline persistence
// Cache is capped at 100 MB to prevent unbounded device storage usage.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    cacheSizeBytes: 100 * 1024 * 1024, // 100 MB max
  }),
  ignoreUndefinedProperties: true,
});

// Storage
export const storage = getStorage(app);

// Google Auth Provider
// Firebase already requests openid + email + profile by default.
// Adding extra scopes explicitly is redundant and broadens the OAuth consent dialog.
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Analytics (async, browser only)
export const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

// FCM Messaging (browser only)
export const initMessaging = async () => {
  if (await isFCMSupported()) {
    return getMessaging(app);
  }
  return null;
};

export default app;
