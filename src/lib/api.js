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
        'id, key, name, booking_window_days, deposit_cents, booking_notes, services(id, name, position, service_types(id, name, description, image_url, duration_minutes, position, service_prices(price_cents)))',
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

export const signUp = async ({ email, password, name, whatsapp }) =>
  unwrap(
    await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, whatsapp }, emailRedirectTo: `${window.location.origin}/conta` },
    }),
  )

export const fetchMyClient = async (userId) =>
  unwrap(
    await supabase.from('clients').select('id, name, whatsapp').eq('user_id', userId).maybeSingle(),
  )

export const updateMyClient = async (userId, { name, whatsapp }) =>
  unwrap(await supabase.from('clients').update({ name, whatsapp }).eq('user_id', userId))

export const fetchMyAppointments = async () =>
  unwrap(
    await supabase
      .from('appointments')
      .select(
        'id, starts_at, ends_at, status, price_cents, service_types(name, services(name, professionals(key, name)))',
      )
      .order('starts_at', { ascending: false }),
  )

export const cancelMyAppointment = async (id) =>
  unwrap(await supabase.rpc('cancel_my_appointment', { p_id: id }))

export const sendPasswordReset = async (email) =>
  unwrap(
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    }),
  )

export const changePassword = async (password) =>
  unwrap(await supabase.auth.updateUser({ password }))

export const signOut = async () => unwrap(await supabase.auth.signOut())

export const fetchMyProfessional = async () => {
  const id = unwrap(await supabase.rpc('current_professional_id'))
  return id
    ? unwrap(
        await supabase
          .from('professionals')
          .select('id, key, name, booking_window_days, deposit_cents, booking_notes')
          .eq('id', id)
          .single(),
      )
    : null
}

export const fetchAgenda = async (professionalId) =>
  unwrap(
    await supabase
      .from('appointments')
      .select(
        'id, starts_at, ends_at, status, price_cents, deposit_paid_cents, deposit_payment, clients(name, whatsapp), service_types(name, services(name))',
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

export const setAppointmentPayment = async (id, payment) =>
  unwrap(await supabase.from('appointments').update({ payment, status: 'done' }).eq('id', id))

export const fetchEarnings = async (professionalId, from, to) =>
  unwrap(
    await supabase
      .from('appointments')
      .select(
        'id, starts_at, price_cents, payment, deposit_paid_cents, deposit_payment, clients(name), service_types(name)',
      )
      .eq('professional_id', professionalId)
      .eq('status', 'done')
      .gte('starts_at', from)
      .lt('starts_at', to)
      .order('starts_at', { ascending: false }),
  )

export const fetchOwnTypes = async (professionalId) =>
  unwrap(
    await supabase
      .from('service_types')
      .select(
        'id, service_id, name, description, duration_minutes, active, image_url, service_prices(price_cents), services!inner(id, name, position, professional_id)',
      )
      .eq('services.professional_id', professionalId)
      .order('position'),
  )

export const uploadTypePhoto = async (typeId, file) => {
  const extension = file.name.split('.').pop().toLowerCase()
  const path = `${typeId}-${Date.now()}.${extension}`
  unwrap(await supabase.storage.from('service-photos').upload(path, file, { upsert: true }))
  const { data } = supabase.storage.from('service-photos').getPublicUrl(path)
  unwrap(
    await supabase.from('service_types').update({ image_url: data.publicUrl }).eq('id', typeId),
  )
}

export const updateProfessional = async (id, patch) =>
  unwrap(await supabase.from('professionals').update(patch).eq('id', id))

export const fetchWorkingHours = async (professionalId) =>
  unwrap(
    await supabase
      .from('working_hours')
      .select('weekday, starts_at, ends_at')
      .eq('professional_id', professionalId),
  )

export const saveWorkingHours = async (hours) =>
  unwrap(await supabase.rpc('set_working_hours', { p_hours: hours }))

export const fetchTimeOff = async (professionalId) =>
  unwrap(
    await supabase
      .from('time_off')
      .select('id, starts_on, ends_on, reason')
      .eq('professional_id', professionalId)
      .gte('ends_on', todayIso())
      .order('starts_on'),
  )

export const addTimeOff = async (professionalId, { starts_on, ends_on, reason }) =>
  unwrap(
    await supabase
      .from('time_off')
      .insert({ professional_id: professionalId, starts_on, ends_on, reason: reason || null }),
  )

export const removeTimeOff = async (id) =>
  unwrap(await supabase.from('time_off').delete().eq('id', id))

export const countBookedBetween = async (professionalId, from, to) => {
  const { count, error } = await supabase
    .from('appointments')
    .select('id', { count: 'exact', head: true })
    .eq('professional_id', professionalId)
    .in('status', ['pending', 'confirmed'])
    .gte('starts_at', from)
    .lt('starts_at', to)
  if (error) throw error
  return count
}

export const updateType = async (id, patch) =>
  unwrap(await supabase.from('service_types').update(patch).eq('id', id))

export const savePrice = async (typeId, cents) =>
  unwrap(
    await supabase
      .from('service_prices')
      .upsert({ service_type_id: typeId, price_cents: cents }, { onConflict: 'service_type_id' }),
  )

export const addType = async (serviceId, { name, duration_minutes, price_cents }) => {
  const created = unwrap(
    await supabase
      .from('service_types')
      .insert({ service_id: serviceId, name, duration_minutes, position: 99 })
      .select('id')
      .single(),
  )
  await savePrice(created.id, price_cents)
}

export const updateAppointment = async (id, patch) =>
  unwrap(await supabase.from('appointments').update(patch).eq('id', id))
