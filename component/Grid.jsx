import React from 'react';
import * as THREE from 'three';

function Grid() {
  return (
    <gridHelper args={[10, 10, `#444444`, `#888888`]} />
  );
}

export default Grid;
