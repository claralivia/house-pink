import '../../app.css'
import { DEVELOPER } from '../../data/site.js'
import { cx } from '../../lib/cx.js'
import AppHeader from './AppHeader.jsx'

export default function AppShell({ hideAccount, credit, withBar, children, bottom }) {
  return (
    <div className="app">
      <AppHeader hideAccount={hideAccount} />
      <main className={cx('app-main', withBar && 'with-bar')}>
        {children}
        {credit ? <p className="app-credit">Desenvolvido por {DEVELOPER}</p> : null}
      </main>
      {bottom}
    </div>
  )
}
