import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'za.co.big5.ops',
  appName: 'Big 5 Security Ops',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: false
  }
};

export default config;
