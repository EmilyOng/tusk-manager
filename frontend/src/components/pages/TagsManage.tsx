import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import Icon from 'components/atoms/Icon'
import TagItem from 'components/atoms/TagItem'
import LoadingBar from 'components/molecules/LoadingBar'
import TagItemAddon from 'components/molecules/TagItemAddon'
import { useTags } from 'composables/tag'
import { useSelector } from 'react-redux'
import { selectBoards } from 'store/boards'

function TagsManage() {
  const { currentBoardId } = useSelector(selectBoards)
  const { loading, tags } = useTags(currentBoardId)

  return (
    <div>
      {loading ? (
        <LoadingBar />
      ) : (
        <div>
          {tags.map((tag) => (
            <span key={tag.id}>
              <TagItem name={tag.name} color={tag.color}>
                <TagItemAddon events={{ onClick: () => {} }}>
                  <Icon icon={faEdit} />
                </TagItemAddon>
                <TagItemAddon events={{ onClick: () => {} }}>
                  <Icon icon={faTrash} />
                </TagItemAddon>
              </TagItem>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default TagsManage
