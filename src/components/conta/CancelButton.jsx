import { useState } from 'react'
import AppButton from '../app/AppButton.jsx'

export default function CancelButton({ onCancel }) {
  const [confirming, setConfirming] = useState(false)

  return confirming ? (
    <>
      <AppButton variant="secondary" onClick={onCancel}>
        Sim, cancelar
      </AppButton>
      <AppButton variant="ghost" onClick={() => setConfirming(false)}>
        Manter horário
      </AppButton>
    </>
  ) : (
    <AppButton variant="ghost" onClick={() => setConfirming(true)}>
      Cancelar horário
    </AppButton>
  )
}
