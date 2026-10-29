# Vídeos das aulas

Monta uma aula em vídeo a partir de prints do app: cada frase vira um trecho com a
voz (Thalita, pt-BR), um círculo rosa no lugar do toque e a legenda numa faixa escura.

Precisa do `ffmpeg` (`winget install Gyan.FFmpeg`) e de internet para gerar a voz.

```
cd tools/aulas
npm init -y && npm i msedge-tts      # só na primeira vez
node build.mjs aula.json saida.mp4
```

## Como funciona

1. **Prints**: 390x844 (celular), com a barra de rolagem escondida e a lista já carregada.
   Para cada print, anote onde ficam os botões: `shots.json` guarda, por print, o centro
   de cada alvo, `{"tela": {"botao": [x, y, diâmetro]}}`. O Playwright devolve isso com
   `locator.boundingBox()`; botões e campos largos recebem o círculo na ponta direita (x=336),
   para não cobrir o texto.
2. **Roteiro** (`atender.exemplo.json`): `beats` com `shot` (nome do print), `text` (a frase
   falada, que também vira legenda) e `rings` (nomes dos alvos do `shots.json`).
3. `build.mjs` gera a voz de cada frase (guardada em `work/`, não repete), mede a duração e
   monta o vídeo. Cada vídeo usa a própria subpasta em `work/`, então dá para montar vários
   ao mesmo tempo.

Depois suba o `.mp4` no Supabase Storage (`help-pro` para profissionais, `help-public` para
clientes) e escreva o nome do arquivo no campo `video` da aula em `src/data/help.js`.
Use um nome novo a cada versão: o upload não substitui o arquivo antigo.
