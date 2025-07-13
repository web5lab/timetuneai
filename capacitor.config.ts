import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.timetuneai.app',
  appName: 'TimeTuneAi',
  webDir: 'dist',
  plugins: {
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
