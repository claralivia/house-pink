import { useCallback, useState } from 'react'
import { useAsync } from '../../hooks/useAsync.js'
import { fetchOwnTypes, uploadTypePhoto } from '../../lib/api.js'
import Notice from '../app/Notice.jsx'

function TypeRow({ type, onUploaded }) {
  const [state, setState] = useState('idle')
  const idleLabel = type.image_url ? 'Trocar foto' : 'Adicionar foto'
  const buttonLabel = state === 'sending' ? 'Enviando...' : idleLabel

  const pick = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    setState('sending')
    try {
      await uploadTypePhoto(type.id, file)
      setState('idle')
      onUploaded()
    } catch {
      setState('error')
    }
  }

  return (
    <li className="app-row app-photo-row">
      {type.image_url ? (
        <img className="app-thumb" src={type.image_url} alt="" />
      ) : (
        <span className="app-thumb empty">Sem foto</span>
      )}
      <div>
        <div className="app-name">{type.name}</div>
        <div className="app-item-meta">{type.services.name}</div>
        {state === 'error' ? <div className="app-item-meta">Não foi possível enviar.</div> : null}
      </div>
      <label className="app-btn secondary app-upload">
        {buttonLabel}
        <input type="file" accept="image/*" onChange={pick} disabled={state === 'sending'} hidden />
      </label>
    </li>
  )
}

export default function OwnServices({ professionalId }) {
  const load = useCallback(() => fetchOwnTypes(professionalId), [professionalId])
  const types = useAsync(load, professionalId)

  return (
    <>
      <p className="app-lead">Estas fotos aparecem para a cliente na hora de escolher o tipo.</p>
      {types.loading ? <p className="app-lead">Carregando...</p> : null}
      {types.error ? <Notice tone="danger" title="Não foi possível carregar os serviços" /> : null}
      <ul className="app-group app-spaced">
        {(types.data ?? []).map((type) => (
          <TypeRow key={type.id} type={type} onUploaded={types.reload} />
        ))}
      </ul>
    </>
  )
}
