import { PROS } from '../data/site.js'
import { fetchTeam } from '../lib/api.js'
import { useAsync } from './useAsync.js'

// Mostra os dados padrão na hora e troca pelos editados pelas profissionais quando chegam.
export const useTeam = () => useAsync(fetchTeam, 'team').data ?? PROS
