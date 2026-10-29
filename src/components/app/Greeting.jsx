import { greetingNow } from '../../lib/greeting.js'
import Avatar from './Avatar.jsx'

export default function Greeting({ person, children }) {
  return (
    <section className="app-greeting">
      <Avatar
        src={person?.photo}
        name={person?.name}
        size="xl"
        className={person?.isPro ? 'pro' : ''}
      />
      <div>
        <p className="app-greeting-hello">{greetingNow()},</p>
        <h1 className="app-greeting-name">{person?.first ? `${person.first}!` : 'tudo bem?'}</h1>
        {children ? <p className="app-greeting-lead">{children}</p> : null}
      </div>
    </section>
  )
}
