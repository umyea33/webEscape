import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GameScreen } from '../../../src/views/screens/GameScreen';
import type { GameViewModel } from '../../../src/viewModels/useGameViewModel';

jest.mock('../../../src/views/components/GameBoard', () => ({
  GameBoard: () => null,
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function buildViewModel(timeDisplay: string | null): GameViewModel {
  return {
    activeEdges: [],
    activeNodes: [],
    blockedEventToken: 0,
    blockedNodeId: null,
    currentLevelLabel: 'Level 1',
    handleNodePress: jest.fn(),
    handleRemovalComplete: jest.fn(),
    isInteractionLocked: false,
    isOutOfLives: false,
    isOutOfTime: false,
    levelSummary: 'Test level',
    levelView: {
      id: 'level-1',
      gridWidth: 10,
      gridHeight: 10,
    },
    livesRemaining: 3,
    maxLives: 3,
    retryLevel: jest.fn(),
    returnHome: jest.fn(),
    setZoom: jest.fn(),
    showGrid: false,
    timeDisplay,
    toggleGrid: jest.fn(),
    zoom: 0.5,
  };
}

function buildScreen(timeDisplay: string | null) {
  let tree: ReactTestRenderer;

  act(() => {
    tree = create(
      <SafeAreaProvider>
        <GameScreen viewModel={buildViewModel(timeDisplay)} />
      </SafeAreaProvider>,
    );
  });

  return tree!;
}

function getLivesContainer(root: ReturnType<typeof buildScreen>) {
  return root.root.findAllByType(View).find((node) => {
    const style = node.props.style;
    if (!style) return false;
    const styles = Array.isArray(style) ? style : [style];
    return styles.some((entry) => entry?.position === 'absolute' && entry?.left === 0 && entry?.right === 0);
  })!;
}

function expectLivesContainerCentered(root: ReturnType<typeof buildScreen>) {
  const style = getLivesContainer(root).props.style;
  const styles = Array.isArray(style) ? style : [style];

  expect(styles).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
      }),
    ]),
  );
}

describe('GameScreen heart layout', () => {
  it('keeps the hearts centered across the full top bar when time is shown', () => {
    const tree = buildScreen('0:30');

    expectLivesContainerCentered(tree);
  });

  it('keeps the hearts centered across the full top bar when time is hidden', () => {
    const tree = buildScreen(null);

    expectLivesContainerCentered(tree);
  });
});
