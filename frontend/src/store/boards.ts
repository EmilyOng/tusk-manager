import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BoardAPI } from 'api/board'
import { NotificationType, useNotification } from 'composables/notification'
import { BoardPrimitive } from 'types/board'

type BoardsState = {
  boards: BoardPrimitive[]
  loading: boolean
  currentBoardId: number | null
}

const initialState: BoardsState = {
  boards: [],
  loading: false,
  currentBoardId: null
}

export const getBoards = createAsyncThunk(
  'Boards/getBoards',
  async (_, thunkAPI) => {
    const api = new BoardAPI()
    return api.getBoards().then((res) => {
      if (res.error) {
        return thunkAPI.rejectWithValue(res.error)
      }
      return res
    })
  }
)

export const BoardsSlice = createSlice({
  name: 'Boards',
  initialState,
  reducers: {
    setBoards(state, action: { payload: BoardPrimitive[] }) {
      state.boards = action.payload
    },
    updateBoards(state, action: { payload: BoardPrimitive[] }) {
      state.boards = action.payload
    },
    setCurrentBoardId(state, action: { payload: number | null }) {
      state.currentBoardId = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBoards.pending, (state) => {
        state.loading = true
      })
      .addCase(getBoards.fulfilled, (state, { payload }) => {
        state.boards = payload
        state.loading = false
      })
      .addCase(getBoards.rejected, (state, { payload }) => {
        state.loading = false
        useNotification({
          type: NotificationType.Error,
          message: payload as string
        })
      })
  }
})

export const selectBoards = ({ board }: { board: BoardsState }) => board
export const { setBoards, updateBoards, setCurrentBoardId } =
  BoardsSlice.actions
export const BoardsReducer = BoardsSlice.reducer
