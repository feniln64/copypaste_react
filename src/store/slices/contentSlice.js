import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  content: {}, 
}

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    addContent: (state, action) => {
      state.content = action.payload
    },
    removeContent: (state) => {
      state.content = {}
    },
    updateContent: (state, action) => {
        state.content = action.payload
    }
  },
 
})


// // Action creators are generated for each case reducer function
export const {  addContent,removeContent,updateContent } = contentSlice.actions

export default contentSlice.reducer