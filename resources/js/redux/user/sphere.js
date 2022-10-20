import { createSlice } from '@reduxjs/toolkit'
// Slice
const slice = createSlice({
  name: 'sphere',
  initialState: {
    radius: 2,
    segemntsX: 64,
    segemntsY: 64,
  },
  reducers: {
    setSphereRadius: (state, action) => {
      state.radius = action.payload;
    },
    setSphereSegments: (state, action) => {
      state.segemntsX = action.payload;
      state.segemntsY = action.payload;
    },
    setSphereMaterial: (state, action) => {
      state.material = action.payload;
    },
  },
});
export default slice.reducer




// Actions
const { setSphereRadius, setSphereSegments, setSphereMaterial } = slice.actions
export const setRadius = (width) => async dispatch => {
  dispatch(setSphereRadius(width));
}
export const setSegments = (value) => async dispatch => {
  return dispatch(setSphereSegments(value))
}
export const setMaterial = (value) => async dispatch => {
  return dispatch(setSphereMaterial(value))
}