import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Button } from '@/components/ui';
import { theme } from '@/constants/theme';

export const ResetPasswordScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      // TODO: Show error message
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement password reset
      console.log('Reset password');
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your new password below.
          </Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter new password"
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                testID="password-input"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                testID="confirm-password-input"
              />
            </View>

            <Button
              title="Reset Password"
              onPress={handleResetPassword}
              loading={isLoading}
              disabled={!password || !confirmPassword}
              fullWidth
              testID="reset-button"
            />
          </View>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography['3xl'],
    fontWeight: theme.typography.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
    lineHeight: theme.typography.base * theme.typography.normalLineHeight,
  },
  form: {
    gap: theme.spacing.lg,
  },
  inputContainer: {
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.sm,
    fontWeight: theme.typography.medium,
    color: theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.base,
    color: theme.colors.text,
    backgroundColor: theme.colors.white,
  },
});
