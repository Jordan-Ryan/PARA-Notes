import React, { useEffect, useRef } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { theme } from '@/constants/theme';

const { height: screenHeight } = Dimensions.get('window');

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  animationType?: 'slide' | 'fade' | 'none';
  testID?: string;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  animationType = 'slide',
  testID,
}) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      if (animationType === 'slide') {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (animationType === 'fade') {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } else {
      if (animationType === 'slide') {
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (animationType === 'fade') {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [visible, animationType, slideAnim, fadeAnim]);

  const handleBackdropPress = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  const getModalStyle = () => {
    switch (size) {
      case 'sm':
        return styles.sm;
      case 'md':
        return styles.md;
      case 'lg':
        return styles.lg;
      case 'full':
        return styles.full;
      default:
        return styles.md;
    }
  };

  const renderContent = () => (
    <View style={[styles.container, getModalStyle()]} testID={testID}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {showCloseButton && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              testID={`${testID}-close`}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.backdrop}>
          {animationType === 'slide' ? (
            <Animated.View
              style={[
                styles.animatedContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              {renderContent()}
            </Animated.View>
          ) : animationType === 'fade' ? (
            <Animated.View
              style={[
                styles.animatedContainer,
                { opacity: fadeAnim },
              ]}
            >
              {renderContent()}
            </Animated.View>
          ) : (
            renderContent()
          )}
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedContainer: {
    width: '100%',
    alignItems: 'center',
  },
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.lg,
  },
  sm: {
    width: '80%',
    maxWidth: 400,
  },
  md: {
    width: '90%',
    maxWidth: 500,
  },
  lg: {
    width: '95%',
    maxWidth: 600,
  },
  full: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.lg,
    fontWeight: theme.typography.semibold,
    color: theme.colors.text,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: theme.typography.xl,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.bold,
  },
  content: {
    padding: theme.spacing.lg,
  },
});
