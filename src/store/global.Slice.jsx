import { createSlice } from '@reduxjs/toolkit'
import { GetUserData, } from './global.Action'

const initialState = {
  user: null,
  sidebarOpen: false,
}

export const globalSlice = createSlice({
  name: 'globalState',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetUserData.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
})

export const { setUser ,toggleSidebar } = globalSlice.actions

export default globalSlice.reducer