import { render, screen } from '@testing-library/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from '../../../src/views/screens/HomeScreen';
import { defaultPlayerProgress } from '../../../src/storage/playerProgressStore.shared';

describe('HomeScreen', () => {
  it('displays the current level label', () => {
    const mockViewModel = {
      screen: 'home' as const,
      currentLevelLabel: 'Level 5',
      playButtonLabel: 'Play',
      playerProgress: defaultPlayerProgress,
      openGameScreen: jest.fn(),
      updatePlayerProgress: jest.fn(),
    };

    render(
      <SafeAreaProvider>
        <HomeScreen viewModel={mockViewModel} />
      </SafeAreaProvider>,
    );

    expect(screen.getByText('Level 5')).toBeTruthy();
  });
});
