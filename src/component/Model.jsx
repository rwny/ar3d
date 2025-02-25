import { useState, useEffect, useRef } from 'react';
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from 'three';

function Model({ BUILDING_DATA, onObjectClick, visibleFloors, visibilityController }) {
  const model1 = useGLTF(BUILDING_DATA[0].url);
  const models = [model1];
  const [label, setLabel] = useState(null);
  const [selectedMesh, setSelectedMesh] = useState(null);
  const modelRefs = useRef([]);

  const setMaterialForChildren = (object, colors) => {
    let index = 0;
    object.traverse(child => {
      if (child.isMesh) {
        const color = colors[index % colors.length];
        child.material = new THREE.MeshStandardMaterial({ 
          color, 
          transparent: true, 
          opacity: 0.5
        });
        child.castShadow = true;
        index++;
      }
    });
  };

  useEffect(() => {
    const lightColors = ["lightyellow", "lightsalmon"];

    models.forEach((model, index) => {
      try {
        if (!model || !model.scene) return;
        const scene = model.scene;
        setMaterialForChildren(scene, lightColors);
        scene.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;
          }
        });
      } catch (error) {
        console.error(`Error processing model ${index}:`, error);
      }
    });
  }, []);

  useEffect(() => {
    models.forEach((model, index) => {
      if (model && model.scene) {
        model.scene.traverse((child) => {
          if (child.isMesh) {
            if (index === 4) {
              console.log('Model5 mesh:', child.name);
              console.log('Floor level:', child.userData.floorLevel);
              console.log('Visibility check:', visibilityController.isVisible(child));
              child.visible = true;
            } else {
              child.visible = visibilityController.isVisible(child);
            }
          }
        });
      }
    });
  }, [visibleFloors, models]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '/' && selectedMesh) {
        const parentScene = models.find(model => 
          model.scene.getObjectById(selectedMesh.id) !== undefined
        );
        
        if (parentScene) {
          if (visibilityController.isolatedObject) {
            visibilityController.resetIsolation(parentScene.scene);
          } else {
            visibilityController.isolateObject(selectedMesh, parentScene.scene);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedMesh, models]);

  const handleClick = (e) => {
    e.stopPropagation();
    const clickedObject = e.object;

    if (!visibleFloors.includes(clickedObject.userData.floorLevel)) {
      return;
    }

    if (selectedMesh && selectedMesh !== clickedObject) {
      selectedMesh.material.emissive.setHex(0x000000);
    }

    clickedObject.material.emissive.setHex(0xff6600);
    setSelectedMesh(clickedObject);
    
    setLabel({
      name: clickedObject.name,
      position: e.point
    });
    
    onObjectClick && onObjectClick({
      name: clickedObject.name,
      buildingName: clickedObject.userData.buildingName,
      floorLevel: clickedObject.userData.floorLevel
    });
  };

  return (
    <group>
      {models.map((model, index) => (
        model && model.scene ? (
          <primitive
            key={index}
            object={model.scene}
            ref={el => (modelRefs.current[index] = el)}
            onClick={handleClick}
          />
        ) : null
      ))}
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

export default Model;