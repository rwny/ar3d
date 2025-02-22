import { useState, useEffect, useRef } from 'react';
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from 'three';

const POSITION_OFFSET = {
  x: -40,
  y: 0,
  z: -40
};

const BUILDING_DATA = [
  { url: './models/ar00x1.glb', position: [0, 0, 0] },
  { url: './models/ar12x1.glb', position: [0, 0, 0] },
  { url: './models/ar13x1.glb', position: [48, 0, 0] },
  { url: './models/ar14x1.glb', position: [48, 0, 26] },
  { url: './models/ar20x1.glb', position: [0, 0, 85.5] },
];

function Model({ onObjectClick, visibleFloors, visibilityController }) {
  const model1 = useGLTF(BUILDING_DATA[0].url);
  const model2 = useGLTF(BUILDING_DATA[1].url);
  const model3 = useGLTF(BUILDING_DATA[2].url); 
  const model4 = useGLTF(BUILDING_DATA[3].url); 
  const model5 = useGLTF(BUILDING_DATA[4].url); 

  const models = [model1, model2, model3, model4, model5];
  console.log('asdf asdf asdf',models[0]);

  useEffect(() => {
    models.forEach((model, index) => {
      if (model && model.scene) {
        console.log(`Model ${index + 1} loaded successfully:`, BUILDING_DATA[index].url);
      } else {
        console.error(`Failed to load model ${index + 1}:`, BUILDING_DATA[index].url);
      }
    });
  }, [models]);

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
    const lightColors = [
      "lightyellow",
      "lightsalmon",
    ];

    models.forEach((model, index) => {
      try {
        if (!model || !model.scene) {
          console.error(`Model ${index} failed to load:`, model);
          return;
        }

        const scene = model.scene;
        setMaterialForChildren(scene, lightColors);

        scene.position.set(
          BUILDING_DATA[index].position[0],
          BUILDING_DATA[index].position[1],
          BUILDING_DATA[index].position[2]
        );

        scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
          }
        });

        const boundingBox = new THREE.Box3().setFromObject(scene);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());
        console.log(`Model ${index} Size:`, size);

        console.log(`Model ${index} loaded and positioned at:`, BUILDING_DATA[index].position);
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
    
    // Convert world coordinates to local coordinates
    const localPosition = e.point.clone();
    localPosition.sub(new THREE.Vector3(POSITION_OFFSET.x, POSITION_OFFSET.y, POSITION_OFFSET.z));
    
    console.log('Click world position:', e.point);
    console.log('Click local position:', localPosition);
    
    setLabel({
      name: clickedObject.name,
      position: localPosition
    });
    
    onObjectClick && onObjectClick({
      name: clickedObject.name,
      buildingName: clickedObject.userData.buildingName,
      floorLevel: clickedObject.userData.floorLevel
    });
  };

  return (
    <group position={[POSITION_OFFSET.x, POSITION_OFFSET.y, POSITION_OFFSET.z]}>
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
            transform: 'translate(-50%, -50%)', // Center both horizontally and vertically
            textAlign: 'center'
          }}
        >
          {label.name}
        </Html>
      )}
    </group>
  );
}

BUILDING_DATA.forEach(building => {
  useGLTF.preload(building.url);
});

export default Model;