import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export function useSession() {
  const [state, setState] = useState({ loading: true, session: null })

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setState({ loading: false, session: data.session }))
    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      setState({ loading: false, session }),
    )
    return () => data.subscription.unsubscribe()
  }, [])

  return state
}
