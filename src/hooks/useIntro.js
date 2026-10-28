import { useEffect, useState } from 'react'
import { markIntroSeen, readIntroSeen } from '../lib/intro.js'

export const useIntro = () => {
  const [seen] = useState(readIntroSeen)

  useEffect(markIntroSeen, [])

  return seen
}
