import { Node } from './Node';

export type GraphEdge = {
  from: Node;
  to: Node;
};

export type GraphTapResult =
  | { kind: 'blocked'; nodeId: number }
  | {
      kind: 'removed';
      node: Node;
      affectedNeighbors: Node[];
    };

export class Graph {
  private readonly nodesById: Map<number, Node>;

  constructor(nodes: Node[]) {
    this.nodesById = new Map(nodes.map((node) => [node.id, node]));
    this.recalculateInDegrees();
  }

  getNode(nodeId: number): Node | undefined {
    return this.nodesById.get(nodeId);
  }

  getNodes(): Node[] {
    return [...this.nodesById.values()].sort((left, right) => left.id - right.id);
  }

  getActiveNodes(): Node[] {
    return this.getNodes();
  }

  getActiveEdges(): GraphEdge[] {
    return this.getNodes().flatMap((node) =>
      node.neighbors
        .map((neighborId) => this.nodesById.get(neighborId))
        .filter((neighbor): neighbor is Node => neighbor instanceof Node)
        .map((neighbor) => ({ from: node, to: neighbor })),
    );
  }

  tapNode(nodeId: number): GraphTapResult {
    const node = this.nodesById.get(nodeId);

    if (!node || node.inDegree > 0) {
      return { kind: 'blocked', nodeId };
    }

    const affectedNeighbors = node.neighbors
      .map((neighborId) => this.nodesById.get(neighborId))
      .filter((neighbor): neighbor is Node => neighbor instanceof Node);

    for (const neighbor of affectedNeighbors) {
      neighbor.decreaseInDegree();
    }

    this.nodesById.delete(nodeId);

    return {
      kind: 'removed',
      node,
      affectedNeighbors,
    };
  }

  isComplete(): boolean {
    return this.nodesById.size === 0;
  }

  private recalculateInDegrees() {
    for (const node of this.nodesById.values()) {
      node.inDegree = 0;
    }

    for (const node of this.nodesById.values()) {
      for (const neighborId of node.neighbors) {
        const neighbor = this.nodesById.get(neighborId);

        if (!neighbor) {
          throw new Error(`Graph references missing neighbor ${neighborId} from node ${node.id}.`);
        }

        neighbor.inDegree += 1;
      }
    }
  }
}
