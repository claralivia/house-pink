import { PROS } from './site.js'

export const NAV_LINKS = [
  { label: 'Serviços', hash: 'servicos' },
  { label: 'Diferencial', hash: 'diferencial' },
  { label: 'Como agendar', hash: 'como' },
  { label: 'Contato', hash: 'contato' },
]

export const MARQUEE_WORDS = ['Unhas de porcelana', 'Cílios', 'Sobrancelhas']

export const SERVICES = [
  {
    key: 'unhas',
    title: 'Unhas de porcelana',
    pro: PROS.bruna,
    image: '/img/unhas.jpg',
    alt: 'Mão com unhas em amêndoa, francesa com brilho',
    text: 'Acrílico natural, baby boomer e francesa reversa. E manutenção para o acabamento seguir impecável.',
    cta: 'Agendar unhas',
  },
  {
    key: 'cilios',
    title: 'Cílios',
    pro: PROS.herlany,
    image: '/img/cilios.webp',
    alt: 'Olho com cílios longos e volumosos',
    text: 'Um olhar marcante, com técnica e cuidado do começo ao fim.',
    cta: 'Agendar cílios',
  },
  {
    key: 'sobrancelhas',
    title: 'Sobrancelhas',
    pro: PROS.herlany,
    image: '/img/sobrancelha.webp',
    alt: 'Olho e sobrancelha bem definida',
    text: 'Design que valoriza o seu rosto, fio a fio.',
    cta: 'Agendar sobrancelhas',
  },
]

export const WHY_ITEMS = [
  {
    title: 'Agende em 1 minuto',
    text: 'Escolha o serviço, o dia e o horário. Sem precisar criar conta.',
  },
  {
    title: 'Hora marcada só para você',
    text: 'Cada atendimento tem o seu horário reservado.',
  },
  {
    title: 'Tudo na mesma visita',
    text: 'Unhas, cílios e sobrancelhas em uma única sessão, com as duas atendendo ao mesmo tempo.',
  },
  {
    title: 'Agenda sempre à vista',
    text: 'Veja os horários livres de hoje e dos próximos 15 dias.',
  },
]

export const LANES = [
  { pro: PROS.bruna, label: 'Aplicação', tone: 'dark' },
  { pro: PROS.herlany, label: 'Cílios e sobrancelhas', tone: 'pink' },
]

export const STEPS = [
  'Escolha o serviço',
  'Escolha o dia e o horário',
  'Confirme com nome e WhatsApp',
]
