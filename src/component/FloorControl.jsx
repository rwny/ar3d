import React from 'react';

function Controls({ visibleFloors, onToggleFloor }) {
  const buttonStyle = (floor) => ({
    padding: '8px 16px',
    background: visibleFloors.includes(floor) ? '#646cff' : 'rgba(26, 26, 26, 0.2)', // Modified this line
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '80px',
    textAlign: 'right'
  });

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      zIndex: 1000,
      alignItems: 'flex-end'
    }}>
      <div style={{ display: 'flex', alignItems: 'right', gap: '10px' }}>
        <button onClick={() => onToggleFloor('2')} style={buttonStyle('2')}>2</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'right', gap: '10px' }}>
        <button onClick={() => onToggleFloor('1')} style={buttonStyle('1')}>1</button>
      </div>
    </div>
  );
}

export default Controls;
