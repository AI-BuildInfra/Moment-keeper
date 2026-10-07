// ─── PrivacyPolicyPage Component ──────────────────────────────

import React from 'react';
import { ShieldCheck, Lock, EyeOff, Trash2, Camera, Smartphone, Database } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in text-mk-white pb-12">
      <div>
        <h1 className="section-title text-3xl">Privacy Policy</h1>
        <p className="text-xs text-mk-silver tracking-widest uppercase mt-1">
          Last Updated: September 29, 2026 • AI-BuildInfra
        </p>
      </div>

      <div className="rounded-2xl p-6 sm:p-8 glass border border-mk-glass-border shadow-silver space-y-6 text-sm text-mk-silver leading-relaxed">
        {/* Intro */}
        <div>
          <h2 className="text-lg font-bold text-mk-white font-display mb-2 flex items-center gap-2">
            <ShieldCheck size={20} className="text-mk-accent" />
            1. Privacy Commitment & Data Controller
          </h2>
          <p>
            Moment-Keeper is maintained by <strong className="text-mk-white">AI-BuildInfra</strong> (<a href="https://aibuildinfra.com/projects/moment-keeper" target="_blank" rel="noopener noreferrer" className="text-mk-accent hover:underline">aibuildinfra.com/projects/moment-keeper</a>). We believe personal milestones and memories are sacred. We collect only what is strictly required to operate the application, and we <strong className="text-mk-white">never sell, rent, monetize, or track your data</strong> for commercial advertising.
          </p>
        </div>

        {/* Data We Collect */}
        <div className="pt-4 border-t border-mk-glass-border/40">
          <h2 className="text-lg font-bold text-mk-white font-display mb-2 flex items-center gap-2">
            <Database size={20} className="text-mk-accent" />
            2. Data We Collect
          </h2>
          <p className="mb-2">We collect only information you explicitly input:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-mk-silver">
            <li><strong className="text-mk-white">Account Credentials:</strong> Email, display name, and user ID through Firebase Auth / Google OAuth.</li>
            <li><strong className="text-mk-white">Milestones & Events:</strong> Event titles, dates, categories, priorities, custom tags, and personal notes.</li>
            <li><strong className="text-mk-white">Loved Ones Profiles:</strong> Contact names, nicknames, relationships, favorite colors/foods, gift ideas, and uploaded avatar images.</li>
            <li><strong className="text-mk-white">Optional Integrations:</strong> Spotify links you provide to sync celebration audio.</li>
          </ul>
        </div>

        {/* Permissions */}
        <div className="pt-4 border-t border-mk-glass-border/40">
          <h2 className="text-lg font-bold text-mk-white font-display mb-2 flex items-center gap-2">
            <Smartphone size={20} className="text-mk-accent" />
            3. Android Device Permissions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-mk-glass-border">
              <Camera size={16} className="text-mk-accent mb-1" />
              <strong className="text-mk-white block mb-0.5">Camera</strong>
              <span>Used only when actively taking a contact avatar photo. Frames are cropped and compressed on-device. No background access.</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-mk-glass-border">
              <Smartphone size={16} className="text-mk-accent mb-1" />
              <strong className="text-mk-white block mb-0.5">Contacts (Optional)</strong>
              <span>Only accessed if you choose &quot;Import from Contacts&quot;. We read locally on device to let you select dates. Your address book is never uploaded in bulk.</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-mk-glass-border">
              <Lock size={16} className="text-mk-accent mb-1" />
              <strong className="text-mk-white block mb-0.5">Notifications</strong>
              <span>Used to deliver local milestone countdown alerts at 7d, 3d, 1d, and same day.</span>
            </div>
          </div>
        </div>

        {/* Encryption & Security */}
        <div className="pt-4 border-t border-mk-glass-border/40">
          <h2 className="text-lg font-bold text-mk-white font-display mb-2 flex items-center gap-2">
            <Lock size={20} className="text-mk-accent" />
            4. Security Architecture & Encryption
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-mk-silver">
            <li>
              <strong className="text-mk-white">Data in Transit:</strong> 100% of network traffic is encrypted via <span className="text-mk-white font-mono">TLS 1.2 / TLS 1.3 (HTTPS)</span>.
            </li>
            <li>
              <strong className="text-mk-white">Data at Rest:</strong> Cloud databases and files are encrypted at rest with server-side <span className="text-mk-white font-mono">AES-256</span> on Google Cloud.
            </li>
            <li>
              <strong className="text-mk-white">Zero-Knowledge Private Vault:</strong> Private memories are encrypted client-side using <span className="text-mk-white font-mono">AES-256-GCM</span> with <span className="text-mk-white font-mono">PBKDF2 (600,000 iterations)</span> key derivation using your 4-digit passkey. Server operators cannot decrypt or read your private vault data.
            </li>
            <li>
              <strong className="text-mk-white">Binary Magic Byte Validation:</strong> Media uploads undergo binary header inspection (validating true JPEG, PNG, WebP, GIF byte signatures) before upload.
            </li>
            <li>
              <strong className="text-mk-white">Multi-User Offline Cache Isolation:</strong> Offline photos stored in IndexedDB are partitioned per user account (<span className="text-mk-white font-mono">userId:personId</span>), preventing cross-account leakage on shared devices.
            </li>
          </ul>
        </div>

        {/* Third Party */}
        <div className="pt-4 border-t border-mk-glass-border/40">
          <h2 className="text-lg font-bold text-mk-white font-display mb-2 flex items-center gap-2">
            <EyeOff size={20} className="text-mk-accent" />
            5. Third-Party Infrastructure Subprocessors
          </h2>
          <p className="text-xs">
            We use only trusted backend infrastructure partners:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-mk-silver mt-1">
            <li><strong className="text-mk-white">Google Firebase / Google Cloud Platform:</strong> Authentication, Firestore database, media storage, and push notifications.</li>
            <li><strong className="text-mk-white">Spotify API:</strong> Audio preview embed player (only invoked if a Spotify URL is saved).</li>
          </ul>
        </div>

        {/* Deletion & Control */}
        <div className="pt-4 border-t border-mk-glass-border/40">
          <h2 className="text-lg font-bold text-mk-white font-display mb-2 flex items-center gap-2">
            <Trash2 size={20} className="text-mk-accent" />
            6. Data Retention & Instant Deletion
          </h2>
          <p>
            When you delete an event, person profile, photo, or group in the app, it is immediately and permanently removed from our cloud storage and database. You can also request complete account termination and full data deletion at any time via Settings or by emailing <a href="mailto:privacy@aibuildinfra.com" className="text-mk-accent hover:underline">privacy@aibuildinfra.com</a>.
          </p>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-mk-glass-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-mk-silver">
          <span>AI-BuildInfra • Open Source Privacy Standard</span>
          <a
            href="https://aibuildinfra.com/projects/moment-keeper"
            target="_blank"
            rel="noopener noreferrer"
            className="text-mk-accent hover:underline font-semibold"
          >
            aibuildinfra.com/projects/moment-keeper
          </a>
        </div>
      </div>
    </div>
  );
};
