import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppViewModel } from '../../viewModels/useAppViewModel';
import { PrimaryButton } from '../components/PrimaryButton';
import { palette, typography } from '../theme';

type HomeScreenProps = {
  viewModel: AppViewModel;
};

export function HomeScreen({ viewModel }: HomeScreenProps) {
  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.centerSection}>
          <Text style={styles.levelLabel}>{viewModel.currentLevelLabel}</Text>
        </View>

        <View style={styles.bottomSection}>
          <PrimaryButton label={viewModel.playButtonLabel} onPress={viewModel.openGameScreen} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: palette.background,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  centerSection: {
    alignItems: 'center',
    flex: 4,
    justifyContent: 'center',
  },
  levelLabel: {
    color: palette.text,
    fontSize: typography.titleSize,
    fontWeight: '800',
  },
  bottomSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
