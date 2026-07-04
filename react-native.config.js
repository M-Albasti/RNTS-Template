module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts/'],
  // Chat SDK is a template dependency only (Jest mock); no src/ usage yet.
  dependencies: {
    'stream-chat-react-native': {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
};
