import React, { useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './redux/store';
import SingleWorldScene from './components/Threejs/Test/SingleWorldScene';
import WebsocketProvider, { WebSocketContext } from './components/Socket/WebSocket';

function OneWorldApp() {
  const ws = useContext(WebSocketContext);
  return (
    <div className="react-three-component">
      <Provider store={store}>
        <SingleWorldScene></SingleWorldScene>
        <WebsocketProvider></WebsocketProvider>
      </Provider>
    </div >
  );
}

export default OneWorldApp;