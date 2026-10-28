# House Pink

Site e sistema de agendamento do **House Pink Nails & Lashes**, salão em Fortaleza com duas profissionais independentes: **Bruna Ítala** (unhas de porcelana) e **Herlany Lessa** (cílios e sobrancelhas). Hoje reúne a página inicial do salão e o agendamento online, em que a cliente escolhe serviço, dia e horário só com nome e WhatsApp.

## Stack

- [React](https://react.dev/) 19 + [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [Supabase](https://supabase.com/) (Postgres, regras de segurança por linha e funções)
- CSS puro: `src/styles.css` na página inicial e `src/app.css` no agendamento e na agenda, que seguem o design system (Inter, mobile-first)
- [ESLint](https://eslint.org/) e [Prettier](https://prettier.io/)
- Deploy no [Vercel](https://vercel.com/)

## Telas

- **Início (`/`)** — responsiva (celular, tablet e computador), com abertura animada, fotos, serviços por profissional, o diferencial da sessão conjunta (as duas atendem ao mesmo tempo), passo a passo e contatos.
- **Agendar (`/agendar`)** — escolha do serviço, do dia e do horário, com a agenda de cada profissional e a janela de dias liberados. Sem criar conta: só nome e WhatsApp.
- **Entrar (`/entrar`)** — login único com e-mail e senha: quem é profissional abre a agenda (`/painel`) e quem é cliente abre a conta (`/conta`).
- **Criar conta (`/cadastro`)** — cadastro da cliente, que passa a ver os valores e a acompanhar os seus horários.
- **Minha conta (`/conta`)** — horários da cliente (próximos e anteriores) e perfil.
- **Agenda (`/painel`)** — agenda da profissional, com confirmar, concluir e cancelar horários.

Os valores dos serviços não aparecem em nenhuma página pública.

## Pré-requisitos

- **Node.js 20.19+ ou 22.12+** (exigência do Vite 8)

## Configuração

```bash
npm install
cp .env.example .env.local
npm run dev
```

Preencha o `.env.local` com a URL e a chave publicável do projeto no Supabase (Settings > API Keys):

| Variável            | Descrição                             |
| ------------------- | ------------------------------------- |
| `VITE_SUPABASE_URL` | URL do projeto no Supabase            |
| `VITE_SUPABASE_KEY` | Chave publicável (`sb_publishable_…`) |

O site sobe em `http://localhost:5173`.

## Scripts

| Comando                | Descrição                                  |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Sobe o servidor de desenvolvimento do Vite |
| `npm run build`        | Gera o build de produção em `dist/`        |
| `npm run preview`      | Serve o build de produção localmente       |
| `npm run lint`         | Confere o código com o ESLint              |
| `npm run format`       | Formata o projeto com o Prettier           |
| `npm run format:check` | Confere a formatação sem alterar arquivos  |

## Estrutura

```
public/                  logo, favicon e fotos
src/
├── main.jsx             bootstrap (React + Router)
├── App.jsx              rotas
├── styles.css           estilos da página inicial
├── app.css              estilos do agendamento e da agenda (design system)
├── data/
│   ├── site.js          salão, profissionais e títulos das páginas
│   ├── content.js       textos e listas da página inicial
│   └── assets.js        caminhos da logo, da borboleta e da foto
├── lib/                 api (Supabase), datas, horários livres, telefone, links, endereço, classes, abertura
├── hooks/               useAsync, useCatalog, useAvailability, useSession, useIntro e usePageTitle
├── components/
│   ├── ui/              Button, Butterfly, Kicker, SectionHeading, ExternalLink, Site
│   ├── layout/          Header e Footer
│   ├── home/            seções da página inicial
│   ├── app/             AppShell, AppButton, Field, Notice, TabBar, BottomBar, Icon
│   ├── agendar/         telas do agendamento (serviço, tipo, data, dados, confirmação)
│   └── painel/          agenda e troca de senha das profissionais
└── pages/               Home, Agendar, Entrar e Painel
supabase/
├── schema.sql           tabelas, regras de segurança e funções
└── seed.sql             profissionais, serviços, horários e preços de exemplo
```

## Banco de dados

O esquema fica em `supabase/schema.sql` e deve ser rodado no SQL Editor do Supabase, seguido de `supabase/seed.sql`.

- Cada profissional tem a própria agenda: o banco impede dois agendamentos sobrepostos para a mesma profissional, e a sessão conjunta roda em paralelo.
- Os preços ficam em `service_prices`, legível só por quem está logado. Os preços do `seed.sql` são de exemplo.
- A cliente agenda pela função `create_appointment`, que confere janela de dias, folgas e expediente. Os horários ocupados saem por `busy_slots`, sem dados de clientes.
- Cada profissional enxerga só a própria agenda e a própria receita, e é reconhecida pelo vínculo da conta (`professionals.user_id`).
- Ao criar uma conta, um gatilho cria o perfil da cliente (`clients`), que passa a ser usado nos agendamentos feitos logada.

## Dados do salão

Tudo o que é dado do salão fica em `src/data`:

- **Instagram** do salão e de cada profissional, **WhatsApp** de cada profissional (não existe um WhatsApp único do salão), endereço e dias de atendimento: `site.js`
- Serviços, benefícios e passos da página inicial: `content.js`

## Fotos

As fotos de unhas, cílios e sobrancelhas são provisórias, do [Unsplash](https://unsplash.com/license) (uso comercial livre): `hvqHtZqNMeI`, `hxp1rPHSUzI` e `2IK78QZhkfo`. Troque pelas fotos do trabalho das duas em `public/img/`.

## Protótipo Online (Deploy Vercel)

Acompanhe a versão mais recente e online através deste link:

[Deploy Vercel](https://house-pink-two.vercel.app/)

Cada push na branch `main` publica uma nova versão automaticamente. As variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_KEY` precisam estar configuradas no projeto do Vercel.

## Autor & Contato

Clara Moura. 🧡

<br>

<div>
  <a href="https://www.linkedin.com/in/claralivia" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-FF4500?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a>
  <a href="https://github.com/claralivia" target="_blank"><img src="https://img.shields.io/badge/-GitHub-FF4500?style=for-the-badge&logo=github&logoColor=white" target="_blank"></a>
  <a href="https://www.instagram.com/cclaralivia/" target="_blank"><img src="https://img.shields.io/badge/-Instagram-FF4500?style=for-the-badge&logo=instagram&logoColor=white" target="_blank"></a>
</div>

###### © Clara Moura, 2026
