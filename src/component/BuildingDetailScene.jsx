import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import sceneManager from '../utils/SceneManager';
import Model from './Model';

function BuildingDetailScene({ onObjectClick, visibleFloors, visibilityController }) {
  const buildingInfo = sceneManager.selectedBuildingInfo;
  const { camera } = useThree();

  // Set camera position when component mounts
  useEffect(() => {
    camera.position.set(-30, 30, 30);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

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
