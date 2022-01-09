import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthAPI } from 'api/auth'
import { AuthUser } from 'generated/models'
import { setAuthToken, removeAuthToken } from 'utils/authToken'

type MeState = {
  user: AuthUser | null
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
    setMe(state, action: { payload: AuthUser }) {
      state.user = action.payload
      setAuthToken(action.payload.token)
    },
    resetMe(state) {
      state.user = null
      removeAuthToken()
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMe.pending, (state) => {
        state.loading = true
      })
      .addCase(getMe.fulfilled, (state, { payload }) => {
        state.user = payload.data
        state.loading = false
        setAuthToken(payload.data.token)
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false
      })
  }
})

export const selectMe = ({ me }: { me: MeState }) => me
export const { setMe, resetMe } = MeSlice.actions
export const MeReducer = MeSlice.reducer
