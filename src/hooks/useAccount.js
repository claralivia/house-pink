import { fetchMyProfessional } from '../lib/api.js'
import { useAsync } from './useAsync.js'
import { useSession } from './useSession.js'

const roleOf = (professional) => (professional ? 'pro' : 'client')

export function useAccount() {
  const { loading: sessionLoading, session } = useSession()
  const profile = useAsync(fetchMyProfessional, session?.user.id)
  const loading = sessionLoading || profile.loading

  return {
    loading,
    session,
    professional: profile.data,
    role: session && !loading ? roleOf(profile.data) : null,
  }
}
