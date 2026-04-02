import { Graph } from './Graph';
import { Node } from './Node';

export type LevelNodeDefinition = {
  id: number;
  position: {
    x: number;
    y: number;
  };
  neighbors: number[];
};

export type LevelDefinition = {
  id: string;
  number: number;
  name: string;
  grid: {
    width: number;
    height: number;
  };
  nodes: LevelNodeDefinition[];
};

export class Level {
  readonly id: string;
  readonly number: number;
  readonly name: string;
  readonly gridWidth: number;
  readonly gridHeight: number;
  readonly graph: Graph;

  private constructor(id: string, number: number, name: string, gridWidth: number, gridHeight: number, graph: Graph) {
    this.id = id;
    this.number = number;
    this.name = name;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.graph = graph;
  }

  static fromDefinition(definition: LevelDefinition) {
    validateLevelDefinition(definition);

    const nodes = definition.nodes.map(
      (nodeDefinition) =>
        new Node(
          nodeDefinition.id,
          nodeDefinition.position.x,
          nodeDefinition.position.y,
          nodeDefinition.neighbors,
        ),
    );

    return new Level(
      definition.id,
      definition.number,
      definition.name,
      definition.grid.width,
      definition.grid.height,
      new Graph(nodes),
    );
  }
}

function validateLevelDefinition(definition: LevelDefinition) {
  if (definition.grid.width <= 0 || definition.grid.height <= 0) {
    throw new Error(`Level ${definition.id} must have a positive grid size.`);
  }

  const knownIds = new Set<number>();

  for (const node of definition.nodes) {
    if (knownIds.has(node.id)) {
      throw new Error(`Level ${definition.id} contains duplicate node id ${node.id}.`);
    }

    knownIds.add(node.id);

    if (node.position.x < 0 || node.position.x >= definition.grid.width) {
      throw new Error(`Node ${node.id} in ${definition.id} has an x position outside the grid.`);
    }

    if (node.position.y < 0 || node.position.y >= definition.grid.height) {
      throw new Error(`Node ${node.id} in ${definition.id} has a y position outside the grid.`);
    }
  }

  for (const node of definition.nodes) {
    for (const neighborId of node.neighbors) {
      if (!knownIds.has(neighborId)) {
        throw new Error(`Node ${node.id} in ${definition.id} references unknown neighbor ${neighborId}.`);
      }
    }
  }
}
