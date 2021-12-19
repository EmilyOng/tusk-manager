import { useEffect, useState } from 'react'
import FormAuthentication, {
  Form,
  FormMode
} from 'components/organisms/FormAuthentication'
import Message from 'components/atoms/Message'
import clsx from 'clsx'
import './Authentication.css'
import { AuthUser } from 'types/user'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'context/Authentication'

function Authentication() {
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.user) {
      navigate('/', { replace: true })
    }
  }, [])

  const [error, setError] = useState('')
  const [mode, setMode] = useState<FormMode>(FormMode.SignUp)

  function onSubmit(form: Form, cb: () => void) {
    if (mode === FormMode.SignUp) {
      auth.signUp(
        form as AuthUser,
        () => {
          navigate('/', { replace: true })
          cb()
        },
        (res) => {
          setError(res.error)
          cb()
        }
      )
    } else {
      auth.login(
        form as Omit<AuthUser, 'name'>,
        () => {
          navigate('/', { replace: true })
          cb()
        },
        (res) => {
          setError(res.error)
          cb()
        }
      )
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
