import { useState, useEffect } from 'react'
import { Category } from 'types/category'
import { CategoryAPI } from 'api/category'

export function useCategories() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const api = new CategoryAPI()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    setLoading(true)
    api.getCategories().then((res) => {
      if (res.error) {
        setError(res.error)
      } else {
        setCategories(res)
      }
    }).finally(() => setLoading(false))
  }, [])

  return {
    loading,
    error,
    categories
  }
}
