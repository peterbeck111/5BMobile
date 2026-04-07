require('dotenv').config();

module.exports = {
  expo: {
    name: 'Five Below Alerts',
    slug: 'five-below-alerts',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    scheme: 'fivebelowalerts',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#0050FF',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.fivebelow.alerts.demo',
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#0050FF',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      package: 'com.fivebelow.alerts.demo',
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: [
      'expo-router',
      [
        'expo-notifications',
        {
          icon: './assets/icon.png',
          color: '#0050FF',
        },
      ],
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Allow Five Below Alerts to use your location to find nearby stores.',
        },
      ],
    ],
    extra: {
      oracleTokenUrl: process.env.ORACLE_TOKEN_URL,
      oracleClientId: process.env.ORACLE_CLIENT_ID,
      oracleClientSecret: process.env.ORACLE_CLIENT_SECRET,
      oracleScope: process.env.ORACLE_SCOPE,
      oracleApiBaseUrl: process.env.ORACLE_CUSTOM_API_BASE_URL,
    },
  },
};
