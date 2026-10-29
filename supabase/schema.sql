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
  deposit_cents integer check (deposit_cents >= 0),
  booking_notes text[] not null default '{}',
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
  description text,
  image_url text,
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
  deposit_paid_cents integer not null default 0 check (deposit_paid_cents >= 0),
  deposit_payment payment_method,
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
  select id from professionals where user_id = auth.uid()
$$;

create function serves_client(p_client uuid) returns boolean
language sql stable security definer set search_path = public as $
  select exists (
    select 1 from appointments
    where client_id = p_client and professional_id = current_professional_id()
  ) or exists (
    select 1 from professional_clients
    where client_id = p_client and professional_id = current_professional_id()
  )
$;

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

  select id into v_client from clients where user_id = auth.uid();

  if v_client is null then
    insert into clients (name, whatsapp) values (p_name, p_whatsapp) returning id into v_client;
  end if;

  insert into appointments (professional_id, client_id, service_type_id, starts_at, ends_at, price_cents)
  select v_professional, v_client, p_service_type, p_starts_at, v_ends_at, sp.price_cents
  from (select 1) _
  left join service_prices sp on sp.service_type_id = p_service_type
  returning id into v_id;

  return v_id;
end;
$$;

create function cancel_my_appointment(p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  update appointments
  set status = 'cancelled'
  where id = p_id
    and is_own_client(client_id)
    and status in ('pending', 'confirmed')
    and starts_at > now();

  if not found then
    raise exception 'Não foi possível cancelar este horário' using errcode = 'P0001';
  end if;
end;
$$;

revoke all on function cancel_my_appointment from public;
grant execute on function cancel_my_appointment to authenticated;

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

create policy clients_update on clients for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into clients (user_id, name, whatsapp)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'whatsapp', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create policy appointments_professional on appointments for all
  using (professional_id = current_professional_id())
  with check (professional_id = current_professional_id());

create policy appointments_client_read on appointments for select using (is_own_client(client_id));

insert into storage.buckets (id, name, public)
values ('service-photos', 'service-photos', true)
on conflict (id) do nothing;

create policy service_photos_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'service-photos' and current_professional_id() is not null);

create policy service_photos_update on storage.objects for update to authenticated
  using (bucket_id = 'service-photos' and current_professional_id() is not null);

-- As profissionais editam só o prazo, o sinal e as regras do próprio perfil.
revoke update on professionals from authenticated;
grant update (booking_window_days, deposit_cents, booking_notes) on professionals to authenticated;

create function set_working_hours(p_hours jsonb) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_professional uuid := current_professional_id();
  v_item jsonb;
begin
  if v_professional is null then
    raise exception 'Sem permissão' using errcode = 'P0001';
  end if;

  delete from working_hours where professional_id = v_professional;

  for v_item in select * from jsonb_array_elements(p_hours) loop
    insert into working_hours (professional_id, weekday, starts_at, ends_at)
    values (
      v_professional,
      (v_item ->> 'weekday')::smallint,
      (v_item ->> 'starts_at')::time,
      (v_item ->> 'ends_at')::time
    );
  end loop;
end;
$$;

revoke all on function set_working_hours from public;
grant execute on function set_working_hours to authenticated;

-- Foto de perfil da cliente, para a profissional saber quem é.
alter table clients add column photo_url text;

insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

create policy profile_photos_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy profile_photos_update on storage.objects for update to authenticated
  using (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Avaliações: a cliente avalia um atendimento concluído; só a profissional dele e a própria cliente leem.
create table feedback (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null unique references appointments (id) on delete cascade,
  client_id uuid not null references clients (id) on delete cascade,
  professional_id uuid not null references professionals (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

alter table feedback enable row level security;

create policy feedback_client_read on feedback for select using (is_own_client(client_id));
create policy feedback_professional_read on feedback for select
  using (professional_id = current_professional_id());

create function leave_feedback(p_appointment uuid, p_rating integer, p_comment text) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_client uuid;
  v_professional uuid;
begin
  select client_id, professional_id into v_client, v_professional
  from appointments
  where id = p_appointment and status = 'done' and is_own_client(client_id);

  if v_client is null then
    raise exception 'Só é possível avaliar um atendimento seu já concluído' using errcode = 'P0001';
  end if;

  insert into feedback (appointment_id, client_id, professional_id, rating, comment)
  values (p_appointment, v_client, v_professional, p_rating, nullif(trim(p_comment), ''))
  on conflict (appointment_id)
  do update set rating = excluded.rating, comment = excluded.comment;
end;
$$;

revoke all on function leave_feedback from public;
grant execute on function leave_feedback to authenticated;

-- Horário lançado pela própria profissional (cliente que combinou pelo WhatsApp).
create function create_appointment_for_client(
  p_service_type uuid,
  p_starts_at timestamptz,
  p_name text,
  p_whatsapp text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_professional uuid := current_professional_id();
  v_owner uuid;
  v_duration integer;
  v_client uuid;
  v_id uuid;
begin
  if v_professional is null then
    raise exception 'Sem permissão' using errcode = 'P0001';
  end if;

  select s.professional_id, st.duration_minutes into v_owner, v_duration
  from service_types st join services s on s.id = st.service_id
  where st.id = p_service_type;

  if v_owner is distinct from v_professional then
    raise exception 'Este serviço é de outra profissional' using errcode = 'P0001';
  end if;

  select c.id into v_client from clients c
  where c.whatsapp = p_whatsapp and serves_client(c.id)
  limit 1;

  if v_client is null then
    insert into clients (name, whatsapp) values (p_name, p_whatsapp) returning id into v_client;
    insert into professional_clients (professional_id, client_id) values (v_professional, v_client);
  end if;

  insert into appointments (
    professional_id, client_id, service_type_id, starts_at, ends_at, price_cents, status
  )
  select
    v_professional, v_client, p_service_type, p_starts_at,
    p_starts_at + make_interval(mins => v_duration), sp.price_cents, 'confirmed'
  from (select 1) _
  left join service_prices sp on sp.service_type_id = p_service_type
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function create_appointment_for_client from public;
grant execute on function create_appointment_for_client to authenticated;

-- Lista de clientes da profissional: cadastro manual e importação da planilha.
create table professional_clients (
  professional_id uuid not null references professionals (id) on delete cascade,
  client_id uuid not null references clients (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (professional_id, client_id)
);

alter table professional_clients enable row level security;

create policy professional_clients_read on professional_clients for select
  using (professional_id = current_professional_id());

create function add_clients(p_clients jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_professional uuid := current_professional_id();
  v_item jsonb;
  v_name text;
  v_phone text;
  v_client uuid;
  v_created integer := 0;
  v_skipped integer := 0;
begin
  if v_professional is null then
    raise exception 'Sem permissão' using errcode = 'P0001';
  end if;

  for v_item in select * from jsonb_array_elements(p_clients) loop
    v_name := trim(coalesce(v_item ->> 'name', ''));
    v_phone := v_item ->> 'whatsapp';

    if v_name = '' or v_phone is null then
      v_skipped := v_skipped + 1;
      continue;
    end if;

    select c.id into v_client from clients c
    where c.whatsapp = v_phone and serves_client(c.id)
    limit 1;

    if v_client is not null then
      v_skipped := v_skipped + 1;
      continue;
    end if;

    insert into clients (name, whatsapp) values (v_name, v_phone) returning id into v_client;
    insert into professional_clients (professional_id, client_id) values (v_professional, v_client);
    v_created := v_created + 1;
  end loop;

  return jsonb_build_object('created', v_created, 'skipped', v_skipped);
end;
$$;

revoke all on function add_clients from public;
grant execute on function add_clients to authenticated;

create function update_client_record(p_client uuid, p_name text, p_whatsapp text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if current_professional_id() is null then
    raise exception 'Sem permissão' using errcode = 'P0001';
  end if;

  update clients
  set name = trim(p_name), whatsapp = p_whatsapp
  where id = p_client and user_id is null and serves_client(id);

  if not found then
    raise exception 'Não foi possível editar esta cliente' using errcode = 'P0001';
  end if;
end;
$$;

revoke all on function update_client_record from public;
grant execute on function update_client_record to authenticated;

-- Perfil público da profissional: ela mesma edita foto, apresentação e Instagram.
alter table professionals add column bio text;
alter table professionals add column photo_url text;
alter table professionals add column instagram text;
grant update (bio, photo_url, instagram) on professionals to authenticated;
