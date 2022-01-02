import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import BoardTabs from 'components/organisms/BoardTabs'
import { getBoards } from 'store/boards'
import { selectMe } from 'store/me'

const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(selectMe)
  useEffect(() => {
    if (!user) {
      return
    }
    dispatch(getBoards())
  }, [user])

  return (
    <div>
      <BoardTabs />
      <Outlet />
    </div>
  )
}

export default DashboardLayout
