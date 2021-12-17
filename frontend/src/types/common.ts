export interface Base {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export enum Color {
  Turquoise = 'Turquoise',
  Blue = 'Blue',
  Cyan = 'Cyan',
  Green = 'Green',
  Yellow = 'Yellow',
  Red = 'Red'
}

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
