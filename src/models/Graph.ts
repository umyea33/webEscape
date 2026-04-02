import { Node } from './Node';

export type GraphEdge = {
  from: Node;
  to: Node;
};

export type GraphTapResult =
  | {
      kind: 'blocked';
      node: Node;
    }
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
    return this.getNodes().filter((node) => !node.removed);
  }

  getActiveEdges(): GraphEdge[] {
    return this.getActiveNodes().flatMap((node) =>
      node.neighbors
        .map((neighborId) => this.nodesById.get(neighborId))
        .filter((neighbor): neighbor is Node => neighbor instanceof Node && !neighbor.removed)
        .map((neighbor) => ({ from: node, to: neighbor })),
    );
  }

  tapNode(nodeId: number): GraphTapResult {
    const node = this.nodesById.get(nodeId);

    if (!node || node.removed || node.inDegree > 0) {
      return {
        kind: 'blocked',
        node: node ?? new Node(nodeId, 0, 0, []),
      };
    }

    node.removed = true;

    const affectedNeighbors = node.neighbors
      .map((neighborId) => this.nodesById.get(neighborId))
      .filter((neighbor): neighbor is Node => neighbor instanceof Node && !neighbor.removed);

    for (const neighbor of affectedNeighbors) {
      neighbor.decreaseInDegree();
    }

    return {
      kind: 'removed',
      node,
      affectedNeighbors,
    };
  }

  isComplete(): boolean {
    return this.getActiveNodes().length === 0;
  }

  private recalculateInDegrees() {
    for (const node of this.nodesById.values()) {
      node.inDegree = 0;
      node.removed = false;
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
