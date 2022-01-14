/* Do not change, this code is generated from Golang structs */
import { Color } from './types'
import { Role } from './types'

export interface Member {
  id: number
  role: Role
  userId?: number
  boardId?: number
}
export interface State {
  id: number
  name: string
  currentPosition: number
  tasks: Task[]
  boardId?: number
}
export interface Tag {
  id: number
  name: string
  color: Color
  tasks: Task[]
  boardId?: number
}
export interface Task {
  id: number
  name: string
  description: string
  dueAt?: Date
  tags: Tag[]
  userId?: number
  boardId?: number
  stateId?: number
}
export interface Board {
  id: number
  name: string
  color: Color
  tasks: Task[]
  tags: Tag[]
  states: State[]
  boardMembers: Member[]
}
export interface BoardPrimitive {
  id: number
  name: string
  color: Color
}
export interface GetBoardPayload {
  id: number
}
export interface GetBoardResponse {
  error: string
  data: BoardPrimitive
}
export interface CreateBoardPayload {
  name: string
  color: Color
  userId: number
}
export interface CreateBoardResponse {
  error: string
  data: BoardPrimitive
}
export interface UpdateBoardPayload {
  id: number
  name: string
  color: Color
  userId: number
}
export interface UpdateBoardResponse {
  error: string
  data: BoardPrimitive
}
export interface GetBoardTasksPayload {
  boardId: number
}
export interface GetBoardTasksResponse {
  error: string
  data: Task[]
}
export interface GetBoardTagsPayload {
  boardId: number
}
export interface TagPrimitive {
  id: number
  name: string
  color: Color
  boardId?: number
}
export interface GetBoardTagsResponse {
  error: string
  data: TagPrimitive[]
}
export interface GetBoardMemberProfilesPayload {
  boardId: number
}
export interface Profile {
  id: number
  name: string
  email: string
}
export interface MemberProfile {
  id: number
  role: Role
  profile: Profile
}
export interface GetBoardMemberProfilesResponse {
  error: string
  data: MemberProfile[]
}
export interface GetBoardStatesPayload {
  boardId: number
}
export interface StatePrimitive {
  id: number
  name: string
  currentPosition: number
  boardId?: number
}
export interface GetBoardStatesResponse {
  error: string
  data: StatePrimitive[]
}
export interface DeleteBoardPayload {
  id: number
}
export interface DeleteBoardResponse {
  error: string
}
export interface Response {
  error: string
}

export interface MemberPrimitive {
  id: number
  role: Role
  userId?: number
  boardId?: number
}

export interface CreateMemberPayload {
  role: Role
  email: string
  boardId: number
}
export interface CreateMemberResponse {
  error: string
  data: MemberProfile
}
export interface UpdateMemberPayload {
  id: number
  role: Role
}
export interface UpdateMemberResponse {
  error: string
  data: MemberProfile
}
export interface DeleteMemberPayload {
  id: number
}
export interface DeleteMemberResponse {
  error: string
}

export interface CreateStatePayload {
  name: string
  boardId: number
  currentPosition: number
}
export interface CreateStateResponse {
  error: string
  data: State
}
export interface UpdateStatePayload {
  id: number
  name: string
  boardId: number
  currentPosition: number
}
export interface UpdateStateResponse {
  error: string
  data: StatePrimitive
}
export interface DeleteStatePayload {
  id: number
}
export interface DeleteStateResponse {
  error: string
}

export interface CreateTagPayload {
  name: string
  color: Color
  boardId: number
}
export interface CreateTagResponse {
  error: string
  data: TagPrimitive
}
export interface UpdateTagPayload {
  id: number
  name: string
  boardId: number
  color: Color
}
export interface UpdateTagResponse {
  error: string
  data: TagPrimitive
}
export interface DeleteTagPayload {
  id: number
}
export interface DeleteTagResponse {
  error: string
}

export interface TaskPrimitive {
  id: number
  name: string
  description: string
  dueAt?: Date
  userId?: number
  boardId?: number
  stateId?: number
}
export interface CreateTaskPayload {
  name: string
  description: string
  dueAt?: Date
  stateId: number
  tags: TagPrimitive[]
  boardId: number
  userId: number
}
export interface CreateTaskResponse {
  error: string
  data: Task
}
export interface UpdateTaskPayload {
  id: number
  name: string
  description: string
  dueAt?: Date
  stateId: number
  tags: TagPrimitive[]
  boardId: number
  userId: number
}
export interface UpdateTaskResponse {
  error: string
  data: Task
}
export interface DeleteTaskPayload {
  id: number
}
export interface DeleteTaskResponse {
  error: string
}
export interface User {
  id: number
  name: string
  email: string
  password: string
  boardMembers: Member[]
  tasks: Task[]
}
export interface UserPrimitive {
  id: number
  name: string
  email: string
  password: string
}

export interface AuthUser {
  id: number
  name: string
  email: string
  token: string
}
export interface AuthUserResponse {
  error: string
  data: AuthUser
}
export interface LoginPayload {
  email: string
  password: string
}
export interface LoginResponse {
  error: string
  data: AuthUser
}
export interface SignUpPayload {
  name: string
  email: string
  password: string
}
export interface SignUpResponse {
  error: string
  data: AuthUser
}
export interface GetUserBoardsResponse {
  error: string
  data: BoardPrimitive[]
}
