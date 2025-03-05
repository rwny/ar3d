import * as THREE from 'three';
import { useGLTF, Html } from "@react-three/drei";
import { useState, useEffect } from 'react';
import sceneManager from '../utils/SceneManager';
import ModelLoader from '../utils/ModelLoader';

function OverviewScene({ onObjectClick, setCardData, enableImageFunctionality }) {
  const model = useGLTF(ModelLoader.getOverviewModelUrl());
  const [selectedObject, setSelectedObject] = useState(null);
  const [objectLabels, setObjectLabels] = useState([]);

  // Initialize unique materials for each mesh
  useEffect(() => {
    model.scene.traverse((object) => {
      if (object.isMesh) {
        // Create a new unique material for each mesh
        object.material = new THREE.MeshStandardMaterial({
          color: object.material.color,
          transparent: true,
          opacity: 0.8,
        });
      }
    });
  }, [model]);

  // Create labels for all objects when model loads
  useEffect(() => {
    const labels = [];
    model.scene.traverse((object) => {
      if (object.isMesh) {
        // Calculate center position of mesh for label placement
        const boundingBox = new THREE.Box3().setFromObject(object);
        const center = boundingBox.getCenter(new THREE.Vector3());
        
        labels.push({
          name: object.name.toUpperCase(),
          position: center
        });
      }
    });
    setObjectLabels(labels);
  }, [model]);

  const handleBuildingSelect = async (e) => {
    e.stopPropagation();
    const clickedObject = e.object;
    
    // Reset previous selection
    if (selectedObject && selectedObject.material) {
      selectedObject.material.emissive.setHex(0x000000);
    }

    // Highlight only clicked object
    if (clickedObject.material) {
      clickedObject.material.emissive.setHex(0xff6600);
      setSelectedObject(clickedObject);
    }
    
    const buildingId = clickedObject.name.toLowerCase();
    const buildingInfo = ModelLoader.getBuildingInfo(buildingId);
    const modelData = ModelLoader.getModelData(buildingId);

    onObjectClick && onObjectClick({
      name: clickedObject.name,
      buildingName: buildingInfo ? `Building ${buildingInfo.id.toUpperCase()}` : 'Overview',
      modelData: modelData // Pass model metadata
    });

    if (buildingInfo) {
      sceneManager.selectedBuildingInfo = buildingInfo;
    }

    // Dynamically import the image if the functionality is enabled
    if (enableImageFunctionality) {
      try {
        const imageModule = await import(`./images/${buildingId}.png`);
        setCardData({
          imageUrl: imageModule.default // Update with the correct path to your images
        });
      } catch (error) {
        console.error(`Error loading image for ${buildingId}:`, error);
        setCardData({ imageUrl: null });
      }
    }
  };

  return (
    <group>
      <primitive
        object={model.scene}
        onClick={handleBuildingSelect}
      />
      {objectLabels.map((label, index) => (
        <Html
          key={index}
          position={label.position}
          center
          style={{ 
            background: '#000',
            padding: '2px 4px',
            color: 'white',
            fontSize: '10px',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
            borderRadius: '4px'
          }}
        >
          {label.name}
        </Html>
      ))}
    </group>
  );
}

export default OverviewScene;