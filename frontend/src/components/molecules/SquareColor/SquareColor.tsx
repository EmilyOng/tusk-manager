import clsx from 'clsx'
import React from 'react'
import { Color } from 'generated/types'
import './SquareColor.scoped.css'

type Props = {
  color: Color
}

const SquareColor: React.FC<Props> = ({ color }) => {
  return <span className={clsx({ square: true, [color]: true })} />
}

export default SquareColor
