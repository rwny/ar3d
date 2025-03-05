import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import sceneManager from '../utils/SceneManager';
import Model from './Model';

function BuildingDetailScene({ visibleFloors, visibilityController }) {
  const [boundingBox, setBoundingBox] = useState(null);
  const buildingInfo = sceneManager.selectedBuildingInfo;
  const { camera, scene } = useThree();
  const modelRef = useRef();

  // Handle bounding box updates
  const handleBoundingBoxCalculated = ({ size, center }) => {
    setBoundingBox({ size, center });
    
    // Transform model to new origin at (x/2, 0, z/2)
    if (modelRef.current) {
      const offsetX = size.x / 2 - center.x;
      const offsetZ = size.z / 2 - center.z;
      modelRef.current.position.set(offsetX, -center.y, offsetZ);
    }
  };

  // Adjust camera based on bounding box size
  useEffect(() => {
    if (!boundingBox) return;
    
    const maxDim = Math.max(boundingBox.size.x, boundingBox.size.y, boundingBox.size.z);
    const cameraDistance = Math.max(maxDim * 1.5, 30);
    
    camera.position.set(-cameraDistance, cameraDistance, cameraDistance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [boundingBox, camera]);

  if (!buildingInfo) return null;

  const BUILDING_DATA = [
    { url: buildingInfo.modelUrl }
  ];

  const handleObjectClick = (objectData) => {
    // Only highlight the clicked object, no data check
    console.log(`Object clicked: ${objectData.name}`);
  };

  return (
    <Model 
      ref={modelRef}
      BUILDING_DATA={BUILDING_DATA}
      onObjectClick={handleObjectClick}
      visibleFloors={visibleFloors}
      visibilityController={visibilityController}
      onBoundingBoxCalculated={handleBoundingBoxCalculated}
    />
  );
}

export default BuildingDetailScene;