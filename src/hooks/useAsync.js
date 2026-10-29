import { useCallback, useEffect, useState } from 'react'

export function useAsync(load, key) {
  const [version, setVersion] = useState(0)
  const [result, setResult] = useState({})
  const requestKey = `${key}:${version}`
  const sameKey = result.key === key
  const fresh = result.requestKey === requestKey

  useEffect(() => {
    if (!key) return undefined
    let active = true
    load().then(
      (data) => active && setResult({ key, requestKey, data }),
      (error) => active && setResult({ key, requestKey, error }),
    )
    return () => {
      active = false
    }
  }, [load, key, requestKey])

  const reload = useCallback(() => setVersion((value) => value + 1), [])

  return {
    data: sameKey ? result.data : undefined,
    error: fresh ? result.error : undefined,
    loading: Boolean(key) && !sameKey,
    reload,
  }
}
