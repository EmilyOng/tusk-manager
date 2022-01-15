import { configureStore } from '@reduxjs/toolkit'
import { BoardsReducer } from './boards'
import { MeReducer } from './me'
import { MembersReducer } from './members'

export const store = configureStore({
  reducer: {
    me: MeReducer,
    board: BoardsReducer,
    member: MembersReducer
  }
})
