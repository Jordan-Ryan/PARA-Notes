import { getDefaultConfig } from 'expo/metro-config';

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.assetExts.push(
  // Fonts
  'ttf',
  'otf',
  'woff',
  'woff2',
  // Images
  'webp',
  'avif',
  // Audio
  'mp3',
  'wav',
  'm4a',
  // Video
  'mp4',
  'mov',
  'avi'
);

// Add support for source maps
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

export default config;
