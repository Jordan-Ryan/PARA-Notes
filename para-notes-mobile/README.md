# PARA Notes Mobile

A React Native Expo mobile application for organizing your life with the PARA method (Projects, Areas, Resources, Archive).

## Features

- **PARA Organization System**: Organize your notes into Projects, Areas, Resources, and Archive
- **Cross-Platform**: Built with React Native and Expo for iOS and Android
- **TypeScript**: Full TypeScript support with strict type checking
- **Offline Support**: Works offline with local storage and sync capabilities
- **Secure**: End-to-end encryption for sensitive notes
- **Modern UI**: Clean, intuitive interface with dark/light theme support
- **Real-time Sync**: Automatic synchronization with Supabase backend

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Supabase** for backend and authentication
- **Zustand** for state management
- **TanStack Query** for data fetching and caching
- **Expo Secure Store** for secure key storage
- **React Native MMKV** for local storage
- **Jest** for testing

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- EAS CLI (`npm install -g eas-cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd para-notes-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   EXPO_PUBLIC_APP_ENV=development
   EXPO_PUBLIC_API_URL=https://api.paranotes.com
   EXPO_PUBLIC_SCHEME=para-notes
   EXPO_PUBLIC_ENCRYPTION_KEY=your_encryption_key_here
   EXPO_PUBLIC_SYNC_INTERVAL=300000
   EXPO_PUBLIC_OFFLINE_MODE=true
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations (shared with web app)
   - Update your environment variables with Supabase credentials

## Development

### Start the development server
```bash
npm start
```

### Run on specific platforms
```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web browser
npm run web
```

### Run tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting and type checking
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Type check
npm run type-check
```

## Building for Production

### Set up EAS
```bash
eas login
eas build:configure
```

### Build for platforms
```bash
# Android
npm run build:android

# iOS
npm run build:ios

# Both platforms
npm run build:all
```

### Submit to app stores
```bash
# Android Play Store
npm run submit:android

# iOS App Store
npm run submit:ios
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Modal, etc.)
│   └── features/        # Feature-specific components
├── screens/             # Screen components
│   ├── auth/            # Authentication screens
│   ├── notes/           # Note-related screens
│   ├── para/            # PARA category screens
│   └── dashboard/       # Dashboard screens
├── navigation/          # Navigation configuration
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
│   ├── supabase/        # Supabase configuration
│   ├── crypto/          # Encryption utilities
│   ├── para/            # PARA logic
│   ├── sync/            # Sync utilities
│   └── storage/         # Storage utilities
├── stores/              # Zustand stores
├── types/               # TypeScript type definitions
├── constants/           # App constants and configuration
└── assets/              # Images, fonts, and other assets
```

## Key Features Implementation

### Authentication
- Supabase Auth integration
- Secure token storage
- Automatic session management
- Password reset functionality

### PARA System
- **Projects**: Outcomes with deadlines
- **Areas**: Standards to maintain
- **Resources**: Topics to reference
- **Archive**: Inactive items

### Data Management
- Offline-first architecture
- Real-time synchronization
- Conflict resolution
- Data encryption

### UI/UX
- Responsive design
- Dark/light theme support
- Smooth animations
- Intuitive navigation

## Configuration

### App Configuration
Edit `src/constants/config.ts` to modify app settings:

```typescript
export const config = {
  app: {
    name: 'PARA Notes',
    version: '1.0.0',
    environment: 'development',
  },
  // ... other configuration
};
```

### Theme Configuration
Edit `src/constants/theme.ts` to customize the app's appearance:

```typescript
export const colors = {
  primary: '#007AFF',
  secondary: '#FF6B6B',
  // ... other colors
};
```

## Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: Screen and navigation tests
- **E2E Tests**: Full user flow tests (coming soon)

### Writing Tests

```typescript
import { render, screen } from '@/tests/utils/test-utils';
import { Button } from '@/components/ui';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button title="Test" onPress={() => {}} />);
    expect(screen.getByText('Test')).toBeTruthy();
  });
});
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@paranotes.com or join our Discord community.

## Roadmap

- [ ] Push notifications
- [ ] Advanced search and filtering
- [ ] Note templates
- [ ] Collaboration features
- [ ] Advanced analytics
- [ ] Widget support
- [ ] Apple Watch app
- [ ] Desktop app integration
