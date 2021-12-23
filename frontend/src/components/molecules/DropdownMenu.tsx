import React, { createRef, Key, useEffect, useRef, useState } from 'react'
import Portal from './Portal'
import DropdownItem from './DropdownItem'
import './DropdownMenu.css'

type Props = {
  trigger: JSX.Element
  items: JSX.Element[]
  events?: {
    onClickDropdownItem?: (key: Key | null) => any
    onClickDropdown?: () => any
  }
}

const DropdownMenu: React.FC<Props> = ({ trigger, items, events }) => {
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)
  const dropdownMenuWrapper = createRef<HTMLDivElement>()
  const dropdownTriggerWrapper = createRef<HTMLDivElement>()
  const animationRef = useRef<number>()

  function positionDropdownMenu() {
    if (!dropdownTriggerWrapper.current || !dropdownMenuWrapper.current) {
      return
    }
    const rect = dropdownTriggerWrapper.current.getBoundingClientRect()
    dropdownMenuWrapper.current.style.left = rect.x + 'px'
    dropdownMenuWrapper.current.style.top = rect.y + rect.height + 'px'
  }

  function onClickDropdownItem(
    e: React.MouseEvent<HTMLDivElement>,
    key: Key | null
  ) {
    e.stopPropagation()
    setDropdownMenuVisible(!dropdownMenuVisible)
    events?.onClickDropdownItem?.(key)
  }

  function onClickDropdown(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    setDropdownMenuVisible(!dropdownMenuVisible)
    events?.onClickDropdown?.()
  }

  function updateDropdownMenuPosition() {
    if (dropdownMenuVisible) {
      positionDropdownMenu()
    }
    animationRef.current = requestAnimationFrame(updateDropdownMenuPosition)
  }

  useEffect(() => {
    animationRef.current = requestAnimationFrame(updateDropdownMenuPosition)
    return () => {
      if (!animationRef.current) {
        return
      }
      cancelAnimationFrame(animationRef.current)
    }
  }, [dropdownMenuVisible])

  return (
    <div className="dropdown">
      <div className="dropdown-trigger" onClick={onClickDropdown}>
        <div ref={dropdownTriggerWrapper}>{trigger}</div>
      </div>
      <Portal>
        <div className="dropdown-menu-wrapper" ref={dropdownMenuWrapper}>
          {dropdownMenuVisible && (
            <div className="dropdown-menu-container" role="menu">
              <div className="dropdown-content">
                {items.map((item) => (
                  <DropdownItem
                    key={item.key}
                    onSelect={(e: React.MouseEvent<HTMLDivElement>) =>
                      onClickDropdownItem(e, item.key)
                    }
                  >
                    {item}
                  </DropdownItem>
                ))}
              </div>
            </div>
          )}
        </div>
      </Portal>
    </div>
  )
}

export default DropdownMenu
