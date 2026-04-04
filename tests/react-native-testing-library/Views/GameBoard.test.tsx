import { act, renderHook } from '@testing-library/react';

import { useAppViewModel } from '../../../src/viewModels/useAppViewModel';

/**
 * Level 1 has nodes: 1→[2,3], 2→[4], 3→[4], 4→[]
 * Node 1 is the only node with in-degree 0 at the start.
 *
 * These tests exercise the ViewModel's handleNodePress to verify that
 * after tapping a valid node, the model state exposed to the view
 * (activeNodes, activeEdges via level.graph) is fully consistent.
 */
describe('GameBoard after tapping a valid node', () => {
  beforeEach(() => {
    globalThis.localStorage?.clear();
  });

  it('removes the tapped node from active nodes immediately', () => {
    const { result } = renderHook(() => useAppViewModel());

    // Open the game screen to load level 1
    act(() => {
      result.current.openGameScreen();
    });

    const gameScreen = result.current.gameScreen!;
    const level = gameScreen.level;

    // All four nodes should be active initially
    expect(level.graph.getActiveNodes().map((n) => n.id)).toEqual([1, 2, 3, 4]);

    // Tap node 1 (in-degree 0)
    act(() => {
      gameScreen.handleNodePress(1);
    });

    // Node 1 should no longer be in active nodes
    const activeIds = level.graph.getActiveNodes().map((n) => n.id);
    expect(activeIds).not.toContain(1);
    expect(activeIds).toEqual([2, 3, 4]);
  });

  it('removes edges from the tapped node immediately', () => {
    const { result } = renderHook(() => useAppViewModel());

    act(() => {
      result.current.openGameScreen();
    });

    const gameScreen = result.current.gameScreen!;
    const level = gameScreen.level;

    act(() => {
      gameScreen.handleNodePress(1);
    });

    const edgePairs = level.graph.getActiveEdges().map((e) => [e.from.id, e.to.id]);
    expect(edgePairs).not.toContainEqual([1, 2]);
    expect(edgePairs).not.toContainEqual([1, 3]);
    // Edge 2→4 and 3→4 should still exist
    expect(edgePairs).toContainEqual([2, 4]);
    expect(edgePairs).toContainEqual([3, 4]);
  });

  it('updates neighbor in-degrees immediately after removal', () => {
    const { result } = renderHook(() => useAppViewModel());

    act(() => {
      result.current.openGameScreen();
    });

    const gameScreen = result.current.gameScreen!;
    const level = gameScreen.level;

    // Before tap, nodes 2 and 3 have in-degree 1
    expect(level.graph.getNode(2)!.inDegree).toBe(1);
    expect(level.graph.getNode(3)!.inDegree).toBe(1);

    act(() => {
      gameScreen.handleNodePress(1);
    });

    // After removing node 1, nodes 2 and 3 should have in-degree 0
    expect(level.graph.getNode(2)!.inDegree).toBe(0);
    expect(level.graph.getNode(3)!.inDegree).toBe(0);
  });

  it('stays consistent through sequential removals without crashing', () => {
    const { result } = renderHook(() => useAppViewModel());

    act(() => {
      result.current.openGameScreen();
    });

    const gameScreen = result.current.gameScreen!;
    const level = gameScreen.level;

    // Tap node 1 (in-degree 0)
    act(() => {
      gameScreen.handleNodePress(1);
    });

    expect(level.graph.getActiveNodes().map((n) => n.id)).toEqual([2, 3, 4]);

    // Tap node 2 (now in-degree 0)
    act(() => {
      gameScreen.handleNodePress(2);
    });

    expect(level.graph.getActiveNodes().map((n) => n.id)).toEqual([3, 4]);

    // Tap node 3 (now in-degree 0)
    act(() => {
      gameScreen.handleNodePress(3);
    });

    expect(level.graph.getActiveNodes().map((n) => n.id)).toEqual([4]);

    // Tap node 4 (now in-degree 0) — completes the level
    act(() => {
      gameScreen.handleNodePress(4);
    });

    expect(level.graph.isComplete()).toBe(true);
  });
});
