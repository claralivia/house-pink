import { useState } from 'react'
import { addClients } from '../../lib/api.js'
import { normalizeWhatsapp } from '../../lib/phone.js'
import AppButton from '../app/AppButton.jsx'
import Field from '../app/Field.jsx'
import Modal from '../app/Modal.jsx'
import Notice from '../app/Notice.jsx'

export default function AddClient({ onSaved, onSchedule, onClose }) {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(null)

  const submit = async (event) => {
    event.preventDefault()
    const normalized = normalizeWhatsapp(whatsapp)
    if (!normalized) return setError('Confira o WhatsApp: use o DDD e os 9 dígitos.')
    try {
      const result = await addClients([{ name: name.trim(), whatsapp: normalized }])
      setError(null)
      setSaved({ client: { name: name.trim(), whatsapp: normalized }, created: result.created })
      onSaved()
    } catch {
      setError('Não foi possível salvar. Tente de novo.')
    }
  }

  return (
    <Modal title="Cadastrar cliente" onClose={onClose}>
      <p className="app-step">Clientes</p>
      <h2 className="app-modal-name">Cadastrar cliente</h2>

      {saved ? (
        <>
          <Notice
            tone={saved.created ? 'success' : 'warning'}
            title={saved.created ? 'Cliente cadastrada' : 'Essa cliente já estava na sua lista'}
          />
          <div className="app-actions">
            <AppButton full onClick={() => onSchedule(saved.client)}>
              Agendar horário para {saved.client.name.split(' ')[0]}
            </AppButton>
            <AppButton variant="secondary" full onClick={onClose}>
              Pronto
            </AppButton>
          </div>
        </>
      ) : (
        <form onSubmit={submit}>
          <Field
            label="Nome da cliente"
            autoComplete="off"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Field
            label="WhatsApp da cliente"
            prefix="+55"
            inputMode="tel"
            placeholder="(85) 99999-9999"
            required
            value={whatsapp}
            onChange={(event) => setWhatsapp(event.target.value)}
          />
          {error ? <Notice tone="danger" title={error} /> : null}
          <div className="app-actions">
            <AppButton full type="submit">
              Salvar cliente
            </AppButton>
            <AppButton variant="ghost" full onClick={onClose}>
              Cancelar
            </AppButton>
          </div>
        </form>
      )}
    </Modal>
  )
}
