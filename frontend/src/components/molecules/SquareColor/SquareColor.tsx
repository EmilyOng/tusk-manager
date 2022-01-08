import React from 'react'
import clsx from 'clsx'
import './SquareColor.scoped.css'
import { Color } from 'generated/types'

type Props = {
  color: Color
}

const SquareColor: React.FC<Props> = ({ color }) => {
  return <span className={clsx({ square: true, [color]: true })} />
}

export default SquareColor
