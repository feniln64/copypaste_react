import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  content: {},
}

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    addContent: (state, action) => {        // used while login to store all data 
      state.content = action.payload
    },
    removeContent: (state) => {             // used while logout to remove all data
      state.content = {}
    },
    removeOneContent: (state, action) => {  // used to remove one data
      state.content = [...state.content.filter((content) => content._id !== action.payload._id)]
    },
    updateContent: (state, action) => {     // used to add new data in viewContent.js file to add new content
      state.content = [...state.content, action.payload]
    },
    updateOneContent: (state, action) => {  // used to update one data with edidt button
      state.content = [...state.content.filter((content) => {if(content._id === action.payload._id){content.title=action.payload.title;content.content=action.payload.content;content.is_protetcted=action.payload.is_protetcted;return content}else{return content}})]
    },
  },

})

// // Action creators are generated for each case reducer function
export const { addContent, removeContent,removeOneContent, updateContent,updateOneContent } = contentSlice.actions

export default contentSlice.reducer