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

- **Início (`/`)** — responsiva (celular, tablet e computador), com abertura animada, fotos, serviços por profissional, o diferencial da sessão conjunta (as duas atendem ao mesmo tempo), a equipe (foto, descrição, WhatsApp e Instagram de cada profissional), passo a passo e contatos.
- **Agendar (`/agendar`)** — começa perguntando se a pessoa é cliente, visitante ou profissional (visitantes não veem os valores). Depois, em 3 passos: serviço e tipo (cartões com foto, descrição e valor), data e horário, e os dados. Sem criar conta: só nome e WhatsApp.
- **Entrar (`/entrar`)** — login único com e-mail e senha: quem é profissional abre a agenda (`/painel`) e quem é cliente abre a conta (`/conta`).
- **Criar conta (`/cadastro`)** — cadastro da cliente, que passa a ver os valores e a acompanhar os seus horários.
- **Minha conta (`/conta`)** — início com o próximo horário em destaque (status em palavras simples, WhatsApp, regras e cancelar), atalho para agendar de novo, pedido de avaliação do último atendimento, histórico com gastos do mês e perfil (foto, nome e WhatsApp). O início também traz o feed "Nossas profissionais", com foto, apresentação e serviços com valores. Cada profissional edita a própria foto, apresentação e Instagram em Mais → Meu perfil, e a landing usa esses dados.
- **Ajuda (`/ajuda` e Mais → Aulas)** — aulas em passo a passo, escritas em `src/data/help.js`. As das clientes são públicas (`/ajuda`); as das profissionais ficam em Mais → Aulas. Para colocar vídeo numa aula, suba o arquivo no Supabase Storage (`help-public` para clientes, `help-pro`, privado, para profissionais) e escreva o nome do arquivo no campo `video` da aula. Aulas vistas ficam salvas só no aparelho.
- **Agenda (`/painel`)** — da profissional, com cinco abas: **Agenda** (visão por dia, com faixa de dias, ou por semana, em grade de horas como no Google Agenda; botão **Novo horário** para lançar o que chega pelo WhatsApp; ao tocar num horário abre um painel com botões grandes para confirmar, concluir com a forma de pagamento, registrar sinal, editar e cancelar), **Clientes** (cadastrar uma por uma, importar da planilha colando as colunas de nome e WhatsApp ou enviando um CSV, buscar e agendar direto para a cliente), **Ganhos** (por dia, semana e mês, com filtro de Pix, cartão e dinheiro, sinal separado do restante e fechamento do período), **Serviços** (valor, duração, descrição, foto e disponibilidade de cada tipo) e **Mais** (avaliações das clientes, ajustes da agenda, com prazo de agendamento, horários, folgas, sinal e regras, e conta). Qualquer horário pode ser desfeito (concluído volta para confirmado, cancelado é reativado) ou apagado de vez, e um serviço cadastrado errado pode ser excluído; se já tiver horários, só é ocultado.

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
└── seed.sql             profissionais, serviços, serviços, tipos e preços das duas, horários e regras de atendimento da Herlany
```

## Banco de dados

O esquema fica em `supabase/schema.sql` e deve ser rodado no SQL Editor do Supabase, seguido de `supabase/seed.sql`.

- Cada profissional tem a própria agenda: o banco impede dois agendamentos sobrepostos para a mesma profissional, e a sessão conjunta roda em paralelo.
- Os preços ficam em `service_prices`, legível só por quem está logado. Os preços vêm das tabelas das profissionais. As durações de todos os tipos ainda são provisórias (1 hora).
- A cliente agenda pela função `create_appointment`, que confere janela de dias, folgas e expediente. Os horários ocupados saem por `busy_slots`, sem dados de clientes.
- Cada profissional enxerga só a própria agenda e a própria receita, e é reconhecida pelo vínculo da conta (`professionals.user_id`).
- Ao criar uma conta, um gatilho cria o perfil da cliente (`clients`), que passa a ser usado nos agendamentos feitos logada.

## Dados do salão

Tudo o que é dado do salão fica em `src/data`:

- **Instagram** do salão e de cada profissional, **WhatsApp** de cada profissional (não existe um WhatsApp único do salão), endereço e dias de atendimento: `site.js`
- Serviços, benefícios e passos da página inicial: `content.js`

## Fotos

As fotos do site são do salão: a das duas e as de unhas (`duo.jpg`, `unhas*.jpg`) e as da Herlany, recortadas do catálogo dela (`public/img/servicos/`).

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
