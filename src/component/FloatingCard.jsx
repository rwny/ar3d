import React from 'react';

function FloatingCard({ imageUrl, onClick }) {
  const cardStyle = {
    position: 'absolute',
    top: '10px', // Position at the upper left corner
    left: '10px', // Position at the upper left corner
    width: '200px',
    height: '150px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    zIndex: 1000,
    transition: 'opacity 0.3s ease',
    opacity: imageUrl ? 1 : 0,
    pointerEvents: imageUrl ? 'auto' : 'none',
    cursor: 'pointer' // Add cursor pointer to indicate clickability
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      {imageUrl && <img src={imageUrl} alt="Building" style={imageStyle} />}
    </div>
  );
}

export default FloatingCard;
