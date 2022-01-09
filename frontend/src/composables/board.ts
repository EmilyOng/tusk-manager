import { useState, useEffect } from 'react'
import { BoardAPI } from 'api/board'
import {
  BoardPrimitive,
  StatePrimitive,
  TagPrimitive,
  Task
} from 'generated/models'

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

export function useBoardStates(boardId: number | null) {
  const [loading, setLoading] = useState(false)

  const api = new BoardAPI()
  const [states, setStates] = useState<StatePrimitive[]>([])

  function updateStates(states: StatePrimitive[]) {
    setStates(states)
  }

  useEffect(() => {
    if (!boardId) {
      return
    }
    setStates([])
    setLoading(true)
    api
      .getStates({ boardId })
      .then((res) => {
        if (!res.error) {
          setStates(res.data)
        }
      })
      .finally(() => setLoading(false))
    return () => {
      // Clean-up
      setLoading(false)
      setStates([])
    }
  }, [boardId])

  return {
    loading,
    states,
    updateStates
  }
}

export function useBoardTags(boardId: number | null) {
  const [loading, setLoading] = useState(false)

  const api = new BoardAPI()
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

export function useBoardTasks(boardId: number | null) {
  const [loading, setLoading] = useState(false)

  const api = new BoardAPI()
  const [tasks, setTasks] = useState<Task[]>([])

  function updateTasks(tasks: Task[]) {
    setTasks(tasks)
  }

  useEffect(() => {
    if (!boardId) {
      return
    }
    setTasks([])
    setLoading(true)
    api
      .getTasks({ boardId })
      .then((res) => {
        if (!res.error) {
          setTasks(res.data)
        }
      })
      .finally(() => setLoading(false))
    return () => {
      // Clean-up
      setLoading(false)
      setTasks([])
    }
  }, [boardId])

  return {
    loading,
    tasks,
    updateTasks
  }
}
