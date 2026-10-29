import { useState } from 'react'
import { addClients } from '../../lib/api.js'
import { parseClients } from '../../lib/importClients.js'
import { formatPhone } from '../../lib/phone.js'
import AppButton from '../app/AppButton.jsx'
import Modal from '../app/Modal.jsx'
import Notice from '../app/Notice.jsx'

const PREVIEW_LIMIT = 5

export default function ImportClients({ onSaved, onClose }) {
  const [text, setText] = useState('')
  const [state, setState] = useState('idle')
  const [result, setResult] = useState(null)
  const { valid, invalid } = parseClients(text)

  const readFile = async (event) => {
    const file = event.target.files[0]
    if (file) setText(await file.text())
  }

  const send = async () => {
    setState('sending')
    try {
      setResult(await addClients(valid))
      setState('done')
      onSaved()
    } catch {
      setState('error')
    }
  }

  return (
    <Modal title="Importar clientes" onClose={onClose}>
      <p className="app-step">Clientes</p>
      <h2 className="app-modal-name">Importar da planilha</h2>

      {state === 'done' ? (
        <>
          <Notice tone="success" title={`${result.created} clientes cadastradas`}>
            {result.skipped
              ? `${result.skipped} já estavam na sua lista e foram ignoradas.`
              : 'Todas entraram na sua lista.'}
          </Notice>
          <div className="app-actions">
            <AppButton full onClick={onClose}>
              Pronto
            </AppButton>
          </div>
        </>
      ) : (
        <>
          <ol className="app-steps-list">
            <li>Abra a sua planilha (Excel ou Google Planilhas).</li>
            <li>Selecione as duas colunas: nome e WhatsApp.</li>
            <li>Copie e cole aqui embaixo.</li>
          </ol>

          <div className="app-field">
            <label htmlFor="import-text">Cole aqui as clientes</label>
            <textarea
              id="import-text"
              className="app-control app-textarea"
              rows="6"
              placeholder={'Maria Souza\t(85) 99999-1111\nAna Lima\t(85) 98888-2222'}
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </div>

          <label className="app-btn secondary app-upload app-import-file">
            Ou enviar arquivo da planilha (.csv)
            <input type="file" accept=".csv,.txt,text/csv,text/plain" onChange={readFile} hidden />
          </label>

          {valid.length ? (
            <Notice
              tone="success"
              title={`${valid.length} ${valid.length === 1 ? 'cliente encontrada' : 'clientes encontradas'}`}
            >
              <ul className="app-import-preview">
                {valid.slice(0, PREVIEW_LIMIT).map((client) => (
                  <li key={client.whatsapp}>
                    {client.name} · {formatPhone(client.whatsapp)}
                  </li>
                ))}
                {valid.length > PREVIEW_LIMIT ? (
                  <li>e mais {valid.length - PREVIEW_LIMIT}...</li>
                ) : null}
              </ul>
            </Notice>
          ) : null}
          {invalid.length ? (
            <Notice
              tone="warning"
              title={`${invalid.length} linhas com problema (não serão importadas)`}
            >
              <ul className="app-import-preview">
                {invalid.slice(0, PREVIEW_LIMIT).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              Confira se tem nome e um WhatsApp com DDD em cada linha.
            </Notice>
          ) : null}
          {state === 'error' ? <Notice tone="danger" title="Não foi possível importar" /> : null}

          <div className="app-actions">
            <AppButton full disabled={!valid.length || state === 'sending'} onClick={send}>
              {state === 'sending'
                ? 'Importando...'
                : `Importar ${valid.length || ''} clientes`.trim()}
            </AppButton>
            <AppButton variant="ghost" full onClick={onClose}>
              Cancelar
            </AppButton>
          </div>
        </>
      )}
    </Modal>
  )
}
