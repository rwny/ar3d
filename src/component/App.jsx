import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import './App.css';
import LightScene from './LightScene.jsx';
import Sidebar from './Sidebar.jsx';
import visibilityController from '../utils/VisibilityController';
import sceneManager from '../utils/SceneManager';
import OverviewScene from './OverviewScene.jsx';
import BuildingDetailScene from './BuildingDetailScene.jsx';
import FloatingCard from './FloatingCard';
import FullscreenImage from './FullscreenImage';

function App() {
  const [currentScene, setCurrentScene] = useState('overview');
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [visibleFloors, setVisibleFloors] = useState(['1', '2']);
  const [sidebarVisible, setSidebarVisible] = useState(false); // New state for sidebar visibility
  const [cardData, setCardData] = useState({ imageUrl: null }); // State for floating card data
  const [fullscreenImage, setFullscreenImage] = useState(null); // State for fullscreen image

  // Configuration variable to enable or disable image functionality
  const enableImageFunctionality = false;

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
    setSidebarVisible(true); // Show sidebar on first object click
  };

  const handleCardClick = () => {
    setFullscreenImage(cardData.imageUrl); // Set the fullscreen image
  };

  const handleCloseFullscreen = () => {
    setFullscreenImage(null); // Close the fullscreen image
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible); // Toggle sidebar visibility
  };

  return (
    <>
      <Canvas 
        camera={{ 
          position: [-55, 55, 55], // Camera position
          fov: 45, // Field of view
          near: 0.1, // Near clipping plane
          far: 1000 // Far clipping plane
        }} 
        shadows 
        gl={{ antialias: true }}
      >
        <LightScene />

        {currentScene === 'overview' ? (
          <OverviewScene 
            onObjectClick={handleObjectClick} 
            setCardData={setCardData} 
            enableImageFunctionality={enableImageFunctionality} // Pass the configuration variable
          />
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
        visible={sidebarVisible} // Pass visibility state to Sidebar
      />

      <button 
        onClick={toggleSidebar} 
        className={`sidebar-toggle-button ${sidebarVisible ? 'sidebar-visible' : ''}`}
      >
        {sidebarVisible ? '>' : '<'}
      </button>

      {enableImageFunctionality && (
        <>
          <FloatingCard imageUrl={cardData.imageUrl} onClick={handleCardClick} /> {/* Render FloatingCard outside of Canvas */}
          {fullscreenImage && (
            <FullscreenImage imageUrl={fullscreenImage} onClose={handleCloseFullscreen} />
          )}
        </>
      )}
    </>
  );
}

export default App;