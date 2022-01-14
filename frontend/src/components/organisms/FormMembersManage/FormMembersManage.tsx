import React from 'react'
import { MemberProfile } from 'generated/models'
import FormMembersShare, {
  Form as ShareForm_
} from 'components/molecules/FormMembersShare'
import FormMembersUpdate, {
  EditableMemberProfile
} from 'components/molecules/FormMembersUpdate'
import { useSelector } from 'react-redux'
import { selectMe } from 'store/me'

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

  return (
    <div>
      <FormMembersShare
        boardId={boardId}
        events={{ onSubmit: events.onShare }}
      />
      <hr />
      <FormMembersUpdate
        members={members_}
        me={me}
        events={{ onSubmit: events.onUpdateSharings }}
      />
    </div>
  )
}

export default FormMembersManage
