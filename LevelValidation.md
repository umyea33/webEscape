To ensure that a level is valid it will need to have several tests.

There will be three different types of tests, level validation tests, good level tests, and graph validation tests.

Level Validation:
A test that ensures that the json file is actually valid json.
A test that ensures the json has all the proper things for a level.  This includes an id, number, name, grid, timeLimit, and nodes.  The grid should have a width and a height.  Nodes is a list of nodes and each node should have an id, position (x and y), and neighbors.
A test that ensures there are no duplicate node IDs.
A test that ensures the grid width or height is not 0.
A test that ensures the grid doesn't have a negative width or a negative height.
A test that ensures all node x positions are in bounds of the grid.
A test that ensures all node y positions are in bounds of the grid.
A test that ensures that no node points to a neighbor that doesn't exist.


Good Level:
A test that ensures no nodes have positions on the outside layer of the grid.
A test that ensures all nodes are at least 3 positions horizontally or vertically away from every other node. 


Graph Validation:
A test that ensures there are no nodes that have themselves as a neighbor.
A test that ensures there are no cycles in the graph.