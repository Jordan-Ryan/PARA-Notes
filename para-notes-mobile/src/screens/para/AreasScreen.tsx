import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { theme } from '@/constants/theme';
import { FloatingActionButton } from '@/components/ui';

export const AreasScreen: React.FC = () => {
  const handleAddArea = () => {
    // TODO: Navigate to add area screen
    console.log('Add area');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Areas</Text>
          <Text style={styles.subtitle}>
            Standards you want to maintain over time
          </Text>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No areas yet</Text>
          <Text style={styles.emptyDescription}>
            Tap the + button to create your first area
          </Text>
        </View>
      </ScrollView>

      <FloatingActionButton
        onPress={handleAddArea}
        testID="add-area-fab"
      />
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
