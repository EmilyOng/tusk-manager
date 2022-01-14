import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe, selectMe } from 'store/me'
import LoadingBar from 'components/molecules/LoadingBar'

const RequireAuth: React.FC = ({ children }) => {
  const dispatch = useDispatch()
  const { user, loading } = useSelector(selectMe)

  useEffect(() => {
    dispatch(getMe())
  }, [])

  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true })
    }
  }, [user])

  return loading ? <LoadingBar /> : (children as JSX.Element)
}

export default RequireAuth
