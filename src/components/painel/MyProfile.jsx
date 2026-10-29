import { useState } from 'react'
import { updateProfessional, uploadProfessionalPhoto } from '../../lib/api.js'
import AppButton from '../app/AppButton.jsx'
import Avatar from '../app/Avatar.jsx'
import Field from '../app/Field.jsx'
import Notice from '../app/Notice.jsx'

const BIO_LIMIT = 400

const handleOf = (value) =>
  value
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .replace(/[/?].*$/, '')

export default function MyProfile({ userId, professional, onSaved }) {
  const [bio, setBio] = useState(professional.bio)
  const [instagram, setInstagram] = useState(professional.instagram)
  const [photoState, setPhotoState] = useState('idle')
  const [result, setResult] = useState(null)

  const pickPhoto = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    setPhotoState('sending')
    try {
      await uploadProfessionalPhoto(userId, professional.id, file)
      setPhotoState('done')
      onSaved()
    } catch {
      setPhotoState('error')
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    try {
      await updateProfessional(professional.id, {
        bio: bio.trim() || null,
        instagram: handleOf(instagram) || null,
      })
      setResult('success')
      onSaved()
    } catch {
      setResult('danger')
    }
  }

  const notices = {
    success: <Notice tone="success" title="Perfil salvo. Já aparece no site." />,
    danger: <Notice tone="danger" title="Não foi possível salvar" />,
  }

  return (
    <section>
      <p className="app-lead">
        Sua foto e sua apresentação aparecem na página inicial do site e na conta das clientes.
      </p>

      <div className="app-profile-photo">
        <Avatar src={professional.photo} name={professional.name} size="xl" className="pro" />
        <div>
          <p className="app-name">{professional.name}</p>
          <label className="app-btn secondary app-upload">
            {photoState === 'sending' ? 'Enviando...' : 'Trocar a minha foto'}
            <input
              type="file"
              accept="image/*"
              onChange={pickPhoto}
              disabled={photoState === 'sending'}
              hidden
            />
          </label>
          {photoState === 'done' ? <Notice tone="success" title="Foto trocada" /> : null}
          {photoState === 'error' ? (
            <Notice tone="danger" title="Não foi possível enviar a foto" />
          ) : null}
        </div>
      </div>

      <form onSubmit={submit}>
        <div className="app-field">
          <label htmlFor="my-bio">Sobre você</label>
          <textarea
            id="my-bio"
            className="app-control app-textarea"
            rows="6"
            maxLength={BIO_LIMIT}
            value={bio}
            onChange={(event) => setBio(event.target.value)}
          />
          <p className="app-help">
            {bio.length} de {BIO_LIMIT} letras
          </p>
        </div>
        <Field
          label="Instagram"
          prefix="@"
          autoCapitalize="none"
          value={instagram}
          onChange={(event) => setInstagram(event.target.value)}
        />
        {notices[result] ?? null}
        <AppButton full type="submit" style={{ marginTop: 16 }}>
          Salvar perfil
        </AppButton>
      </form>
    </section>
  )
}
