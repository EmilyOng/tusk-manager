import { useState, useEffect } from 'react'
import { State, Task } from 'types/task'
import { TaskAPI } from 'api/task'

export function useTasks(boardId: number | null) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const api = new TaskAPI()
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    if (!boardId) {
      return
    }
    setTasks([])
    setLoading(true)
    api
      .getTasks(boardId)
      .then((res) => {
        if (res.error) {
          setError(res.error)
        } else {
          setTasks(res)
        }
      })
      .finally(() => setLoading(false))
    return () => {
      // Clean-up
      setLoading(false)
      setError('')
      setTasks([])
    }
  }, [boardId])

  return {
    loading,
    error,
    tasks
  }
}

export type TasksByState = Record<State, Task[]>

export function orderTasksByState(tasks: Task[]) {
  const orderedTasks: TasksByState = {
    [State.Completed]: [],
    [State.InProgress]: [],
    [State.Unstarted]: []
  }
  tasks.forEach((task) => orderedTasks[task.state].push(task))
  return orderedTasks
}
