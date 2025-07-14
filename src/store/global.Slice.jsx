import { createSlice } from '@reduxjs/toolkit'
import { GetUserData, } from './global.Action'

const initialState = {
  user: null,
}

export const globalSlice = createSlice({
  name: 'globalState',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetUserData.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
})

export const { setUser } = globalSlice.actions

export default globalSlice.reducer