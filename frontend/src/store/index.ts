import { configureStore } from '@reduxjs/toolkit'
import { BoardsReducer } from './boards'
import { MeReducer } from './me'

export const store = configureStore({
  reducer: {
    me: MeReducer,
    board: BoardsReducer
  }
})
