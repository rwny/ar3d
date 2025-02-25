import React from 'react';
import sceneManager from '../utils/SceneManager';

function Sidebar({ 
  objectData, 
  currentScene, 
  selectedObject,
  visibleFloors,
  onToggleFloor 
}) {
  const handleBack = () => {
    sceneManager.returnToOverview();
  };

  const handleViewDetail = () => {
    if (selectedObject) {
      const buildingId = selectedObject.name.toLowerCase();
      sceneManager.selectBuilding(buildingId);
    }
  };

  // Styles
  const sidebarStyle = {
    position: 'absolute',
    right: '0',
    top: '0',
    width: '250px',
    height: '100%',
    backgroundColor: '#f4f4f4',
    borderLeft: '1px solid #ddd',
    padding: '20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '14px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%'
  };

  const floorButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#555',
    margin: '5px 0'
  };

  return (
    <div style={sidebarStyle}>
      {/* Object Info Section */}
      <div className="info-section">
        {objectData && (
          <>
            <h3>AAD {objectData.buildingName}</h3>
            <div>RoomID: {objectData.name || 'Unnamed'}</div>
            <div>RoomName: 'Unnamed'</div>
          </>
        )}
      </div>

      {/* Floor Control Section */}
      {currentScene === 'detail' && (
        <div className="floor-section">
          <h4>Floor Controls</h4>
          {['1', '2', '3', '4'].map(floor => (
            <button
              key={floor}
              onClick={() => onToggleFloor(floor)}
              style={{
                ...floorButtonStyle,
                opacity: visibleFloors.includes(floor) ? 1 : 0.5
              }}
            >
              Floor {floor}
            </button>
          ))}
        </div>
      )}

      {/* Navigation Section */}
      <div className="navigation-section">
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
    </div>
  );
}

export default Sidebar;