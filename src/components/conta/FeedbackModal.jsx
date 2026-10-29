import { useState } from 'react'
import { leaveFeedback } from '../../lib/api.js'
import AppButton from '../app/AppButton.jsx'
import Modal from '../app/Modal.jsx'
import Notice from '../app/Notice.jsx'
import Stars from '../app/Stars.jsx'

const WORDS = { 1: 'Ruim', 2: 'Regular', 3: 'Bom', 4: 'Muito bom', 5: 'Excelente' }

export default function FeedbackModal({ appointment, onDone, onClose }) {
  const type = appointment.service_types
  const pro = type.services.professionals.name.split(' ')[0]
  const [rating, setRating] = useState(appointment.feedback?.rating ?? 0)
  const [comment, setComment] = useState(appointment.feedback?.comment ?? '')
  const [state, setState] = useState('idle')

  const send = async () => {
    setState('sending')
    try {
      await leaveFeedback(appointment.id, rating, comment)
      setState('sent')
      onDone()
    } catch {
      setState('error')
    }
  }

  return (
    <Modal title="Avaliar atendimento" onClose={onClose}>
      <p className="app-step">Sua opinião</p>
      <h2 className="app-modal-name">Como foi com a {pro}?</h2>
      <p className="app-item-meta">
        {type.services.name}, {type.name}
      </p>

      {state === 'sent' ? (
        <>
          <Notice tone="success" title="Obrigada pela sua avaliação!">
            A {pro} vai ler com carinho.
          </Notice>
          <div className="app-actions">
            <AppButton full onClick={onClose}>
              Fechar
            </AppButton>
          </div>
        </>
      ) : (
        <>
          <Stars value={rating} onChange={setRating} label="Nota do atendimento" />
          <p className="app-help app-stars-word">{rating ? WORDS[rating] : 'Toque nas estrelas'}</p>
          <div className="app-field">
            <label htmlFor="feedback-comment">Quer contar mais? (opcional)</label>
            <textarea
              id="feedback-comment"
              className="app-control app-textarea"
              rows="4"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </div>
          {state === 'error' ? (
            <Notice tone="danger" title="Não foi possível enviar">
              Tente de novo em instantes.
            </Notice>
          ) : null}
          <div className="app-actions">
            <AppButton full disabled={!rating || state === 'sending'} onClick={send}>
              {state === 'sending' ? 'Enviando...' : 'Enviar avaliação'}
            </AppButton>
            <AppButton variant="ghost" full onClick={onClose}>
              Agora não
            </AppButton>
          </div>
        </>
      )}
    </Modal>
  )
}
