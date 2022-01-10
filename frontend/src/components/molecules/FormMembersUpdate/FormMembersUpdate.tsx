import React, { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { faRedo, faTimes } from '@fortawesome/free-solid-svg-icons'
import Button from 'components/atoms/Button'
import './FormMembersUpdate.scoped.css'
import { Role } from 'generated/types'
import { Roles } from 'utils/role'
import { AuthUser, MemberProfile } from 'generated/models'
import Avatar from 'components/molecules/Avatar'
import DropdownSelect from 'components/molecules/DropdownSelect'

type Props = {
  members: MemberProfile[]
  me: AuthUser | null
  events: {
    onSubmit: (members: MemberProfile[], cb: () => void) => any
  }
}

interface EditableMemberProfile extends MemberProfile {
  deleted: boolean
  editable: boolean // Whether the member profile can be edited by the current user
}

const FormMembersUpdate: React.FC<Props> = ({
  members: members_,
  me,
  events
}) => {
  const [submitting, setSubmitting] = useState(false)
  const meMember = useMemo(
    () => members_.find((m) => m.profile.id === me?.id),
    [members_]
  )
  const [members, setMembers] = useState<EditableMemberProfile[]>([])

  useEffect(() => {
    setMembers(
      members_.map((member) => {
        return {
          ...member,
          // Only owners can edit others' role, and owner cannot edit themselves.
          editable: meMember?.role === Role.Owner && member.role !== Role.Owner,
          deleted: false
        }
      })
    )
  }, [members_])
  useEffect(() => {
    return () => {
      // Clean-up
      setSubmitting(false)
      setMembers([])
    }
  }, [])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    events.onSubmit(members, () => setSubmitting(false))
  }

  function onToggleDeleteMemberProfile(memberId: number) {
    setMembers(
      members.map((member) =>
        member.id === memberId
          ? { ...member, deleted: !member.deleted }
          : member
      )
    )
  }

  function onChangeMemberRole(memberId: number, role: Role) {
    setMembers(
      members.map((member) =>
        member.id === memberId ? { ...member, role } : member
      )
    )
  }

  function orderedRoleItems(currRole?: Role) {
    // Do not need to consider Owner role
    const roleItems = Roles.filter((role) => role !== Role.Owner).map(
      (role) => {
        return <div key={role}>{role}</div>
      }
    )

    if (!currRole) {
      return roleItems
    }

    roleItems.sort((a, b) => {
      const aKey = a.key as Role
      const bKey = b.key as Role
      if (aKey === currRole) {
        return -1
      }
      if (bKey === currRole) {
        return 1
      }
      return 0
    })
    return roleItems
  }

  return (
    <form className="control" onSubmit={onSubmit}>
      <p className="has-text-weight-bold">Update board members</p>
      <div className="members-container">
        {members.map((member) => (
          <div
            key={member.id}
            className={clsx({
              'form-fields': true,
              'deleted-field': member.deleted
            })}
          >
            <div className="member-info">
              <Avatar name={member.profile.name} />
              <span>
                {member.profile.name} ({member.profile.email})
              </span>
            </div>
            {member.editable ? (
              <DropdownSelect
                items={orderedRoleItems(member.role)}
                events={{
                  onSelect: (key) => onChangeMemberRole(member.id, key as Role)
                }}
              />
            ) : (
              <span>{member.role}</span>
            )}
            {member.editable && (
              <Button
                className="is-danger is-inverted"
                icon={member.deleted ? faRedo : faTimes}
                events={{
                  onClick: () => onToggleDeleteMemberProfile(member.id)
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="control form-control">
        <Button
          type="submit"
          className={clsx({
            'is-link': true,
            'is-loading': submitting
          })}
          attr={{ disabled: submitting }}
          label="Save Changes"
        />
      </div>
    </form>
  )
}

export default FormMembersUpdate
