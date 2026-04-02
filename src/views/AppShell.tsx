import { StyleSheet, Text, View } from 'react-native';

import { useAppViewModel } from '../viewModels/useAppViewModel';
import { GameScreen } from './screens/GameScreen';
import { HomeScreen } from './screens/HomeScreen';
import { palette } from './theme';

export function AppShell() {
  const viewModel = useAppViewModel();

  if (viewModel.currentScreen === 'game' && viewModel.gameScreen) {
    return <GameScreen viewModel={viewModel} />;
  }

  if (viewModel.currentScreen === 'home') {
    return <HomeScreen viewModel={viewModel} />;
  }

  return (
    <View style={styles.fallback}>
      <Text style={styles.fallbackText}>Preparing Web Escape...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    backgroundColor: palette.background,
    flex: 1,
    justifyContent: 'center',
  },
  fallbackText: {
    color: palette.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});
