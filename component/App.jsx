import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
/* Update App.css import path */
import '../src/App.css'
import LightScene from './LightScene.jsx'
import Model from './Model.jsx'
import Sidebar from './Sidebar.jsx'
import Grid from './Grid.jsx'

function App() {
  const [selectedObject, setSelectedObject] = useState(null);

  const handleObjectClick = (objectData) => {
    setSelectedObject({
      name: objectData.name,
      buildingName: objectData.buildingName,
      floor: objectData.floor,
      /* ... add more properties if needed ... */
    });
  };

  return (
    <>
      <Canvas camera={{ position: [-5, 5, 5] }}>
        <Grid />
        <LightScene />
        <Model onObjectClick={handleObjectClick} />
      </Canvas>
      <Sidebar objectData={selectedObject} />
    </>
  )
}

export default App
