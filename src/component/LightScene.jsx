import { OrbitControls, Grid } from "@react-three/drei";
import { useState, useEffect } from 'react';

function LightScene() {

  const showGrid = false;
  const showGround = false;

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[3, 3, 3]} 
        // castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {showGrid && (
        <Grid 
          infiniteGrid 
          cellSize={1} 
          sectionSize={50}
          cellColor="#444"
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
      <OrbitControls 
        minPolarAngle={Math.PI / 4} // 45 degrees from top
        maxPolarAngle={Math.PI / 2.2} // 90 degrees (horizontal)
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}

export default LightScene;