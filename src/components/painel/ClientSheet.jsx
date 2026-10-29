import { useState } from 'react'
import { updateClientRecord } from '../../lib/api.js'
import { whatsappUrl } from '../../lib/links.js'
import { formatPhone, normalizeWhatsapp } from '../../lib/phone.js'
import AppButton from '../app/AppButton.jsx'
import Avatar from '../app/Avatar.jsx'
import Field from '../app/Field.jsx'
import Modal from '../app/Modal.jsx'
import Notice from '../app/Notice.jsx'

export default function ClientSheet({ client, onSaved, onSchedule, onClose }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(client.name)
  const [whatsapp, setWhatsapp] = useState(client.whatsapp.replace(/^55/, ''))
  const [error, setError] = useState(null)
  const first = client.name.split(' ')[0] || 'a cliente'
  const editable = !client.user_id

  const save = async (event) => {
    event.preventDefault()
    const normalized = normalizeWhatsapp(whatsapp)
    if (!normalized) return setError('Confira o WhatsApp: use o DDD e os 9 dígitos.')
    try {
      await updateClientRecord(client.id, { name, whatsapp: normalized })
      setError(null)
      setEditing(false)
      onSaved()
    } catch {
      setError('Não foi possível salvar. Tente de novo.')
    }
  }

  return (
    <Modal title={client.name} onClose={onClose}>
      <p className="app-step">Cliente</p>
      <div className="app-modal-person">
        <Avatar src={client.photo_url} name={client.name} size="xl" />
        <div>
          <h2 className="app-modal-name">{client.name || 'Sem nome'}</h2>
          <p className="app-item-meta">{formatPhone(client.whatsapp)}</p>
        </div>
      </div>

      {editing ? (
        <form onSubmit={save}>
          <Field
            label="Nome"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Field
            label="WhatsApp"
            prefix="+55"
            inputMode="tel"
            required
            value={whatsapp}
            onChange={(event) => setWhatsapp(event.target.value)}
          />
          {error ? <Notice tone="danger" title={error} /> : null}
          <div className="app-actions">
            <AppButton full type="submit">
              Salvar alterações
            </AppButton>
            <AppButton variant="ghost" full onClick={() => setEditing(false)}>
              Voltar
            </AppButton>
          </div>
        </form>
      ) : (
        <div className="app-actions">
          <AppButton
            full
            onClick={() => onSchedule({ name: client.name, whatsapp: client.whatsapp })}
          >
            Agendar horário para {first}
          </AppButton>
          <AppButton
            variant="secondary"
            full
            href={whatsappUrl(
              { first, whatsapp: client.whatsapp },
              `Oi, ${first}! Aqui é da House Pink.`,
            )}
          >
            Falar no WhatsApp
          </AppButton>
          {editable ? (
            <AppButton variant="secondary" full onClick={() => setEditing(true)}>
              Corrigir nome ou WhatsApp
            </AppButton>
          ) : null}
        </div>
      )}
    </Modal>
  )
}
