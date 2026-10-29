import { useState } from 'react'
import { METHOD_LABEL } from '../../lib/closing.js'
import { dateOf, longDate, timeOf } from '../../lib/dates.js'
import { whatsappUrl } from '../../lib/links.js'
import { formatPrice } from '../../lib/money.js'
import AppButton from '../app/AppButton.jsx'
import Avatar from '../app/Avatar.jsx'
import Modal from '../app/Modal.jsx'
import Notice from '../app/Notice.jsx'
import EditAppointment from './EditAppointment.jsx'

const STATUS_TEXT = {
  pending: 'Ainda não confirmado',
  confirmed: 'Confirmado',
  done: 'Atendimento concluído',
  cancelled: 'Cancelado',
}

const reminder = ({ clients, starts_at }) =>
  `Oi, ${clients.name}! Aqui é da House Pink, sobre o seu horário das ${timeOf(starts_at)}.`

function Choices({ question, children }) {
  return (
    <div className="app-actions">
      <p className="app-modal-question">{question}</p>
      {children}
    </div>
  )
}

export default function AppointmentSheet({
  appointment,
  pro,
  onStatus,
  onPay,
  onDeposit,
  onReopen,
  onDelete,
  onChanged,
  onClose,
}) {
  const [view, setView] = useState('main')
  const [failed, setFailed] = useState(false)
  const { id, starts_at, ends_at, status, price_cents, deposit_paid_cents, deposit_payment } =
    appointment
  const { clients, service_types: type } = appointment
  const open = status === 'pending' || status === 'confirmed'
  const canDeposit = open && pro.deposit_cents > 0 && deposit_paid_cents === 0
  const back = () => {
    setFailed(false)
    setView('main')
  }

  const run = (action) => async () => {
    try {
      await action()
      onClose()
    } catch {
      setFailed(true)
    }
  }

  const methods = (onPick) =>
    Object.entries(METHOD_LABEL).map(([method, label]) => (
      <AppButton key={method} variant="secondary" full onClick={run(() => onPick(id, method))}>
        {label}
      </AppButton>
    ))

  return (
    <Modal title={clients.name} onClose={onClose}>
      <p className="app-step">{STATUS_TEXT[status]}</p>
      <div className="app-modal-person">
        <Avatar src={clients.photo_url} name={clients.name} size="xl" />
        <h2 className="app-modal-name">{clients.name}</h2>
      </div>
      <p className="app-modal-when">
        {longDate(dateOf(starts_at))}, das {timeOf(starts_at)} às {timeOf(ends_at)}
      </p>
      <p className="app-item-meta">
        {type.services.name}, {type.name}
        {price_cents === null ? '' : ` · ${formatPrice(price_cents)}`}
      </p>
      {appointment.joint_group_id ? (
        <p className="app-item-meta">
          Sessão conjunta: a cliente também marcou com a outra profissional neste horário.
        </p>
      ) : null}
      {deposit_paid_cents > 0 ? (
        <p className="app-item-meta">
          Sinal de {formatPrice(deposit_paid_cents)} pago no {METHOD_LABEL[deposit_payment]}
        </p>
      ) : null}

      {view === 'main' ? (
        <div className="app-actions">
          {status === 'pending' ? (
            <AppButton full onClick={run(() => onStatus(id, 'confirmed'))}>
              Confirmar horário
            </AppButton>
          ) : null}
          {status === 'confirmed' ? (
            <AppButton full onClick={() => setView('pay')}>
              Atendimento concluído
            </AppButton>
          ) : null}
          {canDeposit ? (
            <AppButton variant="secondary" full onClick={() => setView('deposit')}>
              Cliente pagou o sinal ({formatPrice(pro.deposit_cents)})
            </AppButton>
          ) : null}
          <AppButton variant="secondary" full href={whatsappUrl(clients, reminder(appointment))}>
            Falar com a cliente no WhatsApp
          </AppButton>
          {open ? (
            <>
              <AppButton variant="secondary" full onClick={() => setView('edit')}>
                Mudar o horário ou o valor
              </AppButton>
              <AppButton variant="danger" full onClick={() => setView('cancel')}>
                Cancelar este horário
              </AppButton>
            </>
          ) : (
            <AppButton variant="secondary" full onClick={run(() => onReopen(id))}>
              {status === 'done' ? 'Desfazer: voltar para confirmado' : 'Reativar este horário'}
            </AppButton>
          )}
          <AppButton variant="ghost" full onClick={() => setView('delete')}>
            Apagar este registro
          </AppButton>
        </div>
      ) : null}

      {view === 'pay' ? (
        <Choices question="Como a cliente pagou o restante?">
          {methods(onPay)}
          <AppButton variant="secondary" full onClick={run(() => onStatus(id, 'done'))}>
            Ainda não pagou
          </AppButton>
          <AppButton variant="ghost" full onClick={back}>
            Voltar
          </AppButton>
        </Choices>
      ) : null}

      {view === 'deposit' ? (
        <Choices question="Como a cliente pagou o sinal?">
          {methods(onDeposit)}
          <AppButton variant="ghost" full onClick={back}>
            Voltar
          </AppButton>
        </Choices>
      ) : null}

      {view === 'cancel' ? (
        <Choices question="Tem certeza que quer cancelar este horário?">
          <AppButton variant="danger" full onClick={run(() => onStatus(id, 'cancelled'))}>
            Sim, cancelar
          </AppButton>
          <AppButton variant="secondary" full onClick={back}>
            Não, manter o horário
          </AppButton>
        </Choices>
      ) : null}

      {view === 'delete' ? (
        <Choices question={`Apagar o registro de ${clients.name}?`}>
          <p className="app-help">
            Ele some da agenda, dos ganhos e do histórico da cliente, junto com a avaliação, se
            houver. Não dá para desfazer. Use isto só se você cadastrou por engano.
          </p>
          <AppButton variant="danger" full onClick={run(() => onDelete(id))}>
            Sim, apagar
          </AppButton>
          <AppButton variant="secondary" full onClick={back}>
            Não, manter
          </AppButton>
        </Choices>
      ) : null}

      {failed ? (
        <Notice tone="danger" title="Não foi possível fazer isso">
          Se for reativar, confira se o horário não foi ocupado por outra cliente.
        </Notice>
      ) : null}

      {view === 'edit' ? (
        <EditAppointment appointment={appointment} pro={pro} onSaved={onChanged} onClose={back} />
      ) : null}
    </Modal>
  )
}
