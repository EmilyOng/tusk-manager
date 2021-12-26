import { useEffect, useState } from 'react'

export function useMediaQuery() {
  const [isSmall, setIsSmall] = useState(false)
  // https://bulma.io/documentation/overview/responsiveness/
  const match = window.matchMedia('(max-width: 768px)')

  function onMediaQueryChange(query: MediaQueryListEvent | MediaQueryList) {
    setIsSmall(query.matches)
  }
  match.addEventListener('change', onMediaQueryChange)

  useEffect(() => {
    onMediaQueryChange(match)
    return () => {
      // Clean-up
      setIsSmall(false)
    }
  })
  return {
    isSmall
  }
}
