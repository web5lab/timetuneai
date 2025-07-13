import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.timetuneai.app',
  appName: 'TimeTuneAi',
  webDir: 'dist',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '548258400256-jfrssbte8dhk0cri2e7kjb5onhs8fjd1.apps.googleusercontent.com', // Web Client ID from Google Console
      forceCodeForRefreshToken: true
    },
    splashScreen: {
      launchAutoHide: true,
      launchShowDuration: 0
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#F97316",
      sound: "beep.wav",
    },
  },
};

export default config;
