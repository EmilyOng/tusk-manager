import React, { ChangeEvent, FormEvent, useState } from 'react'
import InputField from '../molecules/InputField'
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'

export type Form = {
  name?: string
  email: string
  password: string
}

export enum FormMode {
  SignUp = 'SignUp',
  Login = 'Login'
}

type Props = {
  mode: FormMode
  onSubmit: (form: Form) => any
}

const FormAuthentication: React.FC<Props> = ({ mode, onSubmit, children }) => {
  const isSignUp = mode === FormMode.SignUp
  const [form, setForm] = useState<Form>({
    ...(isSignUp ? { name: '' } : {}),
    email: '',
    password: ''
  })

  function onSubmit_(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSubmit(form)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value,
    })
  }
  return (
    <form className="control" onSubmit={onSubmit_}>
      {isSignUp && <InputField
        name="name"
        label="Name"
        type="text"
        icon={faUser}
        value={form.name!}
        events={{ onChange: onInputChange }}
      />}
      <InputField
        name="email"
        label="Email"
        type="email"
        icon={faEnvelope}
        value={form.email}
        events={{ onChange: onInputChange }}
      />
      <InputField
        name="password"
        label="Password"
        type="password"
        icon={faLock}
        value={form.password}
        events={{ onChange: onInputChange }}
      />
      <div className="control">
        <button type="submit" className="button is-light is-link">
          {isSignUp ? "Sign Up" : "Login" }
        </button>
      </div>
      {children}
    </form>
  )
}

export default FormAuthentication
