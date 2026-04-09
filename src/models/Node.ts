export type NodeSnapshot = {
  id: number;
  x: number;
  y: number;
};

export class Node {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly neighbors: number[];
  inDegree = 0;

  constructor(id: number, x: number, y: number, neighbors: number[]) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.neighbors = [...neighbors];
  }

  decreaseInDegree() {
    this.inDegree = Math.max(0, this.inDegree - 1);
  }

  toSnapshot(): NodeSnapshot {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
    };
  }
}
