import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import InputField from '../molecules/InputField'
import Button from 'components/atoms/Button'

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
  onSubmit: (form: Form, cb: () => void) => any
}

const FormAuthentication: React.FC<Props> = ({ mode, onSubmit, children }) => {
  const isSignUp = mode === FormMode.SignUp
  const defaultForm = {
    name: '',
    email: '',
    password: ''
  }
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<Form>(defaultForm)

  useEffect(() => {
    setForm(defaultForm)
    return () => {
      setForm(defaultForm)
    }
  }, [mode])

  useEffect(() => {
    return () => {
      // Clean-up
      setSubmitting(false)
      setForm(defaultForm)
    }
  }, [])

  function onSubmit_(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    onSubmit(form, () => setSubmitting(false))
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value
    })
  }
  return (
    <form className="control" onSubmit={onSubmit_}>
      {isSignUp && (
        <InputField
          name="name"
          label="Name"
          type="text"
          icon={faUser}
          value={form.name!}
          events={{ onChange: onInputChange }}
        />
      )}
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
        <Button
          type="submit"
          className={clsx({
            'is-loading': submitting,
            'is-link': true
          })}
          attr={{ disabled: submitting }}
          label={isSignUp ? 'Sign Up' : 'Login'}
        />
      </div>
      {children}
    </form>
  )
}

export default FormAuthentication
