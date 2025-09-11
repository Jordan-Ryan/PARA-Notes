import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import { PARA_CATEGORY_ICONS, PARA_CATEGORY_LABELS } from '@/constants/para';
import { ParaCategory } from '@/types';

export const HomeScreen: React.FC = () => {
  const categories: ParaCategory[] = ['projects', 'areas', 'resources', 'archive'];

  const handleCategoryPress = (category: ParaCategory) => {
    // TODO: Navigate to category screen
    console.log('Navigate to:', category);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.welcomeBadge}>
            <Text style={styles.welcomeText}>Welcome to PARA Notes</Text>
          </View>
          <Text style={styles.title}>Organize Your Life</Text>
          <Text style={styles.subtitle}>
            The PARA method helps you organize information by actionability: 
            <Text style={styles.highlight}> Projects</Text>, 
            <Text style={styles.highlight}> Areas</Text>, 
            <Text style={styles.highlight}> Resources</Text>, and 
            <Text style={styles.highlight}> Archive</Text>.
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.projects + '20' }]}>
              <Text style={[styles.statIconText, { color: theme.colors.projects }]}>📁</Text>
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Active Projects</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.areas + '20' }]}>
              <Text style={[styles.statIconText, { color: theme.colors.areas }]}>🎯</Text>
            </View>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Areas</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.resources + '20' }]}>
              <Text style={[styles.statIconText, { color: theme.colors.resources }]}>📚</Text>
            </View>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Resources</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.archive + '20' }]}>
              <Text style={[styles.statIconText, { color: theme.colors.archive }]}>📝</Text>
            </View>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Notes</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.categories}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[styles.categoryCard, getCategoryCardStyle(category)]}
                onPress={() => handleCategoryPress(category)}
                testID={`category-${category}`}
                activeOpacity={0.8}
              >
                <View style={[styles.categoryIconContainer, getCategoryIconStyle(category)]}>
                  <Text style={styles.categoryIcon}>
                    {PARA_CATEGORY_ICONS[category]}
                  </Text>
                </View>
                <Text style={styles.categoryTitle}>
                  {PARA_CATEGORY_LABELS[category]}
                </Text>
                <Text style={styles.categoryDescription}>
                  {getCategoryDescription(category)}
                </Text>
                <View style={styles.categoryArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const getCategoryDescription = (category: ParaCategory): string => {
  switch (category) {
    case 'projects':
      return 'Outcomes with deadlines';
    case 'areas':
      return 'Standards to maintain';
    case 'resources':
      return 'Topics to reference';
    case 'archive':
      return 'Inactive items';
    default:
      return '';
  }
};

const getCategoryCardStyle = (category: ParaCategory) => {
  const baseStyle = {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  };

  switch (category) {
    case 'projects':
      return { ...baseStyle, borderLeftWidth: 4, borderLeftColor: theme.colors.projects };
    case 'areas':
      return { ...baseStyle, borderLeftWidth: 4, borderLeftColor: theme.colors.areas };
    case 'resources':
      return { ...baseStyle, borderLeftWidth: 4, borderLeftColor: theme.colors.resources };
    case 'archive':
      return { ...baseStyle, borderLeftWidth: 4, borderLeftColor: theme.colors.archive };
    default:
      return baseStyle;
  }
};

const getCategoryIconStyle = (category: ParaCategory) => {
  switch (category) {
    case 'projects':
      return { backgroundColor: theme.colors.projects + '20' };
    case 'areas':
      return { backgroundColor: theme.colors.areas + '20' };
    case 'resources':
      return { backgroundColor: theme.colors.resources + '20' };
    case 'archive':
      return { backgroundColor: theme.colors.archive + '20' };
    default:
      return { backgroundColor: theme.colors.gray100 };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: theme.spacing.xxxl,
  },
  heroSection: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  welcomeBadge: {
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.lg,
  },
  welcomeText: {
    fontSize: theme.typography.sm,
    fontWeight: theme.typography.medium,
    color: theme.colors.primary,
  },
  title: {
    fontSize: theme.typography['5xl'],
    fontWeight: theme.typography.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    lineHeight: theme.typography['5xl'] * theme.typography.tight,
  },
  subtitle: {
    fontSize: theme.typography.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lg * theme.typography.relaxed,
    paddingHorizontal: theme.spacing.md,
  },
  highlight: {
    fontWeight: theme.typography.semibold,
    color: theme.colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  statIconText: {
    fontSize: 24,
  },
  statNumber: {
    fontSize: theme.typography['3xl'],
    fontWeight: theme.typography.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.xl,
    fontWeight: theme.typography.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  categories: {
    gap: theme.spacing.md,
  },
  categoryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryTitle: {
    fontSize: theme.typography.lg,
    fontWeight: theme.typography.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    flex: 1,
  },
  categoryDescription: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  categoryArrow: {
    marginLeft: theme.spacing.sm,
  },
  arrowText: {
    fontSize: theme.typography.lg,
    color: theme.colors.textTertiary,
  },
});
