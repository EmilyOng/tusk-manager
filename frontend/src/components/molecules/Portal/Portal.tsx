import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

// https://blog.logrocket.com/learn-react-portals-by-example/
const Portal: React.FC = ({ children }) => {
  const mount = document.getElementById('portal')
  const el = document.createElement('div')

  useEffect(() => {
    mount?.appendChild(el)
    return () => {
      // Clean-up
      mount?.removeChild(el)
    }
  }, [el, mount])

  return createPortal(children, el)
}

export default Portal
