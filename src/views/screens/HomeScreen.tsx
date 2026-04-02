import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppViewModel } from '../../viewModels/useAppViewModel';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette, spacing, typography } from '../theme';

type HomeScreenProps = {
  viewModel: AppViewModel;
};

export function HomeScreen({ viewModel }: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 900;

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
        <View style={[styles.container, isWideLayout && styles.containerWide]}>
          <View style={[styles.heroCard, isWideLayout && styles.heroCardWide]}>
            <Text style={styles.eyebrow}>Web Escape</Text>
            <Text style={styles.title}>{viewModel.currentLevelLabel}</Text>
            <Text style={styles.subtitle}>{viewModel.homeHeadline}</Text>
            <View style={styles.heroMetaRow}>
              <View style={styles.heroMetaPill}>
                <Text style={styles.heroMetaLabel}>Campaign</Text>
                <Text style={styles.heroMetaValue}>5 seeded levels</Text>
              </View>

              <View style={styles.heroMetaPill}>
                <Text style={styles.heroMetaLabel}>Platform</Text>
                <Text style={styles.heroMetaValue}>Expo SDK 54</Text>
              </View>
            </View>
          </View>

          <View style={styles.sideColumn}>
            <View style={[styles.statsGrid, isWideLayout && styles.statsGridWide]}>
              <StatCard isWide={isWideLayout} label="Levels Cleared" value={String(viewModel.playerStats.levelsCompleted)} />
              <StatCard isWide={isWideLayout} label="Perfect Clears" value={String(viewModel.playerStats.perfectClears)} />
              <StatCard isWide={isWideLayout} label="Total Attempts" value={String(viewModel.playerStats.totalAttempts)} />
              <StatCard isWide={isWideLayout} label="Mistakes Made" value={String(viewModel.playerStats.totalMistakes)} />
            </View>

            <PrimaryButton label={viewModel.playButtonLabel} onPress={viewModel.openGameScreen} />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

type StatCardProps = {
  isWide: boolean;
  label: string;
  value: string;
};

function StatCard({ isWide, label, value }: StatCardProps) {
  return (
    <View style={[styles.statCard, isWide && styles.statCardWide]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: palette.background,
    flex: 1,
  },
  container: {
    backgroundColor: palette.background,
    gap: spacing.lg,
    marginHorizontal: 'auto',
    maxWidth: 1240,
    padding: spacing.lg,
    width: '100%',
  },
  containerWide: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  heroCard: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 28,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  heroCardWide: {
    flex: 1.1,
  },
  eyebrow: {
    color: palette.secondary,
    fontSize: typography.captionSize,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroMetaLabel: {
    color: palette.mutedText,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroMetaPill: {
    backgroundColor: palette.surfaceAlt,
    borderRadius: 20,
    gap: 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  heroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  heroMetaValue: {
    color: palette.text,
    fontSize: typography.captionSize,
    fontWeight: '700',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  sideColumn: {
    gap: spacing.lg,
  },
  title: {
    color: palette.text,
    fontSize: typography.titleSize,
    fontWeight: '800',
  },
  subtitle: {
    color: palette.mutedText,
    fontSize: typography.bodySize,
    lineHeight: 24,
  },
  statsGrid: {
    gap: spacing.md,
  },
  statsGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: palette.surfaceAlt,
    borderRadius: 22,
    gap: spacing.xs,
    padding: spacing.md,
  },
  statCardWide: {
    flexBasis: '48%',
    flexGrow: 1,
  },
  statLabel: {
    color: palette.mutedText,
    fontSize: typography.captionSize,
    textTransform: 'uppercase',
  },
  statValue: {
    color: palette.text,
    fontSize: typography.headingSize,
    fontWeight: '700',
  },
});
