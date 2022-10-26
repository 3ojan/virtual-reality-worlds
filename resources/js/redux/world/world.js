import { createSlice } from '@reduxjs/toolkit';
// Slice
const slice = createSlice({
  name: 'world',
  initialState: {
    data: null,
    editData: null,
    dataForSave: null,
    scenes: {},
  },
  reducers: {
    setWorldData: (state, action) => {
      const scenes = {};
      action.payload.data.scenes.map(scene => {
        scenes[scene.id] = scene
      })
      return {
        ...state,
        data: action.payload,
        editData: action.payload,
        scenes: scenes
      }
    },
    setSavedData: (state, action) => {
      return {
        ...state,
        dataForSave: action.payload
      }
    },
    setChangedSceneData: (state, action) => {
      state.editData.data.scenes[action.payload.index] = action.payload.item
    },
    setSelectedSceneData: (state, action) => {
      state.scenes[action.payload.id] = action.payload.data;
    },
  },
});
export default slice.reducer




// Actions
const { setWorldData, setSavedData, setChangedSceneData, setSelectedSceneData } = slice.actions
export const loadWorldData = (id) => async (dispatch) => {
  await axios.post('/get/worlds/getWorldData', { worldId: id }).then((response) => {
    const json = response.data[0];
    json.data = JSON.parse(json.data);
    dispatch(setWorldData(json))
  })
}
export const saveWorldData = (id, wdata) => async dispatch => {
  await axios.post('/update/worlds/data', { worldId: id, items: { data: wdata } }).then((response) => {
    console.log(response.data)
  })
}
export const cacheSavedData = (data) => async dispatch => {
  dispatch(setSavedData(data))
}
export const onChangeSceneData = (data) => async dispatch => {
  dispatch(setChangedSceneData(data))
}
export const onChangeSelectedSceneData = (data) => async (dispatch,) => {
  dispatch(setSelectedSceneData(data));
}
