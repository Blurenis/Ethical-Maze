import './App.css';
import { useState, useEffect } from 'react';
import LoadingScreen from './components/Loading';
import generateMaze from './logical/generateMaze';
import MazeRenderer from './components/MazeRenderer';

function App() {
  const [maze, setMaze] = useState(null);

  //BG color
  const [bgColor, setBGColor] = useState("#101010")
  const [hideMaze, setHideMaze] = useState(true)
  const [viewField, setViewField] = useState(4)

  useEffect(() => {
    const newMaze = generateMaze(44, 44, 0.3);
    setMaze(newMaze);
  }, []);

  return (
    <div style={{ backgroundColor: bgColor, minHeight: "100vh", padding: "20px" }}>
      <LoadingScreen 
        size={500} 
        minDuration={1000} 
        maxDuration={4000} 
        backgroundColor={"#101010"}
      />

      {maze && (
        <MazeRenderer 
        maze={maze}
        cellSize={14}
        wallColor="#00BB00"
        pathColor="#994C00"
        bgColor = {bgColor}
        hideMaze={true}
        viewField={5}
        position={{ x: 100, y: 50 }}
        containerSize={{ width: 600, height: 400 }}
        />
      )}

    </div>
  );
}  // Add closing curly brace for the App function

export default App;
