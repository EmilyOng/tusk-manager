import { useState, useEffect } from 'react'
import { BoardPrimitive } from 'types/board'
import { BoardAPI, CreatingBoard, EditingBoard } from 'api/board'

export function useBoards() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const api = new BoardAPI()
  const [boards, setBoards] = useState<BoardPrimitive[]>([])

  function updateBoards(boards: BoardPrimitive[]) {
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
    boards,
    updateBoards
  }
}

export function useCreateBoard() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const api = new BoardAPI()

  function createBoard(board: CreatingBoard) {
    setLoading(true)
    return api
      .createBoard(board)
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
    createBoard
  }
}

export function useBoard(boardId: number | null) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      .getBoard(boardId)
      .then((res) => {
        if (res.error) {
          setError(res.error)
        } else {
          setBoard(res)
        }
      })
      .finally(() => setLoading(false))
    return () => {
      // Clean-up
      setLoading(false)
      setError('')
      setBoard(undefined)
    }
  }, [boardId])

  return {
    loading,
    error,
    board,
    updateBoard
  }
}

export function useEditBoard() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const api = new BoardAPI()

  function editBoard(board: EditingBoard) {
    setLoading(true)
    return api
      .editBoard(board)
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
    editBoard
  }
}

export function useDeleteBoard() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const api = new BoardAPI()

  function deleteBoard(boardId: number) {
    setLoading(true)
    return api
      .deleteBoard(boardId)
      .then((res) => {
        if (res.error) {
          setError(res.error)
          return null
        }
        return boardId
      })
      .finally(() => setLoading(false))
  }

  return {
    loading,
    error,
    deleteBoard
  }
}
