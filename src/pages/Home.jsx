import Footer from '../components/layout/Footer.jsx'
import Contact from '../components/home/Contact.jsx'
import Dual from '../components/home/Dual.jsx'
import Hero from '../components/home/Hero.jsx'
import Marquee from '../components/home/Marquee.jsx'
import Services from '../components/home/Services.jsx'
import Steps from '../components/home/Steps.jsx'
import Why from '../components/home/Why.jsx'
import Site from '../components/ui/Site.jsx'
import { PAGE_TITLES } from '../data/site.js'
import { useIntro } from '../hooks/useIntro.js'
import { usePageTitle } from '../hooks/usePageTitle.js'

export default function Home() {
  const seen = useIntro()
  usePageTitle(PAGE_TITLES.home)

  return (
    <Site seen={seen}>
      <Hero seen={seen} />
      <Marquee />
      <Services />
      <Why />
      <Dual />
      <Steps />
      <Contact />
      <Footer />
    </Site>
  )
}
