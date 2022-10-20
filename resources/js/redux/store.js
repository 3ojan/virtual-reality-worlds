import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import user from './user/user';
import sphere from './user/sphere';
import world from './world/world';
import chat from './chat/chat';
import socketRedux from './chat/socketRedux';

const reducer = combineReducers({
  user,
  sphere,
  world,
  chat,
  socketRedux,
})
const store = configureStore({
  reducer,
})
export default store;