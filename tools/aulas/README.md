# Vídeos das aulas

Monta uma aula em vídeo a partir de prints do app: cada frase vira um trecho com a
voz (Thalita, pt-BR), um círculo rosa no lugar do toque e a legenda embaixo.

Precisa do `ffmpeg` (`winget install Gyan.FFmpeg`) e de internet para gerar a voz.

```
cd tools/aulas
npm init -y && npm i msedge-tts      # só na primeira vez
node build.mjs aula.json saida.mp4
```

`ver-agenda.exemplo.json` mostra o formato: `images` aponta para os prints (390x844,
tirados com a lista já carregada) e cada item de `beats` tem o `text` falado, a `image`
e, se quiser, `rings: [[x, y, diâmetro]]` na medida do print.

Depois suba o `.mp4` no Supabase Storage (`help-pro` para profissionais, `help-public`
para clientes) e escreva o nome do arquivo no campo `video` da aula em
`src/data/help.js`. Use um nome novo a cada versão.
