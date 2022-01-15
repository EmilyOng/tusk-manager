import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { BoardAPI } from 'api/board'
import { MemberProfile } from 'generated/models'
import { MeState } from './me'

type MembersState = {
  loading: boolean
  members: MemberProfile[]
}

const initialState: MembersState = {
  loading: false,
  members: []
}

export const getMembers = createAsyncThunk(
  'Members/getMembers',
  async (boardId: number, thunkAPI) => {
    const api = new BoardAPI()
    return api.getMemberProfiles({ boardId }).then((res) => {
      if (res.error) {
        return thunkAPI.rejectWithValue(res.error)
      }
      return res
    })
  }
)

export const MembersSlice = createSlice({
  name: 'Members',
  initialState,
  reducers: {
    setMembers(state, action: { payload: MemberProfile[] }) {
      state.members = action.payload
    },
    updateMembers(state, action: { payload: MemberProfile[] }) {
      state.members = action.payload
    },
    resetMembers(state) {
      state.members = []
      state.loading = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMembers.pending, (state) => {
        state.loading = true
      })
      .addCase(getMembers.fulfilled, (state, { payload }) => {
        state.members = payload.data
        state.loading = false
      })
      .addCase(getMembers.rejected, (state) => {
        state.loading = false
      })
  }
})

export const selectMembers = ({ member }: { member: MembersState }) => member
export const selectMeMember = ({
  member,
  me
}: {
  member: MembersState
  me: MeState
}) => {
  return member.members.find((m) => m.profile.id === me.user?.id) || null
}
export const { setMembers, updateMembers, resetMembers } = MembersSlice.actions
export const MembersReducer = MembersSlice.reducer
