import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Scene from './components/Threejs/Scene';
import { Provider } from 'react-redux'
import store from './redux/store';

function ReactThreeApp() {
  return (
    <div className="react-three-component">
      <Provider store={store}>
        <Scene></Scene>
      </Provider>
    </div >
  );
}

export default ReactThreeApp;