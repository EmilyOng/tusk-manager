import { Role } from 'generated/types'

export const Roles = [Role.Owner, Role.Editor, Role.Viewer]

export function canEdit(role: Role | undefined) {
  return !!role && (role === Role.Owner || role === Role.Editor)
}
