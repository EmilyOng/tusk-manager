import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import './Notification.css'

export enum NotificationType {
  Success = 'is-success',
  Info = 'is-info',
  Warning = 'is-warning',
  Error = 'is-danger'
}

type Props = {
  type: NotificationType
  message: string
}

const Notification: React.FC<Props> = ({ type, message }) => {
  const [visible, setVisible] = useState(true)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    timeout.current = setTimeout(() => {
      timeout.current = null
      setVisible(false)
    }, 5000)
    return () => {
      if (!timeout.current) {
        return
      }
      clearTimeout(timeout.current)
      timeout.current = null
    }
  }, [])

  function clearTimeout_() {
    if (!timeout.current) {
      return
    }
    clearTimeout(timeout.current)
    setVisible(false)
    timeout.current = null
  }

  if (!visible) {
    return null
  }
  return (
    <div
      className={clsx({
        notification: true,
        'is-light': true,
        [type]: true
      })}
    >
      <button className="delete" onClick={clearTimeout_} />
      {message}
    </div>
  )
}

export default Notification
