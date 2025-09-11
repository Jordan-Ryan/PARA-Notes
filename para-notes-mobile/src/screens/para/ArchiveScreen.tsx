import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { theme } from '@/constants/theme';

export const ArchiveScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Archive</Text>
          <Text style={styles.subtitle}>
            Inactive items from other categories
          </Text>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Archive is empty</Text>
          <Text style={styles.emptyDescription}>
            Completed projects and outdated resources will appear here
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography['3xl'],
    fontWeight: theme.typography.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.base,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.base * theme.typography.normalLineHeight,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: theme.typography.xl,
    fontWeight: theme.typography.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyDescription: {
    fontSize: theme.typography.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.base * theme.typography.normalLineHeight,
  },
});
