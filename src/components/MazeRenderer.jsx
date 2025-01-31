import { useEffect, useRef, useState } from 'react';

const MazeRenderer = ({ maze, cellSize, wallColor, pathColor, hideMaze, viewField }) => {
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const mazeRef = useRef(null);

  const styles = {
    mazeContainer: {
      display: 'flex',
      gap: '20px',
      padding: '20px',
    },
    maze: {
      display: 'grid',
      border: '2px solid #4a4a4a',
      width: 'fit-content',
      position: 'relative',
      backgroundColor: '#0A0',
      gridTemplateColumns: `repeat(${maze[0].length}, ${cellSize}px)`,
      gridTemplateRows: `repeat(${maze.length}, ${cellSize}px)`,
    },
    cell: {
      width: `${cellSize}px`,
      height: `${cellSize}px`,
    },
    wall: {
      backgroundColor: wallColor,
    },
    path: {
      backgroundColor: pathColor,
    },
    hiddenCell: {
      backgroundColor: '#001500',
    },
    player: {
      backgroundColor: '#eeeeee',
      borderRadius: '50%',
      position: 'absolute',
      width: `${cellSize - 6}px`,
      height: `${cellSize - 6}px`,
      left: `${playerPos.x * cellSize + 3}px`,
      top: `${playerPos.y * cellSize + 3}px`,
      zIndex: 2,
    },
  };

  const hasLineOfSight = (x1, y1, x2, y2) => {
    const points = getLinePoints(x1, y1, x2, y2);
    
    for (let i = 0; i < points.length - 1; i++) {
      const [x, y] = points[i];
      if (maze[y][x] === 1) {
        return false;
      }
    }
    return true;
  };

  const getLinePoints = (x1, y1, x2, y2) => {
    const points = [];
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    let x = x1;
    let y = y1;

    while (true) {
      points.push([x, y]);
      if (x === x2 && y === y2) break;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }

    return points;
  };

  const isCellVisible = (x, y) => {
    if (!hideMaze) return true;
    
    const distance = Math.sqrt(
      Math.pow(x - playerPos.x, 2) + 
      Math.pow(y - playerPos.y, 2)
    );

    if (distance > viewField) return false;

    return hasLineOfSight(playerPos.x, playerPos.y, x, y);
  };

  const isAdjacentToVisiblePath = (x, y) => {
    // Vérifie si une cellule est adjacente à un chemin visible
    const directions = [
      [0, 1],  // Bas
      [1, 0],  // Droite
      [0, -1], // Haut
      [-1, 0], // Gauche
    ];

    return directions.some(([dx, dy]) => {
      const adjacentX = x + dx;
      const adjacentY = y + dy;

      if (
        adjacentX >= 0 &&
        adjacentX < maze[0].length &&
        adjacentY >= 0 &&
        adjacentY < maze.length
      ) {
        return (
          maze[adjacentY][adjacentX] === 0 && // chemin
          isCellVisible(adjacentX, adjacentY)
        );
      }
      return false;
    });
  };

  const renderCell = (value, x, y) => {
    const isVisible = isCellVisible(x, y);
    const isWallAdjacentToPath = value === 1 && isAdjacentToVisiblePath(x, y);

    let cellStyle = {
      ...styles.cell,
    };

    if (isVisible || isWallAdjacentToPath) {
      cellStyle = {
        ...cellStyle,
        ...(value === 1 ? styles.wall : styles.path),
      };
    } else {
      cellStyle = {
        ...cellStyle,
        ...styles.hiddenCell,
      };
    }

    return (
      <div
        key={`${x}-${y}`}
        style={cellStyle}
      />
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      e.preventDefault();
      const moves = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
      };

      const [dx, dy] = moves[e.key] || [0, 0];
      const newX = playerPos.x + dx;
      const newY = playerPos.y + dy;

      if (
        newX >= 0 && 
        newX < maze[0].length && 
        newY >= 0 && 
        newY < maze.length && 
        maze[newY][newX] === 0
      ) {
        setPlayerPos({ x: newX, y: newY });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [maze, playerPos]);

  if (!maze || !maze.length || !maze[0].length) {
    return <div>Loading maze...</div>;
  }

  return (
    <div style={styles.mazeContainer}>
      <div ref={mazeRef} style={styles.maze}>
        {maze.map((row, y) =>
          row.map((cell, x) => renderCell(cell, x, y))
        )}
        <div style={styles.player} />
      </div>
    </div>
  );
};

MazeRenderer.defaultProps = {
  hideMaze: false,
  viewField: 5,
};

export default MazeRenderer;
