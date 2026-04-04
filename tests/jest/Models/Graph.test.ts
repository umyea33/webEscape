import { Graph } from '../../../src/models/Graph';
import { Node } from '../../../src/models/Node';

/**
 * Build a small chain graph: A → B → C
 * Node A has in-degree 0, B has in-degree 1, C has in-degree 1.
 */
function buildChainGraph() {
  const a = new Node(1, 0, 0, [2]);
  const b = new Node(2, 1, 0, [3]);
  const c = new Node(3, 2, 0, []);
  return new Graph([a, b, c]);
}

describe('Graph', () => {
  describe('tapNode on a valid (in-degree 0) node', () => {
    it('immediately removes the tapped node from active nodes', () => {
      const graph = buildChainGraph();

      const result = graph.tapNode(1);
      expect(result.kind).toBe('removed');

      const activeIds = graph.getActiveNodes().map((n) => n.id);
      expect(activeIds).not.toContain(1);
    });

    it('immediately removes edges originating from the tapped node', () => {
      const graph = buildChainGraph();

      graph.tapNode(1);

      const edgePairs = graph.getActiveEdges().map((e) => [e.from.id, e.to.id]);
      // Edge 1→2 should be gone
      expect(edgePairs).not.toContainEqual([1, 2]);
      // Edge 2→3 should still exist
      expect(edgePairs).toContainEqual([2, 3]);
    });

    it('immediately decreases in-degree of neighbors', () => {
      const graph = buildChainGraph();

      graph.tapNode(1);

      const nodeB = graph.getNode(2)!;
      expect(nodeB.inDegree).toBe(0);
    });

    it('active nodes and edges stay consistent through sequential removals', () => {
      const graph = buildChainGraph();

      // Remove A (in-degree 0)
      graph.tapNode(1);

      // After removing A, B should now have in-degree 0
      const nodeBAfterA = graph.getNode(2)!;
      expect(nodeBAfterA.inDegree).toBe(0);

      // Active nodes should be [B, C]
      let activeIds = graph.getActiveNodes().map((n) => n.id);
      expect(activeIds).toEqual([2, 3]);

      // Active edges should be [B→C] only
      let edgePairs = graph.getActiveEdges().map((e) => [e.from.id, e.to.id]);
      expect(edgePairs).toEqual([[2, 3]]);

      // Remove B (now in-degree 0)
      graph.tapNode(2);

      // C should now have in-degree 0
      const nodeC = graph.getNode(3)!;
      expect(nodeC.inDegree).toBe(0);

      // Active nodes should be [C]
      activeIds = graph.getActiveNodes().map((n) => n.id);
      expect(activeIds).toEqual([3]);

      // Active edges should be empty
      edgePairs = graph.getActiveEdges().map((e) => [e.from.id, e.to.id]);
      expect(edgePairs).toEqual([]);

      // Remove C
      graph.tapNode(3);
      expect(graph.isComplete()).toBe(true);
    });

    it('getActiveNodes never returns a removed node even when read multiple times', () => {
      const graph = buildChainGraph();

      graph.tapNode(1);

      // Simulate multiple reads (like animation re-renders would do)
      for (let i = 0; i < 10; i++) {
        const activeIds = graph.getActiveNodes().map((n) => n.id);
        expect(activeIds).not.toContain(1);
        expect(activeIds).toEqual([2, 3]);
      }
    });

    it('getActiveEdges never returns edges from a removed node even when read multiple times', () => {
      const graph = buildChainGraph();

      graph.tapNode(1);

      for (let i = 0; i < 10; i++) {
        const edgePairs = graph.getActiveEdges().map((e) => [e.from.id, e.to.id]);
        expect(edgePairs).not.toContainEqual([1, 2]);
      }
    });
  });

  describe('tapNode on an invalid (in-degree > 0) node', () => {
    it('returns blocked and does not mutate the graph', () => {
      const graph = buildChainGraph();

      const result = graph.tapNode(2);
      expect(result.kind).toBe('blocked');

      // Nothing should change
      const activeIds = graph.getActiveNodes().map((n) => n.id);
      expect(activeIds).toEqual([1, 2, 3]);

      const edgePairs = graph.getActiveEdges().map((e) => [e.from.id, e.to.id]);
      expect(edgePairs).toEqual([
        [1, 2],
        [2, 3],
      ]);
    });
  });
});
