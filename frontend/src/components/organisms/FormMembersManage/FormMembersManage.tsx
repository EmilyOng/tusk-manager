import React from 'react'
import { MemberProfile } from 'generated/models'
import FormMembersShare, {
  Form as ShareForm
} from 'components/molecules/FormMembersShare'
import FormMembersUpdate from 'components/molecules/FormMembersUpdate'
import { useSelector } from 'react-redux'
import { selectMe } from 'store/me'

type Props = {
  members: MemberProfile[]
  events: {
    onSubmit: (members: MemberProfile[], cb: () => void) => any
    onCancel: () => any
  }
}

const FormMembersManage: React.FC<Props> = ({ members: members_ }) => {
  const { user: me } = useSelector(selectMe)

  function onShare(form: ShareForm, cb: () => void) {
    console.log(form)
    cb()
  }

  function onUpdateSharings(members: MemberProfile[], cb: () => void) {
    console.log(members)
    cb()
  }

  return (
    <div>
      <FormMembersShare events={{ onSubmit: onShare }} />
      <hr />
      <FormMembersUpdate
        members={members_}
        me={me}
        events={{ onSubmit: onUpdateSharings }}
      />
    </div>
  )
}

export default FormMembersManage
