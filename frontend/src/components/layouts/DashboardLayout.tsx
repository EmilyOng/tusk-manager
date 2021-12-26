import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import BoardTabs from 'components/organisms/BoardTabs'
import { getBoards } from 'store/boards'

const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getBoards())
  }, [])

  return (
    <div>
      <BoardTabs />
      <Outlet />
    </div>
  )
}

export default DashboardLayout
