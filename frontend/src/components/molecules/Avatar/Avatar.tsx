import clsx from 'clsx'
import React from 'react'
import { Colors } from 'utils/color'
import './Avatar.scoped.css'

type Props = {
  name: string
}

const Avatar: React.FC<Props> = ({ name }) => {
  const initials = name.split(' ').reduce((acc, curr) => {
    if (acc.length > 2) {
      return acc
    }
    const c = curr.trim()
    return acc + (c.length > 0 ? c[0] : '')
  }, '')
  const color = Colors[name.length % Colors.length]
  return (
    <div className={clsx({ avatar: true, [color]: true })}>
      <span className="initials">{initials}</span>
    </div>
  )
}

export default Avatar
