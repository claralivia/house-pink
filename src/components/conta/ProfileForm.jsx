import { useState } from 'react'
import { updateMyClient, uploadClientPhoto } from '../../lib/api.js'
import { normalizeWhatsapp } from '../../lib/phone.js'
import AppButton from '../app/AppButton.jsx'
import Avatar from '../app/Avatar.jsx'
import Field from '../app/Field.jsx'
import Notice from '../app/Notice.jsx'

const localNumber = (whatsapp) => whatsapp.replace(/^55/, '')

export default function ProfileForm({ userId, client, onSaved }) {
  const [name, setName] = useState(client.name)
  const [whatsapp, setWhatsapp] = useState(localNumber(client.whatsapp))
  const [result, setResult] = useState(null)
  const [photoState, setPhotoState] = useState('idle')
  const idleLabel = client.photo_url ? 'Trocar a minha foto' : 'Adicionar a minha foto'
  const photoLabel = photoState === 'sending' ? 'Enviando...' : idleLabel

  const pickPhoto = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    setPhotoState('sending')
    try {
      await uploadClientPhoto(userId, client.id, file)
      setPhotoState('idle')
      onSaved()
    } catch {
      setPhotoState('error')
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    const normalized = normalizeWhatsapp(whatsapp)
    if (!normalized) return setResult('invalid')
    try {
      await updateMyClient(userId, { name: name.trim(), whatsapp: normalized })
      setResult('success')
      onSaved()
    } catch {
      setResult('danger')
    }
  }

  const notices = {
    success: <Notice tone="success" title="Dados salvos" />,
    danger: <Notice tone="danger" title="Não foi possível salvar" />,
  }

  return (
    <section>
      <div className="app-profile-photo">
        <Avatar src={client.photo_url} name={client.name} size="xl" />
        <div>
          <p className="app-name">{client.name || 'Sua foto'}</p>
          <p className="app-help">A profissional vê a sua foto na agenda e sabe quem é você.</p>
          <label className="app-btn secondary app-upload">
            {photoLabel}
            <input
              type="file"
              accept="image/*"
              onChange={pickPhoto}
              disabled={photoState === 'sending'}
              hidden
            />
          </label>
          {photoState === 'error' ? (
            <Notice tone="danger" title="Não foi possível enviar a foto" />
          ) : null}
        </div>
      </div>

      <form onSubmit={submit}>
        <h2 className="app-title">Editar perfil</h2>
        <Field
          label="Nome completo"
          autoComplete="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Field
          label="WhatsApp"
          prefix="+55"
          inputMode="tel"
          autoComplete="tel-national"
          required
          invalid={result === 'invalid'}
          help={result === 'invalid' ? 'Confira o número: use o DDD e os 9 dígitos.' : undefined}
          value={whatsapp}
          onChange={(event) => setWhatsapp(event.target.value)}
        />
        {notices[result] ?? null}
        <AppButton full type="submit" style={{ marginTop: 16 }}>
          Salvar alterações
        </AppButton>
      </form>
    </section>
  )
}
