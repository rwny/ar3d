import { useGLTF, Html } from "@react-three/drei";
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import sceneManager from '../utils/SceneManager';

const BUILDING_MAPPINGS = {
  'ar12': { id: 'ar12', modelUrl: './models/ar12.glb' },
  'ar13': { id: 'ar13', modelUrl: './models/ar13.glb' },
  'ar14': { id: 'ar14', modelUrl: './models/ar13.glb' },
  'ar20': { id: 'ar20', modelUrl: './models/ar20.glb' }  // Add this line
};

function OverviewScene({ onObjectClick }) {
  const model = useGLTF('./models/ar00.glb');
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

  const handleBuildingSelect = (e) => {
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
    const buildingInfo = BUILDING_MAPPINGS[buildingId];

    onObjectClick && onObjectClick({
      name: clickedObject.name,
      buildingName: buildingInfo ? `Building ${buildingInfo.id.toUpperCase()}` : 'Overview'
    });

    if (buildingInfo) {
      sceneManager.selectedBuildingInfo = buildingInfo;
    }
  };

  return (
    <group  >
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
            // background: '#aaa',
            padding: '2px 4px',
            color: 'black',
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
