import { PROS } from '../data/site.js'
import { addDays, timestamp, todayIso } from './dates.js'
import { supabase } from './supabase.js'

const CONFLICT_CODE = '23P01'
const RULE_CODE = 'P0001'

const unwrap = ({ data, error }) => {
  if (error) throw error
  return data
}

const toBusy = ({ starts_at, ends_at }) => ({
  start: Date.parse(starts_at),
  end: Date.parse(ends_at),
})

export const fetchCatalog = async () =>
  unwrap(
    await supabase
      .from('professionals')
      .select(
        'id, key, name, booking_window_days, services(id, name, position, service_types(id, name, duration_minutes, position, service_prices(price_cents)))',
      )
      .eq('services.active', true)
      .eq('services.service_types.active', true)
      .order('name')
      .order('position', { referencedTable: 'services' })
      .order('position', { referencedTable: 'services.service_types' }),
  ).map((pro) => ({ ...PROS[pro.key], ...pro }))

export const fetchAvailability = async ({ id, booking_window_days }) => {
  const today = todayIso()
  const from = timestamp(today, 0)
  const to = timestamp(addDays(today, booking_window_days + 1), 0)

  const [hours, timeOff, busy] = await Promise.all([
    supabase.from('working_hours').select('weekday, starts_at, ends_at').eq('professional_id', id),
    supabase.from('time_off').select('starts_on, ends_on').eq('professional_id', id),
    supabase.rpc('busy_slots', { p_professional: id, p_from: from, p_to: to }),
  ])

  return {
    hours: unwrap(hours),
    timeOff: unwrap(timeOff),
    busy: unwrap(busy).map(toBusy),
  }
}

export const createAppointment = async ({ serviceTypeId, startsAt, name, whatsapp }) =>
  unwrap(
    await supabase.rpc('create_appointment', {
      p_service_type: serviceTypeId,
      p_starts_at: startsAt,
      p_name: name,
      p_whatsapp: whatsapp,
    }),
  )

export const signIn = async (email, password) =>
  unwrap(await supabase.auth.signInWithPassword({ email, password }))

export const changePassword = async (password) =>
  unwrap(await supabase.auth.updateUser({ password }))

export const signOut = async () => unwrap(await supabase.auth.signOut())

export const fetchMyProfessional = async () => {
  const id = unwrap(await supabase.rpc('current_professional_id'))
  return id
    ? unwrap(await supabase.from('professionals').select('id, key, name').eq('id', id).single())
    : null
}

export const fetchAgenda = async (professionalId) =>
  unwrap(
    await supabase
      .from('appointments')
      .select(
        'id, starts_at, ends_at, status, price_cents, clients(name, whatsapp), service_types(name, services(name))',
      )
      .eq('professional_id', professionalId)
      .gte('starts_at', timestamp(todayIso(), 0))
      .order('starts_at'),
  )

export const setAppointmentStatus = async (id, status) =>
  unwrap(await supabase.from('appointments').update({ status }).eq('id', id))

export const bookingErrorMessage = ({ code, message }) =>
  ({
    [CONFLICT_CODE]: 'Esse horário acabou de ser reservado. Escolha outro, por favor.',
    [RULE_CODE]: message,
  })[code] ?? 'Não foi possível concluir o agendamento. Tente novamente em instantes.'
