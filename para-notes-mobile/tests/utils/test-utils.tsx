import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          {children}
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react-native';

// Override render method
export { customRender as render };

// Test utilities
export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  canGoBack: jest.fn(() => true),
  isFocused: jest.fn(() => true),
  addListener: jest.fn(),
  removeListener: jest.fn(),
});

export const createMockRoute = (params = {}) => ({
  key: 'test-route',
  name: 'TestScreen',
  params,
});

export const createMockProps = (_screenName: string, params = {}) => ({
  navigation: createMockNavigation(),
  route: createMockRoute(params),
});

// Mock data factories
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  avatar_url: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockNote = (overrides = {}) => ({
  id: 'test-note-id',
  title: 'Test Note',
  content: 'Test content',
  para_category: 'projects' as const,
  para_area: null,
  para_project: null,
  para_resource: null,
  tags: ['test'],
  is_encrypted: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  synced_at: null,
  ...overrides,
});

export const createMockProject = (overrides = {}) => ({
  id: 'test-project-id',
  name: 'Test Project',
  description: 'Test project description',
  area_id: null,
  status: 'active' as const,
  due_date: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockArea = (overrides = {}) => ({
  id: 'test-area-id',
  name: 'Test Area',
  description: 'Test area description',
  color: '#FF6B6B',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockResource = (overrides = {}) => ({
  id: 'test-resource-id',
  name: 'Test Resource',
  description: 'Test resource description',
  url: 'https://example.com',
  type: 'website' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});
