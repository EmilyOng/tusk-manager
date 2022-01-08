import { Color } from 'generated/types'

export const Colors = [
  Color.Blue,
  Color.Cyan,
  Color.Green,
  Color.Red,
  Color.Turquoise,
  Color.Yellow
]

export function ColorToAlias(color: Color) {
  return color === Color.Turquoise
    ? 'primary'
    : color === Color.Blue
    ? 'link'
    : color === Color.Cyan
    ? 'info'
    : color === Color.Green
    ? 'success'
    : color === Color.Yellow
    ? 'warning'
    : 'danger'
}
