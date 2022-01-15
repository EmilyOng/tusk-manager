import {
  faEdit,
  faTag,
  faTrash,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BoardPrimitive, MemberProfile } from 'generated/models'
import {
  getMembers,
  selectMeMember,
  selectMembers,
  updateMembers
} from 'store/members'
import { useMediaQuery } from 'utils/mediaQuery'
import { canEdit } from 'utils/role'
import { useBoard } from 'composables/board'
import Button from 'components/atoms/Button'
import Avatar from 'components/molecules/Avatar'
import DropdownMenu from 'components/molecules/DropdownMenu'
import { EditableMemberProfile } from 'components/molecules/FormMembersUpdate'
import ModalCard from 'components/molecules/ModalCard'
import FormBoardEdit, { Form } from '../FormBoardEdit'
import FormMembersManage, { ShareForm } from '../FormMembersManage'
import './BoardHeader.scoped.css'

type Props = {
  boardId: number | null
  events: {
    onEditBoard: (form: Form, cb: () => void) => any
    onDeleteBoard: (boardId: number, cb: () => void) => any
    onShareBoard: (
      sharing: ShareForm,
      cb: (newMember?: MemberProfile) => void
    ) => any
    onUpdateSharings: (
      members: EditableMemberProfile[],
      cb: (updatedMembers?: MemberProfile[]) => void
    ) => any
  }
}

function useBoardEditModal() {
  const [visible, setVisible] = useState(false)
  const [board, setBoard] = useState<BoardPrimitive>()

  function openCard(board: BoardPrimitive) {
    setBoard(board)
    setVisible(true)
  }
  function closeCard() {
    setBoard(undefined)
    setVisible(false)
  }
  return {
    board,
    visible,
    openCard,
    closeCard
  }
}

function useBoardDeleteModal() {
  const [visible, setVisible] = useState(false)
  const [board, setBoard] = useState<BoardPrimitive>()

  function openCard(board: BoardPrimitive) {
    setBoard(board)
    setVisible(true)
  }
  function closeCard() {
    setBoard(undefined)
    setVisible(false)
  }
  return {
    board,
    visible,
    openCard,
    closeCard
  }
}

function useMembersManageModal() {
  const [visible, setVisible] = useState(false)

  function openCard() {
    setVisible(true)
  }
  function closeCard() {
    setVisible(false)
  }
  return {
    visible,
    openCard,
    closeCard
  }
}

const BoardHeader: React.FC<Props> = ({ boardId, events }) => {
  const navigate = useNavigate()
  const { isSmall } = useMediaQuery()
  const dispatch = useDispatch()
  const { board, updateBoard } = useBoard(boardId)
  const [meCanEdit, setMeCanEdit] = useState(false)

  useEffect(() => {
    if (!boardId) {
      return
    }
    dispatch(getMembers(boardId))
  }, [boardId])

  const { members: memberProfiles } = useSelector(selectMembers)
  const meMember = useSelector(selectMeMember)

  const otherMemberProfiles = memberProfiles.filter(
    (m) => m.id !== meMember?.id
  )

  useEffect(() => {
    setMeCanEdit(canEdit(meMember?.role))
  }, [meMember])

  function onEditBoard(form: Form, cb: () => void) {
    events.onEditBoard(form, () => {
      cb()
      closeBoardEditCard()
      updateBoard({ ...form, id: form.id! })
    })
  }

  const [deletingBoard, setDeletingBoard] = useState(false)
  function onDeleteBoard(boardId: number) {
    setDeletingBoard(true)
    events.onDeleteBoard(boardId, () => {
      setDeletingBoard(false)
      closeBoardDeleteCard()
    })
  }

  function onShareBoard(sharing: ShareForm, cb: () => void) {
    events.onShareBoard(sharing, (newMember) => {
      cb()
      if (!newMember) {
        return
      }
      dispatch(updateMembers([...memberProfiles, newMember]))
    })
  }

  function onUpdateSharings(members: EditableMemberProfile[], cb: () => void) {
    events.onUpdateSharings(members, (updatedMembers) => {
      cb()
      if (!updatedMembers) {
        return
      }
      dispatch(updateMembers(updatedMembers))
    })
  }

  const {
    board: openedBoardEdit,
    visible: isBoardEditing,
    openCard: openBoardEditCard,
    closeCard: closeBoardEditCard
  } = useBoardEditModal()

  const {
    board: openedBoardDelete,
    visible: isBoardDeleting,
    openCard: openBoardDeleteCard,
    closeCard: closeBoardDeleteCard
  } = useBoardDeleteModal()

  const {
    visible: isMembersManaging,
    openCard: openMembersManageCard,
    closeCard: closeMembersManageCard
  } = useMembersManageModal()

  return (
    <div className="board-header">
      <ModalCard
        visible={isMembersManaging}
        title="Manage members"
        events={{ onClose: closeMembersManageCard }}
      >
        <FormMembersManage
          boardId={boardId!}
          members={memberProfiles}
          events={{
            onShare: onShareBoard,
            onUpdateSharings
          }}
        />
      </ModalCard>
      {openedBoardEdit && (
        <ModalCard
          visible={isBoardEditing}
          title="Edit board"
          events={{ onClose: closeBoardEditCard }}
        >
          <FormBoardEdit
            board={openedBoardEdit}
            events={{
              onSubmit: onEditBoard,
              onCancel: closeBoardEditCard
            }}
          />
        </ModalCard>
      )}
      {openedBoardDelete && (
        <ModalCard
          visible={isBoardDeleting}
          title="Delete board"
          events={{ onClose: closeBoardDeleteCard }}
        >
          <div>
            Are you sure you want to delete &quot;{openedBoardDelete.name}
            &quot;?
          </div>
          <div>This action is irreversible.</div>
          <div className="form-control">
            <Button
              type="button"
              className="is-light"
              label="Cancel"
              events={{ onClick: () => closeBoardDeleteCard() }}
            />
            <Button
              type="submit"
              className={clsx({
                'is-danger': true,
                'is-loading': deletingBoard
              })}
              attr={{ disabled: deletingBoard }}
              label="Delete"
              events={{ onClick: () => onDeleteBoard(openedBoardDelete.id) }}
            />
          </div>
        </ModalCard>
      )}
      {board && (
        <div className="board-information">
          <h1 className="title">{board.name}</h1>
          <div className="board-members">
            {!isSmall &&
              [meMember, ...otherMemberProfiles].map(
                (member) =>
                  member && (
                    <div
                      key={member.id}
                      className={clsx({
                        'member-avatar': true,
                        'is-me': meMember?.id === member.id
                      })}
                    >
                      <DropdownMenu
                        hoverable={true}
                        items={[
                          <div key="" className="member-info">
                            <span className="member-role">{member.role}</span>
                            <span>
                              {member.profile.name} ({member.profile.email})
                            </span>
                          </div>
                        ]}
                        trigger={<Avatar name={member.profile.name} />}
                      />
                    </div>
                  )
              )}
          </div>
          <div className="board-actions">
            <Button
              className="is-info is-light"
              icon={faTag}
              events={{ onClick: () => navigate(`/${board.id}/tags`) }}
            />
            <Button
              className="is-link is-light"
              icon={faUsers}
              events={{ onClick: openMembersManageCard }}
            />
            {meCanEdit && (
              <>
                <Button
                  className="is-link is-light"
                  icon={faEdit}
                  events={{ onClick: () => openBoardEditCard(board) }}
                />
                <Button
                  className="is-danger is-light"
                  icon={faTrash}
                  events={{ onClick: () => openBoardDeleteCard(board) }}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BoardHeader
