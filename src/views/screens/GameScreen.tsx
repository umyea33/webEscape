import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppViewModel } from '../../viewModels/useAppViewModel';
import { GameBoard } from '../components/GameBoard';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette, spacing, typography } from '../theme';

type GameScreenProps = {
  viewModel: AppViewModel;
};

export function GameScreen({ viewModel }: GameScreenProps) {
  if (!viewModel.gameScreen) {
    return null;
  }

  const { width } = useWindowDimensions();
  const isWideLayout = width >= 980;
  const noticeTitle = viewModel.gameScreen.isOutOfLives ? 'Out of lives' : 'How to clear the graph';
  const noticeBody = viewModel.gameScreen.isOutOfLives
    ? 'Invalid moves shake the node and cost a life. Retry the level to reset the graph.'
    : 'Only tap nodes whose current in-degree is zero. Ready nodes are green, blocked nodes are clay.';
  const primaryActionLabel = viewModel.gameScreen.isOutOfLives ? 'Retry Level' : 'Back Home';
  const primaryAction = viewModel.gameScreen.isOutOfLives
    ? viewModel.gameScreen.retryLevel
    : viewModel.gameScreen.returnHome;

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.safeArea}>
      <View style={[styles.container, isWideLayout && styles.containerWide]}>
        <View style={styles.boardColumn}>
          <View style={styles.headerRow}>
            <View style={styles.headerCopy}>
              <Text style={styles.title}>{viewModel.gameScreen.currentLevelLabel}</Text>
              <Text style={styles.body}>{viewModel.gameScreen.levelSummary}</Text>
            </View>

            <View style={styles.livesBadge}>
              <Text style={styles.livesLabel}>Lives</Text>
              <Text style={styles.livesValue}>{viewModel.gameScreen.livesRemaining}</Text>
            </View>
          </View>

          <View style={styles.toolbar}>
            <ToolbarButton label={viewModel.gameScreen.showGrid ? 'Hide Grid' : 'Show Grid'} onPress={viewModel.gameScreen.toggleGrid} />
            <ToolbarButton label="Zoom -" onPress={viewModel.gameScreen.zoomOut} />
            <ToolbarButton label="Zoom +" onPress={viewModel.gameScreen.zoomIn} />
            <View style={styles.zoomBadge}>
              <Text style={styles.zoomBadgeText}>{Math.round(viewModel.gameScreen.zoom * 100)}% zoom</Text>
            </View>
          </View>

          <GameBoard
            blockedEventToken={viewModel.gameScreen.blockedEventToken}
            blockedNodeId={viewModel.gameScreen.blockedNodeId}
            isInteractionLocked={viewModel.gameScreen.isInteractionLocked}
            level={viewModel.gameScreen.level}
            onNodePress={viewModel.gameScreen.handleNodePress}
            removalEvent={viewModel.gameScreen.removalEvent}
            showGrid={viewModel.gameScreen.showGrid}
            zoom={viewModel.gameScreen.zoom}
          />
        </View>

        <View style={[styles.sideColumn, isWideLayout ? styles.sideColumnWide : styles.sideColumnStacked]}>
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>{noticeTitle}</Text>
            <Text style={styles.noticeBody}>{noticeBody}</Text>
          </View>

          <View style={styles.footerActions}>
            <View style={styles.flexAction}>
              <PrimaryButton label={primaryActionLabel} onPress={primaryAction} />
            </View>
          </View>

          {isWideLayout ? (
            <View style={styles.helperCard}>
              <Text style={styles.helperTitle}>Board Controls</Text>
              <Text style={styles.helperBody}>
                Pan to inspect the graph, tap ready nodes to remove them, and use zoom without changing the half-screen overscroll space.
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

type ToolbarButtonProps = {
  label: string;
  onPress: () => void;
};

function ToolbarButton({ label, onPress }: ToolbarButtonProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.toolbarButton, pressed && styles.toolbarButtonPressed]}>
      <Text style={styles.toolbarButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: palette.background,
    flex: 1,
  },
  boardColumn: {
    flex: 1,
    gap: spacing.md,
    minHeight: 0,
  },
  body: {
    color: palette.mutedText,
    fontSize: typography.bodySize,
    lineHeight: 24,
  },
  container: {
    backgroundColor: palette.background,
    flex: 1,
    gap: spacing.md,
    marginHorizontal: 'auto',
    maxWidth: 1480,
    padding: spacing.lg,
    width: '100%',
  },
  containerWide: {
    flexDirection: 'row',
  },
  flexAction: {
    flex: 1,
  },
  footerActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 220,
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  helperBody: {
    color: palette.mutedText,
    fontSize: typography.captionSize,
    lineHeight: 20,
  },
  helperCard: {
    backgroundColor: palette.surfaceAlt,
    borderRadius: 22,
    gap: spacing.xs,
    padding: spacing.md,
  },
  helperTitle: {
    color: palette.text,
    fontSize: typography.bodySize,
    fontWeight: '800',
  },
  livesBadge: {
    alignItems: 'center',
    backgroundColor: palette.surfaceAlt,
    borderRadius: 24,
    minWidth: 84,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  livesLabel: {
    color: palette.mutedText,
    fontSize: typography.captionSize,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  livesValue: {
    color: palette.primary,
    fontSize: typography.headingSize,
    fontWeight: '800',
  },
  noticeBody: {
    color: palette.mutedText,
    fontSize: typography.bodySize,
    lineHeight: 22,
  },
  noticeCard: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  noticeTitle: {
    color: palette.text,
    fontSize: typography.bodySize,
    fontWeight: '800',
  },
  sideColumn: {
    gap: spacing.md,
  },
  sideColumnStacked: {
    width: '100%',
  },
  sideColumnWide: {
    flexShrink: 0,
    width: 320,
  },
  title: {
    color: palette.text,
    fontSize: typography.titleSize,
    fontWeight: '800',
  },
  toolbar: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  toolbarButton: {
    backgroundColor: palette.surfaceAlt,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  toolbarButtonPressed: {
    opacity: 0.8,
  },
  toolbarButtonText: {
    color: palette.primary,
    fontSize: typography.captionSize,
    fontWeight: '700',
  },
  zoomBadge: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  zoomBadgeText: {
    color: palette.mutedText,
    fontSize: typography.captionSize,
    fontWeight: '700',
  },
});
