import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { MemberProfile } from 'generated/models'
import { Role } from 'generated/types'
import { selectMe } from 'store/me'
import FormMembersShare, {
  Form as ShareForm_
} from 'components/molecules/FormMembersShare'
import FormMembersUpdate, {
  EditableMemberProfile
} from 'components/molecules/FormMembersUpdate'

export type ShareForm = ShareForm_

type Props = {
  boardId: number
  members: MemberProfile[]
  events: {
    onShare: (form: ShareForm, cb: () => void) => any
    onUpdateSharings: (members: EditableMemberProfile[], cb: () => void) => any
  }
}

const FormMembersManage: React.FC<Props> = ({
  boardId,
  members: members_,
  events
}) => {
  const { user: me } = useSelector(selectMe)
  const [canUpdateSharings, setCanUpdateSharings] = useState(false)
  useEffect(() => {
    const meMember = members_.find((m) => m.profile.id === me?.id)
    setCanUpdateSharings(meMember?.role === Role.Owner)
    return () => {
      setCanUpdateSharings(false)
    }
  }, [members_])

  return (
    <div>
      {canUpdateSharings && (
        <>
          <FormMembersShare
            boardId={boardId}
            events={{ onSubmit: events.onShare }}
          />
          <hr />
        </>
      )}
      <FormMembersUpdate
        members={members_}
        me={me}
        events={{ onSubmit: events.onUpdateSharings }}
      />
    </div>
  )
}

export default FormMembersManage
