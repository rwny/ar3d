import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import './App.css';
import LightScene from './LightScene.jsx';
import Model from './Model.jsx';
import Sidebar from './Sidebar.jsx';
import visibilityController from '../utils/VisibilityController';
import sceneManager from '../utils/SceneManager';
import OverviewScene from './OverviewScene.jsx';
import BuildingDetailScene from './BuildingDetailScene.jsx';

function App() {
  const [currentScene, setCurrentScene] = useState('overview');
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [visibleFloors, setVisibleFloors] = useState(['1', '2']);

  useEffect(() => {
    return sceneManager.subscribe(({ scene, building }) => {
      setCurrentScene(scene);
      setSelectedBuilding(building);
    });
  }, []);

  const handleToggleFloor = (floor) => {
    const newVisibleFloors = visibilityController.toggleFloor(floor);
    setVisibleFloors([...newVisibleFloors]);
  };

  const handleObjectClick = (objectData) => {
    setSelectedObject({
      name: objectData.name,
      buildingName: objectData.buildingName,
      floorLevel: objectData.floorLevel,
      modelData: objectData.modelData // Receive the model data
    });
  };

  const SIDEBAR_WIDTH = 200;

  return (
    <>
      <Canvas 
        camera={{ 
          position: [-55, 55, 55],
          fov: 45,
          near: 0.1,
          far: 1000
        }} 
        shadows 
        gl={{ antialias: true }}
      >
        <LightScene />

        {currentScene === 'overview' ? (
          <OverviewScene onObjectClick={handleObjectClick} />
        ) : (
          <BuildingDetailScene 
            buildingId={selectedBuilding}
            onObjectClick={handleObjectClick}
            visibleFloors={visibleFloors}
            visibilityController={visibilityController}
          />
        )}
        
      </Canvas>

      <Sidebar 
        objectData={selectedObject} 
        currentScene={currentScene}
        selectedObject={selectedObject}
        visibleFloors={visibleFloors}
        onToggleFloor={handleToggleFloor}
      />
    </>
  );
}

export default App;