export function createDependencyGraph(schema) {
  const graph = {};

  schema.forEach(table => {
    if (!graph[table.table]) {
      graph[table.table] = new Set(); // Use a Set to avoid duplicate dependencies
    }

    // Populate edges based on keyTo
    table.columns.forEach((column) => {
      if (column.keyTo) {
        column.keyTo.forEach((keyTo) => {
          let referencedTable = keyTo.split('.')[0]; // Extract table name from keyTo
          // Create an edge from current table to the referenced table
          graph[table.table].add(referencedTable);

          // Ensure referenced table is also in the graph
          if (!graph[referencedTable]) {
            graph[referencedTable] = new Set();
          }
        });
      }
    });
  });

  return graph;
}

export function topologicalSort(graph) {
  let visited = new Set(); // Tracks visited nodes
  let stack = []; // Use an array as a stack to hold the sorted elements
  let isCyclic = false; // Flag to check for cycles

  function visit(node) {
    if (visited.has(node)) return;
    visited.add(node);

    graph[node].forEach(dependency => {
      if (!visited.has(dependency)) {
        visit(dependency);
      }
    });

    // Add to the beginning of the stack to ensure dependencies are listed first
    stack.unshift(node);
  }

  // Visit all nodes in the graph
  Object.keys(graph).forEach(node => {
    if (!visited.has(node)) {
      visit(node);
    }
  });

  if (isCyclic) {
    console.error('The graph has a cycle and cannot be topologically sorted.');
    return [];
  }

  return stack;
}

export function sortSchema(schema, sortedTables) {
  return schema.sort((a, b) => {
    const indexA = sortedTables.indexOf(a.table);
    const indexB = sortedTables.indexOf(b.table);
    return indexB - indexA;
  });
}
