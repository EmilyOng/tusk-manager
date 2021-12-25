import { configureStore } from '@reduxjs/toolkit'
import { BoardReducer } from './board'
import { MeReducer } from './me'

export const store = configureStore({
  reducer: {
    me: MeReducer,
    board: BoardReducer
  }
})
