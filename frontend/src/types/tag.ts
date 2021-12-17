import { Color } from './common'

export interface TagPrimitive {
  id: string
  name: string
  color: Color
}

export interface Tag extends TagPrimitive {}
