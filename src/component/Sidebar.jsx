import React from 'react';
import NavigationButtons from './NavigationButtons';

function Sidebar({ 
  objectData, 
  currentScene, 
  selectedObject,
  visibleFloors,
  onToggleFloor 
}) {

  // Styles
  const sidebarStyle = {
    position: 'absolute',
    color: 'white',
    right: '0',
    top: '0',
    width: '240px',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '24px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    // borderRadius: '16px 0 0 16px',
    // boxShadow: '-4px 0 8px rgba(0, 0, 0, 0.1)'
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

  // New style for model data section
  const modelDataStyle = {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };
  
  const dataEntryStyle = {
    display: 'flex',
    justifyContent: 'space-between'
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

      {/* Model Data Section - updated for right alignment */}
      {objectData && objectData.modelData && (
        <div style={modelDataStyle}>
          <h3>Model Data:</h3>
          <div style={dataEntryStyle}>
            <span>ID:</span>
            <span>{objectData.modelData.id}</span>
          </div>
          <div style={dataEntryStyle}>
            <span>Name:</span>
            <span>{objectData.modelData.name}</span>
          </div>
          <div style={dataEntryStyle}>
            <span>Type:</span>
            <span>{objectData.modelData.type}</span>
          </div>
          <div style={dataEntryStyle}>
            <span>Status:</span>
            <span>{objectData.modelData.status}</span>
          </div>
        </div>
      )}

      {/* Floor Control Section */}
      {currentScene === 'detail' && (
        <div className="floor-section">
          <h4>Floor Controls</h4>
          {[ '2', '1'].map(floor => (
            <div key={floor} style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => onToggleFloor(floor)}
                style={{
                  ...floorButtonStyle,
                  opacity: visibleFloors.includes(floor) ? 1 : 0.5,
                  margin: '4px 0'
                }}
              >
                {floor === '1' ? '1st Floor' : '2nd Floor'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Section */}
      <NavigationButtons 
        currentScene={currentScene}
        selectedObject={selectedObject}
      />
    </div>
  );
}

export default Sidebar;