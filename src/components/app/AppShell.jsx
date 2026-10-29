import '../../app.css'
import { cx } from '../../lib/cx.js'
import AppFooter from './AppFooter.jsx'
import AppHeader from './AppHeader.jsx'

export default function AppShell({ hideAccount, withBar, wide, children, bottom }) {
  return (
    <div className="app">
      <AppHeader hideAccount={hideAccount} />
      <main className={cx('app-main', withBar && 'with-bar', wide && 'wide')}>
        <div className="app-content">{children}</div>
        <AppFooter />
      </main>
      {bottom}
    </div>
  )
}
