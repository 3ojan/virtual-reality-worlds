import { createSlice } from '@reduxjs/toolkit';

const singleChatTemplate = (id) => {
  return {
    id: {
      messages: [],
      loading: true,
    }
  }
}
// Slice
const slice = createSlice({
  name: 'chat',
  initialState: {
    worldChat: {
      messages: [],
      loading: true,
    },
    sceneChat: {

    },
    privateChat: {

    }
  },
  reducers: {
    ///world
    addWorldMessage: (state, action) => {
      return {
        ...state,
        worldChat: {
          messages: [...state.worldChat.messages, action.payload],
          loading: false
        }
      }
    },
    onLoadedWorldChatHistory: (state, action) => state.worldChat.loading = false,
    ///scene
    onLoadSceneChat: (state, action) => {
      const { sceneId } = action.payload;
      state.sceneChat[sceneId] = singleChatTemplate(sceneId);
    },
    onLoadedSceneChatHistory: (state, action) => {
      const { sceneId, messages } = action.payload;
      state.sceneChat[sceneId].messages = messages;
    },
    addSceneMessage: (state, action) => {
      const { sceneId, message } = action.payload;
      state.sceneChat[sceneId].messages.push(message);
    },
    ///private
    onLoadPrivateChat: (state, action) => {
      const { userId } = action.payload;
      state.privateChat[userId] = singleChatTemplate(userId);
    },
    onLoadedPrivateChatHistory: (state, action) => {
      const { userId, messages } = action.payload;
      state.privateChat[userId].messages = messages;
    },
    addPrivateMessage: (state, action) => {
      const { userId, message } = action.payload;
      state.privateChat[userId].messages.push(message);
    },


  },
});
export default slice.reducer




// Actions
const { addPrivateMessage, addSceneMessage, addWorldMessage, onLoadPrivateChat, onLoadedPrivateChatHistory, onLoadedWorldChatHistory, onLoadSceneChat } = slice.actions
export const onPrivateMessage = (payload) => async dispatch => {
  dispatch(addPrivateMessage(payload))
}
export const onSceneMessage = (payload) => async dispatch => {
  dispatch(addSceneMessage(payload))
}
export const onWorldMessage = (payload) => async dispatch => {
  console.log(payload)
  dispatch(addWorldMessage(payload))
}
export const onLoadPrivateHistory = (payload) => async dispatch => {
  dispatch(onLoadedPrivateChatHistory(payload))
}
export const onLoadSceneHistory = (payload) => async dispatch => {
  dispatch(onLoadSceneChat(payload))
}
export const onLoadWorldHistory = (payload) => async dispatch => {
  dispatch(onLoadedWorldChatHistory(payload))
}
