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

function buildViewModel(): GameViewModel {
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
  };
}

function buildScreen() {
  let tree: ReactTestRenderer;

  act(() => {
    tree = create(
      <SafeAreaProvider>
        <GameScreen viewModel={buildViewModel()} />
      </SafeAreaProvider>,
    );
  });

  return tree!;
}

function getTopBar(root: ReturnType<typeof buildScreen>) {
  return root.root.findAllByType(View).find((node) => {
    const style = node.props.style;
    if (!style) return false;
    const styles = Array.isArray(style) ? style : [style];
    return styles.some((entry) => entry?.height === 52);
  })!;
}

function emitTopBarLayout(root: ReturnType<typeof buildScreen>, width: number, height: number) {
  act(() => {
    getTopBar(root).props.onLayout({
      nativeEvent: {
        layout: { width, height, x: 0, y: 0 },
      },
    });
  });
}

describe('GameScreen top bar startup layout stability', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('stays hidden while the top bar layout is still changing', () => {
    const tree = buildScreen();

    emitTopBarLayout(tree, 400, 52);

    expect(getTopBar(tree).props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ opacity: 0 })]),
    );

    emitTopBarLayout(tree, 400, 48);

    expect(getTopBar(tree).props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ opacity: 0 })]),
    );
  });

  it('reveals the top bar once its layout has stopped changing', () => {
    const tree = buildScreen();

    emitTopBarLayout(tree, 400, 52);

    act(() => {
      jest.advanceTimersByTime(32);
    });

    expect(getTopBar(tree).props.style).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ opacity: 0 })]),
    );
  });
});
