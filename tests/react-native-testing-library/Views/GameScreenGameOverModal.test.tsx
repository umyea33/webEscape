import React from 'react';
import { Pressable, Text } from 'react-native';
import { act, create } from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GameScreen } from '../../../src/views/screens/GameScreen';
import type { GameViewModel } from '../../../src/viewModels/useGameViewModel';

jest.mock('../../../src/views/components/GameBoard', () => ({
  GameBoard: () => null,
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function buildViewModel(overrides: Partial<GameViewModel> = {}): GameViewModel {
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
    timeDisplay: '0:30',
    toggleGrid: jest.fn(),
    zoom: 0.5,
    ...overrides,
  };
}

function renderScreen(overrides: Partial<GameViewModel> = {}) {
  const viewModel = buildViewModel(overrides);
  let tree: ReturnType<typeof create>;

  act(() => {
    tree = create(
      <SafeAreaProvider>
        <GameScreen viewModel={viewModel} />
      </SafeAreaProvider>,
    );
  });

  return { tree: tree!, viewModel };
}

describe('GameScreen game-over modal', () => {
  it('shows an out of lives modal when the player loses all lives', () => {
    const { tree } = renderScreen({ isOutOfLives: true, isInteractionLocked: true, livesRemaining: 0 });

    expect(tree.root.findByProps({ children: 'Out of Lives' })).toBeTruthy();
    expect(tree.root.findByProps({ children: 'Restart' })).toBeTruthy();
  });

  it('shows an out of time modal when the timer expires', () => {
    const { tree } = renderScreen({ isOutOfTime: true, isInteractionLocked: true });

    expect(tree.root.findByProps({ children: 'Out of Time' })).toBeTruthy();
  });

  it('keeps the modal hidden during normal play', () => {
    const { tree } = renderScreen();

    expect(tree.root.findAllByProps({ children: 'Restart' })).toHaveLength(0);
  });

  it('restarts the level when restart is pressed', () => {
    const { tree, viewModel } = renderScreen({ isOutOfLives: true, isInteractionLocked: true, livesRemaining: 0 });

    const restartButton = tree.root
      .findAllByType(Pressable)
      .find((node) => node.findAllByType(Text).some((textNode) => textNode.props.children === 'Restart'));

    expect(restartButton).toBeDefined();

    act(() => {
      restartButton!.props.onPress();
    });

    expect(viewModel.retryLevel).toHaveBeenCalledTimes(1);
  });
});
