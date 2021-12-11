import { useState } from 'react'
import FormAuthentication, { Form, FormMode } from 'components/organisms/FormAuthentication'
import { RequestAPI } from 'api/request'
import Message from 'components/atoms/Message'
import clsx from 'clsx'
import './Authentication.css'

function Authentication() {
  const Request = new RequestAPI()
  const [error, setError] = useState('')
  const [mode, setMode] = useState<FormMode>(FormMode.SignUp)

  function onSubmit(form: Form) {
    function signup() {
      Request.post('http://localhost:5000/api/public/signup', {
        Name: form.name,
        Email: form.email,
        Password: form.password
      }).then((res) => {
        if (res.error) {
          setError(res.error)
        }
      })
    }

    function login() {
      Request.post('http://localhost:5000/api/public/login', {
        Email: form.email,
        Password: form.password
      }).then((res) => {
        if (res.error) {
          setError(res.error)
        } else {
          
        }
      })
    }

    if (mode === FormMode.SignUp) {
      signup()
    } else {
      login()
    }
  }

  return (
    <div className="box form-authentication">
      <div className="tabs is-fullwidth is-toggle">
        <ul>
          <li className={clsx({'is-active': mode === FormMode.SignUp})} onClick={() => setMode(FormMode.SignUp)}>
            <a><span>Sign Up</span></a>
          </li>
          <li className={clsx({'is-active': mode === FormMode.Login})} onClick={() => setMode(FormMode.Login)}>
            <a><span>Login</span></a>
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
