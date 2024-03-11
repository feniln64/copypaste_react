import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  subdomain: {}
}

const subDomainSlice = createSlice({
  name: 'subdomain',
  initialState,
  reducers: {
    initDomain: (state, action) => {    // used while login to store all data 
      state.subdomain = action.payload
    },
    removeDomain: (state) => {
      state.subdomain = {}
    },
    removeOneDomain: (state, action) => {
      state.subdomain = [...state.subdomain.filter((domain) => domain._id !== action.payload._id)]
    },
    addNewDomain: (state, action) => {  // used to create new subdoamin
      state.subdomain = [...state.subdomain, action.payload]
    },
    updateOneDomain: (state, action) => {  // used to update one data with edidt button
      state.subdomain = [...state.subdomain.filter((subdomain) => {if(subdomain._id === action.payload._id){subdomain.title=action.payload.title;subdomain.subdomain=action.payload.subdomain;subdomain.is_protetcted=action.payload.is_protetcted;return subdomain}else{return subdomain}})]
    },
  },
})


// // Action creators are generated for each case reducer function
export const { initDomain, removeDomain,removeOneDomain, addNewDomain } = subDomainSlice.actions

export default subDomainSlice.reducer