Hi, my project is a mobile game called WebEscape. The core idea is that each level is a directed acyclic graph, or DAG, and the player clears the level by tapping nodes in a valid topological order.

The problem this project solves is really two things at once. First, it turns a computer science concept, graph traversal and topological sorting, into something visual and interactive. Instead of learning it from a textbook, the player experiences the logic directly. Second, from a software perspective, it solves the problem of building a graph-based puzzle game in a way that is reusable, testable, and easy to grow. I wanted a system where I could keep adding levels, validate them automatically, and support mobile and web from the same codebase.

Let me show how it works.

On the home screen, the app shows the player’s current level and some progress stats. When I tap play, it opens the game screen and loads a level from a JSON file. Each level defines a grid size, a set of node positions, and directed edges between nodes.

While I’m playing, each node is only removable if its in-degree is zero, meaning no other active nodes are pointing into it. If I tap a node that is valid, it disappears and its outgoing edges fade away. If I tap a node too early, it shakes and I lose a life. So the player is constantly reading dependencies and figuring out which moves are currently allowed.

For the demo video portion on my phone, I’d narrate something like this:
“Here I’m opening a level. You can see the nodes laid out visually, and the arrows show the dependencies. If I tap a node with no incoming arrows, it clears correctly. If I tap a blocked node, I lose a life. As I remove nodes, other nodes become available because their in-degree drops to zero. Once every node is gone, the level is complete and the game advances me to the next stage.”

One thing I like about this project is that the gameplay rules are backed by the model instead of being hardcoded in the UI. The view just shows the current graph state, and the model decides whether a move is legal.

A second cool part of the code is the architecture. I built it around MVVM, so the model, view model, and view each have a clear role. In the model layer, there are Level, Graph, and Node classes. The Graph class is where the important game logic happens. When a node is tapped, the graph checks its in-degree. If that value is greater than zero, the tap is blocked. If it is zero, the graph removes the node and decreases the in-degree of its neighbors. That separation made the game much easier to debug and test.

A third cool part is how levels are stored and validated. Every level lives in a JSON file, so creating content does not require changing the gameplay code. I also wrote tests that automatically check whether a level is valid. For example, the tests verify that node IDs are unique, positions stay inside the grid, neighbors reference real nodes, and the graph has no cycles. There are also tests that simulate solving every shipped level by always tapping an in-degree-zero node. That gave me a lot of confidence when I started adding many more levels.

The last thing I want to explain is the agentic loop I used while building this.

My workflow was not just asking AI for random code. I gave the agent a specification of the app, including the gameplay, architecture, and constraints. Then I had it work in a loop: first read the specification, then inspect the existing code, then make a focused change, and then verify the result with tests. That worked especially well for this project because there were a lot of moving parts: model logic, UI behavior, and level content.

One concrete example is when I was fixing gameplay bugs and later generating levels. The loop helped because the agent could first understand how the graph logic worked, then inspect the test suite, then make changes that fit the architecture instead of patching around symptoms. It was most useful when I treated it like a collaborator that had to justify changes with the codebase and tests, not just produce output quickly.

Overall, the agentic loop sped up development, helped me stay consistent with my architecture, and made it easier to scale from a few levels to a much larger validated campaign.

That’s my project: a graph-based puzzle game that teaches dependency logic through play, uses a clean MVVM structure, and relies on automated validation to keep the content reliable as it grows.