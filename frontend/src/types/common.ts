export interface Base {
  id: number
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
}

export enum Color {
  Turquoise = 'Turquoise',
  Blue = 'Blue',
  Cyan = 'Cyan',
  Green = 'Green',
  Yellow = 'Yellow',
  Red = 'Red'
}

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
