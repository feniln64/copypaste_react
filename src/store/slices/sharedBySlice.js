import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sharedby: {}
}

const sharedBySlice = createSlice({
  name: 'sharedby',
  initialState,
  reducers: {
    initSharedBy: (state, action) => {    // used while login to store all data 
      state.sharedby = action.payload
    },
    removeSharedBy: (state) => {
      state.sharedby = {}
    },
    removeOneSharedBy: (state, action) => {
      state.sharedby = [...state.sharedby.filter((domain) => domain._id !== action.payload._id)]
    },
    addNewSharedBy: (state, action) => {  // used to create new subdoamin
      state.sharedby = [...state.sharedby, action.payload]
    },
    updateOneSharedBy: (state, action) => {  // used to update one data with edidt button
      state.sharedby = [...state.sharedby.filter((sharedby) => {if(sharedby._id === action.payload._id){sharedby.title=action.payload.title;sharedby.sharedby=action.payload.sharedby;sharedby.is_protetcted=action.payload.is_protetcted;return sharedby}else{return sharedby}})]
    },
  },
})


// // Action creators are generated for each case reducer function
export const { initSharedBy, removeSharedBy,removeOneSharedBy, addNewSharedBy,updateOneSharedBy } = sharedBySlice.actions

export default sharedBySlice.reducer