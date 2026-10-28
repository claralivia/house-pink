# House Pink

Site e sistema de agendamento do **House Pink Nails & Lashes**, salão em Fortaleza com duas profissionais independentes: **Bruna Ítala** (unhas de porcelana) e **Herlany Lessa** (cílios e sobrancelhas). Hoje reúne a página inicial do salão e uma página provisória de agendamento; o agendamento online é a próxima etapa.

## Stack

- [React](https://react.dev/) 19 + [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- CSS puro, com o desenho responsivo em `src/styles.css`
- [ESLint](https://eslint.org/) e [Prettier](https://prettier.io/)
- Deploy no [Vercel](https://vercel.com/)

## Telas

- **Início (`/`)** — responsiva (celular, tablet e computador), com abertura animada, fotos, serviços por profissional, o diferencial da sessão conjunta (as duas atendem ao mesmo tempo), passo a passo e contatos.
- **Agendar (`/agendar`)** — página provisória que leva ao WhatsApp da profissional do serviço escolhido.

Os valores dos serviços não aparecem em nenhuma página pública.

## Pré-requisitos

- **Node.js 20.19+ ou 22.12+** (exigência do Vite 8)

## Configuração

```bash
npm install
npm run dev
```

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
├── styles.css           estilos
├── data/
│   ├── site.js          salão, profissionais e títulos das páginas
│   ├── content.js       textos e listas da página inicial
│   └── assets.js        caminhos da logo, da borboleta e da foto
├── lib/                 funções puras (links, endereço, classes, abertura)
├── hooks/               useIntro e usePageTitle
├── components/
│   ├── ui/              Button, Butterfly, Kicker, SectionHeading, ExternalLink, Site
│   ├── layout/          Header e Footer
│   └── home/            seções da página inicial
└── pages/               Home e Agendar
```

## Dados do salão

Tudo o que é dado do salão fica em `src/data`:

- **Instagram** do salão e de cada profissional, **WhatsApp** de cada profissional (não existe um WhatsApp único do salão), endereço e dias de atendimento: `site.js`
- Serviços, benefícios e passos da página inicial: `content.js`

## Fotos

As fotos de unhas, cílios e sobrancelhas são provisórias, do [Unsplash](https://unsplash.com/license) (uso comercial livre): `hvqHtZqNMeI`, `hxp1rPHSUzI` e `2IK78QZhkfo`. Troque pelas fotos do trabalho das duas em `public/img/`.

## Protótipo Online (Deploy Vercel)

Acompanhe a versão mais recente e online através deste link:

[Deploy Vercel](https://house-pink-two.vercel.app/)

Cada push na branch `main` publica uma nova versão automaticamente.

## Autor & Contato

Clara Moura. 🧡

<br>

<div>
  <a href="https://www.linkedin.com/in/claralivia" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-FF4500?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a>
  <a href="https://github.com/claralivia" target="_blank"><img src="https://img.shields.io/badge/-GitHub-FF4500?style=for-the-badge&logo=github&logoColor=white" target="_blank"></a>
  <a href="https://www.instagram.com/cclaralivia/" target="_blank"><img src="https://img.shields.io/badge/-Instagram-FF4500?style=for-the-badge&logo=instagram&logoColor=white" target="_blank"></a>
</div>

###### © Clara Moura, 2026
