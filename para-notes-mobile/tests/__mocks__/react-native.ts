import { Text, View, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';

// Mock React Native components
export const mockComponents = {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet: {
    create: (styles: any) => styles,
    flatten: (style: any) => style,
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  Platform: {
    OS: 'ios',
    select: (config: any) => config.ios || config.default,
  },
  Alert: {
    alert: jest.fn(),
  },
  Linking: {
    openURL: jest.fn(),
    canOpenURL: jest.fn(() => Promise.resolve(true)),
  },
  AppState: {
    currentState: 'active',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  Keyboard: {
    dismiss: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  },
  StatusBar: {
    setBarStyle: jest.fn(),
    setBackgroundColor: jest.fn(),
  },
};

export default mockComponents;
