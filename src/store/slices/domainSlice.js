import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  subdomain: null
}

const domainSlice = createSlice({
  name: 'domain',
  initialState,
  reducers: {
    addNewDomain: (state, action) => {
      state.subdomain = action.payload
    },
    removeDomain: (state) => {
      state.subdomain = {}
    },
    removeDomain: (state, action) => {
      state.subdomain = [...state.subdomain.filter((domain) => domain._id !== action.payload._id)]
    },
    updateDomain: (state, action) => {
      state.subdomain = [...state.subdomain, action.payload]
    }
  },
})


// // Action creators are generated for each case reducer function
export const { addNewDomain, removeDomain, updateDomain } = domainSlice.actions

export default domainSlice.reducer