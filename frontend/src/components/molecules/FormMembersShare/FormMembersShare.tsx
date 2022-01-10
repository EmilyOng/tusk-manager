import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import Button from 'components/atoms/Button'
import './FormMembersShare.scoped.css'
import { Role } from 'generated/types'
import { Roles } from 'utils/role'
import DropdownSelect from 'components/molecules/DropdownSelect'
import InputField from 'components/molecules/InputField'

export type Form = {
  email: string
  role: Role
}

type Props = {
  events: {
    onSubmit: (form: Form, cb: () => void) => any
  }
}

const FormMembersShare: React.FC<Props> = ({ events }) => {
  const [submitting, setSubmitting] = useState(false)
  const defaultInvitee: Form = { email: '', role: Role.Viewer }
  const [invitee, setInvitee] = useState(defaultInvitee)

  useEffect(() => {
    return () => {
      // Clean-up
      setSubmitting(false)
      setInvitee(defaultInvitee)
    }
  }, [])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    events.onSubmit(invitee, () => {
      setSubmitting(false)
      setInvitee(defaultInvitee)
    })
  }

  function onInviteeEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInvitee({ ...invitee, email: e.target.value })
  }

  return (
    <form className="control">
      <p className="has-text-weight-bold">Share board</p>
      <div className="invite-container">
        <div className="invitee-email-field">
          <InputField
            name="invite"
            type="text"
            label=""
            value={invitee.email}
            events={{ onChange: onInviteeEmailChange }}
          />
        </div>
        <div className="invitee-actions">
          <DropdownSelect
            items={Roles.filter((role) => role !== Role.Owner).map((role) => {
              return <div key={role}>{role}</div>
            })}
            events={{
              onSelect: (key) => setInvitee({ ...invitee, role: key as Role })
            }}
          />
          <Button
            type="submit"
            className={clsx({
              'is-link': true,
              'is-loading': submitting
            })}
            label="Share"
            events={{
              onClick: onSubmit
            }}
          />
        </div>
      </div>
    </form>
  )
}

export default FormMembersShare
