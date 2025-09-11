import { NavigatorScreenParams } from '@react-navigation/native';
import { ParaCategory } from './database';

// Root Stack Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  NoteEditor: {
    noteId?: string;
    category?: ParaCategory;
    area?: string;
    project?: string;
    resource?: string;
  };
  NoteSearch: {
    query?: string;
    category?: ParaCategory;
  };
  Settings: undefined;
  Profile: undefined;
};

// Auth Stack Navigator
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: {
    token: string;
  };
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Projects: undefined;
  Areas: undefined;
  Resources: undefined;
  Archive: undefined;
};

// PARA Stack Navigators
export type ProjectsStackParamList = {
  ProjectsList: undefined;
  ProjectDetails: {
    projectId: string;
  };
  ProjectNotes: {
    projectId: string;
  };
  CreateProject: undefined;
  EditProject: {
    projectId: string;
  };
};

export type AreasStackParamList = {
  AreasList: undefined;
  AreaDetails: {
    areaId: string;
  };
  AreaNotes: {
    areaId: string;
  };
  CreateArea: undefined;
  EditArea: {
    areaId: string;
  };
};

export type ResourcesStackParamList = {
  ResourcesList: undefined;
  ResourceDetails: {
    resourceId: string;
  };
  ResourceNotes: {
    resourceId: string;
  };
  CreateResource: undefined;
  EditResource: {
    resourceId: string;
  };
};

export type ArchiveStackParamList = {
  ArchiveList: undefined;
  ArchivedNote: {
    noteId: string;
  };
};

// Navigation Props
export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: any;
  route: { params: RootStackParamList[T] };
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = {
  navigation: any;
  route: { params: AuthStackParamList[T] };
};

export type MainTabScreenProps<T extends keyof MainTabParamList> = {
  navigation: any;
  route: { params: MainTabParamList[T] };
};

// Deep Linking
export type DeepLinkParams = {
  screen: string;
  params?: Record<string, any>;
};

export type DeepLinkConfig = {
  screens: Record<string, string | DeepLinkParams>;
};
