import React from 'react'
import clsx from 'clsx'
import BoardTabs from 'components/organisms/BoardTabs'

type Props = {
  className?: string
}

const DashboardLayout: React.FC<Props> = ({ className, children }) => {
  return (
    <div className="container">
      <BoardTabs />
      <div
        className={clsx({
          [className ?? '']: !!className
        })}
      >
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout
