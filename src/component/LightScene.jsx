import { OrbitControls, Grid } from "@react-three/drei";

function LightScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 3, 3]} />
      <Grid 
        infiniteGrid 
        cellSize={1} 
        sectionSize={10}
        cellColor="#444"
        sectionColor="#800"
      />
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