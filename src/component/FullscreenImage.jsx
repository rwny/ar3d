import React from 'react';

function FullscreenImage({ imageUrl, onClose }) {
  const fullscreenStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000
  };

  const imageStyle = {
    maxWidth: '90%',
    maxHeight: '90%',
    objectFit: 'contain'
  };

  const buttonStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    zIndex: 2001
  };

  return (
    <div style={fullscreenStyle}>
      <img src={imageUrl} alt="Building" style={imageStyle} />
      <button style={buttonStyle} onClick={onClose}>Close</button>
    </div>
  );
}

export default FullscreenImage;
