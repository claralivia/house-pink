import { useId } from 'react'

export default function Field({ label, help, prefix, invalid, ...input }) {
  const id = useId()
  const control = (
    <input id={id} className="app-control" aria-invalid={Boolean(invalid)} {...input} />
  )

  return (
    <div className="app-field">
      <label htmlFor={id}>{label}</label>
      {prefix ? (
        <div className="app-affix">
          <span>{prefix}</span>
          {control}
        </div>
      ) : (
        control
      )}
      {help ? <p className="app-help">{help}</p> : null}
    </div>
  )
}
