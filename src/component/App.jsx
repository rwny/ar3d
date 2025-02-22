import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import './App.css';
import LightScene from './LightScene.jsx';
import Model from './Model.jsx';
import Sidebar from './Sidebar.jsx';
import Controls from './FloorControl.jsx';
import visibilityController from '../utils/VisibilityController';

function App() {
  const [selectedObject, setSelectedObject] = useState(null);
  const [visibleFloors, setVisibleFloors] = useState(['1', '2']);

  const handleToggleFloor = (floor) => {
    const newVisibleFloors = visibilityController.toggleFloor(floor);
    setVisibleFloors([...newVisibleFloors]);
  };

  const handleObjectClick = (objectData) => {
    setSelectedObject({
      name: objectData.name,
      buildingName: objectData.buildingName,
      floorLevel: objectData.floorLevel
    });
  };

  return (
    <>
      <Canvas camera={{ position: [-15, 15, 15] }} gl={{ antialias: true }}>
        <LightScene />
        <Model 
          onObjectClick={handleObjectClick} 
          visibleFloors={visibleFloors}
          visibilityController={visibilityController}
        />
      </Canvas>
      <Sidebar objectData={selectedObject} />
      <Controls 
        visibleFloors={visibleFloors} 
        onToggleFloor={handleToggleFloor}
      />
    </>
  );
}

export default App;