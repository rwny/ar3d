import { useGLTF, Html } from "@react-three/drei";
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import sceneManager from '../utils/SceneManager';

const BUILDING_MAPPINGS = {
  'ar12': { id: 'ar12', modelUrl: './models/ar12.glb' },
  'ar13': { id: 'ar13', modelUrl: './models/ar13.glb' },
};

function OverviewScene({ onObjectClick }) {
  const model = useGLTF('./models/ar00.glb');
  const [label, setLabel] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);

  const handleBuildingSelect = (e) => {
    e.stopPropagation();
    const clickedObject = e.object;
    
    // Reset previous selection
    if (selectedObject) {
      selectedObject.material.emissive.setHex(0x000000);
    }

    // Highlight new selection
    clickedObject.material.emissive.setHex(0xff6600);
    setSelectedObject(clickedObject);
    
    const buildingId = clickedObject.name.toLowerCase();
    const buildingInfo = BUILDING_MAPPINGS[buildingId];

    setLabel({
      name: clickedObject.name,
      position: e.point
    });

    onObjectClick && onObjectClick({
      name: clickedObject.name,
      buildingName: buildingInfo ? `Building ${buildingInfo.id.toUpperCase()}` : 'Overview'
    });

    if (buildingInfo) {
      sceneManager.selectedBuildingInfo = buildingInfo;
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'g' && selectedObject) {
        const buildingId = selectedObject.name.toLowerCase();
        const buildingInfo = BUILDING_MAPPINGS[buildingId];
        if (buildingInfo) {
          sceneManager.selectBuilding(buildingId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedObject]);

  return (
    <group >
      <primitive
        object={model.scene}
        onClick={handleBuildingSelect}
      />
      {label && (
        <Html
          position={label.position}
          center
          style={{ 
            background: '#222',
            padding: '2px 4px',
            color: 'white',
            fontSize: '10px',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}
        >
          {label.name}
        </Html>
      )}
    </group>
  );
}

export default OverviewScene;
