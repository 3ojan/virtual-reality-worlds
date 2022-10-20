import { createSlice } from '@reduxjs/toolkit';
import { worldData } from './mock'
// Slice
const slice = createSlice({
  name: 'world',
  initialState: {
    data: null,
    editData: null,
    dataForSave: null
  },
  reducers: {
    setWorldData: (state, action) => {
      state.data = action.payload;
      state.editData = action.payload;
    },
    setSavedData: (state, action) => {
      return {
        ...state,
        dataForSave: action.payload
      }
    },
  },
});
export default slice.reducer




// Actions
const { setWorldData, setSavedData } = slice.actions
export const loadWorldData = (id) => async dispatch => {
  await axios.post('/get/worlds/getWorldData', { worldId: id }).then((response) => {
    const json = JSON.parse(response.data.data);
    dispatch(setWorldData(json))
  })
}
export const saveWorldData = (id, wdata, oldData) => async dispatch => {
  await axios.post('/update/worlds/data', { worldId: id, items: { data: wdata } }).then((response) => {
    console.log(response.data)
  })
}
export const cacheSavedData = (data) => async dispatch => {
  dispatch(setSavedData(data))
}