import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList, RootStackParamList } from '@/types/navigation';
import { HomeScreen } from '@/screens/dashboard/HomeScreen';
import { ProjectsScreen } from '@/screens/para/ProjectsScreen';
import { AreasScreen } from '@/screens/para/AreasScreen';
import { ResourcesScreen } from '@/screens/para/ResourcesScreen';
import { ArchiveScreen } from '@/screens/para/ArchiveScreen';
import { NoteEditorScreen } from '@/screens/notes/NoteEditorScreen';
import { NoteSearchScreen } from '@/screens/notes/NoteSearchScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { theme } from '@/constants/theme';
import { PARA_CATEGORY_ICONS } from '@/constants/para';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          const iconMap = {
            Home: '🏠',
            Projects: PARA_CATEGORY_ICONS.projects,
            Areas: PARA_CATEGORY_ICONS.areas,
            Resources: PARA_CATEGORY_ICONS.resources,
            Archive: PARA_CATEGORY_ICONS.archive,
          };
          
          return (
            <span style={{ 
              fontSize: size, 
              color: focused ? theme.colors.primary : theme.colors.textSecondary,
              opacity: focused ? 1 : 0.6,
            }}>
              {iconMap[route.name as keyof typeof iconMap]}
            </span>
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 12,
          paddingTop: 12,
          height: 70,
          shadowColor: theme.colors.black,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.xs,
          fontWeight: theme.typography.medium,
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Projects" 
        component={ProjectsScreen}
        options={{ title: 'Projects' }}
      />
      <Tab.Screen 
        name="Areas" 
        component={AreasScreen}
        options={{ title: 'Areas' }}
      />
      <Tab.Screen 
        name="Resources" 
        component={ResourcesScreen}
        options={{ title: 'Resources' }}
      />
      <Tab.Screen 
        name="Archive" 
        component={ArchiveScreen}
        options={{ title: 'Archive' }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen 
        name="NoteEditor" 
        component={NoteEditorScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="NoteSearch" 
        component={NoteSearchScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};
