import { useState } from 'react'
import { METHOD_LABEL } from '../../lib/closing.js'
import { timeOf } from '../../lib/dates.js'
import { whatsappUrl } from '../../lib/links.js'
import { formatPrice } from '../../lib/money.js'
import AppButton from '../app/AppButton.jsx'
import Icon from '../app/Icon.jsx'
import EditAppointment from './EditAppointment.jsx'

const STATUS = {
  pending: { label: 'Pendente', icon: 'clock', tone: 'warning' },
  confirmed: { label: 'Confirmado', icon: 'ok', tone: 'success' },
  done: { label: 'Concluído', icon: 'ok', tone: 'success' },
  cancelled: { label: 'Cancelado', icon: 'close', tone: 'muted' },
}

const PRIMARY = {
  pending: { label: 'Confirmar', status: 'confirmed' },
  confirmed: { label: 'Concluir' },
}

const PAYMENTS = Object.entries(METHOD_LABEL).map(([id, label]) => ({ id, label }))

const reminder = ({ clients, starts_at }) =>
  `Oi, ${clients.name}! Aqui é da House Pink, sobre o seu horário das ${timeOf(starts_at)}.`

function MethodChoices({ question, onPick, onClose, extra }) {
  return (
    <div className="app-row-actions">
      <p className="app-help app-full">{question}</p>
      {PAYMENTS.map(({ id, label }) => (
        <AppButton key={id} variant="secondary" onClick={() => onPick(id)}>
          {label}
        </AppButton>
      ))}
      {extra}
      <AppButton variant="ghost" onClick={onClose}>
        Voltar
      </AppButton>
    </div>
  )
}

export default function AppointmentRow({
  appointment,
  pro,
  onStatus,
  onPay,
  onDeposit,
  onChanged,
}) {
  const [view, setView] = useState('main')
  const { id, starts_at, ends_at, status, price_cents, deposit_paid_cents, deposit_payment } =
    appointment
  const { clients, service_types } = appointment
  const { label, icon, tone } = STATUS[status]
  const primary = PRIMARY[status]
  const open = status === 'pending' || status === 'confirmed'
  const canDeposit = open && pro.deposit_cents > 0 && deposit_paid_cents === 0

  const back = () => setView('main')
  const pickPayment = async (method) => {
    await onPay(id, method)
    back()
  }
  const pickDeposit = async (method) => {
    await onDeposit(id, method)
    back()
  }
  const finishWithoutPayment = async () => {
    await onStatus(id, 'done')
    back()
  }

  return (
    <li className={`app-row ${status}`}>
      <div>
        <div className="app-time">{timeOf(starts_at)}</div>
        <div className="app-sub">até {timeOf(ends_at)}</div>
      </div>
      <div>
        <div className="app-name">{clients.name}</div>
        <div className="app-item-meta">
          <span className={`app-who ${pro.key}`}>{pro.first}</span> · {service_types.services.name},{' '}
          {service_types.name}
        </div>
        {deposit_paid_cents > 0 ? (
          <div className="app-item-meta">
            Sinal pago {formatPrice(deposit_paid_cents)} ({METHOD_LABEL[deposit_payment]})
          </div>
        ) : null}
      </div>
      <div style={{ textAlign: 'right' }}>
        {price_cents === null ? null : <div className="app-price">{formatPrice(price_cents)}</div>}
        <span className={`app-status ${tone}`}>
          <Icon name={icon} />
          {label}
        </span>
      </div>

      {view === 'pay' ? (
        <MethodChoices
          question="Como foi o pagamento do restante?"
          onPick={pickPayment}
          onClose={back}
          extra={
            <AppButton variant="ghost" onClick={finishWithoutPayment}>
              Sem pagamento
            </AppButton>
          }
        />
      ) : null}
      {view === 'deposit' ? (
        <MethodChoices
          question={`Sinal de ${formatPrice(pro.deposit_cents)}: como foi pago?`}
          onPick={pickDeposit}
          onClose={back}
        />
      ) : null}
      {view === 'edit' ? (
        <div className="app-full-row">
          <EditAppointment appointment={appointment} pro={pro} onSaved={onChanged} onClose={back} />
        </div>
      ) : null}

      {view === 'main' ? (
        <div className="app-row-actions">
          {primary ? (
            <AppButton
              variant="secondary"
              onClick={() => (primary.status ? onStatus(id, primary.status) : setView('pay'))}
            >
              {primary.label}
            </AppButton>
          ) : null}
          <AppButton variant="ghost" href={whatsappUrl(clients, reminder(appointment))}>
            WhatsApp
          </AppButton>
          {open ? (
            <details className="app-more">
              <summary>Mais ações</summary>
              <div className="app-row-actions">
                <AppButton variant="secondary" onClick={() => setView('edit')}>
                  Editar horário
                </AppButton>
                {canDeposit ? (
                  <AppButton variant="secondary" onClick={() => setView('deposit')}>
                    Registrar sinal
                  </AppButton>
                ) : null}
                <AppButton variant="ghost" onClick={() => onStatus(id, 'cancelled')}>
                  Cancelar horário
                </AppButton>
              </div>
            </details>
          ) : null}
        </div>
      ) : null}
    </li>
  )
}
