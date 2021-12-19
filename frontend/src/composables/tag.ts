import { useState, useEffect } from 'react'
import { CreatingTag, TagAPI } from 'api/tag'
import { TagPrimitive } from 'types/tag'

export function useTags(boardId: number | null) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      .getTags(boardId)
      .then((res) => {
        if (res.error) {
          setError(res.error)
        } else {
          setTags(res)
        }
      })
      .finally(() => setLoading(false))
    return () => {
      // Clean-up
      setLoading(false)
      setError('')
      setTags([])
    }
  }, [boardId])

  return {
    loading,
    error,
    tags,
    updateTags
  }
}

export function useCreateTag() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const api = new TagAPI()

  function createTag(tag: CreatingTag) {
    setLoading(true)
    return api
      .createTag(tag)
      .then((res) => {
        if (res.error) {
          setError(res.error)
          return null
        }
        return res
      })
      .finally(() => setLoading(false))
  }

  return {
    loading,
    error,
    createTag
  }
}
