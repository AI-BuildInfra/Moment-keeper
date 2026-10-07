import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// ── Content Security Policy ────────────────────────────────────
// MEDIUM FIX: CSP limits what scripts/resources the browser will execute.
// This cuts the blast radius of any XSS vulnerability significantly.
const CSP = [
  "default-src 'self'",
  // React + Vite HMR require 'unsafe-inline' in dev; narrow in prod via a nonce if needed
  "script-src 'self' 'unsafe-inline' https://apis.google.com https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  // Firebase SDK, Firestore, Auth, Storage, FCM endpoints
  "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://firebaseinstallations.googleapis.com wss://*.firebaseio.com https://*.firebasestorage.googleapis.com https://securetoken.googleapis.com",
  // Photos from Firebase Storage + Google user avatars
  "img-src 'self' data: blob: https://*.googleusercontent.com https://firebasestorage.googleapis.com",
  "media-src 'self' blob:",
  "frame-src https://accounts.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export default defineConfig({
  plugins: [
    react(),
    // Inject CSP header on the dev server
    {
      name: 'csp-headers',
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('Content-Security-Policy', CSP);
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('X-Frame-Options', 'DENY');
          res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three';
            if (id.includes('@react-three')) return 'r3f';
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('framer-motion')) return 'motion';
            return 'vendor';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
})
