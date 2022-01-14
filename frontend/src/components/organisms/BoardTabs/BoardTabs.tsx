import {
  faHome,
  faPlus,
  faSignOutAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { AuthAPI } from 'api/auth'
import { BoardAPI } from 'api/board'
import { MemberAPI } from 'api/member'
import clsx from 'clsx'
import React, { Key, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { MemberProfile } from 'generated/models'
import { selectBoards, setCurrentBoardId, updateBoards } from 'store/boards'
import { resetMe, selectMe } from 'store/me'
import { useMediaQuery } from 'utils/mediaQuery'
import { NotificationType, useNotification } from 'composables/notification'
import Button from 'components/atoms/Button'
import DropdownMenu from 'components/molecules/DropdownMenu'
import DropdownSelect from 'components/molecules/DropdownSelect'
import { EditableMemberProfile } from 'components/molecules/FormMembersUpdate'
import LoadingBar from 'components/molecules/LoadingBar'
import ModalCard from 'components/molecules/ModalCard'
import TabItem from 'components/molecules/TabItem'
import Tabs from 'components/molecules/Tabs'
import BoardHeader from 'components/organisms/BoardHeader'
import FormBoardCreate, { Form } from '../FormBoardCreate'
import { ShareForm } from '../FormMembersManage'
import './BoardTabs.scoped.css'

function useBoardCreateModal() {
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

const BoardTabs: React.FC = () => {
  const dispatch = useDispatch()
  const { isSmall } = useMediaQuery()

  const {
    boards,
    loading: boardsLoading,
    currentBoardId
  } = useSelector(selectBoards)
  const { user: me } = useSelector(selectMe)

  const boardAPI = new BoardAPI()
  const memberAPI = new MemberAPI()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    visible: isBoardCreating,
    openCard: openBoardCreateCard,
    closeCard: closeBoardCreateCard
  } = useBoardCreateModal()

  useEffect(() => {
    if (boardsLoading) {
      return
    }
    // Redirect to the correct tab when boards are loaded
    const boardId_ = location.pathname.replace('/', '')
    const boardId = boardId_ ? parseInt(boardId_) : null
    if (!currentBoardId) {
      if (boardId) {
        dispatch(setCurrentBoardId(boardId))
      } else {
        navigate('/')
      }
      return
    }

    selectBoard(currentBoardId)
  }, [boardsLoading])

  function selectBoard(id: number | null) {
    dispatch(setCurrentBoardId(id))
    if (!id) {
      navigate('/')
      return
    }
    navigate(`/${id}`)
  }

  function createBoard(form: Form, cb: () => void) {
    boardAPI
      .createBoard({
        ...form,
        userId: me!.id
      })
      .then((res) => {
        if (res.error) {
          return
        }
        dispatch(updateBoards([...boards, res.data]))
        // Navigate to the new board
        selectBoard(res.data.id)
        closeBoardCreateCard()
        useNotification({
          type: NotificationType.Success,
          message: 'Board has been created successfully'
        })
      })
      .finally(() => cb())
  }

  function editBoard(form: Form, cb: () => void) {
    boardAPI
      .editBoard({ ...form, id: form.id!, userId: me!.id })
      .then((res) => {
        if (res.error) {
          return
        }
        dispatch(
          updateBoards(
            boards.map((board) => (board.id === res.data.id ? res.data : board))
          )
        )
      })
      .finally(() => cb())
  }

  function shareBoard(
    sharing: ShareForm,
    cb: (newMember?: MemberProfile) => void
  ) {
    memberAPI.createMember(sharing).then((res) => {
      if (res.error) {
        cb()
        return
      }
      useNotification({
        type: NotificationType.Success,
        message: 'Board has been shared with ' + res.data.profile.name
      })
      cb(res.data)
    })
  }

  function updateSharings(
    members: EditableMemberProfile[],
    cb: (updatedMembers?: MemberProfile[]) => void
  ) {
    Promise.all(
      members.map((member) =>
        member.deleted
          ? memberAPI.deleteMember({ id: member.id })
          : memberAPI.editMember({
              id: member.id,
              role: member.role
            })
      )
    ).then((results) => {
      const success = results.every((result) => !result.error)
      if (!success) {
        cb()
        return
      }
      cb(
        members.reduce((acc, member) => {
          if (member.deleted) {
            return acc
          }
          acc.push({
            id: member.id,
            role: member.role,
            profile: member.profile
          })
          return acc
        }, [] as MemberProfile[])
      )
    })
  }

  function deleteBoard(boardId: number, cb: () => void) {
    boardAPI
      .deleteBoard({ id: boardId })
      .then((res) => {
        if (res.error) {
          return
        }
        dispatch(updateBoards(boards.filter((board) => board.id !== boardId)))
        useNotification({
          type: NotificationType.Success,
          message: 'Board has been deleted successfully'
        })
      })
      .finally(() => {
        cb()
        selectBoard(null)
      })
  }

  function logout() {
    const auth = new AuthAPI()
    useNotification({
      type: NotificationType.Info,
      message: 'Logging you out'
    })
    auth.logout().then((res) => {
      if (res.error) {
        return
      }
      dispatch(resetMe())
      useNotification({
        type: NotificationType.Info,
        message: 'Goodbye!'
      })
      navigate('/')
    })
  }

  const loading = useMemo(() => boardsLoading, [boardsLoading])

  return (
    <div className="board-tabs">
      <ModalCard
        visible={isBoardCreating}
        title="Create a new board"
        events={{ onClose: closeBoardCreateCard }}
      >
        <FormBoardCreate
          events={{
            onSubmit: createBoard,
            onCancel: closeBoardCreateCard
          }}
        />
      </ModalCard>
      <div className="tabs-container">
        <DropdownMenu
          closeOnContentClick={false}
          items={[
            <div key="" className="me-info">
              <span className="account-info">Account Information</span>
              <span>
                {me?.name} ({me?.email})
              </span>
              <Button
                icon={faSignOutAlt}
                label="Logout"
                events={{ onClick: logout }}
              />
            </div>
          ]}
          trigger={<Button className="is-ghost is-medium" icon={faUser} />}
        />
        <Button
          className={clsx({
            'is-ghost': true,
            'is-medium': true,
            'is-active': !currentBoardId
          })}
          icon={faHome}
          events={{ onClick: () => selectBoard(null) }}
        />
        {loading ? (
          <LoadingBar />
        ) : isSmall ? (
          <DropdownSelect
            initial={currentBoardId?.toString() as Key}
            items={boards.map((board) => {
              return <span key={board.id}>{board.name}</span>
            })}
            events={{
              onSelect: (key: Key | null) => selectBoard(key as number)
            }}
          />
        ) : (
          <Tabs>
            {boards.map((board) => {
              return (
                <TabItem
                  key={board.id}
                  className={clsx({ 'board-tab': true, [board.color]: true })}
                  label={board.name}
                  selected={board.id === currentBoardId}
                  events={{ onClick: () => selectBoard(board.id) }}
                />
              )
            })}
          </Tabs>
        )}

        <Button
          className="is-ghost is-medium create-board-button"
          icon={faPlus}
          events={{ onClick: openBoardCreateCard }}
        />
      </div>
      {currentBoardId && (
        <BoardHeader
          boardId={currentBoardId}
          events={{
            onEditBoard: editBoard,
            onDeleteBoard: deleteBoard,
            onShareBoard: shareBoard,
            onUpdateSharings: updateSharings
          }}
        />
      )}
    </div>
  )
}

export default BoardTabs
