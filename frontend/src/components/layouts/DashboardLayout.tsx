import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import BoardTabs from 'components/organisms/BoardTabs'
import './DashboardLayout.css'
import { getBoards } from 'store/board'

const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getBoards())
  }, [])

  return (
    <div className="container">
      <BoardTabs />
      <Outlet />
    </div>
  )
}

export default DashboardLayout
