import React from 'react'
import clsx from 'clsx'
import { Color } from 'types/common'
import './SquareColor.scoped.css'

type Props = {
  color: Color
}

const SquareColor: React.FC<Props> = ({ color }) => {
  return <span className={clsx({ square: true, [color]: true })} />
}

export default SquareColor
