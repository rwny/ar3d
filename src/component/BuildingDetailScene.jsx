import { useEffect } from 'react';
import sceneManager from '../utils/SceneManager';
import Model from './Model';

function BuildingDetailScene({ onObjectClick, visibleFloors, visibilityController }) {
  const buildingInfo = sceneManager.selectedBuildingInfo;

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'g') {
        sceneManager.returnToOverview();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!buildingInfo) return null;

  const BUILDING_DATA = [
    { url: buildingInfo.modelUrl }
  ];

  return (
    <Model 
      BUILDING_DATA={BUILDING_DATA}
      onObjectClick={onObjectClick}
      visibleFloors={visibleFloors}
      visibilityController={visibilityController}
    />
  );
}

export default BuildingDetailScene;
