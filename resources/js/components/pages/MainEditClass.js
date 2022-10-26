import React, { useContext, useEffect } from 'react';
import { Provider } from 'react-redux'
import store from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import ModeEdit from './ModeEdit';

function MainEditClass() {

  return (
    <Provider store={store}>
      <ModeEdit></ModeEdit>
    </Provider>
  );
}

export default MainEditClass;