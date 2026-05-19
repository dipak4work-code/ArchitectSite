import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.shreejiassociate.app',
  appName: 'Shreeji Associate',
  webDir: 'out',            // not used — we load from live URL below
  server: {
    // ─── Point to your deployed Vercel / live URL ───────────────
    // Replace this with your actual deployed URL before building APK
    url: 'https://your-vercel-url.vercel.app',
    cleartext: false,       // enforce HTTPS
    // ─── For local testing on a device (same Wi-Fi network) ─────
    // url: 'http://192.168.1.100:3000',   // your PC's local IP
    // cleartext: true,
  },
  android: {
    backgroundColor: '#141414',
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#141414',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
  },
}

export default config
