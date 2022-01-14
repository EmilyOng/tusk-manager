import { AuthAPI } from 'api/auth'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectMe, setMe } from 'store/me'
import Logo from 'assets/mosnter.png'
import { NotificationType, useNotification } from 'composables/notification'
import FormAuthentication, {
  Form,
  FormMode
} from 'components/organisms/FormAuthentication'
import './Authentication.scoped.css'

function Authentication() {
  const dispatch = useDispatch()
  const { user } = useSelector(selectMe)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user])

  const auth = new AuthAPI()
  const [mode, setMode] = useState<FormMode>(FormMode.SignUp)

  function onSubmit(form: Form, cb: () => void) {
    if (mode === FormMode.SignUp) {
      auth
        .signUp({ ...form, name: form.name! })
        .then((res) => {
          if (res.error) {
            return
          }
          dispatch(setMe(res.data))
          navigate('/', { replace: true })
          useNotification({
            type: NotificationType.Info,
            message: 'Welcome!'
          })
        })
        .finally(() => cb())
    } else {
      auth
        .login(form)
        .then((res) => {
          if (res.error) {
            return
          }
          dispatch(setMe(res.data))
          navigate('/', { replace: true })
        })
        .finally(() => cb())
    }
  }

  return (
    <div className="box form-authentication">
      <div className="header-container">
        <h1 className="title">Tusk Manager</h1>
        <img src={Logo} height={128} width={128} />
        <div className="logo-attribution">
          Icons made by{' '}
          <a
            href="https://www.flaticon.com/authors/smashicons"
            title="Smashicons"
          >
            Smashicons
          </a>{' '}
          from{' '}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
      </div>
      <div className="tabs is-fullwidth is-toggle select-form-mode">
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
      <FormAuthentication onSubmit={onSubmit} mode={mode} />
    </div>
  )
}

export default Authentication
