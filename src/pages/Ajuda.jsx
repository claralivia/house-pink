import AppShell from '../components/app/AppShell.jsx'
import HelpCenter from '../components/ajuda/HelpCenter.jsx'
import { PAGE_TITLES } from '../data/site.js'
import { usePageTitle } from '../hooks/usePageTitle.js'

export default function Ajuda() {
  usePageTitle(PAGE_TITLES.ajuda)

  return (
    <AppShell>
      <h1 className="app-headline">Central de ajuda</h1>
      <HelpCenter audience="client" />
    </AppShell>
  )
}
