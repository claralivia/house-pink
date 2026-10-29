import { useCallback, useState } from 'react'
import { useAsync } from '../../hooks/useAsync.js'
import { addType, fetchOwnTypes, savePrice, updateType, uploadTypePhoto } from '../../lib/api.js'
import { formatDuration } from '../../lib/dates.js'
import { formatPrice, toCents, toReais } from '../../lib/money.js'
import AppButton from '../app/AppButton.jsx'
import Field from '../app/Field.jsx'
import Notice from '../app/Notice.jsx'

const priceOf = (type) => type.service_prices?.price_cents

function PhotoButton({ type, onUploaded }) {
  const [state, setState] = useState('idle')
  const idleLabel = type.image_url ? 'Trocar foto' : 'Adicionar foto'
  const label = state === 'sending' ? 'Enviando...' : idleLabel

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
    <>
      <label className="app-btn secondary app-upload">
        {label}
        <input type="file" accept="image/*" onChange={pick} disabled={state === 'sending'} hidden />
      </label>
      {state === 'error' ? <Notice tone="danger" title="Não foi possível enviar a foto" /> : null}
    </>
  )
}

function TypeEditor({ type, onSaved }) {
  const [name, setName] = useState(type.name)
  const [description, setDescription] = useState(type.description ?? '')
  const [duration, setDuration] = useState(String(type.duration_minutes))
  const [price, setPrice] = useState(priceOf(type) === undefined ? '' : toReais(priceOf(type)))
  const [active, setActive] = useState(type.active)
  const [result, setResult] = useState(null)

  const submit = async (event) => {
    event.preventDefault()
    const cents = price.trim() ? toCents(price) : null
    if ((price.trim() && cents === null) || !(Number(duration) > 0)) return setResult('invalid')
    try {
      await updateType(type.id, {
        name: name.trim(),
        description: description.trim() || null,
        duration_minutes: Number(duration),
        active,
      })
      if (cents !== null) await savePrice(type.id, cents)
      setResult('success')
      onSaved()
    } catch {
      setResult('danger')
    }
  }

  const notices = {
    success: <Notice tone="success" title="Salvo" />,
    invalid: <Notice tone="danger" title="Confira a duração e o valor" />,
    danger: <Notice tone="danger" title="Não foi possível salvar" />,
  }

  return (
    <form onSubmit={submit}>
      <Field label="Nome" required value={name} onChange={(e) => setName(e.target.value)} />
      <Field
        label="Duração, em minutos"
        type="number"
        inputMode="numeric"
        min="5"
        step="5"
        required
        help="Define quantos horários ficam livres na agenda. Ex.: 150 para 2h30."
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <Field
        label="Valor, em reais"
        inputMode="decimal"
        placeholder="Ex.: 140,00"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <div className="app-field">
        <label htmlFor={`desc-${type.id}`}>Descrição para a cliente (opcional)</label>
        <textarea
          id={`desc-${type.id}`}
          className="app-control app-textarea"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <label className="app-check app-spaced">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Disponível para agendar
      </label>
      {notices[result] ?? null}
      <AppButton full type="submit" style={{ marginTop: 16 }}>
        Salvar
      </AppButton>
    </form>
  )
}

function TypeRow({ type, onSaved }) {
  const cents = priceOf(type)

  return (
    <li className={`app-type${type.active ? '' : ' off'}`}>
      <details>
        <summary>
          {type.image_url ? (
            <img className="app-thumb" src={type.image_url} alt="" />
          ) : (
            <span className="app-thumb empty">Sem foto</span>
          )}
          <span>
            <span className="app-name">{type.name}</span>
            <span className="app-item-meta">
              {formatDuration(type.duration_minutes)} ·{' '}
              {cents === undefined ? 'sem valor' : formatPrice(cents)}
              {type.active ? '' : ' · oculto'}
            </span>
          </span>
          <span className="app-edit-hint">Editar</span>
        </summary>
        <div className="app-type-body">
          <PhotoButton type={type} onUploaded={onSaved} />
          <TypeEditor type={type} onSaved={onSaved} />
        </div>
      </details>
    </li>
  )
}

function NewType({ service, onSaved }) {
  const [form, setForm] = useState({ name: '', duration: '60', price: '' })
  const [failed, setFailed] = useState(false)
  const set = (field) => (event) => setForm({ ...form, [field]: event.target.value })

  const submit = async (event) => {
    event.preventDefault()
    const cents = toCents(form.price)
    if (cents === null) return setFailed(true)
    try {
      await addType(service.id, {
        name: form.name.trim(),
        duration_minutes: Number(form.duration),
        price_cents: cents,
      })
      setForm({ name: '', duration: '60', price: '' })
      setFailed(false)
      onSaved()
    } catch {
      setFailed(true)
    }
  }

  return (
    <details className="app-more app-new-type">
      <summary>Novo tipo em {service.name}</summary>
      <form onSubmit={submit}>
        <Field label="Nome" required value={form.name} onChange={set('name')} />
        <Field
          label="Duração, em minutos"
          type="number"
          min="5"
          step="5"
          required
          value={form.duration}
          onChange={set('duration')}
        />
        <Field
          label="Valor, em reais"
          inputMode="decimal"
          required
          value={form.price}
          onChange={set('price')}
        />
        {failed ? <Notice tone="danger" title="Confira os dados e tente de novo" /> : null}
        <AppButton full type="submit" style={{ marginTop: 16 }}>
          Adicionar tipo
        </AppButton>
      </form>
    </details>
  )
}

export default function OwnServices({ professionalId }) {
  const load = useCallback(() => fetchOwnTypes(professionalId), [professionalId])
  const types = useAsync(load, professionalId)

  const services = Object.values(
    Object.groupBy(
      [...(types.data ?? [])].sort((a, b) => a.services.position - b.services.position),
      (type) => type.services.id,
    ),
  )

  return (
    <>
      <p className="app-lead">
        Toque em um tipo para mudar o valor, o tempo, a descrição e a foto. Tipos ocultos deixam de
        aparecer para as clientes.
      </p>
      {types.loading ? <p className="app-lead">Carregando...</p> : null}
      {types.error ? <Notice tone="danger" title="Não foi possível carregar os serviços" /> : null}
      {services.map((group) => (
        <section key={group[0].services.id}>
          <h2 className="app-label">{group[0].services.name}</h2>
          <ul className="app-group">
            {group.map((type) => (
              <TypeRow key={type.id} type={type} onSaved={types.reload} />
            ))}
          </ul>
          <NewType service={group[0].services} onSaved={types.reload} />
        </section>
      ))}
    </>
  )
}
