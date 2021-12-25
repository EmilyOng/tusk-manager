import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import FormAuthentication, {
  Form,
  FormMode
} from 'components/organisms/FormAuthentication'
import Message from 'components/atoms/Message'
import clsx from 'clsx'
import './Authentication.css'
import { AuthUser } from 'types/user'
import { useNavigate } from 'react-router-dom'
import { selectMe, setMe } from 'store/me'
import { AuthAPI } from 'api/auth'

function Authentication() {
  const dispatch = useDispatch()
  const { user } = useSelector(selectMe)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user])

  const [error, setError] = useState('')
  const auth = new AuthAPI()
  const [mode, setMode] = useState<FormMode>(FormMode.SignUp)

  function onSubmit(form: Form, cb: () => void) {
    if (mode === FormMode.SignUp) {
      auth
        .signUp(form as AuthUser)
        .then((res) => {
          if (res.error) {
            setError(res.error)
            return
          }
          dispatch(setMe(res))
          navigate('/', { replace: true })
        })
        .finally(() => cb())
    } else {
      auth
        .login(form as Omit<AuthUser, 'name'>)
        .then((res) => {
          if (res.error) {
            setError(res.error)
            return
          }
          dispatch(setMe(res))
          navigate('/', { replace: true })
        })
        .finally(() => cb())
    }
  }

  return (
    <div className="box form-authentication">
      <div className="tabs is-fullwidth is-toggle">
        <ul>
          <li
            className={clsx({ 'is-active': mode === FormMode.SignUp })}
            onClick={() => setMode(FormMode.SignUp)}
          >
            <a>
              <span>Sign Up</span>
            </a>
          </li>
          <li
            className={clsx({ 'is-active': mode === FormMode.Login })}
            onClick={() => setMode(FormMode.Login)}
          >
            <a>
              <span>Login</span>
            </a>
          </li>
        </ul>
      </div>
      <FormAuthentication onSubmit={onSubmit} mode={mode}>
        <Message type="danger" text={error} />
      </FormAuthentication>
    </div>
  )
}

export default Authentication
