import { useState, useEffect } from 'react'
import { Board } from 'types/board'
import { BoardAPI } from 'api/board'

export function useBoards() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const api = new BoardAPI()
  const [boards, setBoards] = useState<Board[]>([])

  useEffect(() => {
    setLoading(true)
    api
      .getBoards()
      .then((res) => {
        if (res.error) {
          setError(res.error)
        } else {
          setBoards(res)
        }
      })
      .finally(() => setLoading(false))
    return () => {
      // Clean-up
      setLoading(false)
      setError('')
      setBoards([])
    }
  }, [])

  return {
    loading,
    error,
    boards
  }
}
