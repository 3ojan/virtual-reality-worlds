import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Scene from './components/Threejs/Scene';

function ReactThreeApp() {
  return (
    <div className="react-three-component">
      <Scene></Scene>
    </div >
  );
}

export default ReactThreeApp;