create extension if not exists btree_gist;

create type appointment_status as enum ('pending', 'confirmed', 'cancelled', 'done');
create type payment_method as enum ('pix', 'card', 'cash');

create table professionals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users (id) on delete set null,
  email text unique,
  key text not null unique,
  name text not null,
  booking_window_days integer not null default 15 check (booking_window_days >= 0),
  created_at timestamptz not null default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references professionals (id) on delete cascade,
  name text not null,
  active boolean not null default true,
  position integer not null default 0
);

create table service_types (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services (id) on delete cascade,
  name text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  active boolean not null default true,
  position integer not null default 0
);

create table service_prices (
  service_type_id uuid primary key references service_types (id) on delete cascade,
  price_cents integer not null check (price_cents >= 0)
);

create table working_hours (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references professionals (id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  starts_at time not null,
  ends_at time not null,
  check (ends_at > starts_at)
);

create table time_off (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references professionals (id) on delete cascade,
  starts_on date not null,
  ends_on date not null,
  reason text,
  check (ends_on >= starts_on)
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users (id) on delete set null,
  name text not null,
  whatsapp text not null,
  created_at timestamptz not null default now()
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references professionals (id),
  client_id uuid not null references clients (id),
  service_type_id uuid not null references service_types (id),
  joint_group_id uuid,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status appointment_status not null default 'pending',
  price_cents integer check (price_cents >= 0),
  payment payment_method,
  notes text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at),
  exclude using gist (
    professional_id with =,
    tstzrange(starts_at, ends_at) with &&
  ) where (status <> 'cancelled')
);

create index appointments_professional_starts_idx on appointments (professional_id, starts_at);
create index appointments_joint_group_idx on appointments (joint_group_id);

create function current_professional_id() returns uuid
language sql stable security definer set search_path = public as $$
  select id from professionals
  where user_id = auth.uid() or lower(email) = lower(auth.jwt() ->> 'email')
$$;

create function serves_client(p_client uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from appointments
    where client_id = p_client and professional_id = current_professional_id()
  )
$$;

create function is_own_client(p_client uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from clients where id = p_client and user_id = auth.uid())
$$;

create function busy_slots(p_professional uuid, p_from timestamptz, p_to timestamptz)
returns table (starts_at timestamptz, ends_at timestamptz)
language sql stable security definer set search_path = public as $$
  select a.starts_at, a.ends_at
  from appointments a
  where a.professional_id = p_professional
    and a.status <> 'cancelled'
    and a.starts_at < p_to
    and a.ends_at > p_from
$$;

create function create_appointment(
  p_service_type uuid,
  p_starts_at timestamptz,
  p_name text,
  p_whatsapp text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_professional uuid;
  v_window integer;
  v_duration integer;
  v_local timestamp := p_starts_at at time zone 'America/Fortaleza';
  v_ends_at timestamptz;
  v_client uuid;
  v_id uuid;
begin
  select p.id, p.booking_window_days, st.duration_minutes
    into v_professional, v_window, v_duration
  from service_types st
  join services s on s.id = st.service_id
  join professionals p on p.id = s.professional_id
  where st.id = p_service_type and st.active and s.active;

  if v_professional is null then
    raise exception 'Serviço indisponível' using errcode = 'P0001';
  end if;

  v_ends_at := p_starts_at + make_interval(mins => v_duration);

  if p_starts_at < now()
    or v_local::date > (now() at time zone 'America/Fortaleza')::date + v_window then
    raise exception 'Data fora do período de agendamento' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from time_off t
    where t.professional_id = v_professional
      and v_local::date between t.starts_on and t.ends_on
  ) then
    raise exception 'A profissional não atende nesta data' using errcode = 'P0001';
  end if;

  if not exists (
    select 1 from working_hours w
    where w.professional_id = v_professional
      and w.weekday = extract(dow from v_local)
      and v_local::time >= w.starts_at
      and (v_local + make_interval(mins => v_duration))::time <= w.ends_at
  ) then
    raise exception 'Horário fora do expediente' using errcode = 'P0001';
  end if;

  insert into clients (name, whatsapp) values (p_name, p_whatsapp) returning id into v_client;

  insert into appointments (professional_id, client_id, service_type_id, starts_at, ends_at, price_cents)
  select v_professional, v_client, p_service_type, p_starts_at, v_ends_at, sp.price_cents
  from (select 1) _
  left join service_prices sp on sp.service_type_id = p_service_type
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function busy_slots from public;
revoke all on function create_appointment from public;
grant execute on function busy_slots to anon, authenticated;
grant execute on function create_appointment to anon, authenticated;

alter table professionals enable row level security;
alter table services enable row level security;
alter table service_types enable row level security;
alter table service_prices enable row level security;
alter table working_hours enable row level security;
alter table time_off enable row level security;
alter table clients enable row level security;
alter table appointments enable row level security;

create policy professionals_read on professionals for select using (true);
create policy professionals_update on professionals for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy services_read on services for select using (true);
create policy services_write on services for all
  using (professional_id = current_professional_id())
  with check (professional_id = current_professional_id());

create policy service_types_read on service_types for select using (true);
create policy service_types_write on service_types for all
  using (exists (
    select 1 from services s
    where s.id = service_id and s.professional_id = current_professional_id()
  ))
  with check (exists (
    select 1 from services s
    where s.id = service_id and s.professional_id = current_professional_id()
  ));

create policy service_prices_read on service_prices for select to authenticated using (true);
create policy service_prices_write on service_prices for all to authenticated
  using (exists (
    select 1 from service_types st
    join services s on s.id = st.service_id
    where st.id = service_type_id and s.professional_id = current_professional_id()
  ))
  with check (exists (
    select 1 from service_types st
    join services s on s.id = st.service_id
    where st.id = service_type_id and s.professional_id = current_professional_id()
  ));

create policy working_hours_read on working_hours for select using (true);
create policy working_hours_write on working_hours for all
  using (professional_id = current_professional_id())
  with check (professional_id = current_professional_id());

create policy time_off_read on time_off for select using (true);
create policy time_off_write on time_off for all
  using (professional_id = current_professional_id())
  with check (professional_id = current_professional_id());

create policy clients_read on clients for select using (
  user_id = auth.uid() or serves_client(id)
);

create policy appointments_professional on appointments for all
  using (professional_id = current_professional_id())
  with check (professional_id = current_professional_id());

create policy appointments_client_read on appointments for select using (is_own_client(client_id));
