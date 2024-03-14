import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sharedto: {}
}

const sharedToSlice = createSlice({
  name: 'sharedto',
  initialState,
  reducers: {
    initSharedTo: (state, action) => {    // used while login to store all data 
      state.sharedto = action.payload
    },
    removeSharedTo: (state) => {
      state.sharedto = {}
    },
    removeOneSharedTo: (state, action) => {
      state.sharedto = [...state.sharedto.filter((domain) => domain._id !== action.payload._id)]
    },
    addNewSharedTo: (state, action) => {  // used to create new subdoamin
      state.sharedto = [...state.sharedto, action.payload]
    },
    updateOneSharedTo: (state, action) => {  // used to update one data with edidt button
      state.sharedto = [...state.sharedto.filter((sharedto) => {if(sharedto._id === action.payload._id){sharedto.title=action.payload.title;sharedto.sharedto=action.payload.sharedto;sharedto.is_protetcted=action.payload.is_protetcted;return sharedto}else{return sharedto}})]
    },
  },
})


// // Action creators are generated for each case reducer function
export const { initSharedTo, removeSharedTo,removeOneSharedTo, addNewSharedTo } = sharedToSlice.actions

export default sharedToSlice.reducer