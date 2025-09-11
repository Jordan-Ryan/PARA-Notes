import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { theme } from '@/constants/theme';

export const NoteSearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search notes..."
          placeholderTextColor={theme.colors.textTertiary}
          autoFocus
          testID="search-input"
        />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptyDescription}>
            Try searching for a different term
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
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchInput: {
    fontSize: theme.typography.lg,
    color: theme.colors.text,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  content: {
    flex: 1,
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
  },
});
