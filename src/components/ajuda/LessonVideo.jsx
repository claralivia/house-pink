import { useCallback } from 'react'
import { useAsync } from '../../hooks/useAsync.js'
import { fetchHelpVideo } from '../../lib/api.js'

export default function LessonVideo({ audience, file }) {
  const load = useCallback(() => fetchHelpVideo(audience, file), [audience, file])
  const video = useAsync(load, `${audience}:${file}`)

  if (!video.data) return null

  return (
    <video className="app-lesson-video" controls playsInline preload="metadata" src={video.data}>
      Seu aparelho não consegue abrir este vídeo. Siga o passo a passo abaixo.
    </video>
  )
}
