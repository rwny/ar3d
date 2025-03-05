import React from 'react';
import './Sidebar.css';
import NavigationButtons from './NavigationButtons';

function Sidebar({ 
  objectData, 
  currentScene, 
  selectedObject,
  visibleFloors,
  onToggleFloor,
  visible // New prop for visibility
}) {
  return (
    <div className={`sidebar ${visible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
      {/* Object Info Section */}
      <div className="info-section">
        {objectData && (
          <>
            <h3>AAD {objectData.modelData.id.toUpperCase()}</h3>
            {/* <div>RoomID: {objectData.name || 'Unnamed'}</div> */}
          </>
        )}
      </div>

      {/* Model Data Section - updated for right alignment */}
      {objectData && objectData.modelData && (
        <div className="model-data">
          <h3>ข้อมูลอาคาร:</h3>
          <div className="data-entry">
            <span className="static-text">ID:</span>
            <span className="data-text">{objectData.modelData.id.toUpperCase()}</span>
          </div>
          <div className="data-entry">
            <span className="static-text">Name:</span>
            <span className="data-text">{objectData.modelData.name}</span>
          </div>
          <div className="data-entry">
            <span className="static-text">Type:</span>
            <span className="data-text">{objectData.modelData.type}</span>
          </div>
          <div className="data-entry">
            <span className="static-text">Status:</span>
            <span className="data-text">{objectData.modelData.status}</span>
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
                className={`button floor-button ${visibleFloors.includes(floor) ? '' : 'opacity-50'}`}
                style={{ margin: '4px 0' }}
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