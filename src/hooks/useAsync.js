import { useCallback, useEffect, useState } from 'react'

export function useAsync(load, key) {
  const [version, setVersion] = useState(0)
  const [result, setResult] = useState({})
  const requestKey = `${key}:${version}`
  const current = result.key === requestKey ? result : {}

  useEffect(() => {
    if (!key) return undefined
    let active = true
    load().then(
      (data) => active && setResult({ key: requestKey, data }),
      (error) => active && setResult({ key: requestKey, error }),
    )
    return () => {
      active = false
    }
  }, [load, key, requestKey])

  const reload = useCallback(() => setVersion((value) => value + 1), [])

  return {
    data: current.data,
    error: current.error,
    loading: Boolean(key) && !current.key,
    reload,
  }
}
