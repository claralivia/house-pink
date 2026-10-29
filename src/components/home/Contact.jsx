import { SALON, TEAM_WITH } from '../../data/site.js'
import { useTeam } from '../../hooks/useTeam.js'
import Butterfly from '../ui/Butterfly.jsx'
import Button from '../ui/Button.jsx'
import Address from './Address.jsx'
import ContactRow from './ContactRow.jsx'

export default function Contact() {
  const team = useTeam()

  return (
    <section className="end" id="contato">
      <Butterfly tone="white" className="big" />
      <div className="wrap end-in">
        <div>
          <h2>Garanta o seu horário</h2>
          <p>
            Unhas, cílios e sobrancelhas {TEAM_WITH}. A agenda está aberta para hoje e os próximos
            15 dias.
          </p>
          <Button to="/agendar" variant="light" tone="pink">
            Quero agendar
          </Button>
        </div>

        <div className="cts">
          <ContactRow label="Salão" instagram={SALON.instagram} />
          {Object.values(team).map((pro) => (
            <ContactRow key={pro.key} label={pro.first} instagram={pro.instagram} pro={pro} />
          ))}
          <Address />
        </div>
      </div>
    </section>
  )
}
