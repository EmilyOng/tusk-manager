import React, { ChangeEvent, FormEvent, useState } from 'react'
import InputField from '../molecules/InputField'
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import './form-sign-up.css'

export type SignUpForm = {
  name: string
  email: string
  password: string
}

type Props = {
  onSignUp: (form: SignUpForm) => any
}

const FormSignUp: React.FC<Props> = ({ onSignUp, children }) => {
  const [form, setForm] = useState<SignUpForm>({
    name: '',
    email: '',
    password: '',
  })

  function onSignUp_(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSignUp(form)
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value,
    })
  }
  return (
    <form className="box control form-sign-up" onSubmit={onSignUp_}>
      <InputField
        name="name"
        label="Name"
        type="text"
        icon={faUser}
        value={form.name}
        events={{ onChange: onInputChange }}
      />
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
        <button type="submit" className="button is-link">
          Sign Up
        </button>
      </div>
      {children}
    </form>
  )
}

export default FormSignUp
