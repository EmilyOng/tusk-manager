import { useState, useEffect } from 'react'
import { TaskAPI } from 'api/task'
import { Task } from 'generated/models'

export function useTasks(boardId: number | null) {
  const [loading, setLoading] = useState(false)

  const api = new TaskAPI()
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
