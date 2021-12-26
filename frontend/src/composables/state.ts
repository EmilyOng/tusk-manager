import { useState, useEffect } from 'react'
import { StateAPI } from 'api/state'
import { State } from 'types/state'

export function useStates(boardId: number | null) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const api = new StateAPI()
  const [states, setStates] = useState<State[]>([])

  function updateStates(states: State[]) {
    setStates(states)
  }

  useEffect(() => {
    if (!boardId) {
      return
    }
    setStates([])
    setLoading(true)
    api
      .getStates(boardId)
      .then((res) => {
        if (res.error) {
          setError(res.error)
        } else {
          setStates(res)
        }
      })
      .finally(() => setLoading(false))
    return () => {
      // Clean-up
      setLoading(false)
      setError('')
      setStates([])
    }
  }, [boardId])

  return {
    loading,
    error,
    states,
    updateStates
  }
}
