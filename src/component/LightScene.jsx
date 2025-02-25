import { CameraControls } from "@react-three/drei";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function LightScene() {
  const controlsRef = useRef();
  const showGrid = false;
  const showGround = false;

  useEffect(() => {
    if (controlsRef.current) {
      // Set initial camera position accounting for offset
      controlsRef.current.setLookAt(
        -55, 55, 55,   // camera position
        10, 0, 0,     // target (offset center point)
        true           // animate
      );
      
      // Set the offset for sidebar compensation
      controlsRef.current.setFocalOffset(10, 0, 0, true);
      
      // Set zoom boundaries around center point
      controlsRef.current.maxDistance = 200;
      controlsRef.current.minDistance = 50;
    }
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[3, 3, 3]} 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {showGrid && (
        <Grid 
          infiniteGrid 
          cellSize={1} 
          sectionSize={50}
          cellColor="#aaa"
          sectionColor="#800"
        />
      )}

      {showGround && (
        <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.01, 0]} 
        receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color="#fff"
            roughness={1}
            metalness={0}
          />
        </mesh>
      ) }

      <axesHelper args={[10]} />

      <CameraControls 
        ref={controlsRef}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
        dampingFactor={0.05}
        smoothTime={0.2}
        dollyToCursor={true}
        target={[10, 0, 0]}
      />

    </>
  );
}

export default LightScene;
