import { fetchCatalog } from '../lib/api.js'
import { useAsync } from './useAsync.js'

export const useCatalog = () => useAsync(fetchCatalog, 'catalog')
