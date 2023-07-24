import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userInfo: {}, 
  isLoggedIn: false, // for monitoring the login process.
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addNewUser: (state, action) => {
      state.userInfo = action.payload
      state.isLoggedIn = true
    },
    removeUser: (state) => {
      state.userInfo = {}
      state.isLoggedIn = false
    },
    updateUser: (state, action) => {
        state.userInfo = action.payload
        state.isLoggedIn = true
    }
  },
})


// // Action creators are generated for each case reducer function
export const {  addNewUser,removeUser,updateUser } = authSlice.actions

export default authSlice.reducer