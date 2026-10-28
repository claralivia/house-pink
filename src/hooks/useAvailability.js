import { useCallback, useMemo } from 'react'
import { fetchAvailability } from '../lib/api.js'
import { buildDays } from '../lib/slots.js'
import { useAsync } from './useAsync.js'

export function useAvailability(pro, duration) {
  const load = useCallback(() => fetchAvailability(pro), [pro])
  const { data, error, loading, reload } = useAsync(load, pro?.id)

  const days = useMemo(
    () =>
      data ? buildDays({ availability: data, duration, windowDays: pro.booking_window_days }) : [],
    [data, duration, pro],
  )

  return { days, error, loading, reload }
}
