import { useState, useEffect, useRef } from 'react';
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from 'three';

function Model({ onObjectClick, visibleFloors, visibilityController }) {
  const { scene } = useGLTF('./models/ar20x1.glb');
  console.log(scene)
  const modelRef = useRef();
  const [label, setLabel] = useState(null);
  const [selectedMesh, setSelectedMesh] = useState(null);

  // Function to assign a distinct light transparent material to each mesh child
  const setMaterialForChildren = (object, colors) => {
    let index = 0;
    object.traverse(child => {
      if (child.isMesh) {
        const color = colors[index % colors.length];
        child.material = new THREE.MeshStandardMaterial({ 
          color, 
          transparent: true, 
          opacity: 0.8 
        });
        index++;
      }
    });
  };

  useEffect(() => {
    const lightColors = [
      "lightblue", 
      "lightgreen", 
      "lightsalmon", 
      "lightcoral", 
      "lightpink", 
      "lightseagreen", 
      "lightgoldenrodyellow", 
      "lightgray", 
      "lightcyan"
    ];
    setMaterialForChildren(scene, lightColors);

    // Calculate bounding box and center the model
    const boundingBox = new THREE.Box3().setFromObject(scene);
    const center = boundingBox.getCenter(new THREE.Vector3());

    // Adjust the model's position
    scene.position.x -= center.x;
    scene.position.z -= center.z;

    const size = boundingBox.getSize(new THREE.Vector3());
    console.log("Model Size:", size);
    
    // Remove SelectableObject related code
  }, [scene]);

  useEffect(() => {
    // Update visibility based on controller
    scene.traverse((child) => {
      if (child.isMesh) {
        child.visible = visibilityController.isVisible(child);
      }
    });
  }, [visibleFloors, scene]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '/') {
        if (selectedMesh) {
          if (visibilityController.isolatedObject) {
            visibilityController.resetIsolation(scene);
          } else {
            visibilityController.isolateObject(selectedMesh, scene);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedMesh, scene]);

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
      buildingName: clickedObject.userData.buildingName,
      floorLevel: clickedObject.userData.floorLevel,
      position: e.point
    });
    
    onObjectClick && onObjectClick({
      name: clickedObject.name,
      buildingName: clickedObject.userData.buildingName,
      floorLevel: clickedObject.userData.floorLevel
    });
  };

  return (
    <group ref={modelRef} onClick={handleClick}>
      <primitive object={scene} />
      {label && (
        <Html position={label.position} center>
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {label.name}
          </div>
        </Html>
      )}
    </group>
  );
}

export default Model;