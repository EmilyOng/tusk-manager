import { useState, useEffect } from 'react'
import { BoardAPI } from 'api/board'
import { BoardPrimitive } from 'generated/models'

export function useBoard(boardId: number | null) {
  const [loading, setLoading] = useState(false)

  const api = new BoardAPI()
  const [board, setBoard] = useState<BoardPrimitive>()

  function updateBoard(board: BoardPrimitive) {
    setBoard(board)
  }

  useEffect(() => {
    if (!boardId) {
      return
    }
    setLoading(true)
    api
      .getBoard({ id: boardId })
      .then((res) => {
        if (!res.error) {
          setBoard(res.data)
        }
      })
      .finally(() => setLoading(false))
    return () => {
      // Clean-up
      setLoading(false)
      setBoard(undefined)
    }
  }, [boardId])

  return {
    loading,
    board,
    updateBoard
  }
}
