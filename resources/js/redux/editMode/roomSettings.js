import { createSlice } from '@reduxjs/toolkit';
// Slice
const slice = createSlice({
  name: 'editModeRoomSettings',
  initialState: {
    selectedScene: null,
    activeTab: "general",
    roomSettingsOpened: true,
    sceneSettingsOpened: false,
  },
  reducers: {
    setSelectScene: (state, action) => {
      state.selectedScene = action.payload;

    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    openRoomSettings: (state, action) => {
      state.roomSettingsOpened = true;
      state.sceneSettingsOpened = false;
    },
    openSceneSettings: (state, action) => {
      state.roomSettingsOpened = false;
      state.sceneSettingsOpened = true;
    },
  },
});
export default slice.reducer


const toggleTab = (currntTab) => {
  if (currntTab === "general") { return "scene" }
  else {
    return "general"
  }
}


// Actions
const { setSelectScene, setActiveTab, openRoomSettings, openSceneSettings, setSelectedSceneData } = slice.actions
export const onSelectScene = (scene) => async dispatch => {
  dispatch(setSelectScene(scene))
}
export const onActiveTabChange = (activeTab) => async dispatch => {
  dispatch(setActiveTab(toggleTab(activeTab)))
}
export const onOpenRoomSettings = () => async dispatch => {
  dispatch(openRoomSettings());
}
export const onOpenSceneSettings = () => async dispatch => {
  dispatch(openSceneSettings());
}
