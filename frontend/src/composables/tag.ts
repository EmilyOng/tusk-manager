import { useState, useEffect } from 'react'
import { TagAPI } from 'api/tag'
import { TagPrimitive } from 'generated/models'

export function useTags(boardId: number | null) {
  const [loading, setLoading] = useState(false)

  const api = new TagAPI()
  const [tags, setTags] = useState<TagPrimitive[]>([])

  function updateTags(tags: TagPrimitive[]) {
    setTags(tags)
  }

  useEffect(() => {
    if (!boardId) {
      return
    }
    setTags([])
    setLoading(true)
    api
      .getTags({ boardId })
      .then((res) => {
        if (!res.error) {
          setTags(res.data)
        }
      })
      .finally(() => setLoading(false))
    return () => {
      // Clean-up
      setLoading(false)
      setTags([])
    }
  }, [boardId])

  return {
    loading,
    tags,
    updateTags
  }
}
