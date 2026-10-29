import { useState } from 'react'
import { useAsync } from '../../hooks/useAsync.js'
import { fetchKnownClients } from '../../lib/api.js'
import { formatPhone } from '../../lib/phone.js'
import AppButton from '../app/AppButton.jsx'
import Avatar from '../app/Avatar.jsx'
import Icon from '../app/Icon.jsx'
import Notice from '../app/Notice.jsx'
import AddClient from './AddClient.jsx'
import ClientSheet from './ClientSheet.jsx'
import ImportClients from './ImportClients.jsx'
import NewAppointment from './NewAppointment.jsx'

const matches = (client, query) => {
  const text = query.trim().toLowerCase()
  const digits = text.replace(/\D/g, '')
  return (
    !text ||
    client.name.toLowerCase().includes(text) ||
    (digits.length > 0 && client.whatsapp.includes(digits))
  )
}

export default function Clients({ professional, onAppointmentSaved }) {
  const clients = useAsync(fetchKnownClients, professional.id)
  const [query, setQuery] = useState('')
  const [view, setView] = useState(null)

  const list = (clients.data ?? []).filter((client) => matches(client, query))
  const open = view?.type === 'client' ? clients.data?.find((c) => c.id === view.id) : null
  const close = () => setView(null)

  return (
    <>
      <div className="app-actions">
        <AppButton full onClick={() => setView({ type: 'add' })}>
          <Icon name="plus" />
          Cadastrar cliente
        </AppButton>
        <AppButton variant="secondary" full onClick={() => setView({ type: 'import' })}>
          Importar da planilha
        </AppButton>
      </div>

      {(clients.data ?? []).length ? (
        <div className="app-field">
          <label htmlFor="client-search">Procurar cliente</label>
          <input
            id="client-search"
            className="app-control"
            type="search"
            placeholder="Nome ou WhatsApp"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      ) : null}

      {clients.loading ? <p className="app-lead">Carregando...</p> : null}
      {clients.error ? (
        <Notice tone="danger" title="Não foi possível carregar as clientes" />
      ) : null}

      {list.length ? (
        <>
          <h2 className="app-label">
            {list.length} {list.length === 1 ? 'cliente' : 'clientes'}
          </h2>
          <ul className="app-group">
            {list.map((client) => (
              <li key={client.id}>
                <button
                  type="button"
                  className="app-client"
                  onClick={() => setView({ type: 'client', id: client.id })}
                >
                  <Avatar src={client.photo_url} name={client.name} />
                  <span>
                    <span className="app-name">{client.name || 'Sem nome'}</span>
                    <span className="app-item-meta">{formatPhone(client.whatsapp)}</span>
                  </span>
                  <Icon name="chevron-right" />
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {!clients.loading && !(clients.data ?? []).length ? (
        <p className="app-lead">
          Você ainda não tem clientes cadastradas. Cadastre uma por uma ou importe a sua lista da
          planilha.
        </p>
      ) : null}
      {(clients.data ?? []).length && !list.length ? (
        <p className="app-lead">Nenhuma cliente encontrada.</p>
      ) : null}

      {view?.type === 'add' ? (
        <AddClient
          onSaved={clients.reload}
          onRemoved={() => {
            clients.reload()
            onAppointmentSaved?.()
          }}
          onSchedule={(client) => setView({ type: 'schedule', client })}
          onClose={close}
        />
      ) : null}
      {view?.type === 'import' ? <ImportClients onSaved={clients.reload} onClose={close} /> : null}
      {open ? (
        <ClientSheet
          client={open}
          onSaved={clients.reload}
          onSchedule={(client) => setView({ type: 'schedule', client })}
          onClose={close}
        />
      ) : null}
      {view?.type === 'schedule' ? (
        <NewAppointment
          pro={professional}
          date={new Date().toLocaleDateString('en-CA', { timeZone: 'America/Fortaleza' })}
          client={view.client}
          onSaved={() => {
            clients.reload()
            onAppointmentSaved()
          }}
          onClose={close}
        />
      ) : null}
    </>
  )
}
