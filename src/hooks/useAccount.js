import { useCallback } from 'react'
import { PROS } from '../data/site.js'
import { fetchMyClient, fetchMyProfessional } from '../lib/api.js'
import { useAsync } from './useAsync.js'
import { useSession } from './useSession.js'

const roleOf = (professional) => (professional ? 'pro' : 'client')
const firstOf = (name) => name?.trim().split(/\s+/)[0] || null

const personOf = (professional, client) => {
  const pro = professional && PROS[professional.key]
  return pro
    ? { name: pro.name, first: pro.first, photo: professional.photo, isPro: true }
    : { name: client?.name ?? '', first: firstOf(client?.name), photo: client?.photo_url ?? null }
}

export function useAccount() {
  const { loading: sessionLoading, session } = useSession()
  const userId = session?.user.id
  const profile = useAsync(fetchMyProfessional, userId)
  const loading = sessionLoading || profile.loading
  const role = session && !loading ? roleOf(profile.data) : null
  const loadClient = useCallback(() => fetchMyClient(userId), [userId])
  const client = useAsync(loadClient, role === 'client' ? userId : null)

  return {
    loading,
    session,
    professional: profile.data,
    reload: profile.reload,
    reloadClient: client.reload,
    role,
    person: session && !loading ? personOf(profile.data, client.data) : null,
  }
}
