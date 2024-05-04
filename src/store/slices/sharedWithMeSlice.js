import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sharedwithme: {}
}

const sharedWithMeSlice = createSlice({
  name: 'sharedwithme',
  initialState,
  reducers: {
    initSharedWithMe: (state, action) => {    // used while login to store all data 
      state.sharedwithme = action.payload
    },
    removeSharedWithMe: (state) => {
      state.sharedwithme = {}
    },
    removeOneSharedWithMe: (state, action) => {
      state.sharedwithme = [...state.sharedwithme.filter((domain) => domain._id !== action.payload._id)]
    },
    addNewSharedWithMe: (state, action) => {  // used to create new subdoamin
      state.sharedwithme = [...state.sharedwithme, action.payload]
    },
    updateOneSharedWithMe: (state, action) => {  // used to update one data with edidt button
      state.sharedwithme = [...state.sharedwithme.filter((sharedwithme) => {if(sharedwithme._id === action.payload._id){sharedwithme.title=action.payload.title;sharedwithme.sharedwithme=action.payload.sharedwithme;sharedwithme.is_protetcted=action.payload.is_protetcted;return sharedwithme}else{return sharedwithme}})]
    },
  },
})


// // Action creators are generated for each case reducer function
export const { initSharedWithMe, removeSharedWithMe,removeOneSharedWithMe, addNewSharedWithMe } = sharedWithMeSlice.actions

export default sharedWithMeSlice.reducer