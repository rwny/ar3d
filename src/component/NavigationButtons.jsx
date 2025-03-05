import React from 'react';
import sceneManager from '../utils/SceneManager';

function NavigationButtons({ currentScene, selectedObject }) {
  const handleBack = () => {
    sceneManager.returnToOverview();
  };

  const handleViewDetail = () => {
    if (selectedObject) {
      const buildingId = selectedObject.name.toLowerCase();
      sceneManager.selectBuilding(buildingId);
    }
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      width: '200px',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {currentScene === 'overview' && selectedObject && (
        <button onClick={handleViewDetail} style={buttonStyle}>
          View {selectedObject.name} →
        </button>
      )}
      {currentScene === 'detail' && (
        <button onClick={handleBack} style={buttonStyle}>
          ← Back to Overview
        </button>
      )}
    </div>
  );
}

export default NavigationButtons;