import { StateAPI } from 'api/state'
import { StatePrimitive } from 'generated/models'
import { useState, useEffect } from 'react'

export function useStates(boardId: number | null) {
  const [loading, setLoading] = useState(false)

  const api = new StateAPI()
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
