import { useState, useEffect } from 'react'
import { SelectableBoard } from 'types/board'
import { BoardAPI } from 'api/board'

export function useSelectableBoards() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const api = new BoardAPI()
  const [boards, setBoards] = useState<SelectableBoard[]>([])

  function updateBoards(boards: SelectableBoard[]) {
    setBoards(boards)
  }

  useEffect(() => {
    setLoading(true)
    api
      .getBoards()
      .then((res) => {
        if (res.error) {
          setError(res.error)
        } else {
          setBoards(
            res.map((board) => {
              return {
                ...board,
                selected: false
              }
            })
          )
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
    boards,
    updateBoards
  }
}
