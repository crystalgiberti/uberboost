import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.eliv8.uberboost",
  appName: "Uber Boost for Drivers",
  webDir: "../dist/spa",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#0EA5E9",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "light",
      backgroundColor: "#0EA5E9",
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#0EA5E9",
      sound: "beep.wav",
    },
    Geolocation: {
      permissions: {
        location: "always",
      },
    },
    Camera: {
      permissions: {
        camera: "Camera access is required for profile photos.",
      },
    },
    Device: {
      permissions: {
        deviceInfo: "Device info helps optimize the app performance.",
      },
    },
  },
  ios: {
    scheme: "Uber Boost",
    contentInset: "automatic",
  },
  android: {
    buildOptions: {
      keystorePath: "release-key.keystore",
      keystoreAlias: "uberboost",
      keystoreAliasPassword: "process.env.KEYSTORE_PASSWORD",
      keystorePassword: "process.env.KEYSTORE_PASSWORD",
      releaseType: "AAB",
      signingType: "apksigner",
    },
    permissions: [
      "android.permission.INTERNET",
      "android.permission.ACCESS_NETWORK_STATE",
      "android.permission.ACCESS_WIFI_STATE",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.CAMERA",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WAKE_LOCK",
      "android.permission.VIBRATE",
      "android.permission.RECORD_AUDIO",
      "android.permission.MODIFY_AUDIO_SETTINGS",
    ],
  },
};

export default config;
