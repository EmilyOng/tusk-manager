import { Color } from './common'

export interface TagPrimitive {
  id: number
  name: string
  color: Color
}

export interface Tag extends TagPrimitive {}
