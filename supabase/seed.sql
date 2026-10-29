insert into professionals (key, name, email) values
  ('bruna', 'Bruna Ítala', 'bruna@exemplo.com'),
  ('herlany', 'Herlany Lessa', 'herlany@exemplo.com');

insert into services (professional_id, name, position)
select p.id, s.name, s.position
from professionals p
join (values
  ('bruna', 'Unhas de porcelana', 0),
  ('herlany', 'Cílios', 0),
  ('herlany', 'Sobrancelhas', 1)
) as s (pro, name, position) on s.pro = p.key;

insert into service_types (service_id, name, duration_minutes, position)
select sv.id, t.name, 60, t.position
from services sv
join (values
  ('Unhas de porcelana', 'Acrílico natural', 0),
  ('Unhas de porcelana', 'Baby boomer', 1),
  ('Unhas de porcelana', 'Francesa reversa', 2),
  ('Unhas de porcelana', 'Manutenção', 3),
  ('Cílios', 'Aplicação', 0),
  ('Cílios', 'Manutenção', 1),
  ('Sobrancelhas', 'Design', 0)
) as t (service, name, position) on t.service = sv.name;

-- Preços da Bruna, conforme a tabela dela. A Herlany ainda não tem preços cadastrados.
insert into service_prices (service_type_id, price_cents)
select st.id, v.price_cents
from service_types st
join services sv on sv.id = st.service_id
join professionals p on p.id = sv.professional_id
join (values
  ('Acrílico natural', 14000),
  ('Baby boomer', 14000),
  ('Francesa reversa', 15000),
  ('Manutenção', 11000)
) as v (type, price_cents) on v.type = st.name
where p.key = 'bruna';

-- Terça a sábado, das 9h30 às 17h30, para as duas.
insert into working_hours (professional_id, weekday, starts_at, ends_at)
select p.id, d, time '09:30', time '17:30'
from professionals p
cross join generate_series(2, 6) as d;

update professionals p
set user_id = u.id
from auth.users u
where lower(u.email) = lower(p.email) and p.user_id is null;
