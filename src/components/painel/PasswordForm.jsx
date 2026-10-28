import { useState } from 'react'
import { changePassword } from '../../lib/api.js'
import AppButton from '../app/AppButton.jsx'
import Field from '../app/Field.jsx'
import Notice from '../app/Notice.jsx'

const MIN_LENGTH = 8

export default function PasswordForm() {
  const [password, setPassword] = useState('')
  const [result, setResult] = useState(null)

  const submit = async (event) => {
    event.preventDefault()
    try {
      await changePassword(password)
      setPassword('')
      setResult('success')
    } catch {
      setResult('danger')
    }
  }

  return (
    <form onSubmit={submit}>
      <h2 className="app-title">Trocar senha</h2>
      <Field
        label="Nova senha"
        type="password"
        autoComplete="new-password"
        minLength={MIN_LENGTH}
        required
        help={`Use pelo menos ${MIN_LENGTH} caracteres.`}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {result === 'success' ? <Notice tone="success" title="Senha alterada" /> : null}
      {result === 'danger' ? (
        <Notice tone="danger" title="Não foi possível alterar a senha">
          Tente outra senha.
        </Notice>
      ) : null}
      <AppButton full type="submit" style={{ marginTop: 16 }}>
        Salvar nova senha
      </AppButton>
    </form>
  )
}
