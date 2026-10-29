insert into professionals (key, name, email, deposit_cents, booking_notes) values
  ('bruna', 'Bruna Ítala', 'bruna@exemplo.com', null, '{}'),
  (
    'herlany',
    'Herlany Lessa',
    'herlany@exemplo.com',
    5000,
    array[
      'O sinal de R$ 50,00 confirma o horário e é abatido do valor do procedimento.',
      'Tolerância de atraso: 15 minutos.',
      'Cancelamento e remarcação com no mínimo 24 horas de antecedência.',
      'Com menos de 24 horas, o sinal não é reembolsável, pois o horário fica reservado.',
      'Manutenção: é preciso ter pelo menos 50% das extensões e estar no prazo de 15 a 20 dias. Fora do prazo, é cobrada como nova aplicação.',
      'No dia: venha sem maquiagem, com roupa confortável e sem pressa. Evite usar o celular e não traga acompanhantes.',
      'Pagamento por Pix, dinheiro ou cartão de débito e crédito. No cartão há o acréscimo da maquineta.'
    ]
  );

insert into services (professional_id, name, position)
select p.id, s.name, s.position
from professionals p
join (values
  ('bruna', 'Unhas de porcelana', 0),
  ('herlany', 'Extensão de cílios', 0),
  ('herlany', 'Manutenção de cílios', 1),
  ('herlany', 'Lash lifting', 2),
  ('herlany', 'Remoção de cílios', 3),
  ('herlany', 'Sobrancelhas', 4)
) as s (pro, name, position) on s.pro = p.key;

-- Todas as durações são provisórias (60 minutos) até as profissionais informarem as reais.
insert into service_types (service_id, name, duration_minutes, position, description)
select sv.id, t.name, 60, t.position, t.description
from services sv
join (values
  ('Unhas de porcelana', 'Acrílico natural', 0, null),
  ('Unhas de porcelana', 'Baby boomer', 1, null),
  ('Unhas de porcelana', 'Francesa reversa', 2, null),
  ('Unhas de porcelana', 'Manutenção', 3, null),
  ('Extensão de cílios', 'Brasileiro Express', 0, 'Efeito de cílios naturais, indicado para quem faz pela primeira vez e para quem gosta de um efeito bem discreto. Essa técnica não tem manutenção.'),
  ('Extensão de cílios', 'Volume Brasileiro', 1, 'Deixa o olhar preenchido, com leveza e naturalidade.'),
  ('Extensão de cílios', 'Volume 5D', 2, 'Deixa o olhar preenchido e marcante, sem perder a leveza de um efeito natural.'),
  ('Extensão de cílios', 'Volume Moderado', 3, 'Para quem ama cílios mais preenchidos, mas sem exagero. Olhar marcante na medida certa, com acabamento leve e confortável.'),
  ('Extensão de cílios', 'Fox Eyes', 4, 'Muda o formato do olhar para que fique mais alongado e sensual.'),
  ('Extensão de cílios', 'Volume Russo', 5, 'Cílios bem mais cheios, com bastante volume e definição, para um efeito glamouroso.'),
  ('Extensão de cílios', 'Mega Volume', 6, 'Olhar intenso e super preenchido, com um efeito impactante que transforma a expressão.'),
  ('Manutenção de cílios', 'Volume Brasileiro', 0, 'Faça de 15 a 20 dias após a aplicação, com pelo menos 50% das extensões.'),
  ('Manutenção de cílios', 'Volume 5D', 1, 'Faça de 15 a 20 dias após a aplicação, com pelo menos 50% das extensões.'),
  ('Manutenção de cílios', 'Volume Moderado', 2, 'Faça de 15 a 20 dias após a aplicação, com pelo menos 50% das extensões.'),
  ('Manutenção de cílios', 'Fox Eyes', 3, 'Faça de 15 a 20 dias após a aplicação, com pelo menos 50% das extensões.'),
  ('Manutenção de cílios', 'Volume Russo', 4, 'Faça de 15 a 20 dias após a aplicação, com pelo menos 50% das extensões.'),
  ('Manutenção de cílios', 'Mega Volume', 5, 'Faça de 15 a 20 dias após a aplicação, com pelo menos 50% das extensões.'),
  ('Lash lifting', 'Lash lifting', 0, 'Curva os cílios naturais e deixa o aspecto de rímel. Dura até 60 dias e não precisa de manutenção. Ótimo para quem não consegue usar extensões por alergia.'),
  ('Remoção de cílios', 'Remoção completa', 0, 'Remove completamente todos os fios. A remoção química é rápida, indolor e segura.'),
  ('Sobrancelhas', 'Design de sobrancelha', 0, 'Remoção de pelos com pinça e/ou cera, definição e alinhamento do formato ideal, para um resultado natural.'),
  ('Sobrancelhas', 'Design com henna', 1, 'Sobrancelhas mais definidas, preenchidas e marcantes, sem perder a naturalidade.'),
  ('Sobrancelhas', 'Brow lamination', 2, 'Sobrancelhas alinhadas, levantadas e com efeito natural de volume.')
) as t (service, name, position, description) on t.service = sv.name;

-- Preços conforme as tabelas da Bruna e da Herlany.
insert into service_prices (service_type_id, price_cents)
select st.id, v.price_cents
from service_types st
join services sv on sv.id = st.service_id
join (values
  ('Unhas de porcelana', 'Acrílico natural', 14000),
  ('Unhas de porcelana', 'Baby boomer', 14000),
  ('Unhas de porcelana', 'Francesa reversa', 15000),
  ('Unhas de porcelana', 'Manutenção', 11000),
  ('Extensão de cílios', 'Brasileiro Express', 10000),
  ('Extensão de cílios', 'Volume Brasileiro', 14000),
  ('Extensão de cílios', 'Volume 5D', 14000),
  ('Extensão de cílios', 'Volume Moderado', 14000),
  ('Extensão de cílios', 'Fox Eyes', 15000),
  ('Extensão de cílios', 'Volume Russo', 16000),
  ('Extensão de cílios', 'Mega Volume', 20000),
  ('Manutenção de cílios', 'Volume Brasileiro', 10000),
  ('Manutenção de cílios', 'Volume 5D', 10000),
  ('Manutenção de cílios', 'Volume Moderado', 10000),
  ('Manutenção de cílios', 'Fox Eyes', 11000),
  ('Manutenção de cílios', 'Volume Russo', 12000),
  ('Manutenção de cílios', 'Mega Volume', 15000),
  ('Lash lifting', 'Lash lifting', 10000),
  ('Remoção de cílios', 'Remoção completa', 5000),
  ('Sobrancelhas', 'Design de sobrancelha', 3500),
  ('Sobrancelhas', 'Design com henna', 5000),
  ('Sobrancelhas', 'Brow lamination', 10000)
) as v (service, type, price_cents) on v.service = sv.name and v.type = st.name;

-- Bruna: terça a sábado, das 9h30 às 17h30.
insert into working_hours (professional_id, weekday, starts_at, ends_at)
select p.id, d, time '09:30', time '17:30'
from professionals p
cross join generate_series(2, 6) as d
where p.key = 'bruna';

-- Herlany, conforme o catálogo dela: terça a sexta, das 9h30 às 18h, e sábado, das 8h às 17h.
insert into working_hours (professional_id, weekday, starts_at, ends_at)
select
  p.id,
  d,
  case when d = 6 then time '08:00' else time '09:30' end,
  case when d = 6 then time '17:00' else time '18:00' end
from professionals p
cross join generate_series(2, 6) as d
where p.key = 'herlany';

update professionals p
set user_id = u.id
from auth.users u
where lower(u.email) = lower(p.email) and p.user_id is null;
