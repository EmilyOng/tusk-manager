import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthAPI } from 'api/auth'
import { NotificationType, useNotification } from 'composables/notification'
import { User } from 'types/user'

type MeState = {
  user: User | null
  loading: boolean
}

const initialState: MeState = {
  user: null,
  loading: false
}

export const getMe = createAsyncThunk('Me/getMe', async (_, thunkAPI) => {
  const api = new AuthAPI()
  return api.getAuthUser().then((res) => {
    if (res.error) {
      return thunkAPI.rejectWithValue(res.error)
    }
    return res
  })
})

export const MeSlice = createSlice({
  name: 'Me',
  initialState,
  reducers: {
    setMe(state, action: { payload: User }) {
      state.user = action.payload
    },
    resetMe(state) {
      state.user = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMe.pending, (state) => {
        state.loading = true
      })
      .addCase(getMe.fulfilled, (state, { payload }) => {
        state.user = payload
        state.loading = false
      })
      .addCase(getMe.rejected, (state, { payload }) => {
        state.loading = false
        useNotification({
          type: NotificationType.Error,
          message: payload as string
        })
      })
  }
})

export const selectMe = ({ me }: { me: MeState }) => me
export const { setMe, resetMe } = MeSlice.actions
export const MeReducer = MeSlice.reducer
