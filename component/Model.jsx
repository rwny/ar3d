import { useGLTF } from "@react-three/drei";

function Model({ onObjectClick }) {
  /* Adjust GLB path assuming models folder is at /c:/Work/Sync/AR3D/3 Web/RoomSpace/models */
  const { scene } = useGLTF('../models/model_1.glb');
  
  return (
    <>
      <primitive 
        object={scene} 
        onClick={(e) => {
          /* Trigger callback with clicked object data */
          onObjectClick && onObjectClick(e.object);
        }}
      />
    </>
  )
}

export default Model;
