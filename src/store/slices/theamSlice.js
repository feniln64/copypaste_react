import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theamInfo: {theam: 'light'}, 
}

const theamSlice = createSlice({
  name: 'theam',
  initialState,
  reducers: {
    addNewTheam: (state, action) => {
      state.theamInfo = action.payload
    },
    removeTheam: (state) => {
      state.theamInfo = {theam: 'light'}
    },
    updateTheam: (state, action) => {
        state.theamInfo = action.payload
    }
  },
})


// // Action creators are generated for each case reducer function
export const {  addNewTheam, removeTheam, updateTheam } = theamSlice.actions

export default theamSlice.reducer