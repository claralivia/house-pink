import { useCallback, useState } from 'react'
import { useAsync } from '../../hooks/useAsync.js'
import { useAvailability } from '../../hooks/useAvailability.js'
import { createManualAppointment, fetchKnownClients, fetchOwnTypes } from '../../lib/api.js'
import { clock, formatDuration, longDate, timestamp, toMinutes } from '../../lib/dates.js'
import { whatsappUrl } from '../../lib/links.js'
import { normalizeWhatsapp } from '../../lib/phone.js'
import AppButton from '../app/AppButton.jsx'
import Field from '../app/Field.jsx'
import Modal from '../app/Modal.jsx'
import Notice from '../app/Notice.jsx'
import Select from '../app/Select.jsx'

const CONFLICT_CODE = '23P01'
const localNumber = (whatsapp) => whatsapp.replace(/^55/, '')

export default function NewAppointment({ pro, date, client, onSaved, onClose }) {
  const loadTypes = useCallback(() => fetchOwnTypes(pro.id), [pro.id])
  const types = useAsync(loadTypes, pro.id)
  const known = useAsync(fetchKnownClients, pro.id)
  const [name, setName] = useState(client?.name ?? '')
  const [whatsapp, setWhatsapp] = useState(client ? localNumber(client.whatsapp) : '')
  const [typeId, setTypeId] = useState('')
  const [day, setDay] = useState(date)
  const [time, setTime] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(null)

  const options = (types.data ?? [])
    .filter((type) => type.active)
    .map((type) => ({
      value: type.id,
      text: `${type.services.name}: ${type.name} (${formatDuration(type.duration_minutes)})`,
    }))
  const chosen = (types.data ?? []).find((type) => type.id === typeId)
  const availability = useAvailability(pro, chosen?.duration_minutes ?? 0)
  const slots = chosen ? (availability.days.find((item) => item.date === day)?.slots ?? []) : []

  const changeName = (value) => {
    setName(value)
    const match = (known.data ?? []).find(
      (client) => client.name.toLowerCase() === value.trim().toLowerCase(),
    )
    if (match) setWhatsapp(localNumber(match.whatsapp))
  }

  const submit = async (event) => {
    event.preventDefault()
    const normalized = normalizeWhatsapp(whatsapp)
    if (!normalized) return setError('Confira o WhatsApp: use o DDD e os 9 dígitos.')
    if (!typeId || !time) return setError('Escolha o serviço e o horário.')
    setSaving(true)
    setError(null)
    try {
      await createManualAppointment({
        serviceTypeId: typeId,
        startsAt: timestamp(day, toMinutes(time)),
        name: name.trim(),
        whatsapp: normalized,
      })
      setSaved({ name: name.trim(), whatsapp: normalized })
      onSaved()
    } catch (failure) {
      setError(
        failure.code === CONFLICT_CODE
          ? 'Você já tem um horário nesse período. Escolha outro horário.'
          : 'Não foi possível salvar. Tente de novo.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Novo horário" onClose={onClose}>
      <p className="app-step">Agenda</p>
      <h2 className="app-modal-name">Novo horário</h2>

      {saved ? (
        <>
          <Notice tone="success" title="Horário salvo e confirmado">
            {longDate(day)}, às {time}, para {saved.name}.
          </Notice>
          <div className="app-actions">
            <AppButton
              variant="secondary"
              full
              href={whatsappUrl(
                { first: saved.name, whatsapp: saved.whatsapp },
                `Oi, ${saved.name}! Seu horário na House Pink ficou marcado para ${longDate(day)}, às ${time}.`,
              )}
            >
              Avisar a cliente no WhatsApp
            </AppButton>
            <AppButton full onClick={onClose}>
              Pronto
            </AppButton>
          </div>
        </>
      ) : (
        <form onSubmit={submit}>
          <Field
            label="Nome da cliente"
            autoComplete="off"
            list="known-clients"
            required
            value={name}
            onChange={(event) => changeName(event.target.value)}
          />
          <datalist id="known-clients">
            {(known.data ?? []).map((client) => (
              <option key={client.id} value={client.name} />
            ))}
          </datalist>
          <Field
            label="WhatsApp da cliente"
            prefix="+55"
            inputMode="tel"
            placeholder="(85) 99999-9999"
            required
            value={whatsapp}
            onChange={(event) => setWhatsapp(event.target.value)}
          />
          <Select
            label="Serviço"
            required
            options={[{ value: '', text: 'Escolha o serviço' }, ...options]}
            value={typeId}
            onChange={(event) => {
              setTypeId(event.target.value)
              setTime('')
            }}
          />
          <Field
            label="Dia"
            type="date"
            required
            value={day}
            onChange={(event) => {
              setDay(event.target.value)
              setTime('')
            }}
          />
          {slots.length ? (
            <div className="app-field">
              <span className="app-field-label">Horários livres neste dia</span>
              <div className="app-slots">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className="app-slot"
                    aria-pressed={time === clock(slot)}
                    onClick={() => setTime(clock(slot))}
                  >
                    {clock(slot)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <Field
            label="Hora"
            type="time"
            step="300"
            required
            help={
              chosen && !slots.length
                ? 'Nenhum horário livre listado: digite a hora que combinaram.'
                : undefined
            }
            value={time}
            onChange={(event) => setTime(event.target.value)}
          />
          {error ? <Notice tone="danger" title={error} /> : null}
          <div className="app-actions">
            <AppButton full type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar horário'}
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
