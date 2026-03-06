import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'za.co.drs.ops',
  appName: 'DRS Security Ops',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: false
  }
};

export default config;
