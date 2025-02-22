import React from 'react';

function Sidebar({ objectData }) {
  return (
    <div className="sidebar">
      
      {objectData ? (
        <div style={{ marginTop: '10px', lineHeight: '1.5' }}>
          <h3>AAD </h3>
          <div>{objectData.buildingName +' - '+objectData.floorLevel+' flr'+' - '+objectData.name} </div>
          {/* <div>Building : {objectData.buildingName +' - '+objectData.floor+'floor' || 'N/A'}</div> */}
          <div>RoomID : {objectData.name || 'Unnamed'}</div>
          <div>RoomName : 'Unnamed'</div>

          {/* <div>Floor : {objectData.floor+'floor' || 'N/A'}</div> */}
        </div>
      ) : (
        <p>no data</p>
      )}
    </div>
  );
}

export default Sidebar;