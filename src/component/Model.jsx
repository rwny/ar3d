import { useState, useEffect, useRef } from 'react';
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from 'three';

// Add position offset constant
{/* <group position={[-30,0,-50]} > */}

const POSITION_OFFSET = {
  x: -40,
  y: 0,
  z: -38
};

const BUILDING_DATA = [
  { url: './models/ar00x1.glb', position: [0, 0, 0] },
  { url: './models/ar12x1.glb', position: [0, 0, 0] },
  { url: './models/ar13x1.glb', position: [48, 0, 0] },
  { url: './models/ar14x1.glb', position: [48, 0, 26] },
  { url: './models/ar20x1.glb', position: [0, 0, 85.5] },
];

function Model({ onObjectClick, visibleFloors, visibilityController }) {
  // Fix: Load each model with its correct URL
  const model1 = useGLTF(BUILDING_DATA[0].url);
  const model2 = useGLTF(BUILDING_DATA[1].url);
  const model3 = useGLTF(BUILDING_DATA[2].url); 
  const model4 = useGLTF(BUILDING_DATA[3].url); 
  const model5 = useGLTF(BUILDING_DATA[4].url); 


  const models = [model1, model2, model3, model4, model5];
  console.log('asdf asdf asdf',models[0]);
  // Add debug logging for model loading
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

  // Function to assign a distinct light transparent material to each mesh child
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
        child.castShadow = true; // Enable shadow casting for each mesh
        index++;
      }
    });
  };

  useEffect(() => {
    const lightColors = [
      // "lightblue", 
      "lightyellow",
      "lightsalmon",
      // "lightgreen", "lightyellow",
      // "lightsalmon", "lightcoral",
      // "lightpink", "lightseagreen", 
      // "lightgoldenrodyellow",
      // "lightgray", "lightcyan"
    ];

    models.forEach((model, index) => {
      try {
        if (!model || !model.scene) {
          console.error(`Model ${index} failed to load:`, model);
          return;
        }

        const scene = model.scene;
        setMaterialForChildren(scene, lightColors);

        // Enable shadows for all meshes in the scene
        scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
          }
        });

        // Calculate bounding box for each model
        const boundingBox = new THREE.Box3().setFromObject(scene);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());
        console.log(`Model ${index} Size:`, size);

        // Apply position with offset
        scene.position.set(
          BUILDING_DATA[index].position[0] + POSITION_OFFSET.x,
          BUILDING_DATA[index].position[1] + POSITION_OFFSET.y,
          BUILDING_DATA[index].position[2] + POSITION_OFFSET.z
        );

        // Debug log
        console.log(`Model ${index} loaded and positioned at:`, BUILDING_DATA[index].position);
      } catch (error) {
        console.error(`Error processing model ${index}:`, error);
      }
    });
  }, []);

  useEffect(() => {
    // Update visibility based on controller
    models.forEach((model, index) => {
      if (model && model.scene) {
        model.scene.traverse((child) => {
          if (child.isMesh) {
            // Add debug logging for model5
            if (index === 4) {
              console.log('Model5 mesh:', child.name);
              console.log('Floor level:', child.userData.floorLevel);
              console.log('Visibility check:', visibilityController.isVisible(child));
              // Force visibility for model5 (temporary fix)
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
    
    // Get the exact click position in world coordinates
    const clickPosition = e.point.clone();
    // Adjust click position for offset
    clickPosition.x -= POSITION_OFFSET.x;
    clickPosition.y -= POSITION_OFFSET.y;
    clickPosition.z -= POSITION_OFFSET.z;
    
    // Set the label with exact click position
    setLabel({
      name: clickedObject.name,
      buildingName: clickedObject.userData.buildingName,
      floorLevel: clickedObject.userData.floorLevel,
      position: clickPosition
    });
    
    onObjectClick && onObjectClick({
      name: clickedObject.name,
      buildingName: clickedObject.userData.buildingName,
      floorLevel: clickedObject.userData.floorLevel
    });
  };

  return (
    // Apply offset to the entire group
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
            pointerEvents: 'none',
            transform: 'translate3d(-50%, -100%, 0)' // Offset label above click point
          }}
        >
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            userSelect: 'none'
          }}>
            {label.name}
          </div>
        </Html>
      )}
    </group>
  );
}

// Preload models
BUILDING_DATA.forEach(building => {
  useGLTF.preload(building.url);
});

export default Model;