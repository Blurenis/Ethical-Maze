// generateMaze.js
export default function generateMaze(length, height, complexity = 0.3) {
  const initializeMaze = () => {
    const newMaze = [];
    for (let i = 0; i < height; i++) {
      const row = new Array(length).fill(1);
      newMaze.push(row);
    }
    return newMaze;
  };

  const getUnvisitedNeighbors = (x, y, maze) => {
    const neighbors = [];
    const directions = [
      [x, y - 2],
      [x + 2, y],
      [x, y + 2],
      [x - 2, y]
    ];

    for (const [nextX, nextY] of directions) {
      if (nextX > 0 && nextX < length - 1 &&
          nextY > 0 && nextY < height - 1 &&
          maze[nextY][nextX] === 1) {
        neighbors.push([nextX, nextY]);
      }
    }
    return neighbors;
  };

  const countAdjacentWalls = (x, y, maze) => {
    let count = 0;
    const directions = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];

    for (const [dx, dy] of directions) {
      if (x + dx >= 0 && x + dx < length && y + dy >= 0 && y + dy < height) {
        if (maze[y + dy][x + dx] === 1) count++;
      }
    }
    return count;
  };

  const addAdditionalPaths = (maze) => {
    const pathsToAdd = Math.floor((length * height) * complexity * 0.1);

    for (let i = 0; i < pathsToAdd; i++) {
      const x = Math.floor(Math.random() * (length - 2)) + 1;
      const y = Math.floor(Math.random() * (height - 2)) + 1;

      if (maze[y][x] === 1) {
        const wallCount = countAdjacentWalls(x, y, maze);
        if (wallCount >= 5) {
          maze[y][x] = 0;
        }
      }
    }
  };

  const maze = initializeMaze();
  const stack = [];
  const startX = 1;
  const startY = 1;

  maze[startY][startX] = 0;
  stack.push([startX, startY]);

  while (stack.length > 0) {
    const [currentX, currentY] = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(currentX, currentY, maze);

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const [nextX, nextY] = neighbors[Math.floor(Math.random() * neighbors.length)];
      maze[nextY][nextX] = 0;
      maze[(currentY + nextY) / 2][(currentX + nextX) / 2] = 0;
      stack.push([nextX, nextY]);
    }
  }

  addAdditionalPaths(maze);
  return maze;
}
