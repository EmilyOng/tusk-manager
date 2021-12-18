import React from 'react'
import { Outlet } from 'react-router-dom'
import BoardTabs from 'components/organisms/BoardTabs'

const DashboardLayout: React.FC = () => {
  return (
    <div className="container">
      <BoardTabs />
      <Outlet />
    </div>
  )
}

export default DashboardLayout
