import { useState } from 'react'
import { changePassword } from '../../lib/api.js'

const MIN_LENGTH = 8

export default function PasswordForm() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const submit = async (event) => {
    event.preventDefault()
    try {
      await changePassword(password)
      setPassword('')
      setMessage('Senha alterada.')
    } catch {
      setMessage('Não foi possível alterar a senha. Tente outra.')
    }
  }

  return (
    <section className="bk-step">
      <h2 className="bk-title">Trocar senha</h2>
      <form className="bk-form" onSubmit={submit}>
        <label className="bk-field">
          <span>Nova senha, com pelo menos {MIN_LENGTH} caracteres</span>
          <input
            type="password"
            autoComplete="new-password"
            minLength={MIN_LENGTH}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {message ? <p className="bk-note">{message}</p> : null}
        <button type="submit" className="chip">
          Salvar nova senha
        </button>
      </form>
    </section>
  )
}
