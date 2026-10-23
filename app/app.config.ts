import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'LernTok',
  slug: 'lerntok',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'lerntok',
  userInterfaceStyle: 'dark',
  ios: {
    bundleIdentifier: 'com.example.lerntok',
    supportsTablet: false,
    usesAppleSignIn: true,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSCameraUsageDescription: 'LernTok nutzt die Kamera, damit du Fotos von Lernmaterial direkt als Clip-Quelle aufnehmen kannst.',
      NSPhotoLibraryUsageDescription: 'LernTok greift auf deine Fotos zu, damit du Lernmaterial als Clip-Quelle auswählen kannst.',
      NSMicrophoneUsageDescription: 'LernTok nutzt das Mikrofon nur, wenn du Sprachnotizen zu Lernclips aufnimmst.',
      NSUserNotificationsUsageDescription: 'LernTok erinnert dich an deine Lernziele, wenn du das möchtest.',
    },
  },
  android: {
    package: 'com.example.lerntok',
  },
  plugins: [
    'expo-router',
    'expo-dev-client',
    'expo-apple-authentication',
    ['expo-video', { supportsBackgroundPlayback: false, supportsPictureInPicture: false }],
    ['expo-document-picker', { iCloudContainerEnvironment: 'Production' }],
    [
      'expo-image-picker',
      {
        photosPermission: 'LernTok greift auf deine Fotos zu, damit du Lernmaterial als Clip-Quelle auswählen kannst.',
        cameraPermission: 'LernTok nutzt die Kamera, damit du Fotos von Lernmaterial aufnehmen kannst.',
        microphonePermission: 'LernTok nutzt das Mikrofon nur, wenn du Sprachnotizen aufnimmst.',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'LernTok nutzt die Kamera, damit du Fotos von Lernmaterial aufnehmen kannst.',
        microphonePermission: 'LernTok nutzt das Mikrofon nur, wenn du Sprachnotizen aufnimmst.',
      },
    ],
    [
      'expo-notifications',
      { color: '#C8F560', defaultChannel: 'default' },
    ],
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 180,
        resizeMode: 'contain',
        backgroundColor: '#0B0C10',
        dark: { backgroundColor: '#0B0C10' },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    useMocks: process.env.EXPO_PUBLIC_USE_MOCKS !== 'false',
  },
};

export default config;
