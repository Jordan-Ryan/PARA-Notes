import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { theme } from '@/constants/theme';

export const NoteEditorScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Note title..."
            placeholderTextColor={theme.colors.textTertiary}
            testID="title-input"
          />
        </View>

        <View style={styles.contentContainer}>
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="Start writing your note..."
            placeholderTextColor={theme.colors.textTertiary}
            multiline
            textAlignVertical="top"
            testID="content-input"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  titleInput: {
    fontSize: theme.typography['2xl'],
    fontWeight: theme.typography.semibold,
    color: theme.colors.text,
    minHeight: 40,
  },
  contentContainer: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  contentInput: {
    fontSize: theme.typography.base,
    color: theme.colors.text,
    lineHeight: theme.typography.base * theme.typography.normalLineHeight,
    minHeight: 200,
  },
});
