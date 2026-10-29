import { useId } from 'react'

export default function Select({ label, options, ...select }) {
  const id = useId()

  return (
    <div className="app-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="app-control" {...select}>
        {options.map(({ value, text }) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </div>
  )
}
