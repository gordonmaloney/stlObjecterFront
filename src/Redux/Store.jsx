import { configureStore } from '@reduxjs/toolkit'
import stateReducer from './Slice'

export const store = configureStore({
  reducer: {
    applications: stateReducer,
  },
})