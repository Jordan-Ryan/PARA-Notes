export default function (api) {
  const isTest = api.env('test');
  
  const plugins = [
    // Required for zustand
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@hooks': './src/hooks',
          '@lib': './src/lib',
          '@stores': './src/stores',
          '@types': './src/types',
          '@constants': './src/constants',
          '@assets': './src/assets',
        },
      },
    ],
  ];
  
  // Only add reanimated plugin for non-test environments
  if (!isTest) {
    plugins.unshift('react-native-reanimated/plugin');
  }
  
  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
}
