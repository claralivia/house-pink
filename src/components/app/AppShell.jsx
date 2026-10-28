import { Link } from 'react-router-dom'
import '../../app.css'
import { DEVELOPER, SALON } from '../../data/site.js'
import { LOGO } from '../../data/assets.js'
import { cx } from '../../lib/cx.js'

export default function AppShell({ logo, credit, withBar, children, bottom }) {
  return (
    <div className="app">
      <main className={cx('app-main', withBar && 'with-bar')}>
        {logo ? (
          <Link className="app-logo" to="/">
            <img src={LOGO.pink} alt={SALON.name} />
          </Link>
        ) : null}
        {children}
        {credit ? <p className="app-credit">Desenvolvido por {DEVELOPER}</p> : null}
      </main>
      {bottom}
    </div>
  )
}
