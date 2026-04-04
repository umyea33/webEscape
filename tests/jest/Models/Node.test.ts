import { Node } from '../../../src/models/Node';

describe('Node', () => {
  it('decreases in-degree but never below 0', () => {
    const node = new Node(1, 0, 0, []);
    node.inDegree = 2;

    node.decreaseInDegree();
    expect(node.inDegree).toBe(1);

    node.decreaseInDegree();
    expect(node.inDegree).toBe(0);

    node.decreaseInDegree();
    expect(node.inDegree).toBe(0);
  });
});
