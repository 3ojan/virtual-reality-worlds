import { createSlice } from '@reduxjs/toolkit';
// Slice
const slice = createSlice({
  name: 'socketReducer',
  initialState: {
    currentUsers: {},
  },
  reducers: {
    onSetCurrentUsers: (state, action) => {
      state.currentUsers = action.payload;
    },
  },
});
export default slice.reducer




// Actions
const { onSetCurrentUsers } = slice.actions
export const setCurrentUsers = (currentUsers) => async dispatch => {
  dispatch(onSetCurrentUsers(currentUsers))
}
